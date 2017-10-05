/**
 * Created by netTrek GmbH & Co. KG
 * User: netTrek - Saban Uenlue
 * @module business
 **/

(function (ns, $, console) {
    "use strict";
    /**
     * * Diese Command-Klasse wird aufgerufen, wenn man PlayerConfiguration-Objekte aus einem JSON-Objekt anfordert
     * @class GetPlayerConfigByJsonCmd
     * @constructor
     * @public
     **/
    var GetPlayerConfigByJsonCmd = function (player) {

        this._player = player;

        this.initialize();
    };

    var p = GetPlayerConfigByJsonCmd.prototype;

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
            //if (data instanceof ns.PlayerConfiguration) {
            if (typeof data == "object") {
                isError = false;
                this.parseData(JSON.parse(JSON.stringify(data)));
            }
            else if (!$.isBlank(data)) {
                isError = false;
                $.getJSON(data, ns.Delegate.create(this, this.parseData))
                    .fail(function (jqXHR, textStatus, errorThrown) {
                        owner._callback(undefined);
                        owner._callback = null;
                        ns.ErrorController.getInstance(owner._player).throwError(ns.ErrorController.PC_JSON_FILE_NOT_FOUND, ns.ErrorController.IS_CRITICAL_YES, data);
                    });
            }
        }
        if (isError) {
            ns.ErrorController.getInstance(owner._player).throwError(ns.ErrorController.PC_JSON_FILE_WRONG_URI, ns.ErrorController.IS_CRITICAL_YES, data);
            // alert("illegal data for pc");
        }
    };

    /**
     * Die Methode wird ausgelöst als Eventhandler, während der Ausführung des getJSON-Aufrufs
     * @methode parseData
     * @param data. Typ: JSON.
     * @private
     */
    p.parseData = function (data) {
        var pc;
        if (data) {
            //log ( data );
            pc = new ns.PlayerConfiguration();
            $.each(data, function (key, value) {

                if (key === "_representationArray") {
                    $.each(value, function (repindex, rep) {
                        //log ( " ### " + repindex +" := " + rep );
                        var pcr = {};
                        $.each(rep, function (repKey, repValue) {
                            //log ( " ###### " + repKey +" := " + repValue );
                            pcr [ repKey ] = repValue;
                        });
                        pc.setRepresentation(repindex, null, null, null, null, pcr._representationClass);
                    });
                }
                else {
                    pc [key] = value;
                }
                //log ( key +" := " + value );
            });
        }
        if (this._callback)
            this._callback(pc);
    };

    ns.GetPlayerConfigByJsonCmd = GetPlayerConfigByJsonCmd;

})(ardplayer, ardplayer.jq, ardplayer.console);
