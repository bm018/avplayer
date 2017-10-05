<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="utf-8"/>
    <meta http-equiv="X-UA-Compatible" content="IE=edge"/>
    <meta http-equiv="content-type" content="text/html; charset=UTF-8">

    <title>[ARD-Player - Test Pixelung]</title>

    <!-- Basisklasse: Immer verwenden-->
    <link rel="stylesheet" href="mandanten/ard/style/main.css" type="text/css"/>


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

        .container_blank {
            position: relative;
            float: left;
            margin: 10px auto;
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

        .box:hover > a {
            color: black;
        }

        .box:hover {

            background-color: #c0c0c0;
        }

        #player_cont {
            position: relative;
            float: left;
            margin-right: 20px;
            margin-bottom: 10px;
            border: 1px solid #ffffff;
            width: 512px;
            height: 288px;
        }

        .subheadtxt {
            color: white;
            font-size: 30px;
            margin: auto;
        }

        .subtxt {
            color: whitesmoke;
            font-size: 100%;
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

        .itemTxt {
            font-weight: bold;
            color: #fff;
            font-size: 20px;
            margin: 0;
        }

        #menue {
            position: relative;
            float: left;
            display: block;
            height: 288px;
        }

        .atxt, .txt, .bullet-liste1 {
            color: #fff;
            /*text-decoration: none;  */
            height: 100%;
            font-size: 12px;
            margin-top: 1%;
        }

        .atxt {
            cursor: pointer;
        }

        .anzTxt {
            padding: 3px;
            margin-bottom: -14px;
        }

    </style>


    <!-- Plugin Untertitel -->
    <script src="addons/untertitel/js/AddonUntertitel.js"></script>
    <script src="addons/untertitel/js/controller/SubtitleController.js"></script>
    <link rel="stylesheet" href="addons/untertitel/css/AddonUntertitel.css" media="all"/>

    <!-- Plugin EBU-Untertitel -->
    <script src="addons/ebu-tt/js/AddonUntertitel_ebu_tt.js"></script>
    <script src="addons/ebu-tt/js/controller/EbuSubtitleController.js"></script>
    <link rel="stylesheet" href="addons/ebu-tt/css/AddonEbuSubtitle.css" media="all"/>

    <!-- ARD Player END -->
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

            // Ende useragent-Abfrage *********************************************************
            //*********************************************************************************

            //startmenü
            $('.box').each(function (key, val) {
                $(this).click(function (evt) {
                    startTest(evt.currentTarget.id);
                    $('.box').hide();
                    $('.container').show();
                });
            });


            function startTest(ta) {

                var testArt = ta;

                //--------Player --------------------------------------------------

                if (ta == "TestStart1") {
                    var mc = new ardplayer.MediaCollection("video", true, 1);
                } else {
                    mc = new ardplayer.MediaCollection("video", false, 1);
                }

                mc.setSortierung(["auto", 0, 1, 2, 3]);
                mc.setPreviewImage("base/img/posterframe-m.jpg");
                if (ta == "TestStart2") {
                    mc.setSubtitleUrl("test/untertiteldateien/ebu/ebu-tt-all.xml", "");
                } else {
                    mc.setDVREnabled(true);
                }

                /*Live-Stream*/
                mc.addMedia(0);

                if (ta == "TestStart1") {
                    mc.addMediaStream(0, "auto", "", "http://live1_hr-lh.akamaihd.net/z/hr_fernsehen@75910/manifest.f4m", "akamai");
                    mc.addMediaStream(0, 1, "rtmp://artestras.fc.llnwd.net/artestras/", "s_artestras_scst_geoFRDE_de?s=1320220800&h=878865258ebb8eaa437b99c3c7598998", "limelight");
                } else {

                    mc.addMediaStream(0, 0, "", "http://http-stream.rbb-online.de/rbb/ard_ref_clip/video/tmp_20100202_ard_ref_clip_MP4H264_s_16_9_256x144_DEFEKT.mp4", "default");
                    mc.addMediaStream(0, 1, "rtmp://ondemand.rbb-online.de/ondemand/", "mp4:rbb/ard_ref_clip/video/tmp_20100202_ard_ref_clip_MP4H264_m_16_9_512x288.mp4", "akamai");
                    mc.addMediaStream(0, 2, "", "http://http-stream.rbb-online.de/rbb/ard_ref_clip/video/tmp_20100202_ard_ref_clip_MP4H264_l_16_9_960x544.mp4", "default");
                    mc.addMediaStream(0, 3, "", "http://http-stream.rbb-online.de/rbb/ard_ref_clip/video/tmp_20100202_ard_ref_clip_MP4H264_l_16_9_960x544.mp4", "default");

                    mc.addMedia(1);
                    mc.addMediaStream(1, 0, "", ["http://cdn-vod-ios.br.de/i/mir-live/MUJIuUOVBwQIb71S/bKOWBwQCuL9zsK1S/_2rc_H1S/_-ZS/_AxP5-rd/303204a0-721e-4919-b438-f8b1112f3bc0_,0,.mp4_DEFEKT.csmil/master.m3u8",
                            "http://http-stream.rbb-online.de/rbb/ard_ref_clip/video/tmp_20100202_ard_ref_clip_MP4H264_s_16_9_256x144_DEFEKT.mp4"],
                        "");
                    mc.addMediaStream(1, 1, "", ["http://cdn-vod-ios.br.de/i/mir-live/MUJIuUOVBwQIb71S/bKOWBwQCuL9zsK1S/_2rc_H1S/_-ZS/_AxP5-rd/303204a0-721e-4919-b438-f8b1112f3bc0_,0,.mp4.csmil/master.m3u8",
                            "http://http-stream.rbb-online.de/rbb/ard_ref_clip/video/tmp_20100202_ard_ref_clip_MP4H264_m_16_9_512x288.mp4"],
                        "");
                    mc.addMediaStream(1, 2, "", ["http://cdn-vod-ios.br.de/i/mir-live/MUJIuUOVBwQIb71S/bKOWBwQCuL9zsK1S/_2rc_H1S/_-ZS/_AxP5-rd/303204a0-721e-4919-b438-f8b1112f3bc0_,0,.mp4.csmil/master.m3u8",
                            "http://http-stream.rbb-online.de/rbb/ard_ref_clip/video/tmp_20100202_ard_ref_clip_MP4H264_l_16_9_960x544.mp4"],
                        "");
                    mc.addMediaStream(1, 3, "", ["http://cdn-vod-ios.br.de/i/mir-live/MUJIuUOVBwQIb71S/bKOWBwQCuL9zsK1S/_2rc_H1S/_-ZS/_AxP5-rd/303204a0-721e-4919-b438-f8b1112f3bc0_,0,.mp4.csmil/master.m3u8",
                            "http://httpmedia.radiobremen.de/ard-referenzclips/20090126_ard_ref_clip_dsl.mp4"],
                        "");
                }


                var pc = new ardplayer.PlayerConfiguration();
                // pc.setRepresentation(quality,, width, height, inLayer, scale, confection)
                pc.setRepresentation("m");


                pc.setAutoPlay(true);
                pc.setShowOptions(true);
                pc.setSolaAnalyticsEnabled(false);
                pc.setSolaAnalyticsConfig("conf/sola/sola.json");

                //Abfrage nach JSON-triggering
                if (testArt == 'TestStart2' || testArt == 'TestStart3') {
                    pc.setPixelConfig("conf/pixel/player_pixel_config_test.js");

                    if(testArt != 'TestStart3') $('#anzProg').hide();
                    $('#anzJson').show();
                }


                pc.setAddons(
                    "AddonUntertitel_ebu_tt"
                );

                var p = new ardplayer.Player("player01", pc, mc);

                //Abfrage nach programmatischem triggering
                //if (testArt == 'TestStart1' || testArt == 'TestStart3') {
                activateBindingPixelTriggering();

                $('#anzProg').show();
                if(testArt != 'TestStart3') $('#anzJson').hide();
                //}


                function activateBindingPixelTriggering() {
                    //Pixel-EventListener
                    //***********************************************************************************
                    for (var prop in ardplayer.PlayerPixelController) {
                        $(p).bind(ardplayer.PlayerPixelController[prop], function (event) {
                            new PixelTracker(event, 'prog');
                        });
                    }

                }
            }

            // PixelTracker ()
            //***********************************************************************************
            AnzeigeZeit = <?php echo $tz = 6000;?>;

            var PixelTracker = function (evt, trigger) {
                this.initialize(evt, trigger);
            }
            window.PixelTracker = PixelTracker;

            function timeCal(t) {
                // berechnet die verstrichenen Sekunden des Tages (ab 00:00)
                var seconds = t.getSeconds();
                var minutes = t.getMinutes() * 60;
                var hour = t.getHours() * 3600;
                var daytimeInSek = seconds + minutes + hour;

                return daytimeInSek;
            };

            /**
             * Diese Methode rechnet die seit 0:00 Uhr vergangenen Sekunden aus und übergibt sie als String
             */
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
            };

            PixelTracker.prototype.initialize = function (evt, trg) {
                //if(evt.type=="super_scrubbar_change_position_forward" || evt.type=="super_scrubbar_change_position_rewind")console.log(evt.current+" -> "+evt.seekto);
                if(evt.type=="super_back_to_live"){
                    //console.log(evt)
                    eventStreamStartTime = 0;
                    dvrStreamOffset = 0;
                    var realNow = Math.round(timeCal(new Date()));

                    pos1 = realNow - eventStreamStartTime;
                    pos = realNow - (dvrStreamOffset - (Math.round(evt.currentTarget.model.getTime())) - eventStreamStartTime);

                    console.info("AGF: Seek (8): " + pos + " -> " + pos1);
                }

                if(evt.type=="super_quality_change"){
                    //console.log(evt)
                    eventStreamStartTime = 0;
                    var realNow = Math.round(timeCal(new Date()));
                    pos = realNow - eventStreamStartTime;

                    console.info("AGF: Play Video (5): " + pos);
                }

                if(evt.type=="super_pause"){
                    //console.log(evt)
                    eventStreamStartTime = 0;
                    dvrStreamOffset = 0;
                    var realNow = Math.round(timeCal(new Date()));
                    pos = realNow - eventStreamStartTime;
                    if (evt.currentTarget.model.mediaCollection.getDVREnabled() && evt.currentTarget.getCtrl()._dvrEnabled) {
                        pos += (Math.round(evt.currentTarget.model.getTime()) - dvrStreamOffset);
                    }

                    console.info("AGF: Pause (6): " + pos);
                }
                var that = this;
                that.event = evt;
                that.trigger = trg;
                that.id = "pixelEventText_" + new Date().getTime();
                that.eventType = that.event.type;
                that.anzNode = $('<p class="anzTxt" id="' + that.id + '">' + that.eventType + '</p>');
                $('#EventAnzeigeCont').append(that.anzNode);

                var txtContent = $(that.anzNode).text().toLowerCase();

                //Setzen und Abfragen der Farbgebung je nach trigger(programmatisch oder JSON) und Event-Auslöser
                var col = '#c71163';
                var bgCol = that.trigger == 'prog' ? '#4578a8' : '#c0c0c0';


                if (txtContent.indexOf("key") >= 0) {
                    col = '#ffff00';
                }
                if (txtContent.indexOf("mouse") >= 0) {
                    col = '#000000';
                }
                if (txtContent.indexOf("super") >= 0) {
                    col = '#ffffff';
                }

                that.anzNode.css({"color":col, "background-color":bgCol});

                window.setTimeout(function () {
                    that.anzNode.fadeOut('slow', function () {
                            that.anzNode.remove();
                        }
                    );


                }, AnzeigeZeit);
            };

            // Version **********************************************************************************

            $('#stand').append("| <b>Player-Version: </b>" + ardplayer.GlobalModel.VERSION);

        });
    })(ardplayer.jq);
