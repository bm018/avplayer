/**
 * Created by netTrek GmbH & Co. KG
 * @module core
 * @class PlaylistPlayer
 **/

(function (ns, $, console) {
    "use strict";

    var PlaylistPlayer = function (playerDivId, playlist, filter_pc, filter_mc) {
        this.construct(playerDivId, playlist, filter_pc, filter_mc);
    };

    var p = PlaylistPlayer.prototype;

    p.construct = function (playerDivId, playlist, filter_pc, filter_mc) {

        this._id = playerDivId;
        this._filter_pc = filter_pc;
        this._filter_mc = filter_mc;

        // Falls die Playlist eine URL ist (JSON), wird diese geladen
        // und die weitere Initialisierung später fortgesetzt.
        if (typeof playlist == "string") {
            new ns.GetPlaylistByJsonCmd(this).execute(playlist,
                function (playlistObject) {
                    this.construct(playerDivId, playlistObject, filter_pc, filter_mc);
                }.bind(this)
            );

            return;
        }

        // Neuen callstack oeffnen, um Eventbindungen zu erlauben.
        setTimeout(function () {
            this.initialize(playerDivId, playlist);
        }.bind(this), 1);
    };

    p.initialize = function (playerDivId, playlist) {
        this._playlist = playlist;

        if (playlist != null) {
            this._currentPlaylistIndex = -1;
            this.playNext();
        }
    };

    p.replayPlaylist = function () {
        this._currentPlaylistIndex = -1;
        this.playNext(true);
    };

    p.playNext = function (ignorePreroll) {
        this._currentPlaylistItem = null;
        if (this._hasNext()) {
            this._disposeCurrentPlayer();
            this._currentPlaylistItem = this._getNext(ignorePreroll === true);
        } else {
            // last in row?
            if (this._currentPlayer) {
                this._dispatchCustomEvent(PlaylistPlayer.EVENT_LIST_FINISHED);
            } else {
                this._dispatchCustomEvent(PlaylistPlayer.EVENT_NO_ITEMS_IN_PLAYLIST);
            }
        }

        if (this._currentPlaylistItem) {
            var pc = this._currentPlaylistItem._pc,
                mc = this._currentPlaylistItem._mc;

            var pc_filter = this._filter_pc;

            // Autoplay für Folgeclips standardmäßig aktivieren
            if ( this._currentPlaylistIndex > 0 )
            {

                if ( pc instanceof ns.PlayerConfiguration )
                {
                    pc.setAutoPlay(true);
                } else {
                    pc_filter = function(filterPC) {
                        filterPC.setAutoPlay(true);
                        return typeof this._filter_pc ? this._filter_pc(filterPC) : filterPC;
                    }.bind(this);
                }

            }

            this._currentPlayer = new ns.Player(this._id, pc, mc, this, pc_filter, this._filter_mc);
            this._bindPlayer();

            this._dispatchCustomEvent(PlaylistPlayer.EVENT_NEXT_PLAYLIST_ITEM,
                {
                    index: this._currentPlaylistIndex,
                    total: this._playlist._playlistItems.length,
                    item: this._currentPlaylistItem,
                    player: this._currentPlayer
                });
        }
    };

    p.isPrerollPlayer = function (playerInstance) {
        return this._currentPlayer === playerInstance && this._currentPlaylistItem && this._currentPlaylistItem._preroll;
    };

    p._disposeCurrentPlayer = function () {
        if (this._currentPlayer) {
            // dispose

            this._currentPlayer.stop();
            this._currentPlayer.dispose();

            this._unbindPlayer();

            ns.ErrorController.forceRemovePlayer(this._currentPlayer);

            ns.PlayerModel.autoPlayerAlreadyActive = false;
            ns.PlayerModel.forceRemovePlayer(this._currentPlayer);

            ns.ViewController.forceRemovePlayer(this._currentPlayer);

            $("#" + this._currentPlayer.getId())
                .empty();

            this._currentPlayer = null;
        }
    };

    p.getCurrentPlaylistIndex = function () {
        return this._currentPlaylistIndex;
    };

    p._hasNext = function () {
        return this._currentPlaylistIndex + 1 < this._playlist._playlistItems.length;
    };

    p._getNext = function (ignorePreroll) {

        if (!ignorePreroll) {
            if (this._currentPlaylistIndex == this._playlist.length - 1)
                this._currentPlaylistIndex = 0;
            else
                this._currentPlaylistIndex++;
        } else {
            this._currentPlaylistIndex = 0;

            var item = this._playlist._playlistItems[0];
            while (item != null && this._hasNext()) {
                item = this._playlist._playlistItems[this._currentPlaylistIndex];
                if (item._preroll == undefined || item._preroll == false)
                    break;

                this._currentPlaylistIndex++;
            }
        }

        return this._playlist._playlistItems[this._currentPlaylistIndex];
    };

    p._bindPlayer = function () {
        $(this._currentPlayer).on(ns.Player.EVENT_END_STREAM, function (event) {
            this.playNext();
        }.bind(this));

        // ERROR => next clip
        $(this._currentPlayer).on(ns.Player.EVENT_ERROR, function (event) {
            this.playNext();
        }.bind(this));
    };

    p._unbindPlayer = function () {
        $(this._currentPlayer).off();
    };

    p._dispatchCustomEvent = function (type, data) {
        var event = $.extend($.Event(type), data);
        $(this).trigger(event);
    };

    // EVENTS
    PlaylistPlayer.EVENT_NEXT_PLAYLIST_ITEM = "PlaylistPlayer.EVENT_NEXT_PLAYLIST_ITEM";
    PlaylistPlayer.EVENT_NO_ITEMS_IN_PLAYLIST = "PlaylistPlayer.EVENT_NO_ITEMS_IN_PLAYLIST";
    PlaylistPlayer.EVENT_LIST_FINISHED = "PlaylistPlayer.EVENT_LIST_FINISHED";

    ns.PlaylistPlayer = PlaylistPlayer;

})(ardplayer, ardplayer.jq, ardplayer.console);
