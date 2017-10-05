/**
 * Created by netTrek GmbH & Co. KG
 * @module business
 **/

(function (ns, $, console) {
    "use strict";
    /**
     * * Diese Command-Klasse wird aufgerufen, wenn man Playlist-Objekte aus einem JSON-Objekt anfordert
     * @class GetPlaylistByJsonCmd
     * @constructor
     * @public
     **/
    var GetPlaylistByJsonCmd = function (player) {

        this._player = player;

        this.initialize();
    };

    var p = GetPlaylistByJsonCmd.prototype;

    /**
     * Initialization method.
     * @method initialize
     * @protected
     **/
    p.initialize = function () {
    };

    /**
     * Diese Methode löste das Command aus.
     * @methode execute
     * @public
     * @param data Typ: string. - URL der JSON Datei
     * @param callback Typ: function. - Eventhandler dass im Anschluss aufgerufen werden soll
     */
    p.execute = function (data, callback) {

        var owner = this;

        if (callback)
            this._callback = callback;

        var isError = true;

        if (data) {
            if (data instanceof ns.Playlist) {
                isError = false;
                this.parseData(JSON.parse(JSON.stringify(data)));
            }
            else if (!$.isBlank(data)) {
                isError = false;
                $.getJSON(data, ns.Delegate.create(this, this.parseData))
                    .fail(function (jqXHR, textStatus, errorThrown) {
                        owner._callback(undefined);
                        owner._callback = null;
                        ns.ErrorController.getInstance(owner._player).throwError(ns.ErrorController.PLAYLIST_JSON_FILE_NOT_FOUND, ns.ErrorController.IS_CRITICAL_YES, data);
                    });
            }
        }
        if (isError) {
            ns.ErrorController.getInstance(owner._player).throwError(ns.ErrorController.PLAYLIST_JSON_FILE_NOT_FOUND, ns.ErrorController.IS_CRITICAL_YES, data);
        }
    };

    /**
     * Die Methode wird ausgelöst als Eventhandler, während der Ausführung des getJSON-Aufrufs
     * @methode parseData
     * @param data. Typ: JSON.
     * @private
     */
    p.parseData = function (data) {
        var plist;
        if (data) {
            //log ( data );
            plist = new ns.Playlist();
            $.each(data, function (key, value) {
                plist._playlistItems [key] = value;
            });
        }
        if (this._callback)
            this._callback(plist);
    };

    ns.GetPlaylistByJsonCmd = GetPlaylistByJsonCmd;

})(ardplayer, ardplayer.jq, ardplayer.console);