</script>
<div id="body-Container">
    <div class="headDiv">
        <div style="position: relative; float: left; ">
            <h1 class="headtxt">ARD-Player - Test Pixelung</h1>

            <p class="txt" id="stand" style="font-size: 14px; padding: 10px 10px 0 0;"><b>Stand Seite: </b></p>
        </div>
        <div class="logo"></div>
    </div>

    <div class="box" id="TestStart1">
        <a class="atxt"><p class="itemTxt">1. Start des Binding-Pixel-Tests mit Livestream</p>
            Bei diesem Test wird das Triggering der programmatischen Einbindung der Pixel-Events getestet.
            Dies geschieht direkt auf der Webseite.
        </a>
    </div>
    <div class="box" id="TestStart2">
        <a class="atxt"><p class="itemTxt">2. Start des Binding-Pixel-Tests mit OnDemand</p>
            Bei diesem Test wird das Triggering der programmatischen Einbindung der Pixel-Events getestet.
            Dies geschieht direkt auf der Webseite.
        </a>
    </div>
    <!--div class="box" id="TestStart3">
        <a class="atxt"><p class="itemTxt">3. Start des Kombi-Pixel-Tests</p>
            Bei diesem Test werden beide Triggering-Methoden parallel aktiviert und getestet.</a>
    </div -->

    <div class="container" style="min-height: 400px; display: none">
        <div id="player_cont">
            <div id="player01"></div>
        </div>

        <div id="menue">
            <p class="subheadtxt">Legende:</p>

            <div id="anzProg">
                <p class="anzTxt" style="color:#ffff00; background-color: #4578a8;">programmatisch - Tasten-Event</p>

                <p class="anzTxt" style="color:#000000; background-color: #4578a8;">programmatisch - Maus-Event</p>

                <p class="anzTxt" style="color:#ffffff; background-color: #4578a8;">programmatisch - Super-Event</p>

                <p class="anzTxt" style="color:#c71163; background-color: #4578a8;">programmatisch - System-Event</p>
            </div>
            <br/>

            <div id="anzJson">
                <p class="anzTxt" style="color:#ffff00; background-color: #c0c0c0;">JSON - Tasten-Event</p>

                <p class="anzTxt" style="color:#000000; background-color: #c0c0c0;">JSON - Maus-Event</p>

                <p class="anzTxt" style="color:#ffffff; background-color: #c0c0c0;">JSON - Super-Event</p>

                <p class="anzTxt" style="color:#c71163; background-color: #c0c0c0;">JSON - System-Event</p>
            </div>

        </div>
    </div>


</div>


<div class="container" style="min-height: 400px; display: none">
    <div class="container_blank" id="EventAnzeigeCont">
        <p class="subheadtxt">Hier werden die geworfenen Pixel-Events angezeigt...</p>

        <p>und nach <?php echo ($tz / 1000);?> Sekunden automatisch ausgeblendet:</p>

    </div>


</div>


</body>
</html>
