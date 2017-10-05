/**
 * Created by netTrek GmbH & Co. KG
 * User: netTrek - Kadir Uludag
 * @module controller
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
    var SubtitleController = function (player) {

        if (SubtitleController.playerIDs == undefined)
            SubtitleController.playerIDs = {};
        if (SubtitleController.players == undefined)
            SubtitleController.players = [];

        var playerID = undefined;
        if (player && player instanceof ns.Player) {
            playerID = player.getId();
        }

        if (playerID == undefined) {
            var errorCtrl = ns.ErrorController.getInstance();
            errorCtrl.throwError(ns.ErrorController.NO_PLAYER_DEFINED, ns.ErrorController.IS_CRITICAL_YES);
        }

        if (SubtitleController.playerIDs [playerID]) {
            return SubtitleController.playerIDs [playerID];
        }
        SubtitleController.playerIDs [playerID] = this;
        SubtitleController.players.push(player);

        /**
         * div id von disem Controller
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
     * @return SubtitleController
     */
    SubtitleController.getInstance = function (player) {
        return new SubtitleController(player);
    };

    /*
     * Löscht die Parameter die zum erstellen eines Singeltons genutzt werden
     * @method resetSingleton
     * @public
     * @param void
     * @return void
     * */
    SubtitleController.resetSingleton = function () {
        SubtitleController.instance = undefined;
    };

    var p = SubtitleController.prototype;

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
			SubtitleController.playerIDs [this.playerID] = null;
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
            // .error (ns.Delegate.create(this, this.xmlError))
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
        //console.log("SubtitleController xmlComplete");
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
        //console.log("SubtitleController xmlError");
        triggerEvent(this, SubtitleController.ERROR_LOADING_XML);
    };

    var capTypes = {
        'text/srt':['text', 'parseSrt'],
        'application/ttaf+xml':['xml', 'parseDfxp']
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
            var dfxpElement = $('<li><a class="track" type="application/ttaf+xml" href="'
                + this.subTitleURL
                + '" lang="de" '
                + ' data-enabled="enabled" '
                + '>DFXP/ttml file</a></li>');

            $(this.playingPlayer).append(dfxpElement.hideWithClass());

            var mm = $(".track");
            var type = mm.attr('type') || 'text/srt';
            type = capTypes[type];
            var captionArray = new Array();
            var that = this;

            var fn = function (captions) {
                $.each(captions, function (i, caption) {
                    captionArray.push(caption);
                    that.trackData.captions.push(caption);
                });
                that.subTitleObjects = captionArray;
            };

            try {
                $[type[1]](
                    xml,
                    function (caps) {
                        that.trackData.captions = caps;
                        fn(caps);
                    },
                    ($(".track")[0].attributes['data-sanitize'] || {}).specified
                );
            }
            catch (e) {
                //console.log(e);
            }
        }
    };

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

        for (var i = 0; i < captionsArray.length; i++) {
            var obj = captionsArray[i];
            if (currTimeInSec >= obj.start && currTimeInSec <= obj.end) {
                captionObject = obj;
                break;
            }
        }

        if (this._lastCaptioningElement != captionObject) {
            this._lastCaptioningElement = captionObject;

            if (captionObject != null) {
                triggerEvent(this, SubtitleController.TEXT_VALUE_CHANGED, {changedObject:captionObject});
            } else {
                triggerEvent(this, SubtitleController.HIDE_SUBTITLES, {changedObject:null});
            }
        }
    };


    /*
     * helper function
     * */
    $.backgroundEach = function (arr, processFn, completeFn) {
        var i = 0,
            l = arr.length
            ;
        var process = function () {
            var start = new Date().getTime();
            for (; i < l; i++) {
                processFn(i, arr[i], arr);
                if (new Date().getTime() - start > 100) {
                    setTimeout(process, 50);
                    break;
                }
            }
            if (i >= l - 1) {
                completeFn(arr, i, l);
            }
        };
        process();
    };
    $.parseDfxp = (function () {
        var sanitizeReg = /<[a-zA-Z\/][^>]*>/g;
        var getTime = function (time) {
            time = (time || '').split(':');

            if (time.length === 3) {
                time = (parseInt(time[0], 10) * 60 * 60) +
                    (parseInt(time[1], 10) * 60) +
                    (parseInt(time[2], 10))
                ;
                // hier muss das offset rein bsp-36000 !
                time = time - 36000;

                return isNaN(time) ? false : time;
            }
            return false;
        },
            doc = document,
            allowedNodes = {
                span:1,
                div:1,
                p:1,
                em:1,
                strong:1,
                br:1
            },
            getContent = function (elem) {
                var childs = elem.childNodes,
                    div = doc.createElement('div'), childElem, childContent, childContentStyle;

                for (var i = 0, len = childs.length; i < len; i++) {
                    //wenn du ein reiner Textknoten bist, binde den reinen Text ins div...
                    if (childs[i].nodeType === 3) {
                        div.appendChild(doc.createTextNode(childs[i].data));
                    } else
                    if (childs[i].nodeType === 1 && allowedNodes[childs[i].nodeName.toLowerCase()]) {
                        //...wenn du ein anderer Knoten bist...
                        childElem = doc.createElement(childs[i].nodeName);
                        div.appendChild(childElem);
                        childContent = getContent(childs[i]);
                        childContentStyle = setSpanStyle(childs[i]);

                        //...schau, ob du einen Inhalt hast (zb span)...
                        if (childContent) {
                            childElem.innerHTML = childContent;
                            //...wenn ja, schau, ob du einen Stlye hast
                            if (childContentStyle) {
                                //für span muss "block" angegeben werden, sonst funzt styling nicht
                                $(childElem).css('display', 'block');

                                for (key in childContentStyle) {
                                    $(childElem).css(key, childContentStyle[key]);
                                }
                            }
                        }
                    }
                }
                return div.innerHTML;
            };

        setSpanStyle = function (elem) {
            //Lies je span (elem) alle Attribute aus und übergib sie als dictionary
            var span_css_dict = {};

            for (var i = 0; i < elem.attributes.length; i++) {
                if (elem.attributes[i].nodeName.match(/tts:.+/i) !== null) {
                    span_css_dict[elem.attributes[i].nodeName.replace(/tts:/gi, "")] = elem.attributes[i].nodeValue;
                }
            }
            return span_css_dict;
        };

        getStylesHeader = function (xml) {
            //Lies für jede Style-Vorlage alle Attribute aus und übergib sie als dictionary
            var styleSheets = $('head', xml).find('styling').find('style');
            var head_css_dict = {};

            for (var j = 0; j < styleSheets.length; j++) {
                var tmp_head_css_dict = {};

                for (var i = 0; i < styleSheets[j].attributes.length; i++) {
                    if (styleSheets[j].attributes[i].nodeName.match(/tts:.+/i) !== null) {
                        tmp_head_css_dict[styleSheets[j].attributes[i].nodeName.replace(/tts:/gi, "")] = styleSheets[j].attributes[i].nodeValue;
                    }
                }
                head_css_dict[$(styleSheets[j]).attr('id')] = tmp_head_css_dict;
            }
            return head_css_dict;
        };

        setBodyStyle = function (xml) {
            //Ermittle für den Body-Tag den Style, lies alle Attribute aus und übergib sie als dictionary

            var body_css_dict = {};
            //wenn eine Styledefinition im body-tag vorliegt, lege ein dict an...
            if ($('head', xml).find('#' + $('body', xml).attr('style'))[0] != undefined) {
                var bodyStyle = $('head', xml).find('#' + $('body', xml).attr('style'))[0].attributes;

                for (var i = 0; i < bodyStyle.length; i++) {
                    var css_attr = bodyStyle[i].nodeName.replace(/tts:/gi, "");

                    if (bodyStyle[i].nodeName.match(/tts:.+/i) !== null) {
                        body_css_dict[bodyStyle[i].nodeName.replace(/tts:/i, "")] = bodyStyle[i].nodeValue;
                    }
                }
            }
            return body_css_dict;
        };

        setStyle = function (c, bStyle, hStyles, xml) {
            //liest für jeden Tag sein StyleSheet aus dem Header und
            //vergleicht diese mit seinen Vorgaben für <body> und sich.
            //Je nach Hierarchie wird das Attribut überschrieben
            //Für jedes Tag wird ein Dictionaty angelegt, in dem das komplette Styling steht

            var _styleAttr = c.getAttribute('style');
            var headstyle = $('head', xml).find('styling').find('#' + _styleAttr);

            //Style aus Body...
            var css_dict = clone(bStyle);

            //Styles aus Header...
            var css_dict = clone(hStyles[c.getAttribute('style')]);

            //Styles aus UT-tag...
            for (var j = 0; j < c.attributes.length; j++) {
                if (c.attributes[j].nodeName.match(/tts:.+/i) !== null) {
                    css_dict[c.attributes[j].nodeName.replace(/tts:/i, "")] = c.attributes[j].nodeValue;
                }
            }
            return css_dict;
        };

        clone = function (o) {
            // Klone/überschreibe jeweiliges dictionary
            function c(o) {
                for (var i in o) {
                    this[i] = o[i];
                }
            }

            return new c(o);
        };

        return function (xml, complete, sanitize) {
            var caps = $('p, div, span', xml).filter('[begin][end]'),
                captions = []
                ;
            var e, s, c, a;
            var bStyle, hStyles;

            hStyles = getStylesHeader(xml);
            bStyle = setBodyStyle(xml);

            $.backgroundEach(caps, function (i) {
                s = getTime(caps[i].getAttribute('begin'));
                e = getTime(caps[i].getAttribute('end'));

                a = setStyle(caps[i], bStyle, hStyles, xml);


                if (s !== false && e !== false) {
                    c = getContent(caps[i]) || '';

                    captions.push({
                        content:c,
                        start:s,
                        end:e,
                        style:a
                    });
                }
            }, function () {
                complete(captions);
            });
        };
    })();


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
    SubtitleController.TEXT_VALUE_CHANGED = "textValueChanged";
    /**
     * Statischer Wert, der für den Eventdispatcher als Eventtyp genutzt wird.
     * @public
     * @static
     * @const
     * */
    SubtitleController.HIDE_SUBTITLES = "hideSubtitles";
    /**
     * Statischer Wert, der für den Eventdispatcher als Eventtyp genutzt wird.
     * @public
     * @static
     * @const
     * */
    SubtitleController.ERROR_LOADING_XML = "errorLoadingXml";


    ns.SubtitleController = SubtitleController;

}(ardplayer, ardplayer.jq, ardplayer.console));