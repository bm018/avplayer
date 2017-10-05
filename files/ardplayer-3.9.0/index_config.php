<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="utf-8"/>
    <meta http-equiv="X-UA-Compatible" content="IE=edge"/>
    <meta http-equiv="content-type" content="text/html; charset=UTF-8">

    <title>[ARD-Player mit Konfigurator]</title>

    <!-- Basisklasse: Immer verwenden-->
    <link rel="stylesheet" href="mandanten/ard/style/main.css" type="text/css"/>
    <!--link rel="stylesheet" href="mandanten/ardmediathek/style/main.css" type="text/css"/ -->

    <!--link rel="stylesheet" href="mandanten/sport/css/sportschau-player.css" media="all"/-->

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


    <!-- Plugin Untertitel -->
    <script src="addons/untertitel/js/AddonUntertitel.js"></script>
    <script src="addons/untertitel/js/controller/SubtitleController.js"></script>
    <link rel="stylesheet" href="addons/untertitel/css/AddonUntertitel.css" media="all"/>

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

        #player_cont {
            position: relative;

            margin-right: 20px;
            margin-bottom: 10px;

            width: 512px;
            height: 256px;
        }

        .box, .container {
            background-color: #112759;
            border: 5px solid white;
            float: left;
            margin: 10px auto 0;
            padding: 10px;
            width: 100%;
        }

        .container_blank {
            position: relative;
            float: left;
            margin: 10px auto;
            width: 100%;
        }

        #menue {
            position: relative;
            float: left;
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

        // Ende useragent-Abfrage zum überspringen überflüssiger Tests ********************
        //*********************************************************************************

        tmpZ3 = 0;
        var dimenstion_arr = new Array(512,288);
        //rep_array = ["m"];
        fAVClickCheck();



        $("input[name='AvWahl']").click(fAVClickCheck);
        $("input[name='LiveWahl']").click(fLiveCheckClick);
        $('select[name="STU"]').change(fSTU);
        $('select[name="ERR"]').change(fErr);
        $('input[value="XML anzeigen"]').click(fXML);
        $('input[value="Reload"]').click(fReload);
        $('select[name="Size"]').change(fRepresentation);

        $("input[name='settings']:checkbox").click(countChecked);

        //initialisierung der params des players
        function fPlayerInit() {
            /*
             tempvars fuer selection...
             */
            tmpPlugin = $('select[name="PLUGIN"] option:selected').index();
            tmpZ1 = 0;
            tmpZ2 = 0;

            check_audio_arr = [];
            check_live_arr = [];

            //***********************

            $("#player_cont").width(dimenstion_arr[0]).height(dimenstion_arr[1]);


            mc = new ardplayer.MediaCollection(fAVcheck(), fLiveCheck(), $('select[name="Size"] option:selected').index());
            mc.setSortierung(tmpPlugin);

            mc.setPreviewImage("base/img/posterframe-m.jpg");
            mc.setAudioImage("base/img/kleinesAudioBild-webM.jpeg");

            fSelectMC();
            fSTU();

            pc = new ardplayer.PlayerConfiguration();

            pc.setRepresentation($('#Size').val());

            // Zuruecksetzen des ErrorControllers erzwingen
            ardplayer.ErrorController.loadedErrorMessages = false;
            pc.setErrorMessagesConfig($('#ERRPfad').val());

            countChecked();
            pc.setSolaAnalyticsEnabled(true);
            pc.setSolaAnalyticsConfig({
                "beacon": "http://ma140-r.analytics.edgesuite.net/config/beacon-4646.xml",
                "csma": "http://79423.analytics.edgesuite.net/csma/plugin/csma.swf",
                "jslib": "http://79423.analytics.edgesuite.net/html5/akamaihtml5-min.js",
                "metadata": {
                    "viewerId": "",
                    "playerId": "ardplayer-" + ardplayer.GlobalModel.VERSION,
                    "pageUrl": document.URL,
                    "title": document.title + " | Konfig-Player",
                    "subCategory": "Player-Tests",
                    "show": document.title,
                    "category": "Player-Kanal"
                }
            });

            pc.setAddons(
                    "AddonUntertitel"
            );

            p = new ardplayer.Player("programatischer-player00", pc, mc);
        }

        fPlayerInit();

        //**Schalter zur Konfiguration************************************************

        //console.log(PlayerModel.getInstanceByPlayerID("programatischer-player00").player.initialize("programatischer-player00",pc,mc));
        //console.log(PlayerModel.getInstanceByPlayerID("programatischer-player00").player.viewCtrl);
        //console.log(PlayerModel.getInstanceByPlayerID("programatischer-player00").player.errorCtrl.bind("throwError", function(){console.log("bbbbbb")}));
        // checke clipmodi------------------------------------------

        function fAVcheck() {
            return $("input[name='AvWahl']:checked").val();
        }

        function fAVClickCheck() {

            var pAV = $("input[name='AvWahl']:checked").val();
            var hide_audio_arr = ['setShowColorSettings', 'setNoSubtitelAtStart'];
            var hide_video_arr = ['setShowEqualizer' ];

            if (pAV == 'audio') {

                $('#conf-head').html("Optionen der Audio-ardplayer.PlayerConfiguration:");
                $('#STU-div').hide();

                check_audio_arr = fCheckBool(hide_audio_arr);

                for (e in hide_audio_arr) {
                    $("input[value=" + hide_audio_arr[e] + "]").hide();
                    $("input[value=" + hide_audio_arr[e] + "]").next().hide();
                    $("input[value=" + hide_audio_arr[e] + "]").attr('checked', false);
                }
                for (e in hide_video_arr) {
                    $("input[value=" + hide_video_arr[e] + "]").show();
                    $("input[value=" + hide_video_arr[e] + "]").next().show();
                    $("input[value=" + hide_video_arr[e] + "]").attr('checked', hide_video_arr[e]);
                }

                $('.onlyV').hide();
                $('.onlyA').show();

            } else {
                $('#conf-head').html("Optionen der Video-PlayerConfiguration:");

                $('#STU-div').show();

                check_audio_arr = fCheckBool(hide_video_arr);

                for (e in hide_audio_arr) {
                    $("input[value=" + hide_audio_arr[e] + "]").show();
                    $("input[value=" + hide_audio_arr[e] + "]").next().show();
                    $("input[value=" + hide_audio_arr[e] + "]").attr('checked', check_audio_arr[e]);
                }

                for (e in hide_video_arr) {
                    $("input[value=" + hide_video_arr[e] + "]").hide();
                    $("input[value=" + hide_video_arr[e] + "]").next().hide();
                    $("input[value=" + hide_video_arr[e] + "]").attr('checked', false);
                }
                $('.onlyV').show();
                $('.onlyA').hide();
            }

            return pAV;
        }

        function fLiveCheck() {
            return $("input[name='LiveWahl']").prop("checked");
        }

        function fLiveCheckClick() {

            $("input[name='LiveWahl']").prop("checked");
            var hide_live_arr = ['setShowToolbarDownloadButtons', 'setNoSubtitelAtStart'];

            if ($("input[name='LiveWahl']").prop("checked")) {
                $('#STU-div').hide();

                check_live_arr = fCheckBool(hide_live_arr);

                for (e in hide_live_arr) {
                    $("input[value=" + hide_live_arr[e] + "]").hide();
                    $("input[value=" + hide_live_arr[e] + "]").next().hide();
                    $("input[value=" + hide_live_arr[e] + "]").attr('checked', false);
                }

            } else {
                $('#STU-div').show();

                for (e in hide_live_arr) {
                    $("input[value=" + hide_live_arr[e] + "]").show();
                    $("input[value=" + hide_live_arr[e] + "]").next().show();
                    $("input[value=" + hide_live_arr[e] + "]").attr('checked', check_live_arr[e]);
                }
            }
        }

        function fCheckBool(tmp_arr) {

            var ret_arr = [];

            for (e in tmp_arr) {
                ret_arr[e] = $("input[value=" + tmp_arr[e] + "]").prop('checked');
            }
            return  ret_arr
        }

        function fSize() {
            this.size = this.length;
        }

        function fReSize() {
            this.size = $("option:selected", this).length;
        }

        // checke playerconfiguration-------------------------------

        function countChecked() {
            if (tmpZ1 != 0) {
                var n = $("input[name='settings']:checked").length;
                var tmpVar = "pc." + $(this).attr("value");
                var tmpVal = $(this).prop("checked");
            } else {
                $("input[name='settings']").each(function () {
                    tmpVar = "pc." + $(this).attr("value");
                    // aktiviere bei audio standardmaessig des EQ und die Ctrl-bar immer sichtbar
                    if (fAVcheck() == 'audio' && (tmpVar == 'pc.setForceControlBarVisible' || tmpVar == 'pc.setShowEqualizer') && tmpZ3 == 0) {
                        tmpVal = true;
                        $(this).attr('checked', true);
                        tmpZ3 = 1;

                    } else {

                        tmpVal = $(this).prop("checked");
                    }

                    eval(tmpVar + '(' + tmpVal + ')');
                });
            }
            tmpZ1 = 1;
        }

        // checke player-groesse--------------------------------------

        function fRepresentation() {

            dimenstion_arr = [];

            $('select[name="Size"] option:selected').each(function () {
                switch ($(this).text()) {
                    case "webXS":
                        ardplayer.PlayerModel.getInstanceByPlayerID("programatischer-player00").player.viewCtrl.setRepresentationsClasses("xs")
                        dimenstion_arr.push(256, 45);
                        break;
                    case "webS":
                        ardplayer.PlayerModel.getInstanceByPlayerID("programatischer-player00").player.viewCtrl.setRepresentationsClasses("s");
                        dimenstion_arr.push(256, 144);
                        break;
                    case "webM":
                        ardplayer.PlayerModel.getInstanceByPlayerID("programatischer-player00").player.viewCtrl.setRepresentationsClasses("m");
                        dimenstion_arr.push(512, 288);
                        break;
                    case "webL":
                        ardplayer.PlayerModel.getInstanceByPlayerID("programatischer-player00").player.viewCtrl.setRepresentationsClasses("l");
                        dimenstion_arr.push(960, 544);
                        break;
                    case "webXL":
                        ardplayer.PlayerModel.getInstanceByPlayerID("programatischer-player00").player.viewCtrl.setRepresentationsClasses("xl");
                        dimenstion_arr.push(1280, 720);
                        break;
                }
            });
            //$(this).attr('checked', true);

        }



        // checke Untertitel-config---------------------------------
        function fSTU() {
            //var tmpSTU = $('select[name="STU"] option:selected').each(function () {eval($(this).attr('value'));});
            //console.log(eval($(this).attr('value')));
            var tmpSTU = $('select[name="STU"] option:selected').attr('value');
            var STUval = $('select[name="STU"] option:selected').attr('value');

            if (STUval !== "" && STUval !== "eigene") {
                mc.setSubtitleUrl(tmpSTU, 0);
                $("#XmlAnzeigen").attr("href", tmpSTU);
                $("#XmlAnzeigen").text(tmpSTU);
                $("#XmlAnzeigen").show();
                $("#UTPfad").hide();
            } else if (STUval == "eigene") {
                $("#XmlAnzeigen").hide();
                $("#UTPfad").show();
                console.log($("#UTPfad").attr('value'));
                mc.setSubtitleUrl($("#UTPfad").attr('value'), 0);
            } else {
                $("#XmlAnzeigen").hide();
                $("#UTPfad").hide();
            }


        }

        // check custom ErrorMessage-URL---------------------------------
        function fErr(){
            $('#ERRPfad').val($('select[name="ERR"] option:selected').attr('value'));
        }


        // Zeige XML-Datei an---------------------------------------
        function fXML() {
            console.log($('select[name="STU"] option:selected').attr('value'));

        }



        // lade player mit gesetzen werten neu----------------------

        function fReload() {
            // Wenn der Player nicht disposed wird, kommt es zu Fehlern auf der Seite!
            p.dispose();

            $('#programatischer-player00').remove();

            ardplayer.GlobalModel.resetSingleton();
            ardplayer.ErrorController.resetSingleton();
            ardplayer.ViewController.resetSingleton();
            ardplayer.PlayerModel.resetSingleton();
            ardplayer.Cookie.resetSingleton();
            ardplayer.QueryParser.resetSingleton();

            $('#player_cont').append('<div id="programatischer-player00"></div>');

            fPlayerInit();

        }


        // Lade selektierte Mediacollection------------------------
        // unterscheide Live/OD und Audio/Video--------------------
        function fSelectMC() {

            var isGeoBlocked = $("input[name='settingsTmp']").prop("checked");

            if (fAVcheck() == 'video' && !isGeoBlocked) {
                if (fLiveCheck()) {
                    mc.addMedia(0);
                    mc.addMediaStream(0, 0, "rtmp://cp128569.live.edgefcs.net/live/", "ts-live1-webs-flv@63322", "akamai");
                    mc.addMediaStream(0, 1, "rtmp://cp128569.live.edgefcs.net/live/", "ts-live1-webm-flv@63323", "akamai");
                    mc.addMediaStream(0, 2, "rtmp://cp128569.live.edgefcs.net/live/", "ts-live1-webl-flv@63324", "akamai");
                    mc.addMediaStream(0, 3, "rtmp://cp128569.live.edgefcs.net/live/", "ts-live1-webl-flv@63324", "akamai");

                } else {
                    mc.addMedia(0);
                    mc.addMediaStream(0, 0, "", "http://http-stream.rbb-online.de/rbb/ard_ref_clip/video/tmp_20100202_ard_ref_clip_MP4H264_s_16_9_256x144.mp4", "default");
                    mc.addMediaStream(0, 1, "rtmp://ondemand.rbb-online.de/ondemand/", "mp4:rbb/ard_ref_clip/video/tmp_20100202_ard_ref_clip_MP4H264_m_16_9_512x288.mp4", "akamai");
                    mc.addMediaStream(0, 2, "", "http://http-stream.rbb-online.de/rbb/ard_ref_clip/video/tmp_20100202_ard_ref_clip_MP4H264_l_16_9_960x544.mp4", "default");
                    mc.addMediaStream(0, 3, "", "http://http-stream.rbb-online.de/rbb/ard_ref_clip/video/tmp_20100202_ard_ref_clip_MP4H264_l_16_9_960x544.mp4", "default");

                    mc.addMedia(1);
                    mc.addMediaStream(1, 0, "", "http://download.rbb-online.de/ard_ref_clip/video/kontraste_20021212_MP4H264_m_4_3_384x288.mp4", "");
                    mc.addMediaStream(1, 1, "", "http://httpmedia.radiobremen.de/ard-referenzclips/20090126_ard_ref_clip_dsl.mp4", "");
                    mc.addMediaStream(1, 2, "", "http://download.rbb-online.de/ard_ref_clip/video/kontraste_20021212_MP4H264_m_4_3_384x288.mp4", "");
                    mc.addMediaStream(1, 3, "", "http://httpmedia.radiobremen.de/ard-referenzclips/20090126_ard_ref_clip_dsl.mp4", "");
                }
            } else if (fAVcheck() == 'audio' && !isGeoBlocked) {
                if (fLiveCheck()) {
                    mc.addMedia(0);
                    //mc.addMediaStream(0, 1, "","rtsp://3gp-streaming.tagesschau.de/aac_64kbit.sdp","akamai");
                    mc.addMediaStream(0, 0, "", "http://www.wdr.de/wdrlive/media/einslive.m3u", "icecast");
                    mc.addMediaStream(0, 1, "", "http://www.wdr.de/wdrlive/media/einslive.m3u", "icecast");
                    //mc.addMediaStream(1, 1, "", "http://cdn-storage.br.de/mir-live/MUJIuUOVBwQIb71S/iw11MXTPbXPS/_2rc_K1S/_AES/_-rc5yFc/111020_1205_Tagesgespraech_Internet.mp3");
                } else {
                    mc.addMedia(0);
                    mc.addMediaStream(0, 0, "", "http://download.rbb-online.de/ard_ref_clip/audio/referenz_hf.mp3", "default");
                    mc.addMediaStream(0, 1, "", "http://download.rbb-online.de/ard_ref_clip/audio/referenz_hf.mp3", "defaut");

                    mc.addMedia(1);
                    mc.addMediaStream(1, 0, "", "http://download.rbb-online.de/ard_ref_clip/audio/referenz_hf.mp3", "default");
                    mc.addMediaStream(1, 1, "", "http://download.rbb-online.de/ard_ref_clip/audio/referenz_hf.mp3", "default");

                }
            // wenn geogeblocked==true wird ein Wiedergabefehler simuliert
            } else if (isGeoBlocked) {

                mc.setGeoBlocked(true);

                if (fLiveCheck()) {
                    mc.addMedia(0);
                    mc.addMediaStream(0, 0, "", "httpdefekteURL.mp4", "akamai");
                    mc.addMediaStream(0, 1, "", "httpdefekteURL.mp4", "akamai");
                    mc.addMediaStream(0, 2, "", "httpdefekteURL.mp4", "akamai");
                    mc.addMediaStream(0, 3, "", "httpdefekteURL.mp4", "akamai");

                } else {
                    mc.addMedia(0);
                    mc.addMediaStream(0, 0, "", "http://httpdefekteURL.mp4", "default");
                    mc.addMediaStream(0, 1, "", "http://httpdefekteURL.mp4", "akamai");
                    mc.addMediaStream(0, 2, "", "http://httpdefekteURL.mp4", "default");
                    mc.addMediaStream(0, 3, "", "http://httpdefekteURL.mp4", "default");

                    mc.addMedia(1);
                    mc.addMediaStream(1, 0, "", "http://httpdefekteURL.mp4", "");
                    mc.addMediaStream(1, 1, "", "http://httpdefekteURL.mp4", "");
                    mc.addMediaStream(1, 2, "", "http://httpdefekteURL.mp4", "");
                    mc.addMediaStream(1, 3, "", "http://httpdefekteURL.mp4", "");
                }
            }
        }

