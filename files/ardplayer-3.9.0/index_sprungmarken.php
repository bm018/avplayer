<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="utf-8"/>
    <meta http-equiv="X-UA-Compatible" content="IE=edge"/>
    <meta http-equiv="content-type" content="text/html; charset=UTF-8">

    <title>[ARD-Player - Sprungmarken - Einbindung per JavaScript]</title>

    <!-- Basisklasse: Immer einbinden -->
    <link rel="stylesheet" href="mandanten/ard/style/main.css" type="text/css"/>

    <!-- Body-Setup: Helferklasse nur fuer Release-Ausspielung -->

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

    <!-- Plugin Untertitel -->
    <script src="addons/untertitel/js/AddonUntertitel.js"></script>
    <script src="addons/untertitel/js/controller/SubtitleController.js"></script>
    <link rel="stylesheet" href="addons/untertitel/css/AddonUntertitel.css" media="all"/>

    <!-- Plugin EBU-Untertitel -->
    <script src="addons/ebu-tt/js/AddonUntertitel_ebu_tt.js"></script>
    <script src="addons/ebu-tt/js/controller/EbuSubtitleController.js"></script>
    <link rel="stylesheet" href="addons/ebu-tt/css/AddonEbuSubtitle.css" media="all"/>

    <!-- Plugin Debug
    <script src="addons/debug/js/AddonDebug.js"></script>
    <link rel="stylesheet" href="addons/debug/css/AddonDebug.css" media="all"/>
    -->

    <!-- Plugin Sprungmarken -->
    <script src="addons/sprungmarken/js/AddonSprungmarken.js"></script>
    <link rel="stylesheet" href="addons/sprungmarken/css/AddonSprungmarken.css" media="all"/>

    <!-- ARD Player END -->

    <style>

        html, body {
            background-color: #4578A8;
            color: #FFFFFF;
            font-family: Verdana, Arial, sans-serif;
            height: 100%;
            margin: 0 4%;
            position: relative;
        }

        #player_cont {
            border: 1px solid #FFFFFF;
            float: left;
            height: 288px;
            /* margin: 10px; */
            position: relative;
            width: 512px;
        }

        #body_container {
            background-color: #FFFFFF;
            float: left;
            position: relative;
            width: 100%;
        }

        .headDivContainer {
            background-color: #EE5330;
            color: #FFFFFF;
            float: left;
            margin-bottom: 20px;
            position: relative;
            width: 100%;
        }

        .headDiv {
            float: left;
            margin: 40px 10px 0;
            position: relative;
        }

        .logo {
            background: url("http://ard.de/pool/img/base/icon/ardlogo_weiss.png") no-repeat scroll 0 0 rgba(0, 0, 0, 0);
            bottom: 10px;
            height: 35px;
            position: absolute;
            right: 10px;
            text-decoration: none;
            width: 70px;
        }

        .container {
            background-color: #112759;
            float: left;
            position: relative;
            width: 100%;
            margin-bottom: 10px;
        }

        .container_blank {
            float: left;
            margin: 10px;
            position: relative;
            /*width: 100%;   */
        }

        h1 {
            font-size: 40px;
            margin: auto;
        }

        #viewCont {
            height: 400px;
            overflow: auto;
            float: left;
            width: 100%;
        }


    </style>

</head>
<body>

