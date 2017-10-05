<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="utf-8"/>
    <meta http-equiv="X-UA-Compatible" content="IE=edge"/>
    <meta http-equiv="content-type" content="text/html; charset=UTF-8">

    <title>[ARD-Player - Test AGF]</title>

    <!-- Basisklasse: Immer einbinden -->
    <link rel="stylesheet" href="mandanten/ard/style/main.css" type="text/css"/>

    <!-- Nielsen AGF -->
    <script type="text/javascript" src="https://secure-eu.imrworldwide.com/novms/js/2/ggcmb390.js"></script>


    <script type="text/javascript">
        document.write("<meta http-equiv='X-UA-Compatible' content='IE=edge'/>");
    </script>


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

    <!-- Plugin EBU-Untertitel -->
    <script src="addons/ebu-tt/js/AddonUntertitel_ebu_tt.js"></script>
    <script src="addons/ebu-tt/js/controller/EbuSubtitleController.js"></script>
    <link rel="stylesheet" href="addons/ebu-tt/css/AddonEbuSubtitle.css" media="all"/>

    <!-- Plugin Debug -->
    <script src="addons/debug/js/AddonDebug.js"></script>
    <link rel="stylesheet" href="addons/debug/css/AddonDebug.css" media="all"/>


    <!--AGF-Einzug -->
    <script src="test/pixel/AgfPixelAdapter.js"></script>

    <!-- ARD Player END -->

    <style>
        html, body {
            position: relative;
            font-family: Verdana, Arial, sans-serif;
            /*color: #14315B;  */
            color: #ffffff;
            margin: 0 4%;
            height: 100%;
            background-color: #4578a8;
        }

        #player_cont {
            position: relative;
            float: left;
            margin: 10px;
            border: 1px solid #ffffff;
            width: 512px;
            height: 288px;
        }

        #body-Container {
            position: relative;
            float: left;
            width: 100%;
            background-color: #ffffff;
        }
