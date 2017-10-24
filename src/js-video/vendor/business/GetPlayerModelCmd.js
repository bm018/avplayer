/**
 * Created by netTrek GmbH & Co. KG
 * User: netTrek - Saban Uenlue
 * @module business
 **/

(function (ns, $, console) {
    "use strict";
    /**
     * Diese Klasse wird als Model für den jeweiligen Player genutzt.
     * @class GetPlayerModelCMD
     * @constructor
     * @public
     * @return void
     **/
    var GetPlayerModelCMD = function () {
        this.initialize();
    };

    var p = GetPlayerModelCMD.prototype;

    /**
     * Initialization method.
     * @method initialize
     * @protected
     * @return void
     **/
    p.initialize = function () {

    };

    /**
     * method execute the cmd
     * @method execute
     * @public
     * @param callback - callback function
     * @param url - xml url (optional)
     * @return void
     **/
    p.execute = function (callback, url) {
        this.callback = callback;
        $.ajax({
            type:"GET",
            url:url || "xml/test.xml",
            dataType:"xml",
            success:ns.Delegate.create(this, this.parseXml)
        });

    };

	/**
     * complete handler for loading xml
     * @method parseXml
     * @public
     * @event success
     * @param xml
     * @return void
     **/
    p.parseXml = function (xml) {
        var p = ns.PlayerModel.getInstance();
        p.flashsources = new ns.VideoSources();
        p.flashsources.s = $(xml).find("flash sizes s").text();
        p.flashsources.m = $(xml).find("flash sizes m").text();

        $(xml).find("flash sizes l").each(function () {
            if (( $(this).attr("type") == "extra" )) {
                p.flashsources.xl = $(this).attr("type") + $(this).text();
            }
            else
                p.flashsources.l = $(this).text();
        });

        p.htmlsources = new ns.VideoSources();
        p.htmlsources.s = $(xml).find("flash sizes s").text();
        p.htmlsources.m = $(xml).find("flash sizes m").text();

        $(xml).find("flash sizes l").each(function () {
            if (( $(this).attr("type") == "extra" )) {
                p.htmlsources.xl = $(this).attr("type") + $(this).text();
            }
            else
                p.htmlsources.l = $(this).text();
        });

        this.callback(p);
        /*
         delete xml;
         */
    };

    ns.GetPlayerModelCMD = GetPlayerModelCMD;

})(ardplayer, ardplayer.jq, ardplayer.console);
