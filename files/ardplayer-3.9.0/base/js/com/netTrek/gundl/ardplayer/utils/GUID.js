/**
 * Created by netTrek GmbH & Co. KG
 * User: netTrek - Saban Uenlue
 * @module utils
 **/
(function (ns, $, console) {
    "use strict";
    /**
     * Diese Klasse ist nur dazu da um eine eindeutige Kennung (unique identifier) zu erzeugen
     * @class GUID
     * @constructor
     **/
    var GUID = function () {
    };

    /**
     * Gibt eine eindeutige Kennung (unique identifier) zurück
     * @method generateUID
     * @public
     * @static
     * @return uid String
     **/
    GUID.generateUID = function () {
        var result, i, j;
        result = '';
        for (j = 0; j < 32; j++) {
            if (j == 8 || j == 12 || j == 16 || j == 20)
                result = result + '-';
            i = Math.floor(Math.random() * 16).toString(16).toUpperCase();
            result = result + i;
        }
        return result;
    };

    ns.GUID = GUID;

})(ardplayer, ardplayer.jq, ardplayer.console);
