<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="utf-8"/>
<meta http-equiv="X-UA-Compatible" content="IE=edge"/>
<meta http-equiv="content-type" content="text/html; charset=UTF-8">

<title>[ARD-Player - EBU-TT-Test]</title>

<!-- Basisklasse: Immer einbinden -->
<link rel="stylesheet" href="mandanten/ard/style/main.css" type="text/css"/>


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

<!-- Einbindung Schriftarten (Thesis) für die Untertitelung -->
<link rel="stylesheet" href="test/fonts.css"media="all"/>

<!-- Plugin Untertitel -->
<script src="addons/untertitel/js/AddonUntertitel.js"></script>
<script src="addons/untertitel/js/controller/SubtitleController.js"></script>
<link rel="stylesheet" href="addons/untertitel/css/AddonUntertitel.css" media="all"/>

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

.box:hover > a {
    color: #000000;
}

.box:hover {
    background-color: #C0C0C0;
}

#drobs {
    /*background: #ffffff;   */
    top: 450px;
    left: 15px;
    cursor: nw-resize;
    height: 10px;
    width: 10px;
    margin: 0 auto;
    position: absolute;

    display: none;

    border-bottom: 5px solid #EE5330;
    border-right: 5px solid #EE5330;

}

#drobs:hover {
    border-bottom: 5px solid #ffffff;
    border-right: 5px solid #ffffff;
}

#sizeInfo {
    position: absolute;
    display: none;
}

#sizeInfoTxt {
    color: #ffffff;
    background-color: #EE5330;
    font-size: 16px;

}

.subtxt {
    color: whitesmoke;
    font-size: 16px;
    /*margin-top: 1.5%;    */
}

.subtxtTable {
    color: whitesmoke;
    font-size: 18px;
}

.txtTable {
    color: whitesmoke;
    font-size: 12px;

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

#xml_container {
    position: relative;
    float: left;
    display: block;
    width: 100%;
    height: 387px;
    background-color: #bda784;
}

#Tabelle {
    display: block;
    border: 0;
    /*border-collapse: collapse;     */
    cellpadding: 2;
    cellspacing: 3;
    width: 100%;
    background-color: # #EE5330;
    font-weight: lighter;
}

thead {
    left: 0;
    top: 0;
    position: absolute;
    width: 100%;
}

tbody {
    position: absolute;
    overflow: auto;
    height: 360px;
    left: 0;
    top: 25px;
    width: 100%;
    margin-top: 0;
    background-color: #ffffff;
}

td, th {

    padding-left: 10px;
    padding-right: 10px;

}

td:nth-child(1), th:nth-child(1) {
    background-color: #5c5e5c;
    text-align: center;
    width: 30px;

}

td:nth-child(2), th:nth-child(2) {
    background-color: #112759;
    text-align: center;
    width: 100px;
}

td:nth-child(3), th:nth-child(3) {
    background-color: #5c5e5c;
    text-align: center;
    width: 100px;
}

td:nth-child(4), th:nth-child(4) {
    background-color: #112759;
    /* width: 255px; */
    width: 100%;
}

th:nth-child(4) {
    width: 100%;
    text-align: center;
    /*width: 282px;*/
}

thead, th:nth-child(n) {
    /*width:100%; */
    font-weight: normal;
    background-color: #bda784;

}

th:nth-child(2) {
    display: block;
}

