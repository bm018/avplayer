/**
 * Created by netTrek GmbH & Co. KG
 * User: netTrek - Florian Diesner
 * @module views
 **/

(function (ns, $, console) {

    var TimelineSlider = function (vc, mainContainer) {
        this.viewController = vc;
        this.mainContainer = mainContainer;

        if (this.mainContainer) {
            this.createChildren();
            this.addListener();
        }
    };

    TimelineSlider.prototype =
    {
        viewController: undefined,
        mainContainer: undefined,
        watchedDom: undefined,
        bufferDom: undefined,
        handleDom: undefined,
        handleDraggable: undefined,

        timeHoverArrowDom: undefined,
        timeHoverContainerDom: undefined,
        timeHoverTextDom: undefined,

        createChildren: function () {

            this.mainContainer
                .empty();

            // Buffer
            this.bufferDom = $('<div class="ardplayer-controlbar-slider-bg-buffer"></div>')
                .appendTo(this.mainContainer);

            // Watched
            this.watchedDom = $('<div class="ardplayer-controlbar-slider-bg-watched"></div>')
                .appendTo(this.mainContainer)
                .css("left", "0%")
                .attr("role", "slider");


            // Time popover
            this.timeHoverArrowDom = $('<div class="ardplayer-controlbar-slider-mouseover" style="display:none"></div>')
                .appendTo(this.mainContainer);

            this.timeHoverContainerDom = $('<div class="ardplayer-controlbar-slider-mouseover-time" style="display: none"></div>')
                .appendTo(this.mainContainer);

            this.timeHoverTextDom = $('<span aria-live="off" id="timeSpan">0:00:00</span>')
                .appendTo(this.timeHoverContainerDom);
            this._timeHoverShowing = false;

            // DVR or Mobile
            var domRangeHandleAttr = {
                "aria-live": "off",
                "role": "button",
                "title": this.viewController._dvrEnabledAndRequested ?
                    "Sprung zur aktuellen Stelle des Timeshift-Livestreams [(Strg +) K]" :
                    "Vorspulen [Pfeil rechts (bzw. STRG + Punkt)] und zurückspulen [Pfeil links (bzw. STRG + Komma)]"
            };

            this.handleDom = $('<div class="ardplayer-controlbar-slider-handle">')
                .attr(domRangeHandleAttr)
                //.hide()
                .appendTo(this.mainContainer)
                // Verhindert touchmove wenn Player in Swipe-Widgets eingebunden ist
                .on("touchmove", function(){return false;});

            // drag state flag
            this.isDragAction = false;

            var g = ns.GlobalModel.getInstance();

            var that = this;
            this.handleDraggable = Draggable.create(this.handleDom, {
                bounds: this.mainContainer,
                type: "x",
                throwProps: true,
                onDragStart: function (e) {

                    if (!that.handleDom.hasClass("no-delay"))
                        that.handleDom.addClass("no-delay");

                    that.viewController.fadeInCtrlBar();
                    that.viewController.sliding = true;
                    that.viewController.tabFadePrevention = true;

                    that.viewController.onUserActivity(true);

                    if (g.isMobileDevice)
                        that.showTimeHover();
                },
                onDrag: function () {

                    // remember we are dragging
                    that.isDragAction = true;

                    if (g.isMobileDevice) {
                        var dvrHandleWidth = that.handleDom.width();
                        var relativeX = $(this.target).offset().left - that.mainContainer.offset().left + dvrHandleWidth / 2;
                        that.__layoutTimeHover(relativeX);
                    }

                    var percent = (this.x + this.minX) / (this.maxX + this.minX) * 100;
                    that.setWatchedPercent(percent);
                    that.setBufferPercent(0);

                },
                onDragEnd: function () {

                    if (g.isMobileDevice)
                        that.hideTimeHover();

                    that.viewController.sliding = false;
                    that.viewController.tabFadePrevention = false;

                    that.viewController.onUserActivity(false);

                    if (that.handleDom.hasClass("no-delay"))
                        that.handleDom.removeClass("no-delay");

                    var percent = (this.x + this.minX) / (this.maxX + this.minX);
                    that.postChangeEvent(percent * 100);
                }
            });

            this.setWatchedPercent(0);
            this.setBufferPercent(0);
        },

        postChangeEvent: function (value) {
            clearTimeout(this._postDelayedTimeout);
            this._postDelayedTimeout = setTimeout(function () {
                $(this).trigger($.extend($.Event("change"), {value: value}));
            }.bind(this), 100)
        },

        setWatchedPercent: function (value) {

            this._lastWatchedPercent = value;

            var w = this._active ? this.handleDom.width() : 0;
            var mw = this.mainContainer.width();

            var min = w / 2;
            var max = mw - w;

            var val = max * value / 100 + min;

            value = val / mw * 100;

            this.watchedDom
                .css("width", value + "%");
        },

        setBufferPercent: function (bufferPercentage) {

            this._lastBufferValue = bufferPercentage;

            var w = this._active ? this.handleDom.width() : 0;
            var mw = this.mainContainer.width();

            var cssVal = bufferPercentage + (w / 2 / mw * 100);

            this.bufferDom
                .css("width", cssVal + "%");
        },

        addListener: function () {
            if (this.mainContainer) {

                $(this.mainContainer)
                    .off()
                    .on(this.viewController.moveEventName, this.onMouseMove.bind(this))
                    .on(this.viewController.downEventName, this.onMouseDown.bind(this))
                    .on(this.viewController.clickEventName, this.onMouseUp.bind(this));

                var g = ns.GlobalModel.getInstance();
                if (!g.isMobileDevice) {
                    $(this.mainContainer)
                        .mouseenter(this.onMouseEnter.bind(this))
                        .mouseleave(this.onMouseLeave.bind(this))
                }
            }
        },

        onMouseDown: function (event) {
            this.viewController.sliding = true;
        },

        onMouseUp: function (event) {

            // For mobile devices, layout the hover on touch aswell
            if (event.type == "touchend")
                this.hideTimeHover();

            this.viewController.sliding = false;
            this.viewController.tabFadePrevention = false;

            var percent = 0;

            if ( event && !this.isDragAction )
            {
                var dvrHandleWidth = 0;
                if (this.handleDom)
                    dvrHandleWidth = this.handleDom.width();

                var relativeX = $.crossbrowserPosition(event, this.mainContainer[0]).left;

                if (relativeX < dvrHandleWidth / 2)
                    relativeX = dvrHandleWidth / 2;
                else if (relativeX > this.mainContainer.width() - dvrHandleWidth / 2)
                    relativeX = this.mainContainer.width() - dvrHandleWidth / 2;
                percent = Math.max(Math.min((relativeX - dvrHandleWidth / 2) / (this.mainContainer.width() - dvrHandleWidth) * 100, 100), 0);
            } else {
                var x = this.handleDraggable[0].x,
                    maxX = this.handleDraggable[0].maxX,
                    minX = this.handleDraggable[0].minX;

                percent = (x + minX) / (maxX + minX) * 100;
            }

            this.isDragAction = false;
            this.postChangeEvent(percent);
        },

        onMouseEnter: function (event) {

            if (this.viewController.optionsControlDiv) {

                var relativeX = $.crossbrowserPosition(event, this.mainContainer[0]).left;

                var vcOptionElement = this.viewController.optionsControlDiv;
                var minX = vcOptionElement.position().left;
                var maxX = minX + vcOptionElement.width();

                if (relativeX >= minX && relativeX <= maxX)
                    return;
            }

            this.showTimeHover();
        },

        onMouseLeave: function (event) {
            this.hideTimeHover();
        },

        onMouseMove: function (e) {

            var vc = this.viewController;

            var dvrHandleWidth = 0;
            if (this.handleDom)
                dvrHandleWidth = this.handleDom.width();

            var relativeX = $.crossbrowserPosition(e, this.mainContainer[0]).left;

            if (vc.optionsControlDiv) {
                var vcOptionElement = vc.optionsControlDiv;

                var minX = vcOptionElement.position().left;
                var maxX = minX + vcOptionElement.outerWidth();

                if (relativeX >= minX && relativeX <= maxX) {
                    this.hideTimeHover();
                    return;
                } else {
                    this.showTimeHover();
                }
            } else {
                var relativeY = e.pageY - this.mainContainer.offset().top;
                if (relativeY < 0) {
                    this.hideTimeHover();
                    return;
                }
                else
                    this.showTimeHover();
            }

            if (relativeX < dvrHandleWidth / 2)
                relativeX = dvrHandleWidth / 2;
            else if (relativeX > this.mainContainer.width() - dvrHandleWidth / 2)
                relativeX = this.mainContainer.width() - dvrHandleWidth / 2;

            this.__layoutTimeHover(relativeX);
        },

        __layoutTimeHover: function (relativeX) {

            var dvrHandleWidth = this.handleDom.width();
            var vc = this.viewController;

            var overDiv = this.timeHoverArrowDom;
            overDiv.css("left", (relativeX - (overDiv.width() / 2) ) + "px");

            var overDivTime = this.timeHoverContainerDom;

            // +8 is 2x 4px Padding
            var overDivTimeX = relativeX - (overDivTime.width() + 8) / 2;

            var offsetLeft = 0; //this.offsetLeft;
            var offsetRight = offsetLeft + this.mainContainer.width() - (overDivTime.width() + 8);

            overDivTime.css("left", Math.max(offsetLeft, Math.min(offsetRight, overDivTimeX)) + "px");

            var percent = Math.max(Math.min((relativeX - dvrHandleWidth / 2) / (this.mainContainer.width() - dvrHandleWidth) * 100, 100), 0);

            var duration = 0;
            if (vc.player && vc.player.getCtrl())
                duration = vc.player.getCtrl().getDuration();

            var sec = 0;
            if (vc._dvrEnabledAndRequested) {
                sec = duration - duration * percent / 100;
                this.timeHoverTextDom.html("-" + vc.formatTimestring(sec));
            } else {
                sec = duration * percent / 100;
                this.timeHoverTextDom.html(vc.formatTimestring(sec, true));
            }
        },

        showTimeHover: function () {

            if (this._timeHoverShowing)
                return;
            this._timeHoverShowing = true;

            TweenLite.killTweensOf(this.timeHoverArrowDom);
            TweenLite.killTweensOf(this.timeHoverContainerDom);

            this.timeHoverArrowDom
                .css("opacity", 0)
                .css("display", "inline-block");
            this.timeHoverContainerDom
                .css("opacity", 0)
                .css("display", "inline-block");

            TweenLite.to(this.timeHoverArrowDom, 0.6, {opacity: 1});
            TweenLite.to(this.timeHoverContainerDom, 0.6, {opacity: 1});
        },

        hideTimeHover: function () {

            if (!this._timeHoverShowing)
                return;
            this._timeHoverShowing = false;

            TweenLite.to(this.timeHoverArrowDom, 0.6, {opacity: 0});
            TweenLite.to(this.timeHoverContainerDom, 0.6, {opacity: 0, onComplete: function () {

                this.timeHoverArrowDom
                    .css("display", "none");
                this.timeHoverContainerDom
                    .css("display", "none");

            }.bind(this)});
        },

        updateDVRSlider: function (time, duration) {

            this._lastTime = time;
            this._lastDuration = duration;

            if (this.handleDom) {
                this.handleDom
                    .removeClass("dvr-left")
                    .removeClass("dvr-middle")
                    .removeClass("dvr-right");

                var timeClass = "";
                if (time == 0) {
                    timeClass = "dvr-right"
                } else {
                    if (time >= duration) {
                        timeClass = "dvr-left";
                    } else {
                        timeClass = "dvr-middle";
                    }
                }

                this.handleDom
                    .addClass(timeClass);

                if (this.viewController.sliding)
                    return;

                var w = 40;//this.handleDom.width();
                var mw = this.mainContainer.width();
                var p = time / duration;

                var value = (mw - w) * p;
                if (!isNaN(value) && isFinite(value)) {
                    TweenLite.set(this.handleDraggable[0].target, {x: value});
                }
            }
        },

        refresh: function () {

            setTimeout(function () {

                if (this._lastWatchedPercent != undefined)
                    this.setWatchedPercent(this._lastWatchedPercent);

                if (this._lastBufferValue != undefined)
                    this.setBufferPercent(this._lastBufferValue);

                if (this._lastTime != undefined && this._lastDuration != undefined)
                    this.updateDVRSlider(this._lastTime, this._lastDuration);

            }.bind(this), 1);

        },

        showHandle: function () {
            this._setActive(true);
        },

        hideHandle: function () {
            this._setActive(false);
        },

        dispose: function () {

        },

        hide: function () {
            this.mainContainer.hide();
        },

        show: function () {
            this.mainContainer.show();
        },

        _setActive: function (isActive) {

            this._active = isActive;

            if (this.mainContainer) {
                if (isActive) {
                    if (!this.mainContainer.hasClass("active"))
                        this.mainContainer.addClass("active");
                    if (!this.handleDom.hasClass("active"))
                        this.handleDom.addClass("active");
                    if (!this.bufferDom.hasClass("active"))
                        this.bufferDom.addClass("active");
                    if (!this.watchedDom.hasClass("active"))
                        this.watchedDom.addClass("active");
                }
                else {
                    this.setWatchedPercent(this._lastWatchedPercent);
                    this.setBufferPercent(this._lastBufferValue);

                    if (this.mainContainer.hasClass("active"))
                        this.mainContainer.removeClass("active");
                    if (this.handleDom.hasClass("active"))
                        this.handleDom.removeClass("active");
                    if (!this.bufferDom.removeClass("active"))
                        this.bufferDom.removeClass("active");
                    if (!this.watchedDom.removeClass("active"))
                        this.watchedDom.removeClass("active");

                }
            }

        }
    };

    ns.TimelineSlider = TimelineSlider;

})(ardplayer, ardplayer.jq, ardplayer.console);
