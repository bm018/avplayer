/**
 * Created by netTrek GmbH & Co. KG
 * User: netTrek - Saban Uenlue
 * @module model
 **/

(function (ns, $, console) {
    "use strict";
    /**
     * Diese Klasse wird in dem Projekt als Model für den jeweiligen Player genutzt.
     * Daher wird im Konstruktor die überprüft, ob der Aufrufer dieses Modells eine Instanz vom Typ Player ist.
     * Weiter wird überprüft, welche PlayerID das PlayerModel aufruft, damit die passenden Werte abgegriefen werden kann.
     *
     * Somit wird für jede einzelnen Player ein eigenes PlayerModel erstellt.
     *
     * @class PlayerModel
     * @public
     * @constructor
     **/
    var PlayerModel = function (player) {

        if (PlayerModel.playerIDs == undefined)
            PlayerModel.playerIDs = {};
        if (PlayerModel.players == undefined)
            PlayerModel.players = [];

        var playerID = undefined;
        if (player && player instanceof ns.Player) {
            playerID = player.getId();
        }
        else {
        }

        if (playerID == undefined) {
            var errorCtrl = ns.ErrorController.getInstance();
            errorCtrl.throwError(ns.ErrorController.NO_PLAYER_DEFINED, ns.ErrorController.IS_CRITICAL_YES);
        }

        if (PlayerModel.playerIDs [playerID]) {
            //log ( "return old PlayerModel for " + playerID );
            return PlayerModel.playerIDs [playerID];
        }
        PlayerModel.playerIDs [playerID] = this;
        PlayerModel.players.push(player);

        /**
         * div id von disem Player
         * @public
         * @property playerID
         * @type String
         */
        this.playerID = playerID;
        /**
         * Playerinstanz von diesem Model
         * @public
         * @property player
         * @type Player
         */
        this.player = player;

        this.currentPluginID = "";

        /**
         * akt. Wiedergabezustand
         */
        this.playstate = PlayerModel.PLAYSTATE_UNSPECIFIED;

        /**
         * Gibt an, ob akt. ein Plugin- oder Qualitätswechsel ausgeführt wird.
         * @type {boolean}
         */
        this.pluginChangeInProgress = false;

        this.initialize();
    };

    /*
     * Löscht die Parameter die zum erstellen eines Singeltons genutzt werden
     * @method resetSingleton
     * @public
     * @param void
     * @return void
     * */
    PlayerModel.resetSingleton = function () {
        PlayerModel.playerIDs = undefined;
        if (PlayerModel.players && PlayerModel.players.length > 0) {
            $.each(PlayerModel.players, function (key, value) {
                if (value && value.getCtrl())
                    value.getCtrl().dispose();
            });
        }
        PlayerModel.autoPlayerAlreadyActive = undefined;
        PlayerModel.players = undefined;
    };

    /**
     * Singleton-factory für diese Playerinstanz
     * @public
     * @static
     * @param player
     * @return PlayerModel
     */
    PlayerModel.getInstance = function (player) {
        return new PlayerModel(player);
    };

    /**
     * gibt das PlayerModel für die über die, im Parameter übergebene, playerID zurück
     * @method PlayerModel.getInstanceByPlayerID
     * @public
     * @static
     * @param playerID
     * @return PlayerModel
     */
    PlayerModel.getInstanceByPlayerID = function (playerID) {
        return PlayerModel.playerIDs [playerID];
    };

    /**
     * gibt alle Player, zusammengefasst in einem Array, zurück. Ausgenommen dem Player der in der exceptPlayer-Eigenschaft definiert wurde.
     * @method PlayerModel.getAllPlayer
     * @public
     * @static
     * @param exceptPlayer.
     * @return Array with Player-Objects
     */
    PlayerModel.getAllPlayer = function (exceptPlayer) {
        var player = undefined;
        if (exceptPlayer && exceptPlayer instanceof ns.Player) {
            player = exceptPlayer;
        }
        if (player == undefined)
            return PlayerModel.players;

        var __allPlayer = new Array();
        $.each(PlayerModel.players, function (key, value) {
            if (value.getId() != player.getId())
                __allPlayer.push(value);
        });
        return __allPlayer;
    };

    /**
     * gibt alle Player, zusammengefasst in einem Array, zurück die aktuell einen Stream abspielen.
     * Ausgenommen dem Player der in der exceptPlayer-Eigenschaft definiert wurde.
     * @method PlayerModel.getPlayingPlayer
     * @public
     * @static
     * @param exceptPlayer
     * @return Array with Player-Objects
     */
    PlayerModel.getPlayingPlayer = function (exceptPlayer) {
        var player = undefined;
        if (exceptPlayer && exceptPlayer instanceof ns.Player) {
            player = exceptPlayer;
        }

        var __playingPlayers = new Array();
        $.each(PlayerModel.players, function (key, value) {
            if (player != undefined) {
                if (value.getId() != player.getId() && value.getCtrl() && value.getCtrl().isPlaying() === true) {
                    __playingPlayers.push(value);
                }
            }
            else {
                if (value.getCtrl() && value.getCtrl().isPlaying() === true)
                    __playingPlayers.push(value);
            }
        });
        return __playingPlayers;
    };

    PlayerModel.getPlayerById = function (id) {
        var player = undefined;

        $.each(PlayerModel.players, function (key, value) {
            if (player == undefined) {
                if (id == value.getId()) {
                    player = value;
                }
            }
        });

        return player;
    };

    PlayerModel.forceRemovePlayer = function (player) {

        // players by reference
        var removalIndex = -1;
        $.each(PlayerModel.players, function (key, value) {
            if (value == player) {
                removalIndex = key;
            }
        });

        if (removalIndex >= 0) {
            PlayerModel.players.splice(removalIndex, 1);
        }

        // players by id
        PlayerModel.playerIDs[ player.getId() ] = undefined;
        delete PlayerModel.playerIDs[ player.getId() ];
    };

    var p = PlayerModel.prototype;

    p.dispose = function () {
        this.__metaDaten = undefined;
        this.__duration = undefined;
        this.__time = undefined;
    };

    /**
     * Zeit des laufenden Streams
     * @private
     * @property __Time
     * @type Object
     * @see settime
     * @see gettime
     */
    p.getTime = function () {
        return this.__time;
    };
    p.setTime = function (seconds) {
        this.__time = seconds;
    };

    /**
     * Gesamtdauer des laufenden Streams
     * @private
     * @property __Duration
     * @type Object
     * @see setDuration
     * @see getDuration
     */
    p.getDuration = function () {
        return this.__duration;
    };
    p.setDuration = function (seconds) {
        //console.log ("set durration to " + seconds );
        this.__duration = seconds;
        //log ( "__Duration" );
        //log ( __Duration );
    };

    /**
     * MetaDaten des laufenden Streams
     * @private
     * @property __MetaDaten
     * @type Object
     * @see setMetaDaten
     * @see getMetaDaten
     */
    p.getMetaDaten = function () {
        return this.__metaDaten;
    };
    p.setMetaDaten = function (data) {
        this.__metaDaten = data;
    };

    /**
     * Initialization method.
     * @method initialize
     * @protected
     **/
    p.initialize = function () {
        //log ( "PlayerModel initialize for " + this.playerID );
        /**
         * PlayerConfig von diesem Player
         * @public
         * @property playerConfig
         * @type PlayerConfiguration
         */
        this.playerConfig = undefined;
        /**
         * MediaCollection of this Player
         * @public
         * @property mediaCollection
         * @type MediaCollection
         */
        this.mediaCollection = undefined;

    };

    /**
     * Statische Klassenvariable.
     * Flag, ob der autoPlayer bereits aktiv ist.
     * @public
     * @static
     * @property autoPlayerAlreadyActive
     */
    PlayerModel.autoPlayerAlreadyActive = false;


    /**
     * Konstante für Abspielzustand unbekannt
     * @type {number}
     */
    PlayerModel.PLAYSTATE_UNSPECIFIED = 0;

    /**
     * Konstante für Abspielzustand pause
     * @type {number}
     */
    PlayerModel.PLAYSTATE_PAUSED = 1;

    /**
     * Konstante für Abspielzustand play
     * @type {number}
     */
    PlayerModel.PLAYSTATE_PLAYING = 2;

    /**
     * Konstante für Abspielzustand stop
     * @type {number}
     */
    PlayerModel.PLAYSTATE_STOPPED = 3;


    ns.PlayerModel = PlayerModel;

})(ardplayer, ardplayer.jq, ardplayer.console);
