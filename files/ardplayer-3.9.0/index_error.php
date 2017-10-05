<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="utf-8"/>
    <meta http-equiv="X-UA-Compatible" content="IE=edge"/>
    <meta http-equiv="content-type" content="text/html; charset=UTF-8">

    <title>[ARD-Player - Stream Fehleranalyse]</title>

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

                var streamAlertColor_arr = ['green', 'red', 'black']
                var streamSelection_flash_arr = [];
                var streamSelection_html5_arr = [];
                var firstInit = false

                $('input[name="Reload"]').click(fReload);


                $('.streamSelection_html5').change(changeCol);
                $('.streamSelection_flash').change(changeCol);

                changeCol($('.streamSelection_flash'));
                changeCol($('.streamSelection_html5'));

                function changeCol(evt) {

                    var obj = evt.currentTarget != undefined ? evt.currentTarget : evt;
                    $(obj).parent().css('background-color', streamAlertColor_arr[$(obj).val()]);
                }

                function fReload() {

                    if (firstInit) {
                        p.dispose();
                    }

                    $('#player01').remove();

                    ardplayer.GlobalModel.resetSingleton();
                    ardplayer.ErrorController.resetSingleton();
                    ardplayer.ViewController.resetSingleton();
                    ardplayer.PlayerModel.resetSingleton();
                    ardplayer.Cookie.resetSingleton();
                    ardplayer.QueryParser.resetSingleton();

                    $('#player_cont').append('<div id="player01"></div>');

                    playerConfig();
                }

                function playerConfig() {
                    streamSelection_flash_arr = [];
                    streamSelection_html5_arr = [];

                    $('.streamSelection_flash').each(function () {
                        streamSelection_flash_arr.push($(this).val());
                    });

                    $('.streamSelection_html5').each(function () {
                        streamSelection_html5_arr.push($(this).val());
                    });
                    console.log("Default-Quality: " + $('#sortArr').val() + " +++ flash: " + streamSelection_flash_arr + " +++ html5: " + streamSelection_html5_arr);

                    init();
                }

                playerConfig();

                function init() {

                    //--------Player 1 video Ondemand--------------------------------------------------

					var sortArray = eval($('#sortArr').val() );
                    var mc = new ardplayer.MediaCollection("video", false, sortArray);

                    mc.setSortierung(0, 1);

                    mc.setPreviewImage("base/img/posterframe-m.jpg");

                    mc.addMedia(0);

                    for (var i = 0; i < streamSelection_flash_arr.length; i++) {

                        var count = i == 0 ? '"auto"' : i - 1;

                        if (streamSelection_flash_arr[i] == 0) {
                            mc.addMediaStream(0, count, "", "http://http-stream.rbb-online.de/rbb/ard_ref_clip/video/tmp_20100202_ard_ref_clip_MP4H264_l_16_9_960x544.mp4", "default");
                            console.log('mc.addMediaStream(0,' + count + ', "", "http://http-stream.rbb-online.de/rbb/ard_ref_clip/video/tmp_20100202_ard_ref_clip_MP4H264_l_16_9_960x544.mp4", "default");');

                        } else if (streamSelection_flash_arr[i] == 1) {
                            mc.addMediaStream(0, count, "", "http://httpdefekteURL.mp4", "default");
                            console.log('mc.addMediaStream(0,' + count + ', "", "http://httpdefekteURL.mp4", "default");');

                        } else {
                            console.log("kein Stream für Flash-Qualität " + count + " angelegt");
                        }
                    }
                    console.log("----------------------------------------------------------------------------------------------------------------------------------------");
                    mc.addMedia(1);

                    for (var i = 0; i < streamSelection_html5_arr.length; i++) {

                        var count = i == 0 ? '"auto"' : i - 1;

                        if (streamSelection_html5_arr[i] == 0) {
                            mc.addMediaStream(1, count, "", "http://http-stream.rbb-online.de/rbb/ard_ref_clip/video/tmp_20100202_ard_ref_clip_MP4H264_l_16_9_960x544.mp4", "");
                            console.log('mc.addMediaStream(1,' + count + ', "", "http://http-stream.rbb-online.de/rbb/ard_ref_clip/video/tmp_20100202_ard_ref_clip_MP4H264_l_16_9_960x544.mp4", "default");');


                        } else if (streamSelection_html5_arr[i] == 1) {
                            mc.addMediaStream(1, count, "", "http://httpdefekteURL.mp4", "");
                            console.log('mc.addMediaStream(1,' + count + ', "", "http://httpdefekteURL.mp4", "default");');

                        } else {
                            console.log("kein Stream für HTML5-Qualität " + count + "angelegt");
                        }
                    }

                    var pc = new ardplayer.PlayerConfiguration();
                    pc.setRepresentation("m");
                    pc.setShowOptions(true);

                    p = new ardplayer.Player("player01", pc, mc);

                    firstInit = true;
                }

                // Version **********************************************************************************

                $('#stand').append("| <b>Player-Version: </b>" + ardplayer.GlobalModel.VERSION);
            }

    );
})(ardplayer.jq);
</script>
<div id="body-Container">
    <div class="headDiv">
        <div style="position: relative; float: left; ">
            <h1 class="headtxt">ARD-Player - Stream Fehleranalyse</h1>

            <p class="txt" id="stand" style="font-size: 14px; padding: 10px 10px 0 0;"><b>Stand Seite: </b></p>
        </div>
        <div class="logo"></div>
    </div>

    <div class="container">

        <div id="player_cont" style="width:512px; height: 288px; position: relative; float: left;margin-right: 10px">
            <div class="ardPlayerDiv" id="player01"></div>
        </div>
        <br/>

        <div style="position: relative; float: left; width:370px;">

            <div style="position: relative; float: left;">
                <p class="txt">Default Quality Reihenfolge:
                    <input id="sortArr" name="sortArr" type="text" value='["auto", 0, 1, 2, 3]'>
                </p>
            </div>


            <div style="position: relative; float: left;">
                <form>
                    <p class="txt">Flash:</p>

                    <p class="txt">Qualität: A:
                        <select class="streamSelection_flash" id="flash_auto" name="flash_auto">
                            <option value="0" selected="selected">Stream OK</option>
                            <option value="1">Deadlink</option>
                            <option value="2">nicht belegt</option>
                        </select>
                    </p>
                    <p class="txt">Qualität: 0:
                        <select class="streamSelection_flash" id="flash_0" name="flash_0">
                            <option value="0" selected="selected">Stream OK</option>
                            <option value="1">Deadlink</option>
                            <option value="2">nicht belegt</option>
                        </select>
                    </p>
                    <p class="txt">Qualität: 1:
                        <select class="streamSelection_flash" id="flash_1" name="flash_1">
                            <option value="0" selected="selected">Stream OK</option>
                            <option value="1">Deadlink</option>
                            <option value="2">nicht belegt</option>
                        </select>
                    </p>
                    <p class="txt">Qualität: 2:
                        <select class="streamSelection_flash" id="flash_2" name="flash_2">
                            <option value="0" selected="selected">Stream OK</option>
                            <option value="1">Deadlink</option>
                            <option value="2">nicht belegt</option>
                        </select>
                    </p>
                    <p class="txt">Qualität: 3:
                        <select class="streamSelection_flash" id="flash_3" name="flash_3">
                            <option value="0" selected="selected">Stream OK</option>
                            <option value="1">Deadlink</option>
                            <option value="2">nicht belegt</option>
                        </select>
                    </p>
                </form>
            </div>
            <div style="position: relative; float: left; margin-left: 10px">
                <form>
                    <p class="txt">HTML5:</p>

                    <p class="txt">Qualität: A:
                        <select class="streamSelection_html5" id="html5_auto" name="html5_auto">
                            <option value="0" selected="selected">Stream OK</option>
                            <option value="1">Deadlink</option>
                            <option value="2">nicht belegt</option>
                        </select>
                    </p>
                    <p class="txt">Qualität: 0:
                        <select class="streamSelection_html5" id="html5_0" name="html5_0">
                            <option value="0" selected="selected">Stream OK</option>
                            <option value="1">Deadlink</option>
                            <option value="2">nicht belegt</option>
                        </select>
                    </p>
                    <p class="txt">Qualität: 1:
                        <select class="streamSelection_html5" id="html5_1" name="html5_1">
                            <option value="0" selected="selected">Stream OK</option>
                            <option value="1">Deadlink</option>
                            <option value="2">nicht belegt</option>
                        </select>
                    </p>
                    <p class="txt">Qualität: 2:
                        <select class="streamSelection_html5" id="html5_2" name="html5_2">
                            <option value="0" selected="selected">Stream OK</option>
                            <option value="1">Deadlink</option>
                            <option value="2">nicht belegt</option>
                        </select>
                    </p>
                    <p class="txt">Qualität: 3:
                        <select class="streamSelection_html5" id="html5_3" name="html5_3">
                            <option value="0" selected="selected">Stream OK</option>
                            <option value="1">Deadlink</option>
                            <option value="2">nicht belegt</option>
                        </select>
                    </p>
                </form>
            </div>

            <div style="position: relative; float: left;">
                <input type="button" name="Reload" style="width: 300px"
                       value="&Auml;nderungen &uuml;bernehmen und Player neu laden"/>
            </div>
        </div>
    </div>
</div>
</body>
</html>