// Datum/ Version **********************************************************************************

        $('#stand').append(" | Player-Version: " + ardplayer.GlobalModel.VERSION);
    });
})(ardplayer.jq);


</script>

<div id="body-Container">
    <div class="headDiv">
        <div style="position: relative; float: left; ">
            <h1 class="headtxt">ARD-Player mit Konfigurator</h1>

            <p id="stand" style="font-size: 14px; padding: 10px 10px 0 0;"><b>Stand Seite: </b></p>
        </div>
        <div class="logo"></div>
    </div>
    <div class="container_blank">
        <div id="player_cont">
            <div id="programatischer-player00"></div>
        </div>

    </div>
    <div id="menue">
        <!--div style=""></div-->
        <div id="Tabelle" style="display: block; position: relative; padding-top: 0px; float: left; width:512px">
            <!--form class="txt" name="options"-->
            <p class="subtxt"> Basisauswahl:</p>
     <span class="txt">
    <form>
        <input type="radio" name="AvWahl" value="audio">Audio
        <input type="radio" name="AvWahl" value="video" checked>Video
        |
        <input type="checkbox" name="LiveWahl" value="Live">Live

        | Plugin
        <select id="PLUGIN" name="PLUGIN">
            <option value="0" selected="selected">Flash</option>
            <option value="1">HTML5</option>
        </select>
    </form>
    </span>
            <br/>

            <p class="subtxt"> Repr&auml;sentationsgr&ouml;&szlig;en:</p>
            <select id="Size" name="Size">
                <option value="xs" class="onlyA">webXS</option>
                <option value="s">webS</option>
                <option value="m" selected="selected">webM</option>
                <option value="l" class="onlyV">webL</option>
                <option value="xl" class="onlyV">webXL</option>
            </select>

            <br/>
            <span id="STU-div">
             <p class="subtxt" id="STU-Text">Untertitel-URL:</p>
                <select id="STU-Cont" name="STU">
                    <option selected="selected" value=''>-kein UT-</option>
                    <option value="test/untertiteldateien/alt/8426226.xml">URL-1</option>
                    <option value="test/untertiteldateien/alt/8945602.xml">URL-2</option>
                    <option value="test/untertiteldateien/alt/9405442b.xml">URL-3</option>
                    <option value="test/untertiteldateien/alt/9405442c.xml">URL-4</option>
                    <option value="eigene">eigene URL</option>
                </select>
            <a class="txt" id="XmlAnzeigen" href="#" target="_new"></a>
            <input id="UTPfad" name="UTPfad" type="text" style="width:60%; float:right ;display:none" value="">
            <br/>
            </span>
            <br/>
            <span id="customErr-div">
            <p class="subtxt" id="customErr-Text">Errormessage-URL:</p>
            <select id="ERR-Cont" name="ERR">
                <option selected="selected" value="base/conf/ErrorMessages.json">-Default-</option>
                <option value="test/errormessage/customErrorMessages.json">URL-1</option>
                <option value="">eigene URL</option>
            </select>
            <input id="ERRPfad" name="ERRPfad" type="text" style="width:60%; float:right;" value="base/conf/ErrorMessages.json">
            </span> <br><br>
            <input type="button" value="Reload"/>

            <br/>

            <p class="subtxt" id="conf-head">Optionen der Video-PlayerConfiguration:</p>
            <span class="txt">
            <input type="checkbox" id="sap" name="settings" value="setAutoPlay" checked>
            <label for="sap">pc.setAutoPlay (Player startet automatisch)
                <br/>
            </label>
            <input type="checkbox" id="sso" name="settings" value="setShowOptions" checked>
            <label for="sso">pc.setShowOptions (aktiviert ALLE Einstellungen [Zahnrad])
                <br/>
            </label>
            <input type="checkbox" id="sst" name="settings" value="setShowOptions_Plugins" checked>
            <label for="sst">pc.setShowOptions_Plugins (aktiviert Plugin-Einstellungen [Flash/HTML5])
                <br/>
            </label>
            <input type="checkbox" id="std" name="settings" value="setShowOptions_Quality" checked>
            <label for="std">pc.setShowOptions_Quality (aktiviert )Qualit&auml;ttseinstellungen)
                <br/>
            </label>
            <input type="checkbox" id="scs" name="settings" value="setShowColorSettings" checked>
            <label for="scs">pc.setShowColorSettings (aktiviert Button "Farbeinstellungen")
                <br/>
            </label>
            <input type="checkbox" id="sns" name="settings" value="setNoSubtitelAtStart">
            <label for="sns">pc.setNoSubtitelAtStart(deaktiviert die Untertitelanzeige zu Beginn)
                <br/>
            </label>
            <input type="checkbox" id="sgb" name="settingsTmp" value="setGeoBlocked">
            <label for="sgb">mc.setGeoBlocked (Simuliert geogeblockten Inhalt)
                <br/>
            </label>
            <input type="checkbox" id="sfc" name="settings" value="setForceControlBarVisible">
            <label for="sfc">pc.setForceControlBarVisible (Deaktiviert Ausblenden der Controlbar)
                <br/>
            </label>
            <input type="checkbox" id="sse" name="settings" value="setShowEqualizer" checked><label
                    for="sse">pc.setShowEqualizer (Zeigt EQ mit Audiobild - in Gr&ouml;&szlig;e "webS" nur den EQ)
                    <br/>
                </label>
            </span>
            <!--pc.setStartStopTime(10, 30);-->

            <!--/form-->
        </div>
    </div>

</div>

</body>
</html>