<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="utf-8"/>
    <meta http-equiv="X-UA-Compatible" content="IE=edge"/>
    <meta http-equiv="content-type" content="text/html; charset=UTF-8">

    <title>[ARD-Player - Stream-Test]</title>

    <!-- Basisklasse: Immer verwenden-->
    <link rel="stylesheet" href="mandanten/ard/style/main.css" type="text/css"/>

    <!--link rel="stylesheet" href="website-css/fonts.css" media="all"/>
    <link rel="stylesheet" href="website-css/page.css" media="all"/-->


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


    <link rel="stylesheet" href="test/fonts.css"/>
</
>
<!-- Plugin Untertitel -->
<script src="addons/untertitel/js/AddonUntertitel.js"></script>
<script src="addons/untertitel/js/controller/SubtitleController.js"></script>
<link rel="stylesheet" href="addons/untertitel/css/AddonUntertitel.css" media="all"/>

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

    .box, .container {
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

    .box {
        margin-top: 10px;
    }

    .box:hover > a {
        color: #000000;
    }

    .box:hover {
        background-color: #C0C0C0;
    }

    .subheadtxt {
        color: #FFFFFF;
        font-size: 30px;
        margin: auto;
    }

    .subtxt {
        color: #F5F5F5;
        font-size: 100%;
    }

    h1 {
        font-size: 40px;
        margin: auto;
    }

    .itemTxt {
        color: #FFFFFF;
        font-size: 20px;
        font-weight: bold;
        margin: 0;
    }

    .atxt, .txt, .bullet-liste1 {
        color: #FFFFFF;
        font-size: 12px;
        height: 100%;
        margin-top: 1%;
    }

    .atxt {
        cursor: pointer;
    }

    #test_area {
        display: none;
        float: left;
        position: relative;
        width: 100%;
    }

    #spalte_re {
        float: left;
        position: relative;
        width: 40%;
    }

    #menue {
        height: 288px;
    }

    .endtxt {
        color: #FFFF33;
        font-size: 70%;
        font-weight: bold;
    }

    .headPoint {
        cursor: pointer;
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


        $("input[name='AvWahl']").click(fAVcheck);
        $("input[name='LiveWahl']").click(fLiveCheckClick);
        $('input[name="Reload"]').click(fReload);
        $('select[name="PLUGIN"]').change(fPlugin);
        $('#CdnWahl').change(fCDN);

        var CDN_indicator_obj =  <?php echo $cdn = '{
            "akamai": ["streams.br-online.de", "cdn-vod-fc.br.de", "ardfslive2.daserste.de", "edgefce.net", "edgefcs.net", "ondemand.rbb-online.de", "http-stream.rbb-online.de", "akamaihd.net", "fm-ondemand.swr.de", "vod.daserste.de/ardfs", "cdn-vod-fc.br.de", "hds.ndr.de", "http://adaptiv.wdr.de", "cdn-vod-hds.br.de", "http://www.hr.gl-systemhaus.de", "http://livestreams.br.de", "http://adaptiv.wdr.de"],
            "limelight": ["llnwd.net", "flashmedia.radiobremen.de", "fc-ondemand.einsplus.de", "fc-ondemand.swr.de", "fm-ondemand.einsplus.de"],
            "icecast": ["m3u"],
            "conviva": ["ref:wdr_eur"],
            "default": ["smil"]
        }'
        ?>;

        tmpLive = $("input[name='LiveWahl']").prop("checked");
        tmpServer = $("input[name='SERVER']").val();

        fPlugin();

        if (fCheckAutoCDN()) {
            fPlayerInit();
        }


        // ermittelt aus den Indikatoren (Buchstabenkürzeln) den passenden CDn und gibt ggf. Fehlermeldung zurück

        function fCheckAutoCDN() {

            tmpCDN = tmpPlugin == 0 ? $('select[name="CDN"] option:selected').val() : "";
            tmpServer = $("input[name='SERVER']").val();
            tmpStream = $("input[name='STREAM']").val();

            var tmpCount = false;

            if (tmpPlugin == 0 && tmpCDN == "auto") {

                if (fAVcheck() == 'audio' && !fLiveCheck()) {
                    tmpCDN = "default";
                    tmpCount = true;
                }
                else {

                    $.each(CDN_indicator_obj, function (key, val) {

                        for (var e in val) {

                            var s = tmpServer.match(val[e]);
                            var t = tmpStream.match(val[e]);

                            if (s != null || t != null) {
                                tmpCDN = key;
                                tmpCount = true;
                            }
                        }
                    });
                    if (tmpCount == false) {
                        $('#alerttxt').show();
                    }
                }
            } else {
                tmpCount = true;
            }
            return tmpCount;
        }


        //initialisierung der params des players

        function fPlayerInit() {

            //***********************
            mc = new ardplayer.MediaCollection(fAVcheck(), fLiveCheck(), 1);
            mc.setAudioImage("base/img/posterframe-m.jpg");

            mc.setDVREnabled($("input[name='timeshiftSelect']").prop("checked"));
            mc.setSortierung(tmpPlugin);

            mc.addMedia(tmpPlugin);
            mc.addMediaStream(tmpPlugin, 1, $("input[name='SERVER']").val(), $("input[name='STREAM']").val(), tmpCDN);

            tmpH = (fAVcheck() == 'audio') ? 199 : 288;

            pc = new ardplayer.PlayerConfiguration();
            pc.setRepresentation("m");
            pc.setAutoPlay(true);
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
                    "title": document.title + " | Streaming-Player",
                    "subCategory": "Player-Tests",
                    "show": document.title,
                    "category": "Player-Kanal"
                }
            });

            pc.setAddons("AddonUntertitel");

            p = new ardplayer.Player("programatischer-player00", pc, mc);

            var tmpTxt = ("mc.addMedia(" + tmpPlugin + ");	<br/> mc.addMediaStream(" + tmpPlugin + ' ,1 ,"' + $("input[name='SERVER']").val() + '", "' + $("input[name='STREAM']").val() + '", "' + tmpCDN + '");');
            $('.endtxt').html(tmpTxt);

        }

        // checke clipmodi------------------------------------------

        function fAVcheck() {
            tmpAV = $("input[name='AvWahl']:checked").val();
            fPVRCheck();
            return tmpAV;
        }

        function fLiveCheck() {
            tmpLive = $("input[name='LiveWahl']").prop("checked");
            fPVRCheck();
            return tmpLive;
        }


        function fLiveCheckClick() {

            tmpLive = $("input[name='LiveWahl']").prop("checked");
            fPVRCheck();
        }

        function fPVRCheck() {

            if (tmpLive && tmpPlugin == 0) {
                $('#timeshiftWahl').show();
            } else {
                $('#timeshiftWahl').hide();
            }
        }

        function fPlugin() {
            tmpPlugin = $('select[name="PLUGIN"] option:selected').index();

            if (tmpPlugin != 0) {
                $('#CdnWahl, #serverInput').hide();
                $("input[name='SERVER']").val('');

            } else {
                $('#CdnWahl, #serverInput').show();
                $("input[name='SERVER']").val(tmpServer);
            }
        }

        function fCDN() {

            var tmpCDN = $('select[name="CDN"] option:selected').val();
            tmpServer = $("input[name='SERVER']").val();

            if (tmpCDN == 'icecast' || tmpCDN == 'conviva') {
                $('#serverInput').hide();
                $("input[name='SERVER']").val('');
            } else {
                $('#serverInput').show();
                $("input[name='SERVER']").val(tmpServer);
            }
        }

        // Bei Textfeldeingabe per Enter-Taste Player neuladen
        $("#serverInput, #streamInput").keyup(function(event) {
            if (event.which == 13) {
                fReload();
            }
        });
        // neuladen --------------------------------------

        function fReload() {

            if (fCheckAutoCDN()) {

                ardplayer.removeArdPlayer('programatischer-player00');
                /*
                 p.dispose();

                 $('#programatischer-player00').remove();

                 GlobalModel.resetSingleton();
                 ErrorController.resetSingleton();
                 ViewController.resetSingleton();
                 PlayerModel.resetSingleton();
                 Cookie.resetSingleton();
                 QueryParser.resetSingleton();
                 */
                $('#player_cont').append('<div id="programatischer-player00"></div>');

                $('#alerttxt').hide();

                fPlayerInit();
            }
            //$('select[name="Size"] option[value="webM"]').attr('selected',true);
        }

        // Setze den Erklärtext auf min (den Redakteuren soll das lesen nicht vergehen :-))
        $('.headPointItem').animate({
            height: 'toggle'
        }, 0);

        // Blende auf Klick den Text wieder ein - zum Lesen....
        $(".headPoint").click(function () {
                $(this).next('.headPointItem').animate({
                    height: 'toggle'
                }, 100);
            }
        );
        $(".headPointItem").click(function () {
                $(this).animate({
                    height: 'toggle'
                }, 100);
            }
        );


        // Datum/ Version **********************************************************************************

        $('#stand').append(" | <b>Player-Version:</b> " + ardplayer.GlobalModel.VERSION);


    });
})(ardplayer.jq);

