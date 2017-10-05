<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="utf-8"/>
    <meta http-equiv="X-UA-Compatible" content="IE=edge"/>
    <meta http-equiv="content-type" content="text/html; charset=UTF-8">

    <title>[ARD-Player - alle Kombinationen]</title>

    <!-- Basisklasse: Immer verwenden-->
    <link rel="stylesheet" href="mandanten/ard/style/main.css" type="text/css"/>
    <!--link rel="stylesheet" href="mandanten/rbb/css/player.css" media="all"/-->

    <!-- cachecontrol muss der server liefern, nicht das html -->
    <meta http-equiv="pragma" content="no-cache"/>
    <meta http-equiv="cache-control" content="no-cache"/>


    <!-- ARD Player start -->
    <!--Libs-->
	<script src="base/js/libs/jquery-2.1.1.min.js"></script>
    <script src="base/js/libs/jquery.tools-1.2.7.min.js"></script>
    <script src="base/js/libs/jquery-ui-1.10.4.min.js"></script>
    <script src="base/js/libs/swfobject.js"></script>
    <script src="base/js/libs/mm.useractivity.js"></script>
    <script src="base/js/libs/json2.js"></script>
    <script src="base/js/libs/jquery.cookie.js"></script>
    <script src="base/js/libs/shortcut.js"></script>
    <script src="base/js/libs/bigscreen.min.js"></script>
    <script src="base/js/libs/hls-0.7.11.light.min.js"></script>

    <!-- Greensock -->
    <script src="base/js/libs/TweenLite.min.js"></script>
    <script src="base/js/libs/Draggable.min.js"></script>
    <script src="base/js/libs/CSSPlugin.min.js"></script>

	<!--Player-->
    <script src="base/js/namespace.js"></script>
    <script src="base/js/com/netTrek/gundl/ardplayer/core/AbstractPlayerCtrl.js"></script>
    <script src="base/js/com/netTrek/gundl/ardplayer/core/AbstractCorePlugin.js"></script>
    <script src="base/js/com/netTrek/gundl/ardplayer/core/HtmlVideoCtrl.js"></script>
    <script src="base/js/com/netTrek/gundl/ardplayer/core/HtmlAudioCtrl.js"></script>
    <script src="base/js/com/netTrek/gundl/ardplayer/core/FlashPluginCtrl.js"></script>
    <script src="base/js/com/netTrek/gundl/ardplayer/core/Player.js"></script>
    <script src="base/js/com/netTrek/gundl/ardplayer/model/vo/PlayerConfiguration.js"></script>
    <script src="base/js/com/netTrek/gundl/ardplayer/model/vo/Media.js"></script>
    <script src="base/js/com/netTrek/gundl/ardplayer/model/vo/MediaCollection.js"></script>
    <script src="base/js/com/netTrek/gundl/ardplayer/model/vo/MediaStream.js"></script>
    <script src="base/js/com/netTrek/gundl/ardplayer/model/VideoSources.js"></script>
    <script src="base/js/com/netTrek/gundl/ardplayer/model/PlayerModel.js"></script>
    <script src="base/js/com/netTrek/gundl/ardplayer/controller/KeyboardPlayerController.js"></script>
    <script src="base/js/com/netTrek/gundl/ardplayer/utils/GUID.js"></script>
    <script src="base/js/com/netTrek/gundl/ardplayer/utils/QueryParser.js"></script>
    <script src="base/js/com/netTrek/gundl/ardplayer/utils/DateUtils.js"></script>
    <script src="base/js/com/netTrek/gundl/ardplayer/utils/Cookie.js"></script>
    <script src="base/js/com/netTrek/gundl/ardplayer/utils/Html5MEFactory.js"></script>
    <script src="base/js/com/netTrek/gundl/ardplayer/model/GlobalModel.js"></script>
    <script src="base/js/com/netTrek/gundl/ardplayer/views/ViewController.js"></script>
    <script src="base/js/com/netTrek/gundl/ardplayer/views/ResponsiveImage.js"></script>
    <script src="base/js/com/netTrek/gundl/ardplayer/views/TimelineSlider.js"></script>
    <script src="base/js/com/netTrek/gundl/ardplayer/controller/ErrorController.js"></script>
    <script src="base/js/com/netTrek/gundl/ardplayer/controller/PlayerPixelController.js"></script>
    <script src="base/js/com/netTrek/gundl/ardplayer/business/GetPlayerModelCmd.js"></script>
    <script src="base/js/com/netTrek/gundl/ardplayer/business/GenerateFlashPluginCmd.js"></script>
    <script src="base/js/com/netTrek/gundl/ardplayer/business/InitPlayerCmd.js"></script>
    <script src="base/js/com/netTrek/gundl/ardplayer/business/GetPlayerConfigByQueryCmd.js"></script>
    <script src="base/js/com/netTrek/gundl/ardplayer/business/GetPlayerConfigByJsonCmd.js"></script>
    <script src="base/js/com/netTrek/gundl/ardplayer/business/GetMediaCollectionByQueryCmd.js"></script>
    <script src="base/js/com/netTrek/gundl/ardplayer/business/GetMediaCollectionByJsonCmd.js"></script>
    <script src="base/js/com/netTrek/gundl/ardplayer/business/GenerateHTMLVideoCmd.js"></script>
    <script src="base/js/com/netTrek/gundl/ardplayer/business/GenerateHTMLAudioCmd.js"></script>
    <script src="base/js/com/netTrek/gundl/ardplayer/core/plugins.js"></script>
    <script src="base/js/com/netTrek/gundl/ardplayer/core/script.js"></script>


    <!--script src="js/compressed.js"></script-->

    <!-- Einbindung Schriftarten (Thesis) für die Untertitelung -->
    <link rel="stylesheet" href="test/fonts.css" media="all"/>
    <!-- Plugin Untertitel -->
    <!--script src="addons/untertitel/js/AddonUntertitel.js"></script>
    <script src="addons/untertitel/js/controller/SubtitleController.js"></script>
    <link rel="stylesheet" href="addons/untertitel/css/AddonUntertitel.css" media="all"/-->

    <!-- Plugin EBU-Untertitel -->
    <script src="addons/ebu-tt/js/AddonUntertitel_ebu_tt.js"></script>
    <script src="addons/ebu-tt/js/controller/EbuSubtitleController.js"></script>
    <link rel="stylesheet" href="addons/ebu-tt/css/AddonEbuSubtitle.css" media="all"/>

    <!-- ARD Player END -->

    <style>
        html, body {
            position: relative;
            font-family: Verdana, Arial, sans-serif;
            color: #fff;
            padding: 0 4%;
            height: 100%;
            background-color: #4578a8;
        }

        #body-Container {
            position: relative;
            float: left;
            width: 100%;
        }

        .box, .container {
            background-color: #112759;
            border: 5px solid white;
            float: left;
            margin: 10px auto 0;
            padding: 10px;
            width: 100%;
        }

        .headDiv {
            background-color: #BE2300;
            border: 5px solid white;
            position: relative;
            float: left;
            margin-bottom: 10px;
            margin-right: -10px;
            margin-top: 20px;
            padding: 10px 10px 0;
            width: 100%;
        }

        .logo {
            background: url("http://ard.de/pool/img/base/icon/ardlogo_weiss.png") no-repeat scroll 0 0 transparent;
            bottom: 0;
            height: 35px;
            position: absolute;
            right: 10px;
            text-decoration: none;
            width: 70px;
        }

        h1 {
            font-size: 40px;
            margin: auto;
        }

        .txt, .bullet-liste1 {
            color: #ffffff;
            font-size: 12px;
            margin-top: 1%;
        }

    </style>