4
        .headDivContainer {
            background-color: #EE5330;
            color: #ffffff;
            position: relative;
            float: left;
            margin-bottom: 20px;
            width: 100%;
        }

        .headDiv {
            float: left;
            margin: 40px 10px 0;
            position: relative;
        }

        .logo {
            background: url("http://ard.de/pool/img/base/icon/ardlogo_weiss.png") no-repeat scroll 0 0 transparent;
            bottom: 10px;
            height: 35px;
            position: absolute;
            right: 10px;
            text-decoration: none;
            width: 70px;
        }

        .box, .container {
            background-color: #112759;
            position: relative;
            float: left;
            width: 100%;
            margin-bottom: 10px;
        }

        .container_blank {
            position: relative;
            float: left;
            margin: 10px;
            width: 100%;
        }

        .subheadtxt {
            color: white;
            font-size: 30px;
            margin-top: -6px;
        }

        .subtxt {
            color: whitesmoke;
            font-size: 100%;
            margin-top: 1.5%;
        }

        h1 {
            font-size: 40px;
            margin: auto;
        }

        .txt, .bullet-liste1 {
            color: #ffffff;
            font-size: 12px;
            margin-top: 1%
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

        // Ende useragent-Abfrage  ********************************************************
        //*********************************************************************************

        var eventStreamStartTime = 0;
        var dvrStream = false;
        var dvrStreamOffset = 0;

        window.track_AGF = "c02";

        var AGFconf = {
            "tracker": "AGF",
            "pixeledEvents": ["IA_MOUSE_BACK_TO_LIVE", "STREAM_LOAD", "CLIP_ENDED", "CLIP_ERROR",
                "PLAYER_LOADING", "PLAYER_UNLOAD", "SUPER_SUBTITLE_ACTIVATION", "SUPER_SUBTITLE_DEACTIVATION",
                "SUPER_VOLUME_MUTE", "SUPER_VOLUME_UNMUTE", "SUPER_VOLUME_CHANGE", "SUPER_SCRUBBAR_CHANGE_POSITION_FORWARD", "IA_MOUSE_QUALITY_CHANGE",
                "SUPER_SCRUBBAR_CHANGE_POSITION_REWIND", "SUPER_FULLSCREEN_ACTIVATION", "SUPER_FULLSCREEN_DEACTIVATION", "SUPER_PLAY", "SUPER_PAUSE", "SUPER_REPLAY", "SUPER_INITIAL_PLAY" ],
            "clipUrl": "http://ondemand-ww.wdr.de/medstdp/fsk0/19/190013/punkteteilunginerfurt_1873060.mp4",
            "clipType": "content",
            "debugLevel": 2,
            "startDayTime": eventStreamStartTime,
            "agfMetadata": "<uurl>http://lra.ard.de/ardplayer/abnahme/index_agf.php</uurl><length></length><title>ardplayer-TestTitel-LIVE</title><livestream>yes</livestream><nol_c2>p2,0</nol_c2><nol_c5>p5,ARD-Player Testseiten</nol_c5><nol_c7>p7,crid://daserste.de/reportage _ dokumentation im ersten/0503403875</nol_c7><nol_c10>p10,Das Erste</nol_c10><nol_c12>p12,Content</nol_c12><nol_c18>p18,1</nol_c10>"
        }

        init();


        $("input[name='LiveWahl']").click(function () {
            if ($(this).prop("checked")) {
                $(".eWahl").show();
                $('#dvrWahl').show();
            } else {
                $(".eWahl").hide();
                $('#dvrWahl').hide();
            }
        });

        $('#reload').click(function (e) {
            aPa.leavePage(p);

            p.dispose();

            $('#player00').remove();

            ardplayer.GlobalModel.resetSingleton();
            ardplayer.ErrorController.resetSingleton();
            ardplayer.ViewController.resetSingleton();
            ardplayer.PlayerModel.resetSingleton();
            ardplayer.Cookie.resetSingleton();
            ardplayer.QueryParser.resetSingleton();

            $('#player_cont').append('<div id="player00"></div>');

            init();
        });


        function init() {

            var liveStream = $("input[name='LiveWahl']").prop("checked");
            dvrStream = $('#stWahl').prop("checked");
            var Stream247 = $("input[name='EventWahl']:checked").val();

            if (liveStream) {
                if (Stream247 == "247stream") {
                    eventStreamStartTime = 0;
                } else {
                    if (dvrStream) {
                        eventStreamStartTime = 82800;
                    } else {
                        eventStreamStartTime = 3600;//;//09:00 --- //0;//68400; //19:00
                    }
                }
            }

            var mc = new ardplayer.MediaCollection("video", liveStream, 1);

            mc.setSortierung(0);
            mc.setPreviewImage("base/img/posterframe-m.jpg");
            mc.setDVREnabled(dvrStream);

            if (liveStream) {

                if (dvrStream) {
                    mc.addMedia(0);
                    //mc.addMediaStream(0, 1, "", "http://tagesschau-lh.akamaihd.net/z/tagesschau_1@119231/manifest.f4m", "akamai");
                    mc.addMediaStream(0, 1, "", "http://ndr_fs-lh.akamaihd.net/z/ndrfs_hh@119223/manifest.f4m", "akamai");
                    mc.addMediaStream(0, 2, "rtmp://cp121363.live.edgefcs.net/live/", "hr-fernsehen_768@53002", "akamai");

                    mc.addMedia(1);
                    mc.addMediaStream(1, 1, "", "http://tagesschau-lh.akamaihd.net/i/tagesschau_1@119231/master.m3u8", "");

                } else {
                    mc.addMedia(0);
                    mc.addMediaStream(0, 0, "rtmp://cp121363.live.edgefcs.net/live/", "hr-fernsehen_768@53002", "akamai");
                    mc.addMediaStream(0, 1, "rtmp://cp121363.live.edgefcs.net/live/", "hr-fernsehen_1536@53002", "akamai");
                    mc.addMediaStream(0, 2, "rtmp://mdr-tv-sachsenlivefs.fplive.net/mdr-tv-sachsenlive-live", "stream_livetvmdrsachsen_de_576", "default");
                    mc.addMediaStream(0, 3, "rtmp://mdr-tv-sachsenlivefs.fplive.net/mdr-tv-sachsenlive-live", "stream_livetvmdrsachsen_de_1728", "default");

                    mc.addMedia(1);
                    mc.addMediaStream(1, 1, "", "http://rbb_live-lh.akamaihd.net/i/rbb_berlin@108248/master.m3u8", "");
                }

            } else {

                mc.addMedia(0);
                //mc.addMediaStream(0, "auto", "", "http://http-stream.rbb-online.de/rbb/ard_ref_clip/video/tmp_20100202_ard_ref_clip_MP4H264_l_16_9_960x544.mp4", "default");
                mc.addMediaStream(0, 0, "", "http://http-stream.rbb-online.de/rbb/ard_ref_clip/video/tmp_20100202_ard_ref_clip_MP4H264_s_16_9_256x144.mp4", "default");
                mc.addMediaStream(0, 1, "rtmp://ondemand.rbb-online.de/ondemand/", "mp4:rbb/ard_ref_clip/video/tmp_20100202_ard_ref_clip_MP4H264_m_16_9_512x288.mp4", "akamai");
                mc.addMediaStream(0, 2, "", "http://http-stream.rbb-online.de/rbb/ard_ref_clip/video/tmp_20100202_ard_ref_clip_MP4H264_l_16_9_960x544.mp4", "default");
                mc.addMediaStream(0, 3, "", "http://http-stream.rbb-online.de/rbb/ard_ref_clip/video/tmp_20100202_ard_ref_clip_MP4H264_l_16_9_960x544.mp4", "default");

                mc.addMedia(1);
                mc.addMediaStream(1, 0, "", [
                        "http://http-stream.rbb-online.de/rbb/ard_ref_clip/video/tmp_20100202_ard_ref_clip_MP4H264_s_16_9_256x144.mp4"],
                    "");
                mc.addMediaStream(1, 1, "", [
                        "http://http-stream.rbb-online.de/rbb/ard_ref_clip/video/tmp_20100202_ard_ref_clip_MP4H264_m_16_9_512x288.mp4"],
                    "");
                mc.addMediaStream(1, 2, "", [
                        "http://http-stream.rbb-online.de/rbb/ard_ref_clip/video/tmp_20100202_ard_ref_clip_MP4H264_l_16_9_960x544.mp4"],
                    "");
                mc.addMediaStream(1, 3, "", [
                        "http://httpmedia.radiobremen.de/ard-referenzclips/20090126_ard_ref_clip_dsl.mp4"],
                    "");
            }

            var pc = new ardplayer.PlayerConfiguration();
            pc.setBaseUrl("");

            //schalter: size | ? | scale true false | rep
            pc.setRepresentation("m");
            pc.setAutoPlay(true);
            pc.setShowOptions(true);
            pc.setShowOptions_Plugins(true);
            pc.setShowOptions_Quality(true);

            pc.setAddons(
                "AddonUntertitel_ebu_tt"
            );

            p = new ardplayer.Player("player00", pc, mc);

            $('#UtUrl').append(mc.getSubtitleUrl()).attr("href", mc.getSubtitleUrl());

            aPa = new ardplayer.AgfPixelAdapter(p, AGFconf);
        }


        // Datum/ Version **********************************************************************************

        $('#stand').append(" | <b>Player-Version:</b> " + ardplayer.GlobalModel.VERSION);
        //<h1>ARD-Player - Test EBU-Timed-Text</h1>
    });

})(ardplayer.jq);


