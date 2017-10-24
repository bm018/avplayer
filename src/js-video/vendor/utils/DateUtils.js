/**
 * Created by netTrek GmbH & Co. KG
 * User: netTrek - Saban Uenlue
 * @module utils
 **/
(function (ns, $, console) {
    "use strict";
    /**
     * Diese Klasse wird als utils-Klasse für den Player genutzt.
     * Hier werden unterschiedliche Formatierungen von übergebenen Werten getätigt.
     * @class DateUtils
     * @constructor
     **/
    var DateUtils = function () {
    };

    var p = DateUtils.prototype;

    /**
     * fügt die Zahl 0 so lange vor eine übergebene zahl bis die gewünschte Zahllänge erreicht ist
     * addZeros ( 3, 1) // 001
     * @private
     * @param targetStrLength
     * @param value
     * @return formatierte Strings
     */
    function addZeros(targetStrLength, value) {
        var v = String(value);
        var c = targetStrLength - v.length;
        if (c > 0)
            for (var i = 0; i < c; i++)
                v = "0" + v;
        return v;
    };


    /**
     * gibt einen Zeitstring von einen Millisekundenwert zurück HH:MM:SS
     * @method getFormatedTime
     * @return String
     * @static
     **/
    DateUtils.getFormatedTime = function (p_milliseconds) {

		if ( isNaN(p_milliseconds) )
		{
			return "00:00:00";
		}

        var seconds = Math.floor(p_milliseconds / 1000);
        var secondsRest = seconds % 60;
        var minutes = (seconds - secondsRest) / 60;
        seconds = secondsRest;
        var minutesRest = minutes % 60;
        var hours = (minutes - minutesRest) / 60;
        minutes = minutesRest;
        return addZeros(2, hours) + ":" + addZeros(2, minutes) + ":" + addZeros(2, seconds);
    };

    ns.DateUtils = DateUtils;

})(ardplayer, ardplayer.jq, ardplayer.console);