</head>
<body>
<script>
(function ($) {

    $(window).ready(function () {

            // Start useragent-Abfrage zum überspringen überflüssiger Tests *******************
            //*********************************************************************************
            <?php
            //Veränderungsdatum ermitteln
            $d = getdate(getlastmod());

            //Betriebssystem ermitteln
            $agent = $_SERVER['HTTP_USER_AGENT'];
            $os = "Unbekannt";

            if (strstr($agent, "Windows 98")) $os = "Windows 98";
            elseif (strstr($agent, "NT 4.0")) $os = "Windows NT ";
            elseif (strstr($agent, "NT 5.1")) $os = "Windows XP";
            elseif (strstr($agent, "iPhone")) $os = "iPhone";
            elseif (strstr($agent, "iPod")) $os = "iPod";
            elseif (strstr($agent, "iPad")) $os = "iPad";
            elseif (strstr($agent, "Mac")) $os = "Mac OS";
            elseif (strstr($agent, "Android")) $os = "Android";
            elseif (strstr($agent, "Linux")) $os = "Linux";
            elseif (strstr($agent, "Unix")) $os = "Unix";
            elseif (strstr($agent, "NT 6.0")) $os = "Windows Vista";
            elseif (strstr($agent, "NT 6.1")) $os = "Windows 7";
            elseif (strstr($agent, "NT 6.2")) $os = "Windows 8";

            //Browser ermitteln
            $browsers = array("firefox", "msie", "opera", "chrome", "safari",
                "mozilla", "seamonkey", "konqueror", "netscape",
                "gecko", "navigator", "mosaic", "lynx", "amaya",
                "omniweb", "avant", "camino", "flock", "aol");
            $apples = array("ipad", "iphone", "ipod");


            /*Detection der Android-Version */
            $os_v = "undefined";

            if (preg_match('/android ([0-9.]+).*/si', strtolower($agent), $matchAnd)) {
                $os_v = $matchAnd[1];
            }

            /*Detection der Browser-version*/
            foreach ($browsers as $browser)
            {
                if (preg_match("#($browser)[/ ]?([0-9.]*)#", strtolower($agent), $match)) {
                    $Name = $match[1];
                    $Version = $match[2];

                    /*Detection nach mobilen Apple-Devices*/
                    if ($Name == "safari") {
                        if (preg_match('/OS\s([\d+_?]*)\slike/i', strtolower($agent), $matchIos)) {
                            $Version = "(iOS " . str_replace("_", ".", $matchIos[1]) . ")";
                        }
                    }
                    break;
                }
            }
            ?>

            getLastMod = "<?php echo $d['mday'] . "." . $d['mon'] . "." . $d['year'] . " - " . $d['hours'] . ":" . $d['minutes']; ?>";
            meinBrowser = "<?php echo $Name; ?>";
            meinBrowser_Vers = "<?php echo $Version; ?>";
            meinOs = "<?php echo $os; ?>";
            meinOs_Vers = meinOs == "Android" ? '<?php echo " $os_v" ?>' : "";

            meinBrowser = meinOs == ("iPad" || "iPod" || "iPhone") ? "ios" : meinBrowser;

            //Ausgabe/Befüllung Daten im Seitenkopf
            $('#stand').append(getLastMod + " |  <b>System:</b> " + meinOs + meinOs_Vers + " | <b>Browser:</b> " + meinBrowser + " " + meinBrowser_Vers);

            // Ende useragent-Abfrage zum überspringen überflüssiger Tests ********************
            //*********************************************************************************

            var playerInstArr = $('.ardPlayerDiv');

            var Mandant = 0;
            var Mandant_arr = new Array("ard", "daserste", "sport", "rbb", "sr");
            var mandanten_obj = {
                "ard": {
                    "_bg": '#4578A8',
                    "_bg_cont": "#112759",
                    "_txt": '#ffffff'
                },
                "daserste": {
                    "_bg": '#041634',
                    "_bg_cont": "#D8D8D8",
                    "_txt": '#041634'
                },
                "sport": {
                    "_bg": '#97CAEB',
                    "_bg_cont": "#ffffff",
                    "_txt": '#24324C'
                },
                "rbb": {
                    "_bg": '#D8D8D8',
                    "_bg_cont": "#ffffff",
                    "_txt": '#001a2d'
                },
                "sr": {
                    "_bg": "#000000",
                    "_bg_cont": "#183979",
                    "_txt": '#ffffff'
                }
            }

            init(Mandant);

            $('#selMandant').change(fChangeMandant);

            function fChangeMandant() {

                Mandant = $(this).val();
                var obj_mandant = (mandanten_obj[Mandant_arr[Mandant]]);

                cssNachladen(Mandant);
                ardplayer.removeArdPlayer("all");

                $.each(playerInstArr, function (key, val) {
                    var nr = key + 1;
                    var tmp_cont = '#player_cont_' + (nr < 10 ? '0' + nr : nr);
                    $(tmp_cont).append('<div id="' + this.id + '"></div>');
                });

                $('html, body').css({backgroundColor: obj_mandant._bg});
                $('.container').css({backgroundColor: obj_mandant._bg_cont});

                $('.txt:not(#stand)').css({'color': obj_mandant._txt});

                init(Mandant);
            }


            function cssNachladen(_mandant) {

                /*base-css wird immer gezogen*/
                var e = document.createElement("link");
                e.type = "text/css";
                e.rel = "stylesheet";
                e.href = "mandanten/ard/style/main.css";
                document.getElementsByTagName("head")[0].appendChild(e);

                /*mandantenspezifische css wird ggf. ergänzend gezogen*/
                if (_mandant !== 0) {
                    var e1 = document.createElement("link");
                    e1.type = "text/css";
                    e1.rel = "stylesheet";
                    e1.href = "mandanten/" + Mandant_arr[_mandant] + "/style/main.css";
                    document.getElementsByTagName("head")[0].appendChild(e1);
                }

                /*basis css für das ebu-addon ist im addon selbst hinterlegt und wird ggf nur von den mandanten überschrieben*/
                if (_mandant == 0) {
                    var e2 = document.createElement("link");
                    e2.type = "text/css";
                    e2.rel = "stylesheet";
                    e2.href = "addons/ebu-tt/css/AddonEbuSubtitle.css";
                    document.getElementsByTagName("head")[0].appendChild(e2);
                }
            }

            function init(_mandant) {

                /* allgemeine Pfadanpassung an die Mandanten oder base */
                var mandantenPfad = _mandant != 0 ? ("mandanten/" + Mandant_arr[_mandant]) : "base";

                //--------Player 1 video Ondemand--------------------------------------------------
                var mc = new ardplayer.MediaCollection("video", false, 1);


                mc.setSortierung(0, 1);
                mc.setPreviewImage(mandantenPfad + "/img/posterframe-m.jpg");
                mc.setSubtitleUrl("test/untertiteldateien/ebu/ebu-tt-all.xml", "");

                mc.addMedia(0);
                mc.addMediaStream(0, 0, "", "http://http-stream.rbb-online.de/rbb/ard_ref_clip/video/tmp_20100202_ard_ref_clip_MP4H264_s_16_9_256x144.mp4", "default");
                mc.addMediaStream(0, 1, "rtmp://ondemand.rbb-online.de/ondemand/", "mp4:rbb/ard_ref_clip/video/tmp_20100202_ard_ref_clip_MP4H264_m_16_9_512x288.mp4", "akamai");
                mc.addMediaStream(0, 2, "", "http://http-stream.rbb-online.de/rbb/ard_ref_clip/video/tmp_20100202_ard_ref_clip_MP4H264_l_16_9_960x544.mp4", "default");
                mc.addMediaStream(0, 3, "", "http://http-stream.rbb-online.de/rbb/ard_ref_clip/video/tmp_20100202_ard_ref_clip_MP4H264_l_16_9_960x544.mp4", "default");

                mc.addMedia(1);
                mc.addMediaStream(1, 0, "", ["http://hls.daserste.de/i/videoportal/Film/c_80000/87197/ios.smil/master.m3u8",
                        "http://http-stream.rbb-online.de/rbb/ard_ref_clip/video/tmp_20100202_ard_ref_clip_MP4H264_s_16_9_256x144.mp4"],
                    "");
                mc.addMediaStream(1, 1, "", ["http://hls.daserste.de/i/videoportal/Film/c_80000/87197/ios.smil/master.m3u8",
                        "http://http-stream.rbb-online.de/rbb/ard_ref_clip/video/tmp_20100202_ard_ref_clip_MP4H264_m_16_9_512x288.mp4"],
                    "");
                mc.addMediaStream(1, 2, "", ["http://hls.daserste.de/i/videoportal/Film/c_80000/87197/ios.smil/master.m3u8",
                        "http://http-stream.rbb-online.de/rbb/ard_ref_clip/video/tmp_20100202_ard_ref_clip_MP4H264_l_16_9_960x544.mp4"],
                    "");
                mc.addMediaStream(1, 3, "", ["http://hls.daserste.de/i/videoportal/Film/c_80000/87197/ios.smil/master.m3u8",
                        "http://httpmedia.radiobremen.de/ard-referenzclips/20090126_ard_ref_clip_dsl.mp4"],
                    "");

                var pc = new ardplayer.PlayerConfiguration();

                pc.setRepresentation("m");
                pc.setAutoPlay(true);
                pc.setShowOptions(true);
                pc.setShowOptions_Plugins(true);
                pc.setShowOptions_Quality(true);

                pc.setSolaAnalyticsEnabled(true);
                pc.setSolaAnalyticsConfig({
                    "beacon": "http://ma140-r.analytics.edgesuite.net/config/beacon-4646.xml",
                    "csma": "http://79423.analytics.edgesuite.net/csma/plugin/csma.swf",
                    "jslib": "http://79423.analytics.edgesuite.net/html5/akamaihtml5-min.js",
                    "metadata": {
                        "viewerId": "",
                        "playerId": "ardplayer-" + ardplayer.GlobalModel.VERSION,
                        "pageUrl": document.URL,
                        "title": document.title + " " + $("#label1").text(),
                        "subCategory": "Player-Tests",
                        "show": document.title,
                        "category": "Player-Kanal"
                    }
                });

                pc.setAddons(
                    "AddonUntertitel_ebu_tt"
                );

                p1 = new ardplayer.Player("player01", pc, mc);

                //--------Player 2 video live--------------------------------------------------
                var mc = new ardplayer.MediaCollection("video", true, 1);

                mc.setSortierung(0, 1);
                mc.setPreviewImage(mandantenPfad + "/img/posterframe-m.jpg");
                mc.setDVREnabled(true);

                mc.addMedia(0);
                mc.addMediaStream(0, "auto", "", "http://ndr_fs-lh.akamaihd.net/z/ndrfs_hh@119223/manifest.f4m", "akamai");
                mc.addMediaStream(0, 0, "rtmp://mdr-tv-sachsenlivefs.fplive.net/mdr-tv-sachsenlive-live", "stream_livetvmdrsachsen_de_576", "default");
                mc.addMediaStream(0, 1, "rtmp://mdr-tv-sachsenlivefs.fplive.net/mdr-tv-sachsenlive-live", "stream_livetvmdrsachsen_de_1728", "default");
                mc.addMediaStream(0, 2, "rtmp://mdr-tv-sachsenlivefs.fplive.net/mdr-tv-sachsenlive-live", "stream_livetvmdrsachsen_de_576", "default");
                mc.addMediaStream(0, 3, "rtmp://mdr-tv-sachsenlivefs.fplive.net/mdr-tv-sachsenlive-live", "stream_livetvmdrsachsen_de_1728", "default");

                mc.addMedia(1);
                mc.addMediaStream(1, "auto", "", "http://rbb_live-lh.akamaihd.net/i/rbb_berlin@108248/master.m3u8", "");

                var pc = new ardplayer.PlayerConfiguration();
                // pc.setRepresentation(quality,, width, height, inLayer, scale, confection)
                pc.setRepresentation("m");
                pc.setAutoPlay(true);
                pc.setShowOptions(true);
                pc.setShowOptions_Plugins(true);
                pc.setShowOptions_Quality(true);

                pc.setSolaAnalyticsEnabled(true);
                pc.setSolaAnalyticsConfig({
                    "beacon": "http://ma140-r.analytics.edgesuite.net/config/beacon-4646.xml",
                    "csma": "http://79423.analytics.edgesuite.net/csma/plugin/csma.swf",
                    "jslib": "http://79423.analytics.edgesuite.net/html5/akamaihtml5-min.js",
                    "metadata": {
                        "viewerId": "",
                        "playerId": "ardplayer-" + ardplayer.GlobalModel.VERSION,
                        "pageUrl": document.URL,
                        "title": document.title + " " + $("#label2").text(),
                        "subCategory": "Player-Tests",
                        "show": document.title,
                        "category": "Player-Kanal"
                    }
                });

                var p = new ardplayer.Player("player02", pc, mc);

                //--------Player 3 audio m-OnDemand--------------------------------------------------
                var mc = new ardplayer.MediaCollection("audio", false, 1);

                mc.setSortierung(1, 0);
                mc.setAudioImage("base/img/kleinesAudioBild-webM.jpeg");
                mc.setPreviewImage(mandantenPfad + "/img/posterframe-m.jpg");
                //Flash
                mc.addMedia(0);
                mc.addMediaStream(0, 1, "", "http://download.rbb-online.de/ard_ref_clip/audio/referenz_hf.mp3", "default");
                // Html5
                mc.addMedia(1);
                mc.addMediaStream(1, 1, "", "http://download.rbb-online.de/ard_ref_clip/audio/referenz_hf.mp3", "default");

                var pc = new ardplayer.PlayerConfiguration();
                pc.setRepresentation("m");
                pc.setAutoPlay(true);
                pc.setShowOptions(true);
                pc.setShowOptions_Plugins(true);
                pc.setShowOptions_Quality(true);
                pc.setShowEqualizer(true);
                pc.setForceControlBarVisible(true);

                pc.setSolaAnalyticsEnabled(true);
                pc.setSolaAnalyticsConfig({
                    "beacon": "http://ma140-r.analytics.edgesuite.net/config/beacon-4646.xml",
                    "csma": "http://79423.analytics.edgesuite.net/csma/plugin/csma.swf",
                    "jslib": "http://79423.analytics.edgesuite.net/html5/akamaihtml5-min.js",
                    "metadata": {
                        "viewerId": "",
                        "playerId": "ardplayer-" + ardplayer.GlobalModel.VERSION,
                        "pageUrl": document.URL,
                        "title": document.title + " " + $("#label3").text(),
                        "subCategory": "Player-Tests",
                        "show": document.title,
                        "category": "Player-Kanal"
                    }
                });

                var p = new ardplayer.Player("player03", pc, mc);

                //--------Player 4 audio s-OnDemand--------------------------------------------------
                var mc = new ardplayer.MediaCollection("audio", false, 1);

                mc.setSortierung(1, 0);
                mc.setAudioImage("base/img/kleinesAudioBild-webM.jpeg");
                mc.setPreviewImage(mandantenPfad + "/img/posterframe-s.jpg");
                //Flash
                mc.addMedia(0);
                mc.addMediaStream(0, 1, "", "http://download.rbb-online.de/ard_ref_clip/audio/referenz_hf.mp3", "default");
                // Html5
                mc.addMedia(1);
                mc.addMediaStream(1, 1, "", "http://download.rbb-online.de/ard_ref_clip/audio/referenz_hf.mp3", "default");

                var pc = new ardplayer.PlayerConfiguration();
                pc.setRepresentation("s");
                pc.setAutoPlay(true);
                pc.setShowOptions(true);
                pc.setShowOptions_Plugins(true);
                pc.setShowOptions_Quality(true);
                pc.setShowEqualizer(true);
                pc.setForceControlBarVisible(true);

                pc.setSolaAnalyticsEnabled(true);
                pc.setSolaAnalyticsConfig({
                    "beacon": "http://ma140-r.analytics.edgesuite.net/config/beacon-4646.xml",
                    "csma": "http://79423.analytics.edgesuite.net/csma/plugin/csma.swf",
                    "jslib": "http://79423.analytics.edgesuite.net/html5/akamaihtml5-min.js",
                    "metadata": {
                        "viewerId": "",
                        "playerId": "ardplayer-" + ardplayer.GlobalModel.VERSION,
                        "pageUrl": document.URL,
                        "title": document.title + " " + $("#label4").text(),
                        "subCategory": "Player-Tests",
                        "show": document.title,
                        "category": "Player-Kanal"
                    }
                });

                var p = new ardplayer.Player("player04", pc, mc);

                //--------Player 5 audio m-live--------------------------------------------------
                var mc = new ardplayer.MediaCollection("audio", true, 1);

                mc.setSortierung(0, 1);
                mc.setAudioImage(mandantenPfad + "/img/posterframe-m.jpg");
                mc.setPreviewImage(mandantenPfad + "/img/posterframe-m.jpg");
                //Flash
                mc.addMedia(0);
                mc.addMediaStream(0, 1, "", "http://1live.akacast.akamaistream.net/7/706/119434/v1/gnl.akacast.akamaistream.net/1live", "icecast");
                // Html5
                mc.addMedia(1);
                mc.addMediaStream(1, 1, "", "http://1live.akacast.akamaistream.net/7/706/119434/v1/gnl.akacast.akamaistream.net/1live", "");

                var pc = new ardplayer.PlayerConfiguration();
                pc.setRepresentation("m");
                pc.setAutoPlay(true);
                pc.setShowOptions(true);
                pc.setShowOptions_Plugins(true);
                pc.setShowOptions_Quality(true);
                pc.setShowEqualizer(true);
                pc.setForceControlBarVisible(true);

                pc.setSolaAnalyticsEnabled(true);
                pc.setSolaAnalyticsConfig({
                    "beacon": "http://ma140-r.analytics.edgesuite.net/config/beacon-4646.xml",
                    "csma": "http://79423.analytics.edgesuite.net/csma/plugin/csma.swf",
                    "jslib": "http://79423.analytics.edgesuite.net/html5/akamaihtml5-min.js",
                    "metadata": {
                        "viewerId": "",
                        "playerId": "ardplayer-" + ardplayer.GlobalModel.VERSION,
                        "pageUrl": document.URL,
                        "title": document.title + " " + $("#label5").text(),
                        "subCategory": "Player-Tests",
                        "show": document.title,
                        "category": "Player-Kanal"
                    }
                });

                var p = new ardplayer.Player("player05", pc, mc);

                //--------Player 6 audio s-live-------------------------------------------------
                var mc = new ardplayer.MediaCollection("audio", true, 1);

                mc.setSortierung(0, 1);
                mc.setAudioImage("base/img/kleinesAudioBild-webM.jpeg");
                mc.setPreviewImage(mandantenPfad + "/img/posterframe-s.jpg");
                //Flash
                mc.addMedia(0);
                mc.addMediaStream(0, 1, "", "http://1live.akacast.akamaistream.net/7/706/119434/v1/gnl.akacast.akamaistream.net/1live", "icecast");
                // Html5
                mc.addMedia(1);
                mc.addMediaStream(1, 1, "", "http://1live.akacast.akamaistream.net/7/706/119434/v1/gnl.akacast.akamaistream.net/1live", "");

                var pc = new ardplayer.PlayerConfiguration();
                pc.setRepresentation("s");
                pc.setAutoPlay(true);
                pc.setShowOptions(false);
                pc.setShowOptions_Plugins(true);
                pc.setShowOptions_Quality(true);
                pc.setShowEqualizer(true);
                pc.setForceControlBarVisible(true);

                pc.setSolaAnalyticsEnabled(true);
                pc.setSolaAnalyticsConfig({
                    "beacon": "http://ma140-r.analytics.edgesuite.net/config/beacon-4646.xml",
                    "csma": "http://79423.analytics.edgesuite.net/csma/plugin/csma.swf",
                    "jslib": "http://79423.analytics.edgesuite.net/html5/akamaihtml5-min.js",
                    "metadata": {
                        "viewerId": "",
                        "playerId": "ardplayer-" + ardplayer.GlobalModel.VERSION,
                        "pageUrl": document.URL,
                        "title": document.title + " " + $("#label6").text(),
                        "subCategory": "Player-Tests",
                        "show": document.title,
                        "category": "Player-Kanal"
                    }
                });

                var p = new ardplayer.Player("player06", pc, mc);


                //--------Player 7 audio xs-live--------------------------------------------------

                var mc = new ardplayer.MediaCollection("audio", true, 1);

                mc.setSortierung(0, 1);
                mc.setPreviewImage({xs: mandantenPfad + "/img/posterframe-xs.jpg", s: mandantenPfad + "/img/posterframe-s.jpg"});
                //Flash
                mc.addMedia(0);
                mc.addMediaStream(0, 1, "", "http://1live.akacast.akamaistream.net/7/706/119434/v1/gnl.akacast.akamaistream.net/1live", "icecast");
                //mc.addMediaStream(0, 1, "", "http://download.rbb-online.de/ard_ref_clip/audio/referenz_hf.mp3", "default")

                // Html5
                mc.addMedia(1);
                mc.addMediaStream(1, 1, "", "http://1live.akacast.akamaistream.net/7/706/119434/v1/gnl.akacast.akamaistream.net/1live", "");

                var pc = new ardplayer.PlayerConfiguration();

                pc.setRepresentation("xs");
                pc.setAutoPlay(true);
                pc.setShowEqualizer(true);
                pc.setForceControlBarVisible(true);
                pc.setShowOptions(false);

                pc.setSolaAnalyticsEnabled(true);
                pc.setSolaAnalyticsConfig({
                    "beacon": "http://ma140-r.analytics.edgesuite.net/config/beacon-4646.xml",
                    "csma": "http://79423.analytics.edgesuite.net/csma/plugin/csma.swf",
                    "jslib": "http://79423.analytics.edgesuite.net/html5/akamaihtml5-min.js",
                    "metadata": {
                        "viewerId": "",
                        "playerId": "ardplayer-" + ardplayer.GlobalModel.VERSION,
                        "pageUrl": document.URL,
                        "title": document.title + " " + $("#label7").text(),
                        "subCategory": "Player-Tests",
                        "show": document.title,
                        "category": "Player-Kanal"
                    }
                });

                var p = new ardplayer.Player("player07", pc, mc);


            }

            // Version **********************************************************************************

            $('#stand').append("| <b>Player-Version: </b>" + ardplayer.GlobalModel.VERSION);
        }
    )
    ;
})(ardplayer.jq);
</script>
<div id="body-Container">
    <div class="headDiv">
        <div style="position: relative; float: left; ">
            <h1 class="headtxt">ARD-Player - Alle Player-Kombinationen</h1>

            <p class="txt" id="stand" style="font-size: 14px; padding: 10px 10px 0 0;"><b>Stand Seite: </b></p>
        </div>
        <div class="logo"></div>
    </div>

    <div class="container">
        <form>
            <p class="txt">Mandant:
                <select id="selMandant" name="selMandant" role="listbox" tabindex="0"
                        aria-label="Auswahl Mandanten-Design">
                    <option role="option" value="0" selected="selected">ARD</option>
                    <option role="option" value="1">dasErste</option>
                    <option role="option" value="2">Sportschau</option>
                    <option role="option" value="3">RBB</option>
                    <option role="option" value="4">SR</option>
                </select>
            </p>
        </form>
        <p class="txt" id="label1">|1| Video - OnDemand</p>

        <div id="player_cont_01" style="width:512px; height: 288px;">
            <div class="ardPlayerDiv" id="player01"></div>
        </div>
        <br/>

        <div style="clear:both;"></div>
        <p class="txt" id="label2">|2| Video - Live</p>

        <div id="player_cont_02" style="width:512px; height: 288px;">
            <div class="ardPlayerDiv" id="player02"></div>
        </div>
        <br/>

        <div style="clear:both;"></div>
        <p class="txt" id="label3">|3| Audio M - OnDemand</p>

        <div id="player_cont_03" style="width:512px; height: 288px;">
            <div class="ardPlayerDiv" id="player03"></div>
        </div>
        <br/>

        <div style="clear:both;"></div>
        <p class="txt" id="label4">|4| Audio S - OnDemand</p>

        <div id="player_cont_04" style="width:256px; height: 144px;">
            <div class="ardPlayerDiv" id="player04"></div>
        </div>
        <br/>

        <div style="clear:both;"></div>
        <p class="txt" id="label5">|5| Audio M - Live</p>

        <div id="player_cont_05" style="width:512px; height: 288px;">
            <div class="ardPlayerDiv" id="player05"></div>
        </div>
        <br/>

        <div style="clear:both;"></div>
        <p class="txt" id="label6">|6| Audio S - Live</p>

        <div id="player_cont_06" style="width:256px; height: 144px;">
            <div class="ardPlayerDiv" id="player06"></div>
        </div>
        <br/>

        <div style="clear:both;"></div>
        <p class="txt" id="label7">|7| Audio XS - Live - nur Steuerleiste</p>

        <div id="player_cont_07" style="width:256px; height: 45px;">
            <div class="ardPlayerDiv" id="player07"></div>
        </div>
        <br/>
    </div>
</div>
</body>
</html>