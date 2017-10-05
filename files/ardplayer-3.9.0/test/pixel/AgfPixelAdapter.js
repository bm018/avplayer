/**
 * Created by Klaus Panster (ard.de)
 * User: ard.de - Klaus Panster
 * @module AgfPixelAdapter
 **/

(function (ns, $, console) {

    /**
     * Diese Klasse beschreibt den Pixel-Adapter für die AGF-Pixelung.
     * Er dient als Schnittstelle für die allgemein im Player geworfenen Pixelevents und AGF
     * @class AgfPixelAdapter
     * @param player
     * @return void
     **/

    var AgfPixelAdapter = function (player, pixelConfig) {
        this.player = player;
        this.dvrStreamOffset = 0;
        this.ggAgf = new gg();

        this.conf = pixelConfig;
        this.initialize();
    };

    var apa = AgfPixelAdapter.prototype;

    apa.initialize = function () {

        var p = this.player;

        if (ns.track_AGF && p.model.mediaCollection.getType() == 'video') {

            var canUseSWF = false;
            var uid = 0;

            var _nolggGlobalParams = {
                clientid: "de-605508",
                vcid: ns.agf_vcid,
                cisuffix: "",
                sfcode: "eu",
                prod: "vc"
            };

            this.ggAgf.ggInitialize(_nolggGlobalParams, uid, canUseSWF, false);

            this.bindPlayerPixel();
        }
    };

    /**
     * Diese Methode bindet die relevanten vom Player geworfenen Pixel und steuert somit die AGF-Pixelung
     */

    apa.bindPlayerPixel = function () {

        var gg1 = this.ggAgf;
        var p = this.player;
        var dvrStreamOffset = this.dvrStreamOffset;

        var eventStreamStartTime = this.conf.startDayTime;
        var clipUrl = this.conf.clipUrl;
        var clipType = this.conf.clipType;
        var metaData = this.conf.agfMetadata;
        var pixeledEvents = this.conf.pixeledEvents;
        var debug = (this.conf.debugLevel) ? this.conf.debugLevel : 0;

        var that = this;
        var pos = null;
        var pos1 = null;

        that.clipHasBeenPaused = false; /* Hilfsvariable, die beim Event SUPER_PAUSE auf true gesetzt wird */
        that.clipHasEnded = false; /* Hilfsvariable, die beim Event CLIP_ENDED auf true gesetzt wird */
        that.clipHasBeenMuted = false; /* Hilfsvariable, die beim Event SUPER_VOLUME_MUTE gesetzt wird*/

        /* Pixel-EventListener
         *********************************************************************************** */

        if ($.inArray("STREAM_LOAD", pixeledEvents) > -1) {

            $(p).on(PlayerPixelController.STREAM_LOAD, function (event) {
                if (!(event.isQualityChanged || event.isPluginChanged)) {

                    if (p.model.mediaCollection.getIsLive()) {
                        if (debug > 0) console.log("Load Video (3): " + clipUrl);
                        gg1.ggPM(3, clipUrl, clipType, metaData, 1);
                    } else {
                        if (debug > 0) console.log("Load and Play Video (15): " + clipUrl);
                        gg1.ggPM(15, clipUrl, clipType, metaData, 1);
                    }
                } else if ((event.isPluginChanged || event.isQualityChanged) && (that.clipHasEnded || that.clipHasBeenPaused)) {

                    pos = Math.round(event.currentTarget.model.getTime());

                    if (debug > 0) console.log("Play Video (5): " + pos);
                    gg1.ggPM(5, pos);

                    that.clipHasBeenPaused = false;
                    that.clipHasEnded = false;
                }
            });
        }

        if ($.inArray("SUPER_INITIAL_PLAY", pixeledEvents) > -1) {
            $(p).on(PlayerPixelController.SUPER_INITIAL_PLAY, function (event) {

                that.clipHasBeenPaused = false;
                that.clipHasEnded = false;

                if (p.model.mediaCollection.getIsLive()) {

                    /* Ermittlung des TS-Offset (kann erst beim ersten Abspielen geschehen,
                     da sonst noch keine Stream-Infos vorliegen) */
                    if (p.model.mediaCollection.getDVREnabled() && p.getCtrl()._dvrEnabled) {
                        dvrStreamOffset = Math.round(event.currentTarget.model.getTime());
                    } else {
                        dvrStreamOffset = 0;
                    }

                    var realNow = Math.round(that.timeCal((new Date()))); /* aktueller realer Zeitpunkt */
                    pos = realNow - eventStreamStartTime;
                    if (debug > 0) console.log("Play Video (5): " + pos);
                    if (debug > 1) console.log("Play Video (5): " + that.realTime(pos));
                    gg1.ggPM(5, pos);

                    if (debug == 2) {
                        console.log("Zeit - dvrStreamOffset:   " + that.realTime(dvrStreamOffset) + " | aktuelle Zeit: " + realNow + " sek");
                    }
                    that.dvrStreamOffset = dvrStreamOffset;
                }
            });
        }

        if ($.inArray("CLIP_ENDED", pixeledEvents) > -1) {
            $(p).on(PlayerPixelController.CLIP_ENDED, function (event) {
                pos = Math.round(event.currentTarget.model.getDuration());
                that.clipHasEnded = true;
                that.clipHasBeenPaused = true;
                if (debug > 0) console.log("Stop (7): " + pos);
                gg1.ggPM(7, pos);
            });
        }

        if ($.inArray("CLIP_ERROR", pixeledEvents) > -1) {
            $(p).on(PlayerPixelController.CLIP_ERROR, function (event) {
                if (debug > 0) console.log("StreamFailure (26:) " + event.message);
                gg1.ggPM(26, event.message);
            });
        }

        if ($.inArray("PLAYER_LOADING", pixeledEvents) > -1) {
            $(p).on(PlayerPixelController.PLAYER_LOADING, function (event) {
                if (debug > 0) console.log("Load Player (1)");
                gg1.ggPM(1, window.location.href, document.referrer);
            });
        }

        if ($.inArray("SUPER_VOLUME_MUTE", pixeledEvents) > -1) {
            $(p).on(PlayerPixelController.SUPER_VOLUME_MUTE, function (event) {
                if (debug > 0) console.log("Mute (9): true");
                gg1.ggPM(9, "true");
                that.clipHasBeenMuted = true;
            });
        }

        if ($.inArray("SUPER_VOLUME_UNMUTE", pixeledEvents) > -1) {
            $(p).on(PlayerPixelController.SUPER_VOLUME_UNMUTE, function (event) {
                if (debug > 0) console.log("Mute (9): false");
                gg1.ggPM(9, "false");
                that.clipHasBeenMuted = false;
            });
        }

        if ($.inArray("SUPER_VOLUME_CHANGE", pixeledEvents) > -1) {
            $(p).on(PlayerPixelController.SUPER_VOLUME_CHANGE, function (event) {

                // wenn vorher stumm geschaltet war, werfe "unmute"
                if(that.clipHasBeenMuted) gg1.ggPM(9, "false");
                that.clipHasBeenMuted = false;

                var vol = Math.round((event.volume) * 100);
                if (isNaN(vol)) vol = 50;
                if (debug > 0) console.log("setVolume (11): " + vol);
                gg1.ggPM(11, vol);
            });
        }

        if ($.inArray("SUPER_SCRUBBAR_CHANGE_POSITION_FORWARD", pixeledEvents) > -1) {
            $(p).on(PlayerPixelController.SUPER_SCRUBBAR_CHANGE_POSITION_FORWARD, function (event) {
                that.scrubbing(p, event);
            });
        }

        if ($.inArray("SUPER_SCRUBBAR_CHANGE_POSITION_REWIND", pixeledEvents) > -1) {
            $(p).on(PlayerPixelController.SUPER_SCRUBBAR_CHANGE_POSITION_REWIND, function (event) {
                that.scrubbing(p, event);
            });
        }

        if ($.inArray("IA_MOUSE_BACK_TO_LIVE", pixeledEvents) > -1) {
            $(p).on(PlayerPixelController.IA_MOUSE_BACK_TO_LIVE, function (event) {

                var realNow = Math.round(that.timeCal(new Date())); /* aktueller realer Zeitpunkt */

                pos1 = realNow - eventStreamStartTime;
                pos = realNow - (dvrStreamOffset - (Math.round(event.currentTarget.model.getTime())) - eventStreamStartTime);

                if (debug > 0) console.log("Seek (8): " + pos + " -> " + pos1);
                if (debug > 1) console.log("Seek (8): " + that.realTime(pos) + " -> " + that.realTime(pos1));

                gg1.ggPM(8, pos, pos1);

                if(that.clipHasBeenPaused){
                    if (debug > 0) console.log("Play Video (5): " + pos1);
                    gg1.ggPM(5, pos1);
                }
                that.clipHasBeenPaused = false;
            });
        }

        if ($.inArray("SUPER_FULLSCREEN_ACTIVATION", pixeledEvents) > -1) {
            $(p).on(PlayerPixelController.SUPER_FULLSCREEN_ACTIVATION, function (event) {
                if (debug > 0) console.log("Full screen (10): true");
                gg1.ggPM(10, "true");
            });
        }

        if ($.inArray("SUPER_FULLSCREEN_DEACTIVATION", pixeledEvents) > -1) {
            $(p).on(PlayerPixelController.SUPER_FULLSCREEN_DEACTIVATION, function (event) {
                if (debug > 0) console.log("Full screen (10): false");
                gg1.ggPM(10, "false");
            });
        }

        if ($.inArray("SUPER_PLAY", pixeledEvents) > -1) {
            $(p).on(PlayerPixelController.SUPER_PLAY, function (event) {

                that.clipHasBeenPaused = false;

                if (p.model.mediaCollection.getIsLive()) {

                    var realNow = Math.round(that.timeCal(new Date())); /* aktueller realer Zeitpunkt */
                    pos = realNow - eventStreamStartTime;

                    if (p.model.mediaCollection.getDVREnabled() && p.getCtrl()._dvrEnabled) {
                        pos += (Math.round(event.currentTarget.model.getTime()) - dvrStreamOffset);
                    }

                } else {
                    pos = Math.round(event.currentTarget.model.getTime());
                    that.clipHasEnded = false;
                }
                if (debug > 0) console.log("Play Video (5): " + pos);
                gg1.ggPM(5, pos);

            });
        }

        if ($.inArray("SUPER_PAUSE", pixeledEvents) > -1) {
            $(p).on(PlayerPixelController.SUPER_PAUSE, function (event) {

                that.clipHasBeenPaused = true;

                if (p.model.mediaCollection.getIsLive()) {

                    var realNow = Math.round(that.timeCal(new Date())); /* aktueller realer Zeitpunkt */
                    pos = realNow - eventStreamStartTime;

                    if (p.model.mediaCollection.getDVREnabled() && p.getCtrl()._dvrEnabled) {
                        pos += (Math.round(event.currentTarget.model.getTime()) - dvrStreamOffset);
                    }

                } else {
                    pos = Math.round(event.currentTarget.model.getTime());
                }

                if (debug > 0) console.log("Pause (6): " + pos);
                gg1.ggPM(6, pos);

            });
        }

        if ($.inArray("SUPER_REPLAY", pixeledEvents) > -1) {
            $(p).on(PlayerPixelController.SUPER_REPLAY, function (event) {

                that.clipHasBeenPaused = false;
                that.clipHasEnded = false;

                if (debug > 0) console.log("Play Video (5): 0");
                gg1.ggPM(5, 0);
            });
        }

        /* für externe Links */


       $(window).on("beforeunload", leavePage);

        /* für interne Links */
        //jq(document).on("pagebeforecreate", leavePage).on(Application.EVENT_CONTENT_ADDED, leavePage);

        function leavePage(e, targetNode){

            /*if(jq.isEmptyObject(targetNode)){
                jq(document).off("pagebeforecreate", leavePage).off(Application.EVENT_CONTENT_ADDED, leavePage);
                jq(document).off(Application.EVENT_CONTENT_ADDED, leavePage);
                jq(window).off("beforeunload", leavePage);

                that.leavePage(p);
            } else if(jq(targetNode).find("div[data-ctrl-player]")[0] != undefined){
                jq(document).off(Application.EVENT_CONTENT_ADDED, leavePage);
                jq(document).off("pagebeforecreate", leavePage).off(Application.EVENT_CONTENT_ADDED, leavePage);
                jq(window).off("beforeunload", leavePage);

                that.leavePage(p);
            } */


            console.log("raus hier!");
        }


         if ($.inArray("SUPER_SUBTITLE_ACTIVATION", pixeledEvents) > -1) {
         $(p).on(PlayerPixelController.SUPER_SUBTITLE_ACTIVATION, function (event) {
         });
         }

         if ($.inArray("SUPER_SUBTITLE_DEACTIVATION", pixeledEvents) > -1) {
         $(p).on(PlayerPixelController.SUPER_SUBTITLE_DEACTIVATION, function (event) {
         });
         }


        /* page unload...wenn video noch läuft -> (type 7) player stop
         Abfrage nach msi, weil onbeforunload nicht unterstützt wird */
         /*
        if ($.browser.msie) {
         window.onbeforeunload = function (e) {
         that.leavePage(p);
         };
         } else {
         $(window).unload(function (e) {
         that.leavePage(p);
         });
         }
         */
    }

    /**
     * Diese Methode steuert die Pixelung beim Vor- und Zurückspringen in der Zeitleiste des Players
     */

    apa.scrubbing = function (p, event) {

        var gg1 = this.ggAgf;
        var dvrStreamOffset = this.dvrStreamOffset;
        var eventStreamStartTime = this.conf.startDayTime;
        var debug = this.conf.debugLevel;
        var that = this;
        var pos = null;

        if (p.model.mediaCollection.getIsLive()) {

            var currentSeekTime = Math.round(event.currentTarget.model.getTime()); /* aktueller Zeitpunkt auf der Seekbar des Players(live + x sek) */
            var seekToTime = Math.round(event.seekto);
            var realNow = Math.round(that.timeCal(new Date())); /* aktueller realer Zeitpunkt */
            var currentTsOffsetTime = (Math.round(currentSeekTime - dvrStreamOffset) > -5) ? 0 : Math.round(currentSeekTime - dvrStreamOffset); /* berechnetes Offset zum Live-Punkt (immer <0) wegen Rundungsfehler wird >-5 auf 0 gerundet, */
            var seetkToTsOffsetTime = (Math.round(seekToTime - dvrStreamOffset) > -5) ? 0 : Math.round(seekToTime - dvrStreamOffset); /* berechnetes Offset zum Live-Punkt (immer <0) wegen Rundungsfehler wird >-5 auf 0 gerundet, */

            if (debug == 2) {
                console.log("---------------------------------------------------------------------");
                console.log("currentSeekTime:   " + currentSeekTime);
                console.log("eventStreamStartTime:   " + eventStreamStartTime);
                console.log("seekToTime:   " + seekToTime);
                console.log("dvrStreamOffset (Spanne zwischen linken und rechten Anschlag):  " + dvrStreamOffset);
                console.log("gewünschtes Timeshift Offset: " + seetkToTsOffsetTime);
                console.log("Jetzt: " + realNow);
                console.log("Jetzt - eventStreamStartTime: " + (realNow - eventStreamStartTime));
                console.log("berechnete Pause Zeit: " + Math.round(realNow + currentTsOffsetTime - eventStreamStartTime));
                console.log("berechnete Seek-Zeit: " + Math.round(realNow + seetkToTsOffsetTime - eventStreamStartTime));
                console.log("---------------------------------------------------------------------");
            }

            pos1 = realNow + seetkToTsOffsetTime - eventStreamStartTime;
            pos = Math.round(realNow + currentTsOffsetTime - eventStreamStartTime);
            if (debug > 0) console.log("Seek (8): " + pos + " -> " + pos1);
            gg1.ggPM(8, pos, pos1);

            // wird der Stream bis genau zu LIVE geseekt, spielt der pausierte Player ab und setzt Pause-Status auf false
            if(that.clipHasBeenPaused && (pos1 == realNow - eventStreamStartTime)){
                if (debug > 0) console.log("Play Video (5): " + pos1);
                gg1.ggPM(5, pos1);
                that.clipHasBeenPaused = false;
            }
        } else {

            pos = Math.round(event.seekto);
            if (that.clipHasEnded) {

                that.clipHasBeenPaused = false;
                that.clipHasEnded = false;

                if (debug > 0) console.log("Play Video (5): " + pos);
                gg1.ggPM(5, pos);
            } else {
                var pos1 = Math.round(event.current);
                if (debug > 0) console.log("Seek (8): " + pos1 + " -> " + pos);
                gg1.ggPM(8, pos1, pos);
            }
        }
    }

    /**
     * Diese Methode steuert die Pixelung des Players beim Verlassen der Seite
     */
    apa.leavePage = function (p) {

        if (p.model != null) {
            var gg1 = this.ggAgf;
            var eventStreamStartTime = this.conf.startDayTime;
            var debug = this.conf.debugLevel;
            var dvrStreamOffset = this.dvrStreamOffset;
            var pos = null;
            var that = this;

            if (p.model.mediaCollection.getIsLive()) {

                var realNow = Math.round(this.timeCal(new Date())); /* aktueller realer Zeitpunkt */
                pos = Math.round(realNow - eventStreamStartTime);

                if (p.model.mediaCollection.getDVREnabled() && p.getCtrl()._dvrEnabled) {
                    pos += Math.round(p.model.getTime() - dvrStreamOffset);
                }

                gg1.ggPM(7, pos);
                if (debug > 0) console.log("Stop (7): " + pos);

            } else if (!(that.clipHasEnded)) {
                pos = Math.round(p.model.getTime());
                gg1.ggPM(7, pos);
                if (debug > 0) console.log("Stop (7): " + pos);
            }
        }
    }

    /**
     * Diese Methode rechnet das Date-Object in fortlaufende Sekunden ab 00:00 um
     */
    apa.timeCal = function (t) {
        // berechnet die verstrichenen Sekunden des Tages (ab 00:00)
        var seconds = t.getSeconds();
        var minutes = t.getMinutes() * 60;
        var hour = t.getHours() * 3600;
        var daytimeInSek = seconds + minutes + hour;

        return daytimeInSek;
    }

    /**
     * Diese Methode rechnet die seit 0:00 Uhr vergangenen Sekunden aus und übergibt sie als String
     */
    apa.realTime = function (t) {
        var sec_num = parseInt(t, 10);
        var hours = Math.floor(sec_num / 3600);
        var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
        var seconds = sec_num - (hours * 3600) - (minutes * 60);

        if (hours < 10) hours = "0" + hours;
        if (minutes < 10) minutes = "0" + minutes;
        if (seconds < 10) seconds = "0" + seconds;
        var time = hours + ':' + minutes + ':' + seconds;

        return time;
    }

    ns.AgfPixelAdapter = AgfPixelAdapter;

}(ardplayer, ardplayer.jq, ardplayer.console));