td:nth-child(2):hover {
    cursor: pointer;
    background-color: #EE5330;
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


        var ut_alt = [
            <?php

            // Verzeichnis mit den Dateien
            $verzeichnis = 'test/untertiteldateien/alt/';
            // Verzeichnis auslesen und Dateien ausgeben
            foreach (new DirectoryIterator($verzeichnis) as $datei)
            {
                if (!$datei->isDir() && !$datei->isDot()) {
                    echo '"' . $datei . '",';
                }
            }
            ?>
        ];
        var ut_ebu = [
            <?php

            // Verzeichnis mit den Dateien
            $verzeichnis = 'test/untertiteldateien/ebu/';
            // Verzeichnis auslesen und Dateien ausgeben
            foreach (new DirectoryIterator($verzeichnis) as $datei)
            {
                if (!$datei->isDir() && !$datei->isDot()) {
                    echo '"' . $datei . '",';
                }
            }
            ?>
        ];

        var ut_tmp_file = get_UT_file();

        init();

        function init() {

            if (f_UT_Standard_Check() == 'ebu') {

                var UT_pfad = 'test/untertiteldateien/ebu/';
                var insert_UT_addon = 'AddonUntertitel_ebu_tt';
            } else {
                UT_pfad = 'test/untertiteldateien/alt/';
                insert_UT_addon = 'AddonUntertitel';
            }


            mc = new ardplayer.MediaCollection("video", false, 1);
            mc.setSortierung(0, 1);
            mc.setPreviewImage("base/img/posterframe-m.jpg");

            mc.addMedia(0);
            mc.addMediaStream(0, 0, "", "http://http-stream.rbb-online.de/rbb/ard_ref_clip/video/tmp_20100202_ard_ref_clip_MP4H264_s_16_9_256x144.mp4", "default");
            mc.addMediaStream(0, 1, "rtmp://ondemand.rbb-online.de/ondemand/", "mp4:rbb/ard_ref_clip/video/tmp_20100202_ard_ref_clip_MP4H264_m_16_9_512x288.mp4", "akamai");
            mc.addMediaStream(0, 2, "", "http://http-stream.rbb-online.de/rbb/ard_ref_clip/video/tmp_20100202_ard_ref_clip_MP4H264_l_16_9_960x544.mp4", "default");
            mc.addMediaStream(0, 3, "", "http://http-stream.rbb-online.de/rbb/ard_ref_clip/video/tmp_20100202_ard_ref_clip_MP4H264_l_16_9_960x544.mp4", "default");

            mc.addMedia(1);
            mc.addMediaStream(1, 0, "",
                [
                    "http://c22033-o.z.core.cdn.streamfarm.net:1935/002mdriphoneod/iphone/4100mp4vmo/smil:VOID80febb11-ba8f-4278-9822-6aedde546cdb.smil/playlist.m3u8",
                    "http://http-stream.rbb-online.de/rbb/ard_ref_clip/video/tmp_20100202_ard_ref_clip_MP4H264_m_16_9_512x288.mp4"
                ],
                "default");
            mc.addMediaStream(1, 1, "",
                [
                    "http://c22033-o.z.core.cdn.streamfarm.net:1935/002mdriphoneod/iphone/4100mp4vmo/smil:VOID80febb11-ba8f-4278-9822-6aedde546cdb.smil/playlist.m3u8",
                    "http://http-stream.rbb-online.de/rbb/ard_ref_clip/video/tmp_20100202_ard_ref_clip_MP4H264_m_16_9_512x288.mp4"
                ],
                "default");
            mc.addMediaStream(1, 2, "",
                [
                    "http://c22033-o.z.core.cdn.streamfarm.net:1935/002mdriphoneod/iphone/4100mp4vmo/smil:VOID80febb11-ba8f-4278-9822-6aedde546cdb.smil/playlist.m3u8",
                    "http://http-stream.rbb-online.de/rbb/ard_ref_clip/video/tmp_20100202_ard_ref_clip_MP4H264_m_16_9_512x288.mp4"
                ],
                "default");
            mc.addMediaStream(1, 3, "",
                [
                    "http://c22033-o.z.core.cdn.streamfarm.net:1935/002mdriphoneod/iphone/4100mp4vmo/smil:VOID80febb11-ba8f-4278-9822-6aedde546cdb.smil/playlist.m3u8",
                    "http://http-stream.rbb-online.de/rbb/ard_ref_clip/video/tmp_20100202_ard_ref_clip_MP4H264_m_16_9_512x288.mp4"
                ],
                "default");

            mc.setSubtitleUrl(UT_pfad + get_UT_file(), "0");

            var pc = new ardplayer.PlayerConfiguration();
            pc.setBaseUrl("");
            pc.setRepresentation("m");
            pc.setAutoPlay(true);
            pc.setShowOptions(false);
            pc.setNoSubtitelAtStart(false);
            pc.setAddons(insert_UT_addon);

            var p = new ardplayer.Player("player00", pc, mc);


            //console.log(p.model.playerConfig.getAddons());
            //console.log(p.model.playerConfig);
            //console.log(p.plugins);

            $(p.plugins).each(function () {
                var txtwurst = this.ADDON_NAME + " V." + this.VERSION;
                $('#addon_type').html(txtwurst);
            });

            //AddonUntertitel_ebu_tt


            // UT-Datei als Link auf Seite hinterlegen **********************************************************************************

            $('#UtUrl').append(mc.getSubtitleUrl()).attr("href", mc.getSubtitleUrl()).text(ut_tmp_file);

            /*****************************************************************************************************/
            /*Logik für die Anzeige der HTML-Liste*/
            /*****************************************************************************************************/


            var subtitleURL = mc.getSubtitleUrl(); //ardplayer.PlayerModel.getInstanceByPlayerID("player00").player.model.mediaCollection.getSubtitleUrl();
            trackDataObj = new Object();

            //Tabelle leeren, damit sie immer wieder neu befüllt werden kann
            $('#fillMeTable').empty();

            $.ajax({
                    type: "GET",
                    url: subtitleURL,
                    dataType: "xml",
                    encoding: "UTF-8",
                    error: function () {
                        console.log("fehler")
                    },

                    success: function (xml) {

                        function getElementsWithNS(node, ns, tagName) {

                            if (node.getElementsByTagNameNS) {
                                return node.getElementsByTagNameNS(ns, tagName);
                            }
                            // Ticket #3699 Der liebe IE versteht keine NS - deshalb hier der Fake  mit tt
                            return node.getElementsByTagName('tt' + ':' + tagName);
                        }


                        function sp_getXmlAttr(elem, attrName) {
                            var ret = null;
                            $.each(elem.attributes, function (idx1, attr) {
                                var name = attr.name;
                                var idx = name.indexOf(":");
                                if (idx >= 0) {
                                    name = name.substr(idx + 1);
                                }
                                if (name == attrName) {
                                    ret = attr.value;
                                    // sp_d("... found:"+ret);
                                    return false; // break;
                                }
                                // sp_d("... attr:"+name);
                            });
                            return ret;
                        }

                        function sp_getNodeRawName(elem) {
                            var name = elem.nodeName;
                            var idx = name.indexOf(":");
                            if (idx >= 0) {
                                name = name.substr(idx + 1);
                            }
                            return name;
                        }

                        try {

                            var XmlNs = xml.documentElement.namespaceURI;

                            if (insert_UT_addon == 'AddonUntertitel_ebu_tt') {

                                var XmlParagraphs = getElementsWithNS(xml, XmlNs, "p");

                                for (var i = 0; i < XmlParagraphs.length; i++) {

                                    data = XmlParagraphs[i];
                                    var text = '<p>';
                                    var idIdx = i + 1;
                                    // begin="10:01:22.600" end="10:01:26.040"
                                    var id = sp_getXmlAttr(data, "id");

                                    var startTime = sp_getXmlAttr(data, "begin");
                                    var endTime = sp_getXmlAttr(data, "end");


                                    $.each(data.childNodes, function (idx2, data2) {

                                        var name = sp_getNodeRawName(data2);

                                        if (name == "#text") {
                                            return true; // continue
                                        }
                                        // sp_d("data2.nodeName: "+name);
                                        // <tt:span style="textRed">rot auf schwarz</tt:span>
                                        if (name == "span") {

                                            var spanText = $(data2).text();


                                            text += '<span>' + spanText + '</span>';

                                            return true; // continue
                                        }
                                        if (name == "br") {
                                            text += '<br/>';
                                            return true; // continue
                                        }
                                    });

                                    text += "</p>";

                                    //hier kommt er rein in den xml_container
                                    $('#fillMeTable').append('<tr><td>' + idIdx + '</td><td title="Spring zu Untertitel ' + idIdx + '">' + startTime + '</td><td>' + endTime + '</td><td>' + text + '</td></tr>');
                                    //Listener auf die Startzeitfelder zum seeken an den entsprechenden Zeitpunkt
                                    $('#fillMeTable > tr:nth-child(' + idIdx + ') > td:nth-child(2)').on('click', {'_startTime': startTime}, fSeekTo);
                                }

                            } else {

                                // tabelle befüllen mit daten aus alten addon
                                var caps = $('p, div, span', xml).filter('[begin][end]')

                                $.each(caps, function (id, ele) {
                                    $('#fillMeTable').append('<tr><td>' + id + '</td><td>' + ele.getAttribute('begin') + '</td><td>' + ele.getAttribute('end') + '</td><td style="padding: 5px;">' + $(ele).text() + '</td></tr>');

                                    $('#fillMeTable > tr:nth-child(' + (id + 1) + ') > td:nth-child(2)').on('click', {'_startTime': ele.getAttribute('begin')}, fSeekTo);
                                });
                            }

                        } catch (ex) {
                            //console.log(ex);

                        }
                    }
                }
            );

        }

        //Auswahl der UT-Datei*****************************************************************************************************

        $('input[name="UT_Standard"]').change(get_files);
        $('select[name="ut_selection"]').change(get_UT_file);
        $('input[name="Reload"]').click(fReload);


        function f_UT_Standard_Check() {

            return selected_ut_plugin = $('input[name="UT_Standard"]:checked').val();
        }

        function get_UT_file() {

            ut_tmp_file = $('select[name="ut_selection"] option:selected').text();

            return ut_tmp_file;
        }

        function fReload() {

            $('#player00').remove();

            ardplayer.GlobalModel.resetSingleton();
            ardplayer.ErrorController.resetSingleton();
            ardplayer.ViewController.resetSingleton();
            ardplayer.PlayerModel.resetSingleton();
            ardplayer.Cookie.resetSingleton();
            ardplayer.QueryParser.resetSingleton();

            $('#player_cont').append('<div id="player00"></div>');

            init();
        }

        // Spring zum geklickten Zeitpunkt aus der UT-Liste

        function fSeekTo(event) {

            var time = event.data._startTime.split(':');
            if (time.length === 3) {
                if (f_UT_Standard_Check() == "alt") {
                    time[0] = '00';
                }

                time = (parseInt(time[0], 10) * 60 * 60) +
                    (parseInt(time[1], 10) * 60) +
                    (parseInt(time[2], 10));
            }

            ardplayer.PlayerModel.getInstanceByPlayerID("player00").player.seekTo(time);
        }

        function get_files() {

            $('select[name="ut_selection"] option').remove();

            var ut_val = f_UT_Standard_Check() == 'alt' ? ut_alt : ut_ebu;
            var ref = "test/untertiteldateien/" + f_UT_Standard_Check();

            for (var i in ut_val) {

                $('#STU_Cont').append('<option value="' + ref + ut_val[i] + '">' + ut_val[i] + '</option>');
            }
        }

        /*******************************************/
        /* drag n drop */
        /*******************************************/

        //position zum andocken des ziehers an den Player
        //var tmpXpos = Math.round(($('#player_cont').position().left) + ($('#player_cont').width() / 2) - ($('#drobs').width() / 2));
        var tmpXpos = Math.round(($('#player_cont').position().left) + ($('#player_cont').width()));
        var tmpYpos = Math.round(($('#player_cont').position().top) + ($('#player_cont').height()) + ($('.ardplayer-controlbar03').height()));


        $('#drobs').css({left: tmpXpos, top: tmpYpos}).show();

        $('#drobs').mousedown(function () {
            dragstart(this)
        });


        //Das Objekt, das gerade bewegt wird.
        var dragobjekt = null;

        // Position, an der das Objekt angeklickt wurde.
        var dragx = 0;
        var dragy = 0;

        // Mausposition
        var posx = 0;
        var posy = 0;


        // Initialisierung der Überwachung der Events
        document.onmousemove = drag;
        document.onmouseup = dragstop;

        function dragstart(element) {
            //Wird aufgerufen, wenn ein Objekt bewegt werden soll.
            dragobjekt = element;
            dragy = posy - dragobjekt.offsetTop;
        }

        function dragstop() {
            //Wird aufgerufen, wenn ein Objekt nicht mehr bewegt werden soll.
            dragobjekt = null;

            //position zum sauberen andocken des ziehers an den Player nach dem loslassen
            tmpXpos = Math.round(($('#player_cont').position().left) + ($('#player_cont').width()));
            tmpYpos = Math.round(($('#player_cont').position().top) + ($('#player_cont').height()) + ($('.ardplayer-controlbar03').height()));

            $('#drobs').css({left: tmpXpos, top: tmpYpos});
            $('#sizeInfo').hide();
        }

        function drag(event) {
            //Wird aufgerufen, wenn die Maus bewegt wird und bewegt bei Bedarf das Objekt.

            //posx = document.all ? window.event.clientX : event.pageX;
            posy = document.all ? window.event.clientY : event.pageY;
            if (dragobjekt != null) {

                //ermittle höhe des player-containers
                var tmp_h = Math.round((posy - dragy) - (($("#player_cont").position().top) + ($('.ardplayer-controlbar03').height())));

                if (tmp_h > 50 && tmp_h < 730) {
                    //ermittle breite auf basis des festen seitenverhältnises
                    var tmp_w = Math.round(tmp_h / 0.5625);

                    //dragobjekt.style.left = (posx - dragx) + "px";
                    dragobjekt.style.top = (posy - dragy) + "px";

                    tmpYpos = Math.round(($('#player_cont').position().top) + ($('#player_cont').height()) + ($('.ardplayer-controlbar03').height()));

                    //X-Position zur Bestimmung der Ecke beim Ziehen
                    tmpXpos = Math.round(($('#player_cont').position().left) + ($('#player_cont').width()));

                    $('#drobs').css({left: tmpXpos, top: tmpYpos});


                    var sIw = event.pageX - 50;
                    var sIh = $('#drobs').height() + $('#sizeInfoTxt').height();

                    $('#sizeInfo').show();
                    $('#sizeInfo').css({left: sIw, top: event.pageY});

                    if (tmp_w < 512) {
                        //$("#player_cont").innerHTML("text klaus");
                        $('#sizeInfoTxt').html("Repräsentationsgröße S (" + $('#player_cont').height() + " x " + $('#player_cont').width() + ")").css({background: '#FF4060'});
                        ardplayer.PlayerModel.getInstanceByPlayerID("player00").player.viewCtrl.setRepresentationsClasses("s");

                    } else if (tmp_w >= 512 && tmp_w < 960) {
                        $('#sizeInfoTxt').html("Repräsentationsgröße M (" + $('#player_cont').height() + " x " + $('#player_cont').width() + ")").css({background: '#EE5330'});
                        ardplayer.PlayerModel.getInstanceByPlayerID("player00").player.viewCtrl.setRepresentationsClasses("m");

                    } else if (tmp_w >= 960 && tmp_w < 1280) {
                        $('#sizeInfoTxt').html("Repräsentationsgröße L (" + $('#player_cont').height() + " x " + $('#player_cont').width() + ")").css({background: '#00B763'});
                        ardplayer.PlayerModel.getInstanceByPlayerID("player00").player.viewCtrl.setRepresentationsClasses("l");

                    } else {
                        $('#sizeInfoTxt').html("Repräsentationsgröße XL (" + $('#player_cont').height() + " x " + $('#player_cont').width() + ")").css({background: '#C619EE'});
                        ardplayer.PlayerModel.getInstanceByPlayerID("player00").player.viewCtrl.setRepresentationsClasses("xl");
                    }
                    $("#player_cont").width(tmp_w).height(tmp_h);

                    ardplayer.PlayerModel.getInstanceByPlayerID("player00").player.viewCtrl.measureControlbarDimension();
                }
            }
        }

        // Datum/ Version **********************************************************************************

        $('#stand').append(" | <b>Player-Version:</b> " + ardplayer.GlobalModel.VERSION);
        //<h1>ARD-Player - Test EBU-Timed-Text</h1>
    });

})(ardplayer.jq);
</script>

