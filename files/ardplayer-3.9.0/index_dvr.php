<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="utf-8"/>
    <meta http-equiv="X-UA-Compatible" content="IE=edge"/>
    <meta http-equiv="content-type" content="text/html; charset=UTF-8">

    <title>[ARD-Player - Timeshift-Test]</title>

    <!-- Basisklasse: Immer einbinden -->
    <link rel="stylesheet" href="mandanten/ard/style/main.css" type="text/css"/>


    <!-- Body-Setup: Helferklasse nur fuer Release-Ausspielung -->
    <style>
        html, body {
            font-family: Verdana, Arial, sans-serif;
            background-color: #ffffff;
            color: #000000;
            padding-left: 4%;
            padding-top: 2%;
        }
    </style>

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

        #player_cont {
            position: relative;
            float: left;
            margin-right: 20px;
            margin-bottom: 10px;
            border: 1px solid #ffffff;
            width: 512px;
            height: 256px;
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

        .container_blank {
            position: relative;
            float: left;
            margin: 10px auto;
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
            var mc = new ardplayer.MediaCollection("video", true, 1);

            mc.setSortierung(0);

            mc.setPreviewImage("base/img/posterframe-m.jpg");


            mc.setDVREnabled(true);
            // einbindung des DVR-Live-Streams des ZDF,
            // da ARD-weit leider kein 24/7-Live-Stream mit Timeshift-Funktion zur Verfügung steht - Schade!
            mc.addMedia(0);
            mc.addMediaStream(0, 0, "http://zdf_hds_de-f.akamaihd.net/z/de10_v1@87012/manifest.f4m", "", "akamai");
            mc.addMediaStream(0, 1, "http://ndr_fs-lh.akamaihd.net/z/ndrfs_hh@119223/manifest.f4m", "", "akamai");
            mc.addMediaStream(0, 2, "http://zdf_hds_de-f.akamaihd.net/z/de10_v1@87012/manifest.f4m", "", "akamai");
            mc.addMediaStream(0, 3, "http://zdf_hds_de-f.akamaihd.net/z/de10_v1@87012/manifest.f4m", "", "akamai");

            //WDR-24/7-Livestream mit ...Timeshift - leider kein durchgängiges Sendesignal,
            //statt dessen kurze Video-Schlefen
            //mc.addMediaStream(0, 1, "", "http://wdr_event1_geo-lh.akamaihd.net/z/wdrevent1_geogeblockt@112051/manifest.f4m?b", "akamai");


            var pc = new ardplayer.PlayerConfiguration();
            pc.setBaseUrl("");

            pc.setRepresentation("m");

            pc.setAutoPlay(true);
            pc.setShowOptions(false);

            pc.setSolaAnalyticsEnabled(true);
            pc.setSolaAnalyticsConfig("conf/sola/sola.json");

            var p = new ardplayer.Player("player00", pc, mc);

            var dvr_time = Math.round(p.model.getTime());

            $("#dvr_zur").click(function(){
                console.log(Math.round(p.model.getTime()));
                p.seekToAndPlay(Math.round(p.model.getTime())-60);
            });

            $("#dvr_vor").click(function(){
                console.log(Math.round(p.model.getTime()));
                p.seekToAndPlay(Math.round(p.model.getTime())+60);
            });



            // UT-Datei als Link auf Seite hinterlegen **********************************************************************************

            $('#UtUrl').append(mc.getSubtitleUrl()).attr("href", mc.getSubtitleUrl());

            // Datum/ Version **********************************************************************************

            $('#stand').append(" | <b>Player-Version:</b> " + ardplayer.GlobalModel.VERSION);
            //<h1>ARD-Player - Test EBU-Timed-Text</h1>
        });

    })(ardplayer.jq);


</script>


<div id="body-Container">
    <div class="headDiv">
        <div style="position: relative; float: left; ">
            <h1>ARD-Player - DVR-Timeshift</h1>

            <p id="stand" style="font-size: 14px; padding: 10px 10px 0 0;"><b>Stand Seite: </b></p>
        </div>
        <div class="logo"></div>
    </div>
    <!--div style="position: relative; float: left; margin-top: 20px"-->
    <div id="player_cont">
        <div id="player00"></div>
    </div>


    <br/><br/>

    <button id="dvr_zur" style="position: relative; float: left;  text-align: center; color: green; width: 100px; height: 30px; cursor: pointer;">zurück</button>
    <button id="dvr_vor" style="position: relative; float: left; color: red; text-align: center; width: 100px; height: 30px; cursor: pointer;">vor</button>

</div>


</body>
</html>