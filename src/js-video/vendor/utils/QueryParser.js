/**
 * Created by netTrek GmbH & Co. KG
 * User: netTrek - Saban Uenlue
 * @module utils
 **/

(function (ns, $, console) {
    "use strict";
    /**
     * Diese Klasse ist dafür zuständig um eine Abfrage zu analysieren.
     * @class QueryParser
     * @constructor
     * @public
     * @param identifier
     *
     **/
    var QueryParser = function (identifier) {
        if (/*arguments.callee.*/ QueryParser.__IDs__ == undefined)
        /*arguments.callee.*/ QueryParser.__IDs__ = {};

        if (identifier == undefined) {
            var errorCtrl = ns.ErrorController.getInstance();
            errorCtrl.throwError(ns.ErrorController.IDENTIFIER_IS_UNDEFINED, ns.ErrorController.IS_CRITICAL_YES);
            //alert("identifier is undefined");
            //throw new Error("identifier is undefined");
        }

        if (/*arguments.callee.*/ QueryParser.__IDs__ [identifier]) {
            return /*arguments.callee.*/ QueryParser.__IDs__ [identifier];
        }
        /*arguments.callee.*/
        QueryParser.__IDs__ [identifier] = this;

        /**
         * singleton identifier
         * @property identifier
         * @type String
         */
        this.identifier = identifier;
        this.initialize();
    };

    /*
     * Löscht die Parameter die zum erstellen eines Singeltons genutzt werden
     * @method resetSingleton
     * @public
     * @param void
     * @return void
     * */
    QueryParser.resetSingleton = function () {
        QueryParser.__IDs__ = undefined;
    };

    /**
     * Singleton-factory.
     * Erstellt eine neue QueryParser-Instanz, oder gibt die schon erzeugte Instanz zurück
     * @method getInstance
     * @public
     * @static
     * @param identifier
     * @return QueryParser
     */
    QueryParser.getInstance = function (identifier) {
        identifier = (typeof identifier === 'string' ? identifier : window.location.search);
        return new QueryParser(identifier);
    };

    var p = QueryParser.prototype;

    /**
     * Initializationsmethode.
     * @method initialize
     * @protected
     **/
    p.initialize = function () {
    };

    /**
     * Hier wird die URL und falls vorhadenen weitere Daten über den additionalData-Parameter überprüft.
     * Somit wird es möglich, Player zu erstellen, und/oder PlayerConfigurationen zu übergeben.
     * @method getQueryObject
     * @protected
     * @param additionalData. Typ: Object.
     * @return _params. Typ: Object.
     **/
    p.getQueryObject = function (additionalData) {
        if (this._params)
            return $.extend({}, this._params, additionalData);

        /*
         console.log("-----------------QueryParser getQueryObject----------------------");
         console.log(additionalData);
         */
        var q = this.identifier,
            o = {'f':function (v) {
                return unescape(v).replace(/\+/g, ' ');
            }}
            ;
        o = $.extend({}, o, additionalData);
        /*
         console.log(q);
         */
        /**
         * URL Parameter
         * @property _params
         * @private
         * @type Object
         */
        var params = {};

        $.each(q.match(/^\??(.*)$/)[1].split('&'), function (i, p) {
            p = p.split('=');
            p[1] = o.f(p[1]);
            params[p[0]] = params[p[0]] ? ((params[p[0]] instanceof Array) ? (params[p[0]].push(p[1]), params[p[0]]) : [params[p[0]], p[1]]) : p[1];
        });

        if (params[''] == "undefined")
            return undefined;

        this._params = params;
        return this._params;

    };

    ns.QueryParser = QueryParser;

})(ardplayer, ardplayer.jq, ardplayer.console);