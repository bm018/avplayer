/**
 * Created by ard.de
 * User: ard.de - Klaus Panster
 * @module ebu-subtitle-controller
 **/

(function (ns, $, console) {
    // "use strict";
    /**
     * Diese Klasse wird für die Untertitel genutzt.
     * Die übergebene XML wird geladen und im Anschluss die XML knoten geparst und zur angegebenen Zeit angezeigt.
     * Hierzu wird eine singelton-Instanz der TrackController-Klasse erstellt.
     * @class TrackController
     * @constructor
     * @public
     * @return void
     **/
    var EbuSubtitleController = function (player) {

        if (EbuSubtitleController.playerIDs == undefined)
            EbuSubtitleController.playerIDs = {};
        if (EbuSubtitleController.players == undefined)
            EbuSubtitleController.players = [];

        var playerID = undefined;
        if (player && player instanceof ns.Player) {
            playerID = player.getId();
        }

        if (playerID == undefined) {
            var errorCtrl = ns.ErrorController.getInstance();
            errorCtrl.throwError(ns.ErrorController.NO_PLAYER_DEFINED, ns.ErrorController.IS_CRITICAL_YES);
        }

        if (EbuSubtitleController.playerIDs [playerID]) {
            return EbuSubtitleController.playerIDs [playerID];
        }
        EbuSubtitleController.playerIDs [playerID] = this;
        EbuSubtitleController.players.push(player);

        /**
         * div id von diesem Controller
         * @public
         * @property playerID
         * @type String
         */
        this.playerID = playerID;
        /**
         * Playerinstanz von diesem Controller
         * @public
         * @property player
         * @type Player
         */
        this.player = player;

        this.initialize();
    };

    /**
     * Singletonfactory für eine Playerinstanz
     * @method getInstance
     * @public
     * @static
     * @param player
     * @return EbuSubtitleController
     */
    EbuSubtitleController.getInstance = function (player) {
        return new EbuSubtitleController(player);
    };

    /*
     * Löscht die Parameter die zum erstellen eines Singeltons genutzt werden
     * @method resetSingleton
     * @public
     * @param void
     * @return void
     * */
    EbuSubtitleController.resetSingleton = function () {
        EbuSubtitleController.instance = undefined;
    };

    var p = EbuSubtitleController.prototype;

    /**
     * Initialisierungsmethode, wird vom Konstruktor aufgerufen.
     * @method initialize
     * @protected
     * @return void.
     */
    p.initialize = function () {
        this.playingPlayer = null;
        this.subTitleURL = null;
        this.loadedXML = null;
        this.subTitleObjects = null;
        this.trackData = null;
        this._lastCaptioningElement = null;
    };

    /**
     * Löst ggf. vorhandene Instanzen zum Controller
     * @method dispose
     * @protected
     * @return void.
     */
    p.dispose = function () {
        if ( this.playerID )
        {
            EbuSubtitleController.playerIDs [this.playerID] = null;
        }
    }

    /**
     * Hier wird die XML geladen. Für den als Parameter übergebenen Player.
     * @method loadTrackXML
     * @public
     * @param player. Typ: Object. Player der die Untertitel anzeigen soll
     * @param subtitleURL. Typ: String. Pfad zu der XML.
     * @return void
     */
    p.loadTrackXML = function (player, subtitleURL) {
        this.trackData = new Object();
        this.trackData.captions = new Array();
        this.playingPlayer = player;
        this.subTitleURL = subtitleURL;
        $.ajax({
                type:"GET",
                url:subtitleURL,
                dataType:"xml",
                encoding:"UTF-8",
                error:ns.Delegate.create(this, this.xmlError),
                complete:ns.Delegate.create(this, this.xmlComplete),
                success:ns.Delegate.create(this, this.xmlSuccess)
            }
        );

    };

    /**
     * Complete-Eventhandler für den Ajax-Ladeprozess der XML.
     * @method xmlComplete
     * @public
     * @param xhrInstance. Typ: Object. Das geladene XML-Objekt.
     * @param status. Typ: String. Status des Ladeprozesses
     * @return void
     */
    p.xmlComplete = function (xhrInstance, status) {
        //console.log("EbuSubtitleController xmlComplete");
    };

    /**
     * Error-Eventhandler für den Ajax-Ladeprozess der XML.
     * @method xmlError
     * @public
     * @param xhrInstance. Typ: Object. Das geladene XML-Objekt.
     * @param message. Typ: String.
     * @param optional. Typ: Object.
     * @return void
     */
    p.xmlError = function (xhrInstance, message, optional) {
        //console.log("EbuSubtitleController xmlError");
        triggerEvent(this, EbuSubtitleController.ERROR_LOADING_XML);
    };


    /**
     * Success-Eventhandler für den Ajax-Ladeprozess der XML.
     * @method xmlSuccess
     * @public
     * @param xml. Typ: Object. Das geladene XML-Objekt.
     * @param status. Typ: String. Status des Ladeprozesses
     * @return void
     */
    p.xmlSuccess = function (xml, status) {

        this.loadedXML = xml;

        if (xml != null && status == "success") {

            var EbuElement = $('<li><a class="track" type="application/ttaf+xml" href="'
                + this.subTitleURL
                + '" lang="de" '
                + ' data-enabled="enabled" '
                + '>EBUTT/ttml file</a></li>');

            $(this.playingPlayer).append(EbuElement.hideWithClass());

            var that = this;

            try {

                var XmlNs = that.loadedXML.documentElement.namespaceURI;
                var styles = {};
                var regions = {};

                //**********************************************************************************************
                // Anlegen Regions-Array: derzeit sind laut EBU nur "top" und "bottom" definiert

                //var XmlRegions = that.loadedXML.getElementsByTagNameNS(XmlNs, "region");

                var XmlRegions =  this.getElementsWithNS(that.loadedXML, XmlNs, "region");

                for (var i = 0; i < XmlRegions.length; i++) {

                    var data = XmlRegions[i];

                    var id = that.sp_getXmlAttr(data, "id");

                    if (that.sp_getXmlAttr(data, "displayAlign") == "after") {
                        regions[id] = "bottom"
                    } else if (that.sp_getXmlAttr(data, "displayAlign") == "before") {
                        regions[id] = "top"
                    } else {
                        regions[id] = that.sp_getXmlAttr(data, "displayAlign");
                    }
                }

                //**********************************************************************************************
                // Anlegen Style-Array als Textwurst: <style id="s1" tts:color="blue" tts:fontFamily="Arial" tts:fontSize="28px" />

                //var XmlStyles = that.loadedXML.getElementsByTagNameNS(XmlNs, "style");

                var XmlStyles =  this.getElementsWithNS(that.loadedXML, XmlNs, "style");

                for (var i = 0; i < XmlStyles.length; i++) {

                    var data = XmlStyles[i];

                    var id = that.sp_getXmlAttr(data, "id");
                    // sp_d("id:"+id);

                    var styleText = "";
                    $.each(data.attributes, function (i, attrib) {

                        var name = that.sp_getAttrRawName(attrib);

                        var value = attrib.value;
                        // sp_d("name:"+name);
                        if (name == "id") {
                            return; // ignore
                        }
                        if (name == "fontSize") {
                            name = "font-size"

                            //value = "100%";
                            value = value.toLowerCase();

                            if (value == "1c") {
                                value = "100%";
                            } else if (value == "2c") {
                                value = "160%";
                            }
                            //return; // ignore
                        }
                        if (name == "lineHeight") {
                            name = "line-height";

                            if (value == "normal") {
                                return;// ignore
                            }
                        }
                        if (name == "textAlign") name = "text-align";
                        if (name == "fontFamily") name = "font-family";
                        if (name == "backgroundColor") {
                            if (value.length > 7) {

                                //Auslesen der Transparenz und runden auf 2 Dez-Stellen
                                var tmp_alpha = value.substr(7, 9);
                                tmp_alpha = (Math.round(parseInt(tmp_alpha, 16) / 255 * 100)) / 100;

                                //für den guten, alten IE8 im Bereich 0-100
                                if (navigator.userAgent.match(/msie 8.0/i) != null) {
                                    tmp_alpha = tmp_alpha * 100;
                                }
                                // auskommentiert, da ard-intern mit Andre Berthold beschlossen wurde,
                                // alle UT aus Performance- und Lesbarkeitsgründen
                                // mit 100% Deckkraft anzuzeigen.
                                //styleText += "opacity:" + tmp_alpha + ";";
                                value = value.substr(0, 7);
                            }
                            name = "background-color";
                        }
                        styleText += name + ":" + value + "; ";
                    });
                    // sp_d("styleText --> "+styleText);
                    styles[id] = styleText;
                }

                //Auslesen der Schriftgröße für das umschließende div
                //******************************************************************************************************

                var XmlDivs =  this.getElementsWithNS(that.loadedXML, XmlNs, "div");
                var divFontSize = null;

                for(var j= 0; j < XmlDivs.length; j++){
                    divFontSize = that.getFontSize(XmlDivs[j], XmlStyles);
                }

                //******************************************************************************************************

                var XmlParagraphs =  this.getElementsWithNS(that.loadedXML, XmlNs, "p");

                for (var i = 0; i < XmlParagraphs.length; i++) {

                    data = XmlParagraphs[i];

                    var idIdx = i + 1;
                    // begin="10:01:22.600" end="10:01:26.040"
                    var id = that.sp_getXmlAttr(data, "id");
                    var startTime = that.sp_getXmlAttr(data, "begin");
                    var endTime = that.sp_getXmlAttr(data, "end");
                    var style = that.sp_getXmlAttr(data, "style");
                    var vAlign = that.sp_getXmlAttr(data, "region");
                    var pFontSize = that.sp_getXmlAttr(data, "fontSize");
                    var spanFontSize = null;//head_getRegion(vAlign);


                    // sp_d("p-id: "+id);
                    // sp_d("p-styleId: "+style);

                    var styletext = styles[style];
                    if (typeof styletext == "undefined") {
                        styletext = ""; // nicht gefunden
                    }
                    // linken und rechten Rand für die Positionierung des p-tags mitgeben
                    styletext += "margin-left: 10%; margin-right: 10%;";
                    // sp_d("p-styleText: "+styletext);
                    var text = '<p id="tt' + idIdx + '" style="' + styletext + '">';

                    $.each(data.childNodes, function (idx2, data2) {

                        var name = that.sp_getNodeRawName(data2);
                        if (name == "#text") {
                            return true; // continue
                        }
                        // sp_d("data2.nodeName: "+name);
                        // <tt:span style="textRed">rot auf schwarz</tt:span>
                        if (name == "span") {
                            var style2 = that.sp_getXmlAttr(data2, "style");

                            spanFontSize = that.getFontSize(data2, XmlStyles);
                            var styletext2 = styles[style2];
                            if (typeof styletext2 == "undefined") {
                                styletext2 = ""; // nicht gefunden
                            }
                            // sp_d("span-style: "+styletext2);
                            var spanText = $(data2).text();
                            // sp_d("span-text: "+spanText);

                            if(spanText.indexOf("<span>")==-1)spanText="&nbsp;"+spanText;

                            text += '<span style="' + styletext2 + '">' + spanText + '</span>';

                            return true; // continue
                        }
                        if (name == "br") {
                            var lastposition = text.lastIndexOf("</span>");
                            text = [text.slice(0, lastposition), "&nbsp;", text.slice(lastposition)].join('');

                            text += '<br/>';
                            return true; // continue
                        }
                    });
                    var lastposition = text.lastIndexOf("</span>");
                    text = [text.slice(0, lastposition), "&nbsp;", text.slice(lastposition)].join('');
                    text += "</p>";

                    startTime = that.sp_srtTime2Sec(startTime);
                    endTime = that.sp_srtTime2Sec(endTime);

                    //timedTextData
                    that.trackData.captions.push({
                        "id":"tt" + idIdx,
                        "startTime":startTime,
                        "endTime":endTime,
                        "text":text,
                        "vAlign":regions[vAlign],
                        "divFontSize":divFontSize,
                        "pFontSize":pFontSize,
                        "spanFontSize":spanFontSize
                    });
                }
                //sp_d("sp_loadTimedText: loaded: "+timedTextData.length);
            } catch (ex) {
                //console.log(ex);
                //sp_logException(arguments, ex)
            }
        }
    };

    //***************************************


    /**
     * Methode zum Auslesen der tag-Elemente mit NS
     * @method getElementsWithNS
     * @public
     * @param node - Attributname Typ: object.
     * @param ns - Attributname Typ: string.
     * @param tagName - Attributname Typ: String.
     * @return string
     */

    p.getElementsWithNS = function(node, ns, tagName){

        if (node.getElementsByTagNameNS) {
            return node.getElementsByTagNameNS(ns, tagName);
        }
        // Ticket #3699 Der liebe IE versteht keine NS - deshalb hier der Fake  mit tt
        return node.getElementsByTagName('tt' + ':' + tagName);
    }

    /**
     * Methode zum Auslesen der Style-Namen - kürzt auch NameSpace weg
     * @method sp_getAttrRawName
     * @public
     * @param elem - Attributname Typ: object.
     * @return string
     */
    p.sp_getAttrRawName = function (elem) {
        var name = elem.name;
        var idx = name.indexOf(":");
        if (idx >= 0) {
            name = name.substr(idx + 1);
        }
        return name;
    }

    /**
     * Methode zum Auslesen der tag-Typen/-IDs (span, br ,...)
     * @method sp_getNodeRawName
     * @public
     * @param elem - Attributname Typ: object.
     * @return string
     */
    p.sp_getNodeRawName = function (elem) {
        var name = elem.nodeName;
        var idx = name.indexOf(":");
        if (idx >= 0) {
            name = name.substr(idx + 1);
        }
        return name;
    }

    /**
     * Methode zum Auslesen des Wertes des mitgegebenen Attributes
     * @method sp_getXmlAttr
     * @public
     * @param elem - Attributname Typ: object.
     * @return string
     */
    p.sp_getXmlAttr = function (elem, attrName) {
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

    /**
     * Methode zum Auslesen der Schriftgröße des Elements
     * @method getFontSize
     * @public
     * @param elem - Attributname Typ: Array, XmlStyles - Atrributname Typ: Object.
     * @return string
     */
    p.getFontSize = function (elem, XmlStyles){

        var ret = null;

        var data = elem;

        var eleStyle = this.sp_getXmlAttr(data, "style");

        for (var j = 0; j < XmlStyles.length; j++) {

            var styleData = XmlStyles[j];

            if (this.sp_getXmlAttr(styleData, "id") == eleStyle){
                ret = this.sp_getXmlAttr(styleData, "fontSize");
            }
        }
        return ret;
    }

    /**
     * Methode zum Auslesen und parsen der Zeit in Sekunden(Timeconde)
     * @method sp_srtTime2Sec
     * @public
     * @param srtTime - Attributname Typ: String.
     * @return string
     */
    p.sp_srtTime2Sec = function (srtTime) {
        var ret = 0;
        ret += 3600 * srtTime.substr(0, 2);
        ret += 60 * srtTime.substr(3, 2);
        ret += 1 * srtTime.substr(6, 2);
        ret += 0.001 * srtTime.substr(9, 3);
        if (ret >= 10 * 3600) {
            ret -= 10 * 3600;
        }
        return ret;
    }

    //***********************************************************


    /**
     * Wird mit jedem Update der aktuellen Zeit aufgerufen, und es wird kontrolliert ob ein XMl-Untertitel-Knoten angezeigt werden soll.
     * @method updateTimeFromPlyrCtrl
     * @public
     * @param currTimeInSec. Typ: Number. Zeit in Sekunden.
     * @return void
     */
    p.updateTimeFromPlyrCtrl = function (currTimeInSec) {

        var captionsArray = this.trackData.captions;
        var captionObject = null;
        var overlapseArray = new Array;

        for (var i = 0; i < captionsArray.length; i++) {
            var obj = captionsArray[i];

            if (currTimeInSec >= obj.startTime && currTimeInSec <= obj.endTime) {
                overlapseArray.push(i);
                if(this.activeSubtitle!=i){
                    if(overlapseArray.length > 1){
                        this.activeSubtitle = overlapseArray[overlapseArray.length-1];
                    }else {
                        this.activeSubtitle = i;
                    }
                }
            }
        }


        if(typeof captionsArray[this.activeSubtitle] !== 'object') return;

        if(currTimeInSec >= captionsArray[this.activeSubtitle].startTime && currTimeInSec <= captionsArray[this.activeSubtitle].endTime){

            captionObject = captionsArray[this.activeSubtitle];

            triggerEvent(this, EbuSubtitleController.TEXT_VALUE_CHANGED, {changedObject:captionObject});
            this._lastCaptioningElement = captionObject;
        } else{
            triggerEvent(this, EbuSubtitleController.HIDE_SUBTITLES, {changedObject:null});
        }
    };


    /**
     * Statischer Wert, der für den Eventdispatcher als Eventtyp genutzt wird.
     * @public
     * @method  triggerEvent
     * @param ctrl. Typ: Object. Welcher Controller das Event triggert
     * @param type. Typ: String. Eventtyp
     * @param data. Typ: Object. Daten die mit dem Event mitgesendet werden.
     * @return void
     * */
    var triggerEvent = function (ctrl, type, data) {
        var event = $.extend($.Event(type), data);
        $(ctrl).trigger(event);
    };

    /**
     * Statischer Wert, der für den Eventdispatcher als Eventtyp genutzt wird.
     * @public
     * @static
     * @const
     * */
    EbuSubtitleController.TEXT_VALUE_CHANGED = "textValueChanged";
    /**
     * Statischer Wert, der für den Eventdispatcher als Eventtyp genutzt wird.
     * @public
     * @static
     * @const
     * */
    EbuSubtitleController.HIDE_SUBTITLES = "hideSubtitles";
    /**
     * Statischer Wert, der für den Eventdispatcher als Eventtyp genutzt wird.
     * @public
     * @static
     * @const
     * */
    EbuSubtitleController.ERROR_LOADING_XML = "errorLoadingXml";


    ns.EbuSubtitleController = EbuSubtitleController;

}(ardplayer, ardplayer.jq, ardplayer.console));