</script>
<div id="body_container">
<div class="headDivContainer">
    <div class="headDiv">
        <h1 class="headtxt">ARD-Player - Stream-Test</h1>

        <p id="stand" style="font-size: 14px; padding: 10px 10px 0 0;"><b>Stand Seite: </b></p>
    </div>
    <div class="logo"></div>
</div>
<div class="container">
    <div class="container_blank">
        <div id="player_cont">
            <div id="programatischer-player00"></div>
            <!--div style="clear:both;"></div-->
        </div>
    </div>

    <div class="container_blank" id="menue">

        <!--div style="width:512px"-->
        <form class="txt" name="options">
            <p>1| AV-Wahl
                <input type="radio" name="AvWahl" value="audio">Audio
                <input type="radio" name="AvWahl" value="video" checked>Video
                <br/></p>

            <p>2| Live/OnDemand
                <input type="checkbox" name="LiveWahl" value="Live" checked>Live
                <br/>
            </p>

            <p title="Wahl der Wiedergebekomponente">3| Plugin:
                <select class="inputclass" name="PLUGIN">
                    <option value="0" selected="selected">Flash</option>
                    <option value="1">HTML5</option>
                </select>
            </p>
            <p id="serverInput" title="Wahl des Streaming-Servers, &#10;Dieses Feld nur bei RTMP-Streams ausfüllen!">
                4| Server-URL: <input class="inputclass" name="SERVER" type="text" style="width:395px"
                                      value="">
                <br/>
            </p>

            <p id="streamInput" title="Wahl der Streaming-URL, &#10;Dieses Feld immer ausfüllen!">
                5| Stream-URL: <input class="inputclass" name="STREAM" type="text" style="width:395px"
                                      value="http://ndr_fs-lh.akamaihd.net/z/ndrfs_hh@119223/manifest.f4m">


                <br/>
            </p>


            <p id="CdnWahl" title="Wahl des Content Delivery Networks">
                6| CDN <select class="inputclass" name="CDN">
                    <option value="auto">AUTO-DETECTION</option>
                    <option value="default">default</option>
                    <option value="akamai" selected="selected">akamai</option>
                    <option value="limelight">limelight</option>
                    <option value="icecast">icecast</option>
                    <option value="conviva">conviva</option>
                </select>
            </p>

            <p id="timeshiftWahl">7| PVR-Timeshift
                <input type="checkbox" name="timeshiftSelect" value="ts" checked>
                <br/>
            </p>

            <br/>
            <input type="button" name="Reload" style="width: 512px"
                   value="&Auml;nderungen &uuml;bernehmen und Player neu laden"/>

            <br/>

        </form>
        <p id="alerttxt" style="color:#ff0066; text-align: center; display: none; text-decoration: blink;">
            Achtung:
            der
            CDN konnte nicht
            automatisch ermittelt werden! Bitte CDN manuell ausw&auml;hlen und Player neu laden!</p></div>
    <div class="container_blank" style="width: 100%">
        <p class="subtxt" style="color:#ffff33">Vorschau der MediaCollection: </p>

        <p class="endtxt">So soll die MediaCollection aussehen</p>
    </div>