<script>
(function ($) {

    $(window).ready(function () {

        // Start useragent-Abfrage ********************************************************
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

        // Ende useragent-Abfrage *********************************************************
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
            ardplayer.removeArdPlayer("player00");

            $('#player_cont').append('<div id="player00"></div>');


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

            var mc = new ardplayer.MediaCollection("video", false, ["auto", 0, 1, 2, 3]);

            mc.setDVREnabled(true);
            mc.setSortierung(0, 1);
            mc.setPreviewImage(mandantenPfad + "/img/posterframe-m.jpg");

            mc.addMedia(0);
            //(plugin, quality, server, stream, cdn)
            mc.addMediaStream(0, 0, "", "http://http-stream.rbb-online.de/rbb/ard_ref_clip/video/tmp_20100202_ard_ref_clip_MP4H264_s_16_9_256x144.mp4", "default");
            mc.addMediaStream(0, 1, "rtmp://ondemand.rbb-online.de/ondemand/", "mp4:rbb/ard_ref_clip/video/tmp_20100202_ard_ref_clip_MP4H264_m_16_9_512x288.mp4", "akamai");
            mc.addMediaStream(0, 2, "", "http://http-stream.rbb-online.de/rbb/ard_ref_clip/video/tmp_20100202_ard_ref_clip_MP4H264_l_16_9_960x544.mp4", "default");
            mc.addMediaStream(0, 3, "", "http://http-stream.rbb-online.de/rbb/ard_ref_clip/video/tmp_20100202_ard_ref_clip_MP4H264_l_16_9_960x544.mp4", "default");

            mc.addMedia(1);
            mc.addMediaStream(1, 0, "", ["http://hls.daserste.de/i/videoportal/Film/c_80000/87197/ios.smil/master.m3u8","http://http-stream.rbb-online.de/rbb/ard_ref_clip/video/tmp_20100202_ard_ref_clip_MP4H264_s_16_9_256x144.mp4"],"");
            mc.addMediaStream(1, 1, "", ["http://hls.daserste.de/i/videoportal/Film/c_80000/87197/ios.smil/master.m3u8","http://http-stream.rbb-online.de/rbb/ard_ref_clip/video/tmp_20100202_ard_ref_clip_MP4H264_m_16_9_512x288.mp4"],"");
            mc.addMediaStream(1, 2, "", ["http://hls.daserste.de/i/videoportal/Film/c_80000/87197/ios.smil/master.m3u8","http://http-stream.rbb-online.de/rbb/ard_ref_clip/video/tmp_20100202_ard_ref_clip_MP4H264_l_16_9_960x544.mp4"],"");
            mc.addMediaStream(1, 3, "", ["http://hls.daserste.de/i/videoportal/Film/c_80000/87197/ios.smil/master.m3u8","http://httpmedia.radiobremen.de/ard-referenzclips/20090126_ard_ref_clip_dsl.mp4"],"");


            mc.setSubtitleUrl("test/untertiteldateien/ebu/ebu-tt-all.xml", "");

            //mc.setChapterSpriteImage("test/sprungmarken/Wald_Sprite.png");
            mc.setChapterSpriteColumns(4);
            mc.setChapterArray([
                {
                    "_chapterTime": 20,
                    "_chapterTitle": "Das ist Kapitel 1",
                    "_chapterImg": "http://placehold.it/150x100"
                },
                {
                    "_chapterTime": 200,
                    "_chapterTitle": "Das ist nun das 2. Kapitel."
                },
                {
                    "_chapterTime": 400,
                    "_chapterTitle": "Das ist Kapitel 3",
                    "_chapterImg": ""
                },
                {
                    "_chapterTime": 600,
                    "_chapterImg": "test/sprungmarken/Wald_Sprite.png#xybh=75,0,75,127"
                },
                {
                    "_chapterTime": 1000,
                    "_chapterTitle": "Bei Kapitel 5 ist nun Schluss!",
                    "_chapterImg": "http://placehold.it/50x50"
                }
            ]);


            var pc = new ardplayer.PlayerConfiguration();
            pc.setBaseUrl("");
            pc.setAutoPlay(true);
            pc.setShowOptions(true);
            pc.setShowOptions_Plugins(true);
            pc.setShowOptions_Quality(true);
            pc.setForceControlBarVisible(false);
            pc.setInitialPlayhead(0);
            pc.setSolaAnalyticsEnabled(false);
            pc.setSolaAnalyticsConfig("conf/sola/sola.json");
            pc.setShowEqualizer(true);
            pc.setAddons(
                "AddonUntertitel_ebu_tt",
                "AddonSprungmarken"
            );

            var p = new ardplayer.Player("player00", pc, mc);

            var viewChapterNode = document.createDocumentFragment();
            genControlDiv();

            function genControlDiv() {

                var _chaptarr = p.model.mediaCollection.getChapterArray();
                var _captSpriteImg = p.model.mediaCollection.getChapterSpriteImage();


                for (var i = 0; i < _chaptarr.length; i++) {

                    var _txt = _chaptarr[i].hasOwnProperty("_chapterTitle") ? _chaptarr[i]._chapterTitle : "+++ Kein Text in der Marke angegeben!!! +++";

                    $(viewChapterNode).append('<p style="background-color: #EE5330;">' +
                            '<span>Kapitel ' + (i + 1) + ' bei </span>' +
                            '<span>' + realTime(_chaptarr[i]._chapterTime) + ':   </span>' +
                            '<span>"' + _txt + '"</span>' +
                            '</p>'
                    );

                    if (_chaptarr[i]._chapterImg == undefined || _chaptarr[i]._chapterImg.length === 0) {

                        if (_captSpriteImg !== undefined || _captSpriteImg.length == 0) {
                            $(viewChapterNode).append('<p style="color: red; background-color: #ffffff;">Leider kein Bild gefunden</p>');
                        } else {
                            $(viewChapterNode).append('<img style="height: 100px; width: auto;" src="' + _captSpriteImg + '">');
                        }
                    } else {
                        $(viewChapterNode).append('<img style="height: 100px; width: auto;" src="' + _chaptarr[i]._chapterImg + '">');
                    }
                }

                $('#viewCont').append(viewChapterNode);
            }

            function realTime(t) {
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
        }

        $('#stand').append(" | <b>Player-Version:</b> " + ardplayer.GlobalModel.VERSION);
    });
})(ardplayer.jq);

</script>


<div id="body_container">
    <div class="headDivContainer">
        <div class="headDiv">
            <h1 class="headtxt">ARD-Player - Test Sprungmarken - Einbindung per JavaScript</h1>

            <p id="stand" style="font-size: 14px; padding: 10px 10px 0 0;"><b>Stand Seite: </b></p>
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
        <div class="container_blank">
            <div id="player_cont" style="width:512px; height: 288px;">
                <div id="player00"></div>
            </div>
        </div>
    </div>
    <div class="container" style="height: 100%;">

        <div id="viewCont"></div>

    </div>


</div>


</body>
</html>