<div id="body_container">
    <div class="headDivContainer">
        <div class="headDiv">
            <h1 class="headtxt">ARD-Player - Test EBU-Timed-Text</h1>

            <p id="stand" style="font-size: 14px; padding: 10px 10px 0 0;"><b>Stand Seite: </b></p>
        </div>
        <div class="logo"></div>
    </div>

    <div class="container">
        <!--muss zusätzlich ein margin-bottom für anfasser haben -->
        <div class="container_blank" style="margin-bottom: 20px;">
            <div id="player_cont">
                <div id="player00"></div>
            </div>
            <div id="drobs" title="Skaliere das Player-Fenster per Drag N Drop"></div>
        </div>

        <div class="container_blank" id="menue">
            <div style="position: relative; width: 100%">

                <p>1| Welches Untertitelformat soll es sein - EBU-TT oder DFXP (alt)?</p>

                <form class="txt">
                    <input class="txt" type="radio" name="UT_Standard" value="ebu" checked>ebu
                    <input class="txt" type="radio" name="UT_Standard" value="alt">alt
                </form>

                <p>2| Welche Datei soll es sein?</p>

                <div style="position: relative; float: left;">
                    <select id="STU_Cont" name="ut_selection">
                        <?php

                        // Verzeichnis mit den Dateien
                        $verzeichnis = 'test/untertiteldateien/ebu/';

                        // Verzeichnis auslesen und Dateien ausgeben
                        foreach (new DirectoryIterator($verzeichnis) as $datei) {
                            if (!$datei->isDir() && !$datei->isDot()) {

                                echo '<option value="' . $verzeichnis . $datei . '">' . $datei . '</option>';

                            }
                        }
                        ?>
                    </select>

                    <a class="txt" id="XmlAnzeigen" href="#" target="_new"></a>
                    <input id="UTPfad" name="UTPfad" type="text" style="width:60%; float:right ;display:none"
                           value="">


                    <input type="button" name="Reload" value="Player mit gesetzter URL neu laden"/>

                </div>
            </div>


            <div style="position: relative; float: left; width: 100%; overflow: hidden; float: none;">
                <p>Quellcode der im Player <i>geladenen</i> UT-Datei:</p>

                <a class="txt" id="UtUrl" target="_new"></a>

            </div>

            <div style="position: relative; float: left; width: 100%; overflow: hidden; float: none;">
                <p>Verwendetes UT-Addon:
                    <span class="txt" id="addon_type"></span></p>

            </div>
            <div style="position: relative; width: 100%">

                <p style="color: #EE5330; background-color: #ffffff; width: 100%">Springen zum gew&uuml;nschten UT-TAG
                    per Klick auf die
                    Startzeit in der Tabelle</p>
            </div>
        </div>
    </div>

    <div class="container">
        <div id="xml_container">

            <table id="Tabelle">
                <thead class="subtxtTable">
                <tr>
                    <th>ID</th>
                    <th>Start</th>
                    <th>Ende</th>
                    <th>Text</th>
                </tr>
                </thead>
                <tbody id="fillMeTable" class="txtTable">
                </tbody>
            </table>
        </div>
    </div>

</div>


</body>
<div id="sizeInfo">
    <p id="sizeInfoTxt"></p>
</div>
</html>