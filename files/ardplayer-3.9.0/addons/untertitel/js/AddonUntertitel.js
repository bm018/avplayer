/**
 * netTrek GmbH & Co. KG
 * (c) 2013
 * @plugin Untertitel
 **/

(function (ns, $, console) {
	"use strict";

	var AddonUntertitel = function () {
	};

	var p = AddonUntertitel.prototype = new ns.AbstractCorePlugin();

	/**************************************************************************
	 * Plugin constants
	 *************************************************************************/

		// View
	AddonUntertitel.CLASS_SUBTITEL = "ardplayer-btn-subtitle";
	AddonUntertitel.CLASS_SUBTITEL_PLACEHOLDER = "ardplayer-untertitel";
	AddonUntertitel.CLASS_SUBTITLE_SELECTED = "toggle";

	// IVW / Tracking
	/*
	 * @date: 07.11.13
	 * internal ticketno.: 3984
	 * This two pixel are commented out and replaced with the two pixels from the PlayerPixelController-class
	 * */
	//AddonUntertitel.INTERACTION_SUBTITLE_ACTIVATION = "interaction_subtitle_activation";
	//AddonUntertitel.INTERACTION_SUBTITLE_DEACTIVATION = "interaction_subtitle_deactivation";

	// Error Constants
	AddonUntertitel.ERROR_LOADING_SUBTITLE_XML = "Ein Fehler beim Laden der Untertitel-XML ist aufgetreten.";

	// Custom Events
	AddonUntertitel.EVENT_HIDE_SUBTITLES = "AddonUntertitel.hideSubtitles";
	AddonUntertitel.EVENT_SHOW_SUBTITLES = "AddonUntertitel.showSubtitles";
	AddonUntertitel.EVENT_TGGL_SUBTITLES = "AddonUntertitel.toggleSubtitles";

	/**************************************************************************
	 * Plugin construction area
	 *************************************************************************/

	p.super_register = p.register;
	p.register = function (player) {
		this.super_register(player);

		this.ADDON_NAME = "AddonUntertitel";
		this.VERSION = "1.2";

		// Skip for iPod, iPhone and WP
		var g = ns.GlobalModel.getInstance();
		if (g.isWindowsPhone || g.isIPhoneDevice || g.isIPodDevice) {
			this.log("Plugin skipped: AddonUntertitel");
			return;
		}

		this.register_event(ns.Player.EVENT_INIT, this.eventInitPlayer);
		this.register_event(ns.Player.EVENT_KEYBOARD_RELEASE, this.eventKeyboardRelease);
		this.register_event(ns.Player.EVENT_LOAD_STREAM, this.eventLoadStream);
		this.register_event(ns.Player.EVENT_STOP_STREAM, this.eventStopStream);
		this.register_event(ns.Player.EVENT_END_STREAM, this.eventEndStream);
		this.register_event(ns.Player.EVENT_UPDATE_STREAM_TIME, this.eventUpdateStreamTime);
		this.register_event(ns.Player.VIEW_RESTORE_DEFAULTS, this.eventViewRestoreDefaults);
		this.register_event(ns.Player.SETUP_VIEW, this.eventSetupView);
		this.register_event(ns.Player.SETUP_VIEW_COMPLETE, this.eventViewSetupComplete);
		this.register_event(ns.Player.VIEW_CTRLBAR_MOVE, this.eventLiftSubtitles);
		this.register_event(ns.Player.TOGGLE_FULLSCREEN, this.eventToggleFullscreen);

		// Custom
		this.register_event(AddonUntertitel.EVENT_SHOW_SUBTITLES, this.eventShowSubtitles);
		this.register_event(AddonUntertitel.EVENT_HIDE_SUBTITLES, this.eventHideSubtitles);
		this.register_event(AddonUntertitel.EVENT_TGGL_SUBTITLES, this.eventToggleSubtitles);

		this.log("Plugin registered: AddonUntertitel");
	};

	p.super_dispose = p.dispose;
	p.dispose = function () {
		if (this.subtitleController)
			this.subtitleController.dispose();
		this.subtitleController = null;

		this.super_dispose();
	};

	/**************************************************************************
	 * Event related plugin functions
	 *************************************************************************/

	/**
	 * Event: Player.TOGGLE_FULLSCREEN
	 */
	p.eventToggleFullscreen = function (event) {

        if (!this.displaySubtitles)
            return;
        
		if ( this.subtitleController && this.subtitleController._lastCaptioningElement )
		{
			this.subtitleController._lastCaptioningElement.style = {};
			var event = $.extend($.Event(ns.SubtitleController.TEXT_VALUE_CHANGED), {changedObject: this.subtitleController._lastCaptioningElement});
			$(this.subtitleController).trigger(event);
		}
	};

	/**
	 * Event: AddonUntertitel.EVENT_SHOW_SUBTITLES
	 */
	p.eventShowSubtitles = function (event) {
		this.showSubtitles();
		this.showSubtitleState(true);
	};

	/**
	 * Event: AddonUntertitel.EVENT_HIDE_SUBTITLES
	 */
	p.eventHideSubtitles = function (event) {
		this.hideSubtitles();
		this.showSubtitleState(false);
	};

	/**
	 * Event: AddonUntertitel.eventToggleSubtitles
	 */
	p.eventToggleSubtitles = function (event) {
		var preventTrackingPixel = event ? event.preventTrackingPixel || false : false;
		this.toggleSubtitles(preventTrackingPixel);
	};

	/**
	 * Event: Player.SETUP_VIEW
	 */
	p.eventSetupView = function (event) {
		this.setupView(event);
	};

	/**
	 * Event: Player.EVENT_KEYBOARD_RELEASE
	 */
	p.eventKeyboardRelease = function (event) {

		if (event.shortcut == "u") {
			if (this.displaySubtitles === false)
				this._player.pixelController.triggerCustomPixel(ns.PlayerPixelController.IA_KEY_SUBTITLE_ACTIVATION);
			else if (this.displaySubtitles === true)
				this._player.pixelController.triggerCustomPixel(ns.PlayerPixelController.IA_KEY_SUBTITLE_DEACTIVATION);
			this.toggleSubtitles();
			this.showSubtitleState(this.getISubTitleDivVisible());
		}

	};

	/**
	 * Event: Player.SETUP_VIEW_COMPLETE
	 */
	p.eventViewSetupComplete = function (event) {
		if (this.displaySubtitles)
			this.showSubtitleState(true);
		else
			this.showSubtitleState(false);
	};

	/**
	 * Event: Player.VIEW_RESTORE_DEFAULTS (View Reset)
	 */
	p.eventViewRestoreDefaults = function (event) {
		this.hideSubtitles();
	};

	/**
	 * Event: Player.EVENT_INIT
	 */
	p.eventInitPlayer = function (event) {
		this.subtitleController = ns.SubtitleController.getInstance(this._player);
		this.subtitleControllerBindEventHandler();
	};

	/**
	 * Event: Player.EVENT_LOAD_STREAM
	 */
	p.eventLoadStream = function (event) {
		if (!this._loadTriggered) {
			this._loadTriggered = true;
			this.loadSubtitles();
		}
	};

	/**
	 * Event: Player.EVENT_UPDATE_STREAM_TIME
	 */
	p.eventUpdateStreamTime = function (event) {
		if (this.getISubTitleDivVisible() == true)
			this.subtitleController.updateTimeFromPlyrCtrl(event.currentTime);
	};

	/**
	 * Event: Player.EVENT_STOP_STREAM
	 */
	p.eventStopStream = function (event) {
		this.hideSubtitles();
		if(this.ebuSubtitleController) {
			this.ebuSubtitleController._lastCaptioningElement = null;
		}
	};

	/**
	 * Event: Player.EVENT_END_STREAM
	 */
	p.eventEndStream = function (event) {
		this.hideSubtitles();
	};

	/**
	 * Event: Player.VIEW_CTRLBAR_MOVE
	 */
	p.eventLiftSubtitles = function (event) {

		if (this.getISubTitleDivVisible() == true) {

			var tmpPos = parseInt(event.ctrlBarHeight);
			this.subtitlePlaceHolder.css({"top": "", "bottom": tmpPos});

		}
	};

	/**************************************************************************
	 * View related plugin functions
	 *************************************************************************/

	p.setupView = function (event) {
		// Event data:
		// {controller:vc, viewport:vc.viewport, container:this.functionBtnBox}

		var that = this;

		var mc = this._player.model.mediaCollection;
		var vc = event.controller;
		var btnContainer = event.container;

		function generateSubtitelPlaceholder(vc, target, classes) {
			that.subtitlePlaceHolder = vc.generateDiv(AddonUntertitel.CLASS_SUBTITEL_PLACEHOLDER, vc.viewport, vc, target, classes);
			vc.addGeneratedElemetToList(vc, AddonUntertitel.CLASS_SUBTITEL_PLACEHOLDER, AddonUntertitel.CLASS_SUBTITEL_PLACEHOLDER, that.subtitlePlaceHolder, classes, false, false, false, false, false, true);

			that.hideSubtitles();

			that.subtitlePlaceHolder
				.off(vc.clickEventName)
				.on(vc.clickEventName, function (event) {
					that._player.getCtrl().togglePlay();

					return false;
				})
                .attr("aria-live","off");

			return that.subtitlePlaceHolder;
		};

		function generateSubtitel(vc, target, classes) {
			if (!$.isBlank(mc.getSubtitleUrl()) && !mc.getIsLive()) {

                var handleKeyDown = function (event) {

                    if ( event.keyCode == 13 )
                    {
                        event.preventDefault();
                        return handleClick(event, false);
                    }

                }.bind(this);

                var handleClick = function (event, allowBlur) {

                    // 5739
                    if ( !(allowBlur === false) )
                    {
                        // IE11- Try-Catch #5798
                        try {
                            that.subtitle.blur();
                        } catch (err) {}
                    }

                    if (that.displaySubtitles === false)
                        that._player.pixelController.triggerCustomPixel(ns.PlayerPixelController.IA_MOUSE_SUBTITLE_ACTIVATION);
                    else if (that.displaySubtitles === true)
                        that._player.pixelController.triggerCustomPixel(ns.PlayerPixelController.IA_MOUSE_SUBTITLE_DEACTIVATION);

                    that.toggleSubtitles();

                    // Erlaubt die Ctrlbar auszublenden, wenn ein Klick erfolgt ist.
                    that._player.viewCtrl.tabFadePrevention = false;

                    return false;
                }.bind(this);

				that.subtitle = vc.generateButton(AddonUntertitel.CLASS_SUBTITEL, btnContainer, vc, target, classes)
					.attr({
						"title": "Untertitel ein-/ausblenden [(STRG +) U]",
						"role": "menuitem",
						"aria-pressed": false,
						"tabindex": "0"
					})
					//.addClass("ardplayer-button-border-width-0 ardplayer-tabindex-focus")
                    .on("keydown", handleKeyDown)
                    .on(vc.clickEventName, handleClick)

                    // Mouseover Handling
                    .on('mouseover mouseout touchstart touchend', function (event) {
                        event.preventDefault();
                        $(event.target).toggleClass('hover');
                    });

				return that.subtitle;
			}
			return null;
		};

		this.displaySubtitles = this._player.model.playerConfig.getShowSubtitelAtStart();

		var g = ns.GlobalModel.getInstance();
		if (g.hasSubtitlePreference()) {
			this.displaySubtitles = g.getSubtitleEnabled();
		}

		this.displaySubtitles = this.displaySubtitles && !this._player.model.mediaCollection.getIsLive();

		if (mc.getType() === ns.MediaCollection.TYPE_VIDEO) {
			generateSubtitel(vc);
			generateSubtitelPlaceholder(vc);
		}
	};

	p.getISubTitleDivVisible = function () {
		var isSubTitleDivVisible = false;

		if (this.subtitle)
			isSubTitleDivVisible = this.subtitle.hasClass(AddonUntertitel.CLASS_SUBTITLE_SELECTED);

		return isSubTitleDivVisible;
	};

	p.hideSubtitles = function () {
		if (this.subtitlePlaceHolder) {
			this.subtitlePlaceHolder.hideWithClass();
		}
	};

	p.showSubtitles = function () {
		if (this.subtitlePlaceHolder) {
			this.subtitlePlaceHolder.showWithClass();
		}
	};

	p.showSubtitleState = function (isVisible) {

		this.displaySubtitles = isVisible;

		if (this.subtitle) {
			switch (isVisible) {
				case true:
					this.subtitle.addClass(AddonUntertitel.CLASS_SUBTITLE_SELECTED);
					break;
				case false:
					this.subtitle.removeClass(AddonUntertitel.CLASS_SUBTITLE_SELECTED);
					break;
			}
			this.subtitle.attr({"aria-pressed": isVisible});
		}
	};

	/**
	 * Mit dieser Funktion kann man die Untertitel an- und ausschalten
	 * @method toggleSubtitles
	 * @public
	 * @return void
	 **/
	p.toggleSubtitles = function (preventTrackingPixel) {

		// Kann fehlschlagen, falls wir uns in einem Initialisierungsprozess befinden.
		if (!(this._player && this._player.getCtrl())) {
			return;
		}

		this.displaySubtitles = !this.displaySubtitles;

		ns.GlobalModel.getInstance().setSubtitleEnabled(this.displaySubtitles);

		// Alle weiteren Player benachrichtigen, dass wir die Untertitel getoggelt haben.
		var displaySubtitles = this.displaySubtitles;
		$.each(ns.PlayerModel.getAllPlayer(this._player), function (key, value) {
			value.dispatchCustomEvent(displaySubtitles ? AddonUntertitel.EVENT_SHOW_SUBTITLES : AddonUntertitel.EVENT_HIDE_SUBTITLES);
		});

		this.showSubtitleState(this.displaySubtitles);

		var playerCtrl = this._player.getCtrl();

		if (this.displaySubtitles) {
			playerCtrl.showSubtitles();
			this.showSubtitles();
		} else {
			playerCtrl.hideSubtitles();
			this.hideSubtitles();
		}

		if (!preventTrackingPixel) {
			if (this.displaySubtitles) {
				this._player.pixelController.triggerCustomPixel(ns.PlayerPixelController.SUPER_SUBTITLE_ACTIVATION);
			}
			else {
				this._player.pixelController.triggerCustomPixel(ns.PlayerPixelController.SUPER_SUBTITLE_DEACTIVATION);
			}
		}
	};

	/**************************************************************************
	 * Logic related plugin functions
	 *************************************************************************/

	/**
	 * In dieser Methode wird die subtitle-XML geladen.
	 * @method loadSubtitles
	 * @public
	 * @return void
	 */
	p.loadSubtitles = function () {
		var mc = this._player.model.mediaCollection;
		if (!$.isBlank(mc.getSubtitleUrl())) {
			this.subtitleController.loadTrackXML(this._player.viewCtrl.viewport, mc.getSubtitleUrl());
		} else {
			this.displaySubtitles = false;
		}
	};

	p.subtitleControllerBindEventHandler = function () {
		var that = this;

		$(this.subtitleController).on(ns.SubtitleController.TEXT_VALUE_CHANGED, function (event) {
			if (that.subtitlePlaceHolder) {

				// Wir muessen mit einer Kopie arbeiten, damit wir die original UT nicht
				// beeinflussen!
				var cloneStyle = $.extend({}, event.changedObject.style);

				var ph = $(that.subtitlePlaceHolder);

				// Flaeche leeren
				ph.empty();
				ph.attr("style", null);

				// Hintergrund
				var bgColor = cloneStyle["backgroundColor"];
				if (bgColor === undefined) {
					bgColor = "black";
				}
				cloneStyle["backgroundColor"] = undefined;

				var bgDiv = $("<div class=\"ardplayer-hintergrund\"></div>")
					.css("backgroundColor", bgColor);

				// Inhalt
				if (cloneStyle["color"] === undefined) {
					cloneStyle["color"] = "white";
				}
				var conDiv = $("<div class=\"ardplayer-inhalt\"></div>")
					.css(cloneStyle)
					.appendTo(ph);

				bgDiv.appendTo(ph);

				conDiv.html(event.changedObject.content);

				/*Beginn Einschub für Anpassung EBU-Addon-Verhalten [Klaus Panster]*/
				/********************************************************************************************************/

					//Angleichen eines Paddings links/rechts
				$(ph).children().children().css({'paddingLeft': '10%', 'paddingRight': '10%'});

				//schriftgröße skalierbar anpassen:
				//im verhältnis zu viewportgröße und irt-vorgabenverhältnis 30C-höhe
				//mit der vereinbarten Pilotprojekt-Schriftgröße von 24px ergibt sich etwa der Wert 15
				var fontSize = (that._player.viewCtrl.viewport.height() / 15);

				// Untertitel und Untertitelbutton werden werden ab Schriftgröße <10 ausgeblendet
				var tmpFontSize = fontSize;
				if(tmpFontSize<10) {
					$(ph).children().css('visibility', "hidden");
					$(".ardplayer-btn-subtitle").css('display', "none");
				}else{
					$(ph).children().css('visibility', "visible");
					$(".ardplayer-btn-subtitle").css('display', "inline-block");
				}

				$(ph).children().css('font-size', fontSize);

                //ermittle die höhe der controlbar, um bei unterseitiger Positionierung den UT-Block exakt auf
                // der controlbar aufsetzen zu können und nicht mit liftListener kollidiert
                var tmpCtrlBarHeight = parseInt(that._player.viewCtrl.mainControlbar.css("bottom")) + parseInt(that._player.viewCtrl.mainControlbar.css("height"));

                $(ph).css({"top": "", "bottom": tmpCtrlBarHeight});
                //var bla = $(bgDiv).height() + tmpCtrlBarHeight;

                var tmp_txt_top = $(conDiv).css('top');
                var tmp_txt_height = 0;
                var maxChecks = 100;

                var checkRenderingComplete = function () {

                    if (--maxChecks == 0) {
                        return;
                    }

                    tmp_txt_height = conDiv.outerHeight();

                    if (tmp_txt_height > 20) {

                        //workaround, damit hintergrund immer nach unten auf oberkannte controlbar gezogen wird
                        if (tmp_txt_top != 'auto') {
                            tmp_txt_height = -(parseInt(tmp_txt_top, 10)) + tmp_txt_height;
                        }

                        $(bgDiv).css({'height': tmp_txt_height, 'top': tmp_txt_top});
                    } else {
                        setTimeout(checkRenderingComplete, 30);
                    }
                }

                checkRenderingComplete();

				/*Ende Einschub für Anpassung EBU-Addon-Verhalten [Klaus Panster]*/
				/********************************************************************************************************/


                if(that.displaySubtitles)
                    that.subtitlePlaceHolder.showWithClass();

			}

		});

		$(this.subtitleController).on(ns.SubtitleController.HIDE_SUBTITLES, function (event) {
			if (that.subtitlePlaceHolder) {
				that.subtitlePlaceHolder.hideWithClass();
			}
		});

		$(this.subtitleController).on(ns.SubtitleController.ERROR_LOADING_XML, function (event) {
			if (that.subtitle) {
				that.subtitle.hideWithClass();
				that._player.errorCtrl.throwError(AddonUntertitel.ERROR_LOADING_SUBTITLE_XML, ns.ErrorController.IS_CRITICAL_NO); //true);
				$(that.subtitleController).off();
			}
		});
	};

	ns.AddonUntertitel = AddonUntertitel;

}(ardplayer, ardplayer.jq, ardplayer.console));
