/**
 * Playlist
 *
 * (c) 2015 - netTrek GmbH & Co. kG
 */
(function (ns, $, console) {
    "use strict";

    var Playlist = function () {
        this._playlistItems = [];
    };

    var p = Playlist.prototype;

    p.addPlaylistItem = function (pc, mc, isPreRoll) {
        this._playlistItems.push(new ns.PlaylistItem(pc, mc, isPreRoll));
    };

    ns.Playlist = Playlist;

})(ardplayer, ardplayer.jq, ardplayer.console);