</div>
<div class="container">
    <div class="container_blank">
        <!-- Erkl�rtext rechte Spalte ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- -->
        <p class="subheadtxt">Konfigurationshilfe:</p>

        <p class="txt">
            Nachstehend sind Hilfsnotizen zur Konfiguration eines Streams beschrieben.
            Die Stream-Qualit&auml;t wird in diesem Test-Szenario immer als <b>"M"</b> also 1 mitgegeben. Das hat
            jedoch
            <b>KEINE</b>
            Auswirkung auf den zu testenden Stream!
            Die Checkliste mit den 6 Punkten dient zur Orientierung.
            <br/><br/>
            <b>Achtung:</b> Die Controlbar bleibt zur besseren &Uuml;bersicht <b>IMMER</b> stehen - blendet sich also
            nicht
            aus!
            <br/>
        </p>

        <p class="subtxt headPoint">1| AV-Wahl <span class="txt">(klick mich)</span></p>

        <p class="txt headPointItem">
            Auswahl Audio/Video<br/>
            <b>Achtung:</b> Die Auswahl beinflusst nach dem Neuladen die H&ouml;he des Players!
        </p>

        <p class="subtxt headPoint">2| Live-Wahl <span class="txt">(klick mich)</span></p>

        <p class="txt headPointItem">
            Auswahl Live / OnDemand<br/>
            <b>Achtung:</b> Die Auswahl beinflusst nach dem Neuladen die Bedienelemente des Players!
        </p>

        <p class="subtxt headPoint">3| Plugin <span class="txt">(klick mich)</span></p>

        <p class="txt headPointItem">
            Die Wahl des Plugins (Wiedergabekomponente) ist ausschlaggebend f&uuml;r die Wiedergabe!</br>
            Sollte der Browser oder das Betriebssystem das Plugin nicht unterst&uuml;tzen, wird eine Fehlermeldung
            im
            Viewport angezeigt!
        </p>

        <p class="subtxt headPoint">4| Server-URL <span class="txt">(klick mich)</span></p>

        <p class="txt headPointItem">
            Die Angabe des Streaming-Servers wird nur bei <b>Flash-RTMP-Streams</b> ben&ouml;tigt.<br/>
            F&uuml;r HTML5 oder WindowsMedia-Streams ist das Feld irrelevant und wird somit auf dieser Seite
            ausgeblendet.
        </p>

        <p class="subtxt headPoint">5| Stream-URL <span class="txt">(klick mich)</span></p>

        <p class="txt headPointItem">
            Hier wird die URL des abzuspielenden Clips/Streams eingetragen.
            Die URL eines RTMP-Streams beginnt bei der Angabe des Formates, also z.B. vor mp4:e6
        </p>

        <p class="subtxt headPoint">6| CDN <span class="txt">(klick mich)</span></p>

        <div class="headPointItem">

            <p class="txt">
                Grunds&auml;tzlich wird die CDN-Angabe <b>NUR</b> bei der <b>Flash</b> Wiedergabekomponente gebraucht!
                Deshalb wird dieser Auswahlpunkt nur angezeigt, wenn <b>Flash aktiviert</b> wurde.<br/>
                Wird ein anderes Plugin gew&auml;hlt, wird dieser Parameter ignoriert und in der Mediacollection
                freigelassen.<br/><br/>
                <b style="color: #aaaaaa;">AUTO-DETECTION: Dieser Auswahlpunkt bietet die M&ouml;glichkeit,
                    mittels Indikatoren aus der URL die CDNs "Akamai", "Limelight", "Icecast" oder "Conviva" automatisch
                    zu
                    ermitteln.
                    Eine 100%ige Garantie auf Richtigkeit kann jedoch nicht gegeben werden! Sollte die Erkennung
                    scheitern,
                    bitte "default" versuchen.</b>
                <br/>
            </p>
            <ul>
                <li class="bullet-liste1"><b>Default:</b> Verwendung bei SMIL, TV1, Level3, HTTP, Audio OnDemand</li>
                <li class="bullet-liste1"><b>Akamai:</b> Verwendung bei Akamai-Streams (RTMP, RTSP, HTTP, ... )</li>
                <li class="bullet-liste1"><b>Limelight:</b> Verwendung bei Limelight-Streams(RTMP, RTSP, HTTP, ...)</li>
                <li class="bullet-liste1"><b>Icecast:</b> Verwendung bei mp3-Live-Streams (icecast, shoutcast)</li>
                <li class="bullet-liste1"><b>Conviva:</b> Verwendung bei Conviva-Streaminglisten (Sonderfall - nur Live)
                </li>
            </ul>
            <!--p class="txt"-->
            <p class="txt">
                <b style="color: #aaaaaa;">Update (wichtig!!!): ab Release 3.2.4 muss bei Audio-OnDemand-Streams
                    <u>immer</u>
                    "default" verwendet werden, da sonst keine Gew&auml;hr auf das Auslesen der Metadaten besteht (z.B.
                    keine
                    Duration-Angabe)</b>
                <br/><br/>
                <b>CDN-Indikatoren:</b> <br/>
                Der CDN-Betreiber kann meist anhand von enthaltenen K&uuml;rzeln (Indikatoren) in der URL erkannt
                werden.
                Hierf&uuml;r wurde eine Liste erstellt, um diesen entsprechend für den entsprechenden Stream auszuw&auml;hlen.
                Achtung: eine Gew&auml;hr kann auf diese Liste nicht gegeben werden.
                <br/>

            <ul>
                <li class="bullet-liste1"><b>Akamai: </b>
                    <?php $cdn_obj = json_decode($cdn);
                    $akamai_arr = $cdn_obj->{"akamai"};
                    foreach ($akamai_arr as $val) {
                        echo $val . "; ";
                    };?>
                </li>
                <li class="bullet-liste1"><b>Limelight: </b>
                    <?php $cdn_obj = json_decode($cdn);
                    $akamai_arr = $cdn_obj->{"limelight"};
                    foreach ($akamai_arr as $val) {
                        echo $val . "; ";
                    };?>
                </li>
                <li class="bullet-liste1"><b>Icecast: </b>
                    <?php $cdn_obj = json_decode($cdn);
                    $akamai_arr = $cdn_obj->{"icecast"};
                    foreach ($akamai_arr as $val) {
                        echo $val . "; ";
                    };?>
                </li>
                <li class="bullet-liste1"><b>Conviva: </b>
                    <?php $cdn_obj = json_decode($cdn);
                    $akamai_arr = $cdn_obj->{"conviva"};
                    foreach ($akamai_arr as $val) {
                        echo $val . "; ";
                    };?>
                </li>
            </ul>
            </p>
        </div>


        <p class="subtxt headPoint">7| PVR-Timeshift <span class="txt">(klick mich)</span></p>

        <div class="headPointItem">


            <p class="txt">
                Die Aktivierung dieser Option erm&ouml;glicht das zeitversetzte Anschauen eines Livestreams.
                Dazu wird im Player die Zeitleiste mit einem Anfasser eingeblendet.<br/>
                <b>Achtung:</b> <br/>Die Timeshift-Funktion wird nur dann aktiv, wenn der Streaming-Server den
                entsprechenden Service anbietet.
                Andernfalls wird, trotz Aktivierung des H&auml;kchens, keine <b>Timeshift-Zeitleiste</b> angezeigt!
                <br/>
                Ist der Dienst aktiv, so kann <b>JEDERZEIT</b> zu einem beliebigen Zeitpunkt in der Vergangenheit des
                Streams gesprungen werden.
                Befindet sich der Abspielkopf in der Vergangenheit, so wird in der Steuerleiste zusätzlich ein "Zur&uuml;ck
                zu live"-Button angezeigt.

            </p>
        </div>


    </div>
</div>
</div>


</body>
</html>