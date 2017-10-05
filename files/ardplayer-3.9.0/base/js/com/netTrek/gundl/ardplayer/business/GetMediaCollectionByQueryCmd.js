/**
 * Created by netTrek GmbH & Co. KG
 * User: netTrek - Saban Uenlue
 * @module business
 **/

(function (ns, $, console) {
    "use strict";
    /**
     * Diese Klasse erstellt die MediaCollections die der Entwickler über die URL des Browsers übergeben kann
     * @class GetMediaCollectionByQueryCmd
     * @constructor
     * @public
     **/
    var GetMediaCollectionByQueryCmd = function () {
        this.initialize();
    };

    var p = GetMediaCollectionByQueryCmd.prototype;

    /**
     * Initializationsmethode.
     * @method initialize
     * @protected
     **/
    p.initialize = function () {

    };

    /**
     * Diese Methode löste das Command aus.
     * @methode execute
     * @public
     * @param queryObject Typ: Object.
     * @param callback Typ: function. - Eventhandler dass im Anschluss aufgerufen werden soll
     */
    p.execute = function (queryObject, callback) {

        var q = queryObject || ns.GlobalModel.getInstance().startParams,
            mc;
        if (q) {
            //                                                   queryObject.mct
            var type = "video";
            if (q.mct && q.mct.toLowerCase() === "audio")
                type = "audio";
            //                                                   queryObject.mcl
            var isLive = (q.mcl && q.mcl === "1") ? true : false;
            var defaultQuality = 0;
            //                                                   queryObject.mcd
            if (q.mcd && !isNaN(Number(q.mcd)))
                defaultQuality = Number(q.mcd);


            mc = new ns.MediaCollection(type, isLive, defaultQuality);
            //                                                   queryObject.prio
            if (q.prio)
                mc.setSortierung(q.prio.split(","));

            //                                                   queryObject.dwn
            if (q.dwn && typeof eval(q.dwn) == "function") {
                mc.setDownloadClickFunction(eval(q.dwn));
            }

            //                                                   queryObject.pod
            if (q.pod && typeof eval(q.pod) == "function") {
                mc.setPodcastClickFunction(eval(q.pod));
                //log ( mc.getPodcastClickFunction() );
            }

            //                                                   queryObject.img
            if (q.img) {
                mc.setPreviewImage(q.img);
            }
            //                                                   queryObject.imgAud
            if (q.imgAud) {
                mc.setAudioImage(q.imgAud);
            }
            //                                                   queryObject.suburl
            if (q.suburl) {
                if (q.suburl.split(",").length == 2) {
                    var s = q.suburl.split(",");
                    mc.setSubtitleUrl(s[0], Number(s[1]));
                }
                else
                    mc.setSubtitleUrl(q.suburl);
            }
            //                                                   queryObject.s4flash
            this.parseMedia(mc, q.s4flash, ns.GlobalModel.FLASH);
            //                                                   queryObject.s4html
            this.parseMedia(mc, q.s4html, ns.GlobalModel.HTML5);
        }


        if (callback)
            callback(mc);

        return mc;

    };

    /**
     * Die Methode parst die Informationen aus dem Query. Hier werden unterschiedliche objekte verlangt.
     * Die Objektarrays sind: s4flash, s4html.
     * Pro  Array-Objekt werden insgesamt 3 Werte verlangt.
     * Die Werte sind: quality/server/stream
     *
     * Für jede mediaType wird dann ein Media-Objekt erstellt.
     * Für jede qualität wird dann ein MediaStream-Objekt erstellt.
     *
     * @methode parseMedia
     * @param mc MediaCollection in welche die Stream Informationen abgelegt werden
     * @param args String welche kommaseperiert die Streaminformationen beinhaltet: rtmpt://ndr.fcod.llnwd.net/a3715/d1/,mp4:flashmedia/streams/ndr/2011/0928/TV-20110928-2313-3901.lo,h2,s2,h3,s3,h4,s4
     * @param mediaType uint Medien-Typ 0,1,2 HTML | FLASH
     * @private
     */
    p.parseMedia = function (mc, args, mediaType) {
        if (args && args.split(",").length > 0 && args.split(",").length % 3 === 0) {
            //s4flash=rtmpt://ndr.fcod.llnwd.net/a3715/d1/,mp4:flashmedia/streams/ndr/2011/0928/TV-20110928-2313-3901.lo,h2,s2,h3,s3,h4,s4
            var streamlist = args.split(",");
            var ind = 0;
            mc.addMedia(mediaType);
            //console.info ( streamlist );
            while (streamlist.length > 0) {
                var srv = $.trim(streamlist.shift()),
                    srm = $.trim(streamlist.shift()),
                    cdn = $.trim(streamlist.shift())
                    ;
                /*
                 console.log ( srv );
                 console.log ( srm );
                 console.log ( cdn );
                 */
                mc.addMediaStream(mediaType, ind++, srv, srm, cdn);
            }
        }
    };

    ns.GetMediaCollectionByQueryCmd = GetMediaCollectionByQueryCmd;

})(ardplayer, ardplayer.jq, ardplayer.console);
