<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="utf-8" http-equiv="X-UA-Compatible" content="IE=edge"/>
<title>[ARD-Player - Referenz-Clip-Test]</title>

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
     /*
    .box {
        margin-top: 10px;
    }
    */
    .box:hover > a {
        color: black;
    }

    .box:hover {

        background-color: #c0c0c0;
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

    .itemTxt {
        font-weight: bold;
        color: #fff;
        font-size: 20px;
        margin: 0;
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

    #test_area {
        position: relative;
        float: left;
        width: 100%;
        /*padding-right: 10px;  */
        display: none;
    }

    #menue {
        height: 288px;
    }

    /***********************************************************************************/

    .TestButton {
        display: none;
        position: relative;
        float: left;
        /*background-color: #000;  */
        /*background-image: linear-gradient(#FFFFFF 0%, #D2C6A4 80%); */
        /*background-image: linear-gradient(#6E6E6E 0%, #3E3E3E 63%); */
        /*linear-gradient(#BF9999 0%, #FF0000 63%)   */
        margin: 0 10px 10px 0;
        padding: 5px;
        text-align: center;
        font-weight: bold;
        font-size: 12px;
        cursor: pointer;
        /*border: solid #ffffff 1px; */

        -moz-box-shadow:inset 10px -25px 7px -7px #dbdbdb;
        -webkit-box-shadow:inset 10px -25px 7px -7px #dbdbdb;
        box-shadow:inset 10px -25px 7px -7px #dbdbdb;
        background:-webkit-gradient( linear, left top, left bottom, color-stop(0.05, #ffffff), color-stop(1, #969696) );
        background:-moz-linear-gradient( center top, #ffffff 5%, #969696 100% );
        filter:progid:DXImageTransform.Microsoft.gradient(startColorstr='#ffffff', endColorstr='#969696');
        background-color:#ffffff;


        height: 30px;
        border-radius: 7px;
    }

    .TestButton:hover {
        /*background-image: linear-gradient(#3E3E3E 63%, #6E6E6E 100%);  */
        background:-webkit-gradient( linear, left top, left bottom, color-stop(0.05, #969696), color-stop(1, #ffffff) );
        background:-moz-linear-gradient( center top, #969696 5%, #ffffff 100% );
    }


    /***********************************************************************/
    .Tabelle {
        font-size: 12px;
        text-align: center;
        border-top: 1px solid white;
        border-bottom: 1px solid white;
        /*border-collapse : collapse;  */
        width: 100%;
        color: #000000;
        background-color: #ffffff;

    }

    .td_auswertung {
        border: 1px solid white;
        padding: 5px;
    }

    .td_legende {
        /*border: 1px solid white;  */
        padding: 5px;
        width: 25%;
    }

    #Zeichen {
        border: 1px solid white;
    }

</style>


</head>
<body>

<script>
(function ($) {

    $(window).ready(function () {

        var referenzClipsUrl = null;
        var referenzClipsObj = null;
        var testFallNr = -1;
        var firstInit = false;

        var _term = null;
        var _plg = null;
        var _plg_nr = null;
        var _fake_plg = null;
        var _av = null;
        var _live = null;
        var _serv = null;
        var _strm = null;
        var _cdn = null;
        var _lra = null;

        var getLastMod = null;
        var meinBrowser = null;
        var meinBrowser_Vers = null;
        var meinOs = null;
        var meinOs_Vers = null;
        var _html5OnFlash = false;

        var xml = null;
        var xmlCont = null;
        var autoTests = null;
        var timeout, timeout_error, timeout_load_stream = null;

        //Messzeit zum Abspielen des Clips für Automode (wird für Erklährtext auch als php-var gespeichert)
        var testzeit = <?php echo $tz = 10000;?>;

        var CDN_indicator_obj = {

            "akamai": ["streams.br-online.de", "cdn-vod-fc.br.de", "ardfslive2.daserste.de", "edgefce.net", "edgefcs.net", "ondemand.rbb-online.de", "http-stream.rbb-online.de", "akamaihd.net", "fm-ondemand.swr.de", "vod.daserste.de/ardfs", "cdn-vod-fc.br.de", "hds.ndr.de", "http://adaptiv.wdr.de", "cdn-vod-hds.br.de", "http://www.hr.gl-systemhaus.de", "http://livestreams.br.de", "http://adaptiv.wdr.de"],
            "limelight": ["llnwd.net", "flashmedia.radiobremen.de", "fc-ondemand.einsplus.de", "fc-ondemand.swr.de", "fm-ondemand.einsplus.de"],
            "icecast": ["m3u"],
            "conviva": ["ref:wdr_eur"],
            "default": ["smil"]
        };

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

        //alert(meinBrowser);

        //Ausgabe/Befüllung Daten im Seitenkopf
        $('#stand').append(getLastMod + " |  <b>System:</b> " + meinOs + meinOs_Vers + " | <b>Browser:</b> " + meinBrowser + " " + meinBrowser_Vers);

        // Ende useragent-Abfrage zum überspringen überflüssiger Tests ********************
        //*********************************************************************************

        $("#TestStart1, #TestStart2").show();

        $("#TestStart1, #TestStart2").show();

        $("#TestStart1").click(function () {
            autoTests = true;

            referenzClipsUrl = $('#json_reference').val();
            $('#prevJson').attr('href', referenzClipsUrl);

            $('#test_area').show();
            init_all();
            //fLoadTest(1);

            if (meinBrowser == "ios") {
                $('#testInfoHead').show().html("Halbautomatischer Test - Bitte zum Abspielen auf den Player dr&uuml;cken und warten");
            } else {
                $('#testInfoHead').show().html("Vollautomatischer Test - Bitte warten");
            }
        });

        $("#TestStart2").click(function () {
            autoTests = false;
            $('#test_area').show();
            //fLoadTest(1)
            referenzClipsUrl = $('#json_reference').val();
            $('#prevJson').attr('href', referenzClipsUrl);
            init_all();
        });

        function init_all() {


            $.ajax({
                type: "GET",
                url: referenzClipsUrl,
                dataType: "json",
                encoding: "UTF-8",
                error: function () {
                    alert("Achtung, fehlerhafte Konfiguration der Referenzstream-Liste!")
                },
                success: function (data, status, xhr) {

                    var _tmpTestfallTxt = "#TestfallTxt" + testFallNr;

                    referenzClipsObj = data;
                    getLastMod = xhr.getResponseHeader('Last-Modified');


                    var _tmpTestfallTxt = "#TestfallTxt" + testFallNr;


                    $('#prevJson').append(' - ge&auml;ndert am: ' + getLastMod);

                    $('#beschreibung').prepend('<p class="subtxt" style="margin-left: 10px;">Verlauf Testf&auml;lle f&uuml;r Browser: ' + meinBrowser + '</p>');

                    for (e in referenzClipsObj) {

                        //Abfrage, ob Stream audio oder video ist
                        if (referenzClipsObj[e].AV == "a" || referenzClipsObj[e].AV.toLowerCase() == "audio") {
                            referenzClipsObj[e].AV = "audio";
                        } else {
                            referenzClipsObj[e].AV = "video";
                        }

                        //Abfrage, ob Stream live oder Ondemand ist
                        if (referenzClipsObj[e].Live == "true" || referenzClipsObj[e].Live.toLowerCase() == "live") {
                            referenzClipsObj[e].Live = true;
                        } else {
                            referenzClipsObj[e].Live = false;
                        }

                        // Spezialteil: für Audio-OnDemand IMMER CDN default verwenden
                        if (referenzClipsObj[e].AV == "audio" && referenzClipsObj[e].Live == false) {

                            referenzClipsObj[e].CDN = "default"
                        }

                        // Abfrage, ob Server ein Teilstring aus dem Stream ist
                        // (Vorgang ähnlich der Mediathek)
                        //Bedingung ist aber, dass beim server nicht bereits der Server korrekt eingetragen ist
                        if ((referenzClipsObj[e].Stream.indexOf("rtmp://") > -1) && (!(referenzClipsObj[e].Server.indexOf("rtmp://") > -1))) {

                            var _tmp_arr = referenzClipsObj[e].Stream.split(" ");
                            var _tmp_serverName = "rtmp://" + _tmp_arr[0];
                            var re = new RegExp(_tmp_serverName, "g");
                            var tmp_streamName_arr = _tmp_arr[1].split(re);

                            referenzClipsObj[e].Server = _tmp_serverName;
                            referenzClipsObj[e].Stream = tmp_streamName_arr[1];

                        } else if ((referenzClipsObj[e].CDN == "limelight") && (referenzClipsObj[e].Stream.indexOf("rtmp://") > -1)) {
                            //wenn rtmp-Stream in einer Textwurst im STREAM vorliegt (bislang nur bei limelight aufgetreten)


                        } else if ((referenzClipsObj[e].Server == null)) {
                            //mach eienn Leerstring
                            referenzClipsObj[e].Server = "";
                        }

                        else if ((referenzClipsObj[e].Server.indexOf("rtmp://") > -1)) {
                            //lass alles, wie es ist

                        }
                        else {
                            // wenn esd kein RTMP-Stream ist, lass den Server frei
                            referenzClipsObj[e].Server = "";
                        }
                        /*
                         console.log(referenzClipsObj[e].Server);
                         console.log(referenzClipsObj[e].Stream);
                         console.log("____________________________________________________________")
                         */

                        var _tmpZahl = parseInt(e) < 9 ? "0" + (parseInt(e) + 1).toString() : parseInt(e) + 1;

                        _lra = referenzClipsObj[e].LRA != undefined ? ('<td class="LraGsea">' + referenzClipsObj[e].LRA + '</td>') : "";

                        if (_lra != "") {
                            $('.LraGsea').show();
                        }
                        /*else{
                         _lra = '<td class="LraGsea"></td>';
                         }
                         */

                        $('#AuswertTabl > tbody').append(
                                '<tr class="td_auswertung"><td>' + _tmpZahl + '</td>' +
                                '<td></td>' +
                                '<td></td>' +
                                '<td>' + referenzClipsObj[e].TermID + '</td>' +
                                '<td>' + referenzClipsObj[e].plugin + '</td>' +
                                '<td>' + referenzClipsObj[e].AV + '</td>' +
                                '<td>' + referenzClipsObj[e].Live + '</td>' +
                                _lra +
                                '</tr>');

                    }

                    $("#prev").click(function () {
                        fLoadTest(-1)
                    });
                    $("#nextBad").click(function () {
                        fShowStatus("bad");
                        fCheckEnd(testFallNr);
                        fLoadTest(1);

                    });
                    $("#again").click(function () {
                        fLoadTest(0)
                    });
                    $("#nextOk").click(function () {
                        fShowStatus("ok");
                        fCheckEnd(testFallNr);
                        fLoadTest(1);
                    });


                    $("#stopTests").click(function () {
                        clearTimeout(timeout);
                        p.stop();
                        $(this).hide();
                        $("#RestartTests").show();
                    });
                    $("#RestartTests").click(function () {
                        $(this).hide();
                        $("#stopTests").show();
                        fLoadTest(0);
                    });


                    $("#BtnEnd").click(function () {
                        //console.log("wie weiter????");
                    });
                    fLoadTest(1);
                }
            });


            function fLoadTest(tmpCountNav) {

                if (_html5OnFlash) {
                    tmpCountNav = 0;
                }

                testFallNr = testFallNr + tmpCountNav;

                console.log("Testfall " + testFallNr + " | " + (referenzClipsObj.length-1));

                _term = referenzClipsObj[testFallNr].TermID;
                _plg = referenzClipsObj[testFallNr].plugin;
                _av = referenzClipsObj[testFallNr].AV
                _live = referenzClipsObj[testFallNr].Live;
                _serv = referenzClipsObj[testFallNr].Server;
                _strm = referenzClipsObj[testFallNr].Stream;
                _cdn = referenzClipsObj[testFallNr].CDN;

                $('#AuswertTabl > tbody').find('tr:nth-child(' + (testFallNr + 1) + ')').css({backgroundColor: '#c0c0c0', color: '#0c0c0c'});

                if (_html5OnFlash && tmpCountNav == 0) {
                    _plg = "flash";
                    _fake_plg = "html5"
                    _cdn = "default";
                    //_html5OnFlash = false;
                } else {
                    _fake_plg = _plg;
                }


                /*Abfrage für Radio-Livestreams*/
                /*if(_plg =="flash" && (_cdn== "icecast" || (_av== "a &&" _live=="true"))&& meinBrowser == "ios")
                {
                    _fake_plg = "html5"

                }
                 */

                if (_plg == "flash" && (meinBrowser == "ios" || meinOs == "Android")) {
                    //überspringe flash
                    fShowStatus("jump", "flash");
                    fCheckEnd(testFallNr);
                    if (testFallNr < referenzClipsObj.length - 1) {
                        fLoadTest(1);
                    } else {
                        p.stop();
                    }
                } else if (_plg == "ios" && meinBrowser != "ios") {
                    //überspringe html5
                    fShowStatus("jump", "ios");
                    fCheckEnd(testFallNr);
                    if (testFallNr < referenzClipsObj.length - 1) {
                        fLoadTest(1);
                    } else {
                        p.stop();
                    }
                } else if (_plg == "html5" && (meinBrowser == "opera" || (meinBrowser == "firefox" && (meinOs == "Windows XP" || parseFloat(meinBrowser_Vers) < 22)) || (meinBrowser == "msie" && parseFloat(meinBrowser_Vers) < 9))) {
                    //überspringe html5 und versuche per flash abzuspielen
                    _html5OnFlash = true;
                    fLoadTest(0);
                } else {

                    _html5OnFlash = false;

                    if (_plg == "html5" && (meinBrowser != "ios" || meinBrowser !="andoid")) {
                        _html5OnFlash = true;
                    }

                    if ((_plg == "html5" || _plg=="ios") && _live) {
                        _cdn = "icecast";
                    }


                    if (autoTests) {
                        $(".TestButton, #welcome, #TestStart, #BtnEnd, #commentTxt0, #commentTxt").hide();
                        $("#cont_beschreibung,#anzTestfall,  #stopTests, #nextBad").show();
                    } else {
                        $(".TestButton, #anzTestfall, #cont_beschreibung").show();
                        $("#welcome, #TestStart, #BtnEnd, #RestartTests, #stopTests").hide();
                    }
                    if (firstInit) {
                        fReload(true);
                    } else {
                        firstInit = true;
                    }

                    if (testFallNr == 0) {
                        $("#prev").hide();
                    }

                    if (testFallNr > referenzClipsObj.length - 1) {
                        $("#nextBad, #nextOk").hide();
                        $("#BtnEnd").show();
                    }

                    if (_live) {
                        var pIsLive = "LIVE";
                    } else {
                        pIsLive = "OnDemand";
                    }

                    $("#anzTestfall").html("Testfall " + (testFallNr + 1) +
                        " (TermID " + _term + ", " +
                        _fake_plg + ", " + _av + ", " + pIsLive + ")");


                    //neuladen des Hilfetextes im Texteingabe-feld - bei click wird dieser gelöscht
                    var firstInTxtArea = true;

                    $('textarea#commentTxt').val('Platz für Informationen zum fehlgeschlagen Test');

                    $('textarea#commentTxt').click(
                        function () {
                            if (firstInTxtArea) {
                                $('textarea#commentTxt').val('');
                                firstInTxtArea = false;
                            }

                        });

                    fPlayerInit();
                }
            }

            // ermittelt aus den Indikatoren (Buchstabenkürzeln) den passenden CDn und gibt ggf. Fehlermeldung zurück

            function fCheckAutoCDN() {

                var tmpCount = false;

                if (_plg == "flash" && (_cdn == "auto" || _cdn == "" || _cdn == null)) {

                    if (_av == 'audio' && !_live) {
                        _cdn = "default";
                        tmpCount = true;
                    } else {

                        //_cdn = _cdn == null ? "auto": _cdn;

                        $.each(CDN_indicator_obj, function (key, val) {

                            for (var e in val) {

                                var s = _serv.match(val[e]);
                                var t = _strm.match(val[e]);

                                if (s != null || t != null) {
                                    _cdn = key;
                                    tmpCount = true;
                                }
                            }
                        });
                        if (_av == 'video' && tmpCount == false && (_serv == "" || _strm == "")) {
                            //  Abfrage für SMIL
                            _cdn = "default";
                            tmpCount = true;
                        } else if (_av == 'video' && _cdn == "akamai" && (_serv == "" || _strm == "")) {
                            //  Abfrage für Akamai HDS
                            _cdn = "akamai";
                            tmpCount = true;
                        }

                        if (tmpCount == false) {
                            //console.log("Testfall: " + (testFallNr + 1) + " - keine detection möglich!");
                        }
                    }
                } else {
                    tmpCount = true;
                }
                return tmpCount;
            }

            //initialisierung der params des players

            function fPlayerInit() {

                switch (_plg) {

                    case "flash":
                        _plg_nr = 0;
                        break;
                    case "html5":
                        _plg_nr = 1;
                        break;
                    case "ios":
                        _plg_nr = 1;
                        break;
                }

                // checke CDN nur beim Flash-Plugin
                //***********************

                if (_plg_nr == 0) {
                    fCheckAutoCDN();
                }

                //***********************
                mc = new ardplayer.MediaCollection(_av, _live, 1);
                mc.setAudioImage("base/img/posterframe-m.jpg");

                mc.setSortierung(_plg_nr);
                mc.addMedia(_plg_nr);
                mc.addMediaStream(_plg_nr, 1, _serv, _strm, _cdn);

                pc = new ardplayer.PlayerConfiguration();
                pc.setRepresentation("m");
                pc.setAutoPlay(true);
                pc.setShowOptions(false);
                pc.setForceControlBarVisible(true);

                _term = referenzClipsObj[testFallNr].TermID;
                _plg = referenzClipsObj[testFallNr].plugin;
                _av = referenzClipsObj[testFallNr].AV
                _live = referenzClipsObj[testFallNr].Live;
                _serv = referenzClipsObj[testFallNr].Server;
                _strm = referenzClipsObj[testFallNr].Stream;
                _cdn = referenzClipsObj[testFallNr].CDN;


                pc.setSolaAnalyticsEnabled(true);
                pc.setSolaAnalyticsConfig({
                    "beacon": "http://ma140-r.analytics.edgesuite.net/config/beacon-4646.xml",
                    "csma": "http://79423.analytics.edgesuite.net/csma/plugin/csma.swf",
                    "jslib": "http://79423.analytics.edgesuite.net/html5/akamaihtml5-min.js",
                    "metadata": {
                        "viewerId": "",
                        "playerId": "ardplayer-" + ardplayer.GlobalModel.VERSION,
                        "pageUrl": document.URL,
                        "title": document.title + " | Referenz-Clip-Player " + (testFallNr + 1),
                        "subCategory": "Player-Tests",
                        "show": document.title,
                        "category": "Player-Kanal"
                    }
                });

                p = new ardplayer.Player("programatischer-player00", pc, mc);

                var tmpTxt = ("mc.addMedia(" + _plg_nr + ");	<br/> mc.addMediaStream(" + _plg_nr + ' ,1 ,"' + _serv + '", "' + _strm + '", "' + _cdn + '");');
                $('#prevMc').html(tmpTxt);

                $("#Kontrolle").show();
                //$('#menue').height($('#programatischer-player00').height() + 37);

                if (autoTests) {

                    //html zu flash fehler
                    //testfall 08 referenz clips

                    fShowStatus("active");

                    $(p).off(ardplayer.Player.EVENT_LOAD_STREAM);
                    $(p).on(ardplayer.Player.EVENT_LOAD_STREAM, function (event) {

                        /*setzt ein timeout für das laden des streams - dies geschieht,
                         bevor der error-controller aktiviert ist - todo?!*/

                        clearTimeout(timeout_load_stream);

                        timeout_load_stream = setTimeout(function () {
                            fShowStatus("bad");

                            clearTimeout(timeout);
                            clearTimeout(timeout_error);
                            clearTimeout(timeout_load_stream);

                            if (testFallNr < referenzClipsObj.length - 1) {

                                //fReload(true);
                                fLoadTest(1);
                            } else {
                                fCheckEnd(testFallNr);
                            }

                        }, 30000);


                    });

                    $(p).off(ardplayer.Player.EVENT_PLAY_STREAM);
                    $(p).on(ardplayer.Player.EVENT_PLAY_STREAM, function (event) {

                        clearTimeout(timeout);
                        clearTimeout(timeout_load_stream);

                        timeout = setTimeout(function () {

                            fShowStatus("ok");

                            clearTimeout(timeout);
                            clearTimeout(timeout_error);
                            clearTimeout(timeout_load_stream);

                            if (testFallNr < referenzClipsObj.length - 1) {
                                fLoadTest(1);
                            } else {
                                //fCheckEnd(testFallNr);
                            }
                        }, testzeit);
                    });

                    $(p).off(ardplayer.Player.EVENT_ERROR);
                    $(p).on(ardplayer.Player.EVENT_ERROR, function (event){
                         console.log(event);
                         console.log("das neue errorevent");

                         clearTimeout(timeout);
                         clearTimeout(timeout_error);
                         clearTimeout(timeout_load_stream);

                         /*
                          setzen eines kurzen timeouts, damit die fehlermeldung korrekt angezeigt und auch wieder
                          korrekt disposed werden kann
                          */
                         timeout_error = setTimeout(function () {

                             clearTimeout(timeout);
                             clearTimeout(timeout_error);
                             clearTimeout(timeout_load_stream);

                             console.log("failed by error");
                             fShowStatus("bad");
                             if (testFallNr < referenzClipsObj.length - 1) {

                                 //fReload(true);
                                 fLoadTest(1);
                             } else {
                                 fCheckEnd(testFallNr);
                             }
                         }, 1000);
                     });

                }
            }

            // reseten --------------------------------------

            function fReload(_newDiv) {

                if (p) $(p).off();
                ardplayer.removeArdPlayer('all');

                if (_newDiv) {
                    $('#player_cont').append('<div id="programatischer-player00"></div>');
                }

            }

            //Eintragen der Stati in die Liste auf dem Monitor je nach Testverlauf

            function fShowStatus(pStatus, pFailedPlug) {

                var _tmpZahl = parseInt(testFallNr) < 9 ? "0" + (parseInt(testFallNr) + 1).toString() : parseInt(testFallNr) + 1;
                var _tmpTestfallTxt = "#TestfallTxt" + testFallNr;
                var _tmpStatCol = "";
                var _tmpStatTxt = "";
                var _tmpTableRow = "tr:nth-child(" + (testFallNr + 1) + ")";
                var _tmpTableData = "td:nth-child(" + (_plg_nr + 2) + ")";


                if (pStatus == "ok") {
                    _tmpStatCol = "#00b32a";
                    _tmpStatTxt = "OK";

                } else if (pStatus == "active") {
                    _tmpStatCol = "#4578a8";
                    _tmpStatTxt = "aktiv";

                } else if (pStatus == "bad") {
                    _tmpStatCol = "red";
                    _tmpStatTxt = "Fehler";

                } else {
                    _tmpStatCol = "orange";
                    _tmpStatTxt = "Übersprungen";
                }

                if (pFailedPlug == "flash") {
                    $('#AuswertTabl >tbody').find(_tmpTableRow).find("td:nth-child(3)").text(_tmpStatTxt).css({backgroundColor: _tmpStatCol});

                }

                if (pFailedPlug == "html5") {

                }

                if (pFailedPlug == "ios") {
                    $('#AuswertTabl >tbody').find(_tmpTableRow).find("td:nth-child(2), td:nth-child(3)").text(_tmpStatTxt).css({backgroundColor: _tmpStatCol});

                }

                $('#AuswertTabl >tbody').find(_tmpTableRow).find(_tmpTableData).text(_tmpStatTxt).css({backgroundColor: _tmpStatCol});

            }

            function fCheckEnd(_nr) {
                   console.log("Welche Nummer den?????????????????????????" + _nr);
                //wenn du der letzte Testfall bist
                if (_nr == referenzClipsObj.length-1) {
                     console.log("ende hier!!!!!!!!!!!!!!!!!!!!!!!!!");
                    $('#testInfoHead').html("Auswertung:").css({'text-decoration': 'none', 'color': 'white'});
                    $("#test_area, #Info").hide();
                    fReload(false);
                }

            }
        }

        // Datum/ Version **********************************************************************************

        $('#stand').append(" | <b>Player-Version:</b> " + ardplayer.GlobalModel.VERSION);
    });
})(ardplayer.jq);

</script>
<div id="body-Container">
    <div class="headDivContainer">
        <div class="headDiv">
            <h1 class="headtxt">ARD-Player Referenz-Clip-Test</h1>

            <p class="txt" id="stand" style="font-size: 14px; padding: 10px 10px 0 0;"><b>Stand Seite: </b></p>
        </div>
        <div class="logo"></div>
    </div>

    <div id="welcome">
        <div class="container">
            <div class="container_blank">
                <p class="itemTxt">Prüfstand der Wiedergabekomponenten des ARD-Players</p>

                <p class="txt">
                    Auf dieser Seite wird die Abspielfestigkeit des ARD-Players auf die zugelieferten Medienformate des
                    AV-Standards
                    gepr&uuml;ft.
                    Die Wiedergabekomponenten <b>Flash und HTML5</b> m&uuml;ssen die Streams, je nach
                    System- und Browser-Abh&auml;ngigkeit
                    entlang der vorgegebenen Stream-Liste wiedergeben können. Der ARD-Player wird hierf&uuml;r
                    automatisch
                    gem&auml;&szlig; der Angaben der Stream-Liste konfiguriert. <br/>
                    </br>
                    Der Test kann sowohl <b>vollautomatisch</b>, wie auch <b>manuell</b> durchgef&uuml;hrt werden. <b>Inhaltlich
                        sind beide Tests gleich!</b><br/>
                    Eine Tabelle zeigt anschließend, welcher Stream mit welcher Wiedergabekomponente erfolgreich
                    abgespielt
                    werden konnte.
                    <br/><br/>
                    <b>Achtung:</b> Die Controlbar bleibt zur besseren &Uuml;bersicht <b>IMMER</b> stehen - blendet sich
                    also nicht aus!
                </p>
            </div>
        </div>
        <div class="container">
            <div class="container_blank">
                <p class="itemTxt">Wahl der Referenz-Clip-Liste</p>

                <p class="txt">Bitte wählen Sie zunächst die zu testenden Liste mit Streams aus.
                    <select id="json_reference" name="json_selection">

                        <?php

                        // Verzeichnis mit den Dateien
                        $verzeichnis = 'test/';

                        // Verzeichnis auslesen und Dateien ausgeben
                        foreach (new DirectoryIterator($verzeichnis) as $datei) {
                            if (!$datei->isDir() && !$datei->isDot()) {

                                if (preg_match("/(json?g|JSON)$/i", $datei)) {
                                    echo '<option value="' . $verzeichnis . $datei . '">' . $datei . '</option>';
                                }


                            }
                        }
                        ?>

                    </select>

                </p>
            </div>
        </div>
        <div class="box">
            <div class="container_blank">
                <a class="atxt" style="display: none" id="TestStart1"><p class="itemTxt">Start des vollautomatischen
                        Referenz-Clip-Tests</p>
                    Vollautomatischer Test, der entlang der Liste pr&uuml;ft, ob der Stream/Clip
                    <b><?php echo($tz / 1000); ?> Sekunden</b> lang
                    abgespielt werden kann und die entsprechende Auswertung vornimmt.
                </a>
            </div>
        </div>
        <div class="box">
            <div class="container_blank">
                <a class="atxt" style="display: none" id="TestStart2"><p class="itemTxt">Start des manuellen
                        Referenz-Clip-Tests</p>
                    Klickbarer Test, der Streams/Clips der Liste nach l&auml;dt. Der Benutzer muss per Klick
                    entscheiden, ob der Stream/Clip korrekt wiedergegeben wurde und wird dann zum nächsten Testfall
                    geführt.</a>
            </div>
        </div>
    </div>

    <div class="container" id="test_area">

        <div id="player_cont">
            <div id="programatischer-player00"></div>
        </div>

        <div class="container_blank" id="menue" style="float: none">

            <div class="subtxt" id="Kontrolle" style="display: none; float: left;">
                <p class="subtxt" id="anzTestfall" style="display: none; margin-top: 0;">Testfall </p>

                <div style="position: relative;float: left; width: 512px">
                    <p class="subtxt">Vorschau der MediaCollection: </p>

                    <p class="txt" id="prevMc">So soll die MediaCollection aussehen</p>
                    <a class="atxt" id="prevJson" style="color: #EE5330" href="" target="_new">Liste der Referenz-Clips(JSON)</a>
                </div>


            <div style="position: absolute; bottom: -10px;">
                <a class="TestButton" id="prev" style="color: #0000ff">zurück zum<br/>letzten Testfall</a>
                <a class="TestButton" id="nextBad" style="color: #ff0000">Test nicht OK<br/>N&auml;chster Testfall</a>
                <a class="TestButton" id="again" style="color: #ffff00">Testfall<br/>neuladen</a>
                <a class="TestButton" id="nextOk" style="color: #00ff00">Test OK <br/> N&auml;chster Testfall </a>
                <a class="TestButton" id="BtnEnd" style="color: #fff">Test beenden <br/>und auswerten</a>
                <a class="TestButton" id="stopTests" style="color: #FF1163">Automatischen Test<br/>pausieren</a>
                <a class="TestButton" id="RestartTests" style="color: #fff">Automatischen Test<br/>fortsetzen</a>

            </div>
        </div>

        </div>

    </div>
    <!-- Testfallliste --------------------------------------------------------------------------------------------- -->
    <div class="container" id="cont_beschreibung" style="display: none;">
     <div class="container_blank" id="beschreibung" style="margin: 0;">

            <p class="subheadtxt" id="testInfoHead" style="display: none; color:#ffffff; background-color: #FF1088; padding: 7px;"></p>

            <table class="Tabelle" id="AuswertTabl" rules="none">
                <thead>
                <tr>
                    <td rowspan="2" style="background-color: #999999">Testfall </br> Nr</td>
                    <td colspan="2" style="background-color: #999999">Check-WGK</td>
                    <td colspan="5" style="background-color: #999999">Stream-Infos</td>
                </tr>

                <tr>
                    <td>Flash</td>
                    <td>HTML5</td>
                    <td>Term-ID</td>
                    <td>Plugin</td>
                    <td>A/V</td>
                    <td>Live/OD</td>
                    <td class="LraGsea" style="display: none;">LRA/GSEA</td>
                </tr>
                </thead>
                <tbody>
                </tbody>
            </table>

            <p class="subtxt" style="margin-left: 10px;">Legende:</p>

            <table class="Tabelle" id="Zeichen" rules="none">

                <tr style="">
                    <td class="td_legende" style="">Test noch nicht durchgef&uuml;hrt</td>
                    <td class="td_legende" style="background-color: #00b32a">Test erfolgreich</td>
                    <td class="td_legende" style="background-color: red">Test fehlgeschlagen</td>
                    <td class="td_legende" style="background-color: orange;">Test &uuml;bersprungen/ vom System nicht
                        unterstützt
                    </td>
                </tr>
            </table>
     </div>
    </div>
</div>
</body>
</html>