</script>


<div id="body-Container">
    <div class="headDivContainer">
        <div class="headDiv">
            <h1>ARD-Player - Test AGF</h1>

            <p id="stand"><b>Stand Seite: </b></p>
        </div>
        <div class="logo"></div>
    </div>
    <div class="container">
        <div id="player_cont">
            <div id="player00"></div>
        </div>
        <div class="container_blank" style="float: none">
            <form>
                <input type="checkbox" name="LiveWahl" value="Live">Live-Stream
            </form>
            <form class="eWahl" style="display: none;">
                <p>Achtung: der Event-Livestream wird optisch mit einem Permanant-Livestream simuliert, um ein
                    kontinuierliches Testen gewährleisten zu können. Er "startet" um <b>01:00Uhr</b>!</p>
                <input type="radio" name="EventWahl" value="247stream" checked>24/7-Stream
                <input type="radio" name="EventWahl" value="eventstream">Event-Stream
            </form>
            <form id="dvrWahl" style="display: none;">
                <p>Achtung: der Timeshift-Event-Livestream wird mit einer Startzeit von <b>19:00Uhr</b> angegeben.</p>
                <input type="checkbox" id="stWahl" name="TsWahl" value="ts">DVR-TimeShift
            </form>
            <form>
                <input id="reload" type="button" name="Reload" style="width: 512px"
                       value="&Auml;nderungen &uuml;bernehmen und Player neu laden"/>
            </form>
        </div>
    </div>

    <div class="container">
        <div class="container_blank">
            <p>Das Programm <b>"httpFox"</b> öffnen und schauen, wo das verschlüsselte <b>GIF</b> auftaucht. Dessen
                Inhalt
                kopieren und hier einfügen:</p>
            <a style="color: #EE5330" href="http://l2.glanceguide.com/djunpack.html"
               target="_blank">http://l2.glanceguide.com/djunpack.html</a>
        </div>
    </div>
</div>


</body>
</html>