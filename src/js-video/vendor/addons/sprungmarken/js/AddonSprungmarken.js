/**
 * netTrek GmbH & Co. KG
 * (c) 2014
 * @plugin AddonSprungmarken
 **/

(function (ns, $, console) {
    "use strict";

    /**
     * Transportobjekt für Kapitelmarken
     * Bietet u.a. Parse- und Rechenmethoden zur korrekten Darstellung
     * der Bildinformationen. Hält u.a. auch eine Refernz zum geladenen
     * DOM-Bild Objekt.
     * @constructor
     */
    var ChapterVO = function () {
        var _seconds = 0,
            _title = "",
            _imageRaw = "",

            _imageDomObject = null,
            _imageIsGlobalSpritesheet = false,
            _imageGlobalSpritesheetIndex = -1;

        return {
            /**
             * Verarbeitet das Konfigurationsobjekt, und baut das ChapterVO
             * entsprechend auf.
             * @param rawObject
             * @returns {ChapterVO} Instanz
             */
            parse: function (rawObject) {
                if (rawObject.hasOwnProperty("_chapterTime"))
                    _seconds = rawObject._chapterTime || 0;

                if (rawObject.hasOwnProperty("_chapterTitle"))
                    _title = rawObject._chapterTitle || "";

                if (rawObject.hasOwnProperty("_chapterImg"))
                    _imageRaw = rawObject._chapterImg || "";

                return this;
            },

            /**
             * Gibt die Ziel-Zeit der Sprungmarke zurück
             * @returns {number}
             */
            getSeconds: function () {
                return _seconds;
            },

            /**
             * Gibt an, ob das Kapitel einen Titel besitzt.
             * @returns {boolean}
             */
            hasTitle: function () {
                return !!_title.trim();
            },

            /**
             * Gibt den ggf. vorhandenen Titel zurück.
             * @returns {string}
             */
            getTitle: function () {
                return _title;
            },

            /**
             * Gibt an, ob das Kapitel ein individuelles Bild besitzt.
             * Unabhängig davon, kann trotzdem ein globales Spritesheet
             * eingesetzt werden.
             * @returns {boolean}
             */
            hasPreloadImage: function () {
                return !!_imageRaw.trim();
            },

            /**
             * Gibt die Url des individuell konfigurierten Kapitelbildes
             * zurück.
             * @returns {string}
             */
            getPreloadImageUrl: function () {
                if (this.hasPreloadImage())
                    return _imageRaw.replace(/#.*$/, "");
                return "";
            },

            /**
             * Setzt das erfolgreich geladene DOM-Objekt für das anzuzeigende
             * Bild. Dies kann sowohl ein globales Bild, als auch ein individuelles
             * Kapitelbild sein.
             * @param image DOM Objekt des geladenen Bildes.
             * @param global Gibt an, ob das Bild global verwendet wird.
             * @param globalIndex Index für den Zugriff innerhalb des globalen Kapitelbildes.
             * @returns {ChapterVO}
             */
            setPreloadedImage: function (image, global, globalIndex) {
                _imageDomObject = image;

                _imageIsGlobalSpritesheet = global;
                _imageGlobalSpritesheetIndex = globalIndex;
                return this;
            },

            /**
             * Gibt an, ob das Kapitel ein geladenes Bild enthält (sowohl global als auch individuell).
             * @returns {boolean}
             */
            hasImage: function () {
                return !!_imageDomObject;
            },

            /**
             * Gibt die Bildquelle des geladenen Bildes zurück.
             * @returns {String}
             */
            getImageSrc: function () {
                if (!this.hasImage())
                    return "";
                return _imageDomObject.src;
            },

            /**
             * Gibt ein Rechteckobjekt zurück, dass die Koordinaten für die
             * Darstellung des Spritesheets im Hintergrund enthält. Dieses
             * ist so global gehalten, dass es auch für Einzelbilder verwendet
             * wird.
             * @returns {Object} Rechteck Objekt mit x, y, w (width) und h (height).
             */
            getSpritesheetCoordinates: function () {
                if (!_imageDomObject)
                    return false;

                var cellW, cellH, cellX, cellY;

                if (_imageIsGlobalSpritesheet) {
                    var columns = AddonSprungmarken.SPRITESHEET_COLUMN_COUNT;

                    cellW = _imageDomObject.width / columns;
                    cellH = cellW / 16 * 9;
                    cellX = Math.floor(_imageGlobalSpritesheetIndex % columns) * cellW;
                    cellY = Math.floor(_imageGlobalSpritesheetIndex / columns) * cellH;

                } else {
                    var coordinatesMatch = /#xybh=(\d+),(\d+),(\d+),(\d+)$/;
                    if (coordinatesMatch.test(_imageRaw)) {
                        var coordinates = _imageRaw.match(coordinatesMatch);
                        cellX = coordinates[1];
                        cellY = coordinates[2];
                        cellW = coordinates[3];
                        cellH = coordinates[4];
                    } else {
                        cellX = 0;
                        cellY = 0;
                        cellW = _imageDomObject.width;
                        cellH = _imageDomObject.height;
                    }
                }

                return {x: cellX, y: cellY, w: cellW, h: cellH};
            }
        }
    };

    var AddonSprungmarken = function () {
        this._imageQueue = [];
        this._chapters = [];
        this._duration = 0;
        this._drawingComplete = false;
    };

    var p = AddonSprungmarken.prototype = new ns.AbstractCorePlugin();

    /**************************************************************************
     * Plugin constants
     *************************************************************************/
    AddonSprungmarken.TXT_MAX_WIDTH = 160;
    AddonSprungmarken.CSS_CLASS_MARKER_CONTAINER = "sprungmarken";
    AddonSprungmarken.CSS_CLASS_MARKER = "sprungmarke";
    AddonSprungmarken.CSS_CLASS_POPUP = "popup";
    AddonSprungmarken.CSS_CLASS_POPUP_ARROW = "arrow";
    AddonSprungmarken.SPRITESHEET_COLUMN_COUNT = 1;

    /**************************************************************************
     * Plugin Konstruktionsbereich
     *************************************************************************/
    p.super_register = p.register;
    p.register = function (player) {
        this.super_register(player);

        // Wird das Plugin per Konfiguration verboten, brechen wir hier den
        // Ladevorgang ab.
        if (!player.model.playerConfig.getChaptersEnabled())
            return;

        var g = ns.GlobalModel.getInstance();
        this._isMobile = g.isMobileDevice;

        this._markerWidth = 7;
        if (this._isMobile)
            this._markerWidth = 14;

        // Sprungmarken werden nur für Player mit Zeitleiste unterstützt.
        if (player.model.mediaCollection.getIsLive())
            return;


        this.register_event(ns.Player.EVENT_READY, this.playerEventReadyHandler);
        this.register_event(ns.Player.EVENT_PLAY_STREAM, this.playStreamEventHandler);
        this.register_event(ns.Player.EVENT_CTRLBAR_FADEIN_START, this.fadeInCtrlbarStart);
        this.register_event(ns.Player.EVENT_CTRLBAR_FADEOUT_START, this.fadeOutCtrlbarStart);
    };

    p.fadeInCtrlbarStart = function () {
        if (this._uiJumpMarkContainer)
            this._uiJumpMarkContainer.children().removeClass("fadeout");
    };

    p.fadeOutCtrlbarStart = function () {
        if (this._uiJumpMarkContainer)
            this._uiJumpMarkContainer.children().addClass("fadeout");
    };

    p.super_dispose = p.dispose;
    p.dispose = function () {
        this.super_dispose();

        this._chapters.splice(0, this._chapters.length);
        this._imageQueue.splice(0, this._imageQueue.length);

        this._drawingComplete = false;
        this._duration = 0;

        AddonSprungmarken.SPRITESHEET_COLUMN_COUNT = 4;

        if (this._uiJumpMarkContainer)
            this._uiJumpMarkContainer.remove();
    };

    /**************************************************************************
     * Event-spezifische Plugin-Funktionen
     *************************************************************************/

    /**
     * Eventhandler der aufgerufen wird, sobald der Player sein READY-Event ausgibt.
     * @param event
     */
    p.playerEventReadyHandler = function (event) {
        var mc = this._player.model.mediaCollection;

        // Gloables Sprite
        var chapterSpriteImage = mc.getChapterSpriteImage() || "";
        if (!!chapterSpriteImage.trim()) {
            this._imageQueue.push(chapterSpriteImage);

            var chapterSpriteColumns = mc.getChapterSpriteColumns();
            if (!isNaN(chapterSpriteColumns) && chapterSpriteColumns > 0)
                AddonSprungmarken.SPRITESHEET_COLUMN_COUNT = chapterSpriteColumns;
        }

        var chapterArray = mc.getChapterArray() || [];
        for (var i = 0; i < chapterArray.length; i++) {

            var chapter = new ChapterVO().parse(chapterArray[i]);
            this._chapters.push(chapter);

            if (chapter.hasPreloadImage())
                this._imageQueue.push(chapter.getPreloadImageUrl());
        }

        if (this._imageQueue.length > 0)
            this.preloadImage(this._imageQueue.shift());
        else
            this.preloadingFinished();
    };

    /**
     * Lädt das übergebene Bild vor, und kehr anschließend zur Warteschlange zurück.
     * @param src Bildquelle
     */
    p.preloadImage = function (src) {

        /**
         * Ladevorgang erfolgreich
         * @param event
         */
        function imageLoaded(event) {
            var isGlobal = src == this._player.model.mediaCollection.getChapterSpriteImage();

            for (var i = 0, globalIndex = -1; i < this._chapters.length; i++) {
                var curChapter = this._chapters[i];

                // Der Index des global Spritesheets errechnet sich aus
                // allen Sprites, die kein abweichendes Bild definiert haben.
                if (!curChapter.hasPreloadImage() && isGlobal) {
                    ++globalIndex;
                }

                if (curChapter.getPreloadImageUrl() == src || ( !curChapter.hasPreloadImage() && isGlobal ))
                    curChapter.setPreloadedImage(event.target, isGlobal, globalIndex);
            }

            loadNextImage.bind(this).call();
        }

        /**
         * Ladevorgang fehlerhaft
         * @param event
         */
        function imageError(event) {
            loadNextImage.bind(this).call();
        }

        /**
         * Lädt das nächste Bild in der Warteschlange
         */
        function loadNextImage() {
            if (this._imageQueue.length > 0)
                this.preloadImage(this._imageQueue.shift());
            else
                this.preloadingFinished();
        }

        $("<img>")
            .attr("src", src)
            .one("load", imageLoaded.bind(this))
            .one("error", imageError.bind(this));
    };

    /**
     * Callback das aufgerufen wird, wenn der Ladevorgang abgeschlossen wurde,
     * und das Plugin mit der Initialisierung fortfahren darf.
     */
    p.preloadingFinished = function () {
        this._preloadingFinished = true;
        this.draw();
    };

    /**
     * Playerevent das aufgerufen wird, sobald der Stream abspielt.
     * @param event
     */
    p.playStreamEventHandler = function (event) {
        // Mehrfachaufrufe unterdrücken
        if (this._duration > 0)
            return;

        this._duration = this._player.getCtrl().getDuration() || 0;
        if (this._duration == 0) {
            setTimeout(this.playStreamEventHandler.bind(this), 100);
            return;
        }

        this.draw();
    };

    /**************************************************************************
     * View-spezifische Plugin-Funktionen
     *************************************************************************/

    /**
     * Zeichnet die Sprungmarken auf der Zeitleiste.
     */
    p.draw = function () {
        if (!this._preloadingFinished || this._duration <= 0 || this._drawingComplete)
            return;
        this._drawingComplete = true;

        // Container
        var vc = this._player.viewCtrl;
        this._uiJumpMarkContainer = vc.generateDiv(AddonSprungmarken.CSS_CLASS_MARKER_CONTAINER, vc.mainControlbar, vc);

        for (var i = 0; i < this._chapters.length; i++) {
            var curChapter = this._chapters[i];

            var marker = $("<span></span>")
                .addClass(AddonSprungmarken.CSS_CLASS_MARKER)
                .css("left", "calc( " + (curChapter.getSeconds() / this._duration * 100).toFixed(8) + "% - " + this._markerWidth / 2 + "px)")// 2.5
                .on("click", this.jumpMark_clickHandler.bind(this))
                .appendTo(this._uiJumpMarkContainer);

            if (this._isMobile)
                marker.addClass("mobile");

            if (curChapter.hasTitle() || curChapter.hasImage()) {
                marker
                    .on("mouseenter", this.jumpMark_mouseOverHandler.bind(this));
                if (!this._isMobile)
                    marker.on("mouseout", this.jumpMark_mouseOutHandler.bind(this));
            }
        }
    };

    /**
     * Eventhandler für Klicks auf eine Sprungmarke
     * @param event
     */
    p.jumpMark_clickHandler = function (event) {

        if (this._isMobile)
            clearTimeout(this._currentHoverTimeout);

        function _clickTargetToJumpmark(target) {
            var returnTarget = target;

            do {
                if (returnTarget.hasClass(AddonSprungmarken.CSS_CLASS_MARKER))
                    break;
                returnTarget = returnTarget.parent();
            } while (returnTarget != null);

            return returnTarget || target;
        }

        var resolveTarget = _clickTargetToJumpmark($(event.target));
        var chapter = this._chapters[ resolveTarget.index() ];

        this._player.seekTo(chapter.getSeconds());

        if (this._isMobile)
            resolveTarget.empty();
    };

    /**
     * Eventhandler für Mouse-Over über einer Sprungmarke
     * @param event
     */
    p.jumpMark_mouseOverHandler = function (event) {
        var jqTarget = $(event.target);

        if (this._currentHoverTarget != null)
            this._currentHoverTarget.empty();
        this._currentHoverTarget = jqTarget;

        if (this._isMobile) {
            clearTimeout(this._currentHoverTimeout);
            this._currentHoverTimeout = setTimeout(function () {
                if (this._currentHoverTarget) {
                    if (this._currentHoverTarget != null)
                        this._currentHoverTarget.empty();
                    this._currentHoverTarget = null;
                }
            }.bind(this), 5000);
        }

        var chapter = this._chapters[ jqTarget.index() ];

        // Nur das oberste Element zulassen (Marker)
        if (!jqTarget.hasClass(AddonSprungmarken.CSS_CLASS_MARKER))
            return;

        var jumpMarkDetailContainer = $("<div></div>")
            .addClass(AddonSprungmarken.CSS_CLASS_POPUP)
            .css("display", "table");

        if (chapter.hasImage()) {
            var imgCoords = chapter.getSpritesheetCoordinates();
            $("<div></div>")
                .css({
                    margin: "4px",
                    width: imgCoords.w,
                    height: imgCoords.h,
                    backgroundImage: "url(" + chapter.getImageSrc() + ")",
                    backgroundPosition: -imgCoords.x + "px " + -imgCoords.y + "px"
                })
                .appendTo(jumpMarkDetailContainer);
        }

        if (chapter.hasTitle()) {
            $("<p>" + chapter.getTitle() + "</p>")
                .css({
                    padding: "2px",
                    textAlign: "left",
                    margin: "0px",
                    width: AddonSprungmarken.TXT_MAX_WIDTH,
                    minWidth: AddonSprungmarken.TXT_MAX_WIDTH,
                    color: "#FFFFFF",
                    display: "table-cell",
                    verticalAlign: "top"
                })
                .appendTo(jumpMarkDetailContainer);
        }

        var arrowOffsetLeft = (this._markerWidth - 14) / 2; // 14 is arrow width

        $("<span></span>")
            .addClass(AddonSprungmarken.CSS_CLASS_POPUP_ARROW)
            .css("left", arrowOffsetLeft + "px")
            .fadeIn("slow")
            .appendTo(jqTarget);

        jumpMarkDetailContainer
            .fadeIn("slow")
            .appendTo(jqTarget);

        // Popup unter Berücksichtigung der linken und rechten Kante zentrieren
        var playerRect = this._uiJumpMarkContainer.parent()[0].getBoundingClientRect(),
            markerRect = this._currentHoverTarget[0].getBoundingClientRect(),
            arrowPosL = markerRect.left + arrowOffsetLeft - playerRect.left,
            arrowPosC = arrowPosL + 7,
            //arrowPosR = arrowPosL + 14, // 14 is arrow width
            popupWidth = jumpMarkDetailContainer.width();

        // screen left to zero (relative to arrowCenter)
        var x = arrowPosC - popupWidth / 2;

        // left overhead
        if (x < 0) {
            x = 0;
        } else {
            if (x + popupWidth > playerRect.width)
                x = playerRect.width - popupWidth;
        }

        // relative factor
        x += playerRect.left - markerRect.left;

        jumpMarkDetailContainer.css("left", x + "px");
    };

    /**
     * Eventhandler, der beim Verlassen einer Sprungmarke aufgerufen wird.
     * @param event
     */
    p.jumpMark_mouseOutHandler = function (event) {
        $(event.target)
            .empty();
    };

    ns.AddonSprungmarken = AddonSprungmarken;

}(ardplayer, ardplayer.jq, ardplayer.console));