/**
 * netTrek GmbH & Co. KG
 * (c) 2013
 * modified by Klaus Panster 06/2013
 * @plugin EBU-Untertitel
 **/

(function (ns, $, console) {
	"use strict";

	var AddonUntertitel_ebu_tt = function () {
	};

	var p = AddonUntertitel_ebu_tt.prototype = new ns.AbstractCorePlugin();

	/**************************************************************************
	 * Plugin constants
	 *************************************************************************/

		// View
	AddonUntertitel_ebu_tt.CLASS_SUBTITEL = "ardplayer-btn-subtitle";
	AddonUntertitel_ebu_tt.CLASS_SUBTITEL_PLACEHOLDER = "ardplayer-untertitel-ebu";
	AddonUntertitel_ebu_tt.CLASS_SUBTITLE_SELECTED = "toggle";

	// IVW / Tracking
	/*
	 * @date: 07.11.13
	 * internal ticketno.: 3984
	 * This two pixel are commented out and replaced with the two pixels from the PlayerPixelController-class
	 * */
	//AddonUntertitel_ebu_tt.INTERACTION_SUBTITLE_ACTIVATION = "interaction_subtitle_activation";
	//AddonUntertitel_ebu_tt.INTERACTION_SUBTITLE_DEACTIVATION = "interaction_subtitle_deactivation";

	// Error Constants
	AddonUntertitel_ebu_tt.ERROR_LOADING_SUBTITLE_XML = "Ein Fehler beim Laden der Untertitel-Datei ist aufgetreten.";

	// Custom Events
	AddonUntertitel_ebu_tt.EVENT_HIDE_SUBTITLES = "AddonUntertitel.hideSubtitles";
	AddonUntertitel_ebu_tt.EVENT_SHOW_SUBTITLES = "AddonUntertitel.showSubtitles";
	AddonUntertitel_ebu_tt.EVENT_TGGL_SUBTITLES = "AddonUntertitel.toggleSubtitles";

	/**************************************************************************
	 * Plugin construction area
	 *************************************************************************/

	p.super_register = p.register;
	p.register = function (player) {
		this.super_register(player);

		this.ADDON_NAME = "AddonUntertitel_ebu_tt";
		this.VERSION = "1.6";
		this.vAlign = "bottom";

		// Skip for iPod, iPhone and WP
		var g = ns.GlobalModel.getInstance();
		if (g.isWindowsPhone || g.isIPhoneDevice || g.isIPodDevice) {
			this.log("Plugin skipped: AddonUntertitel_ebu_tt");
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
		this.register_event(AddonUntertitel_ebu_tt.EVENT_SHOW_SUBTITLES, this.eventShowSubtitles);
		this.register_event(AddonUntertitel_ebu_tt.EVENT_HIDE_SUBTITLES, this.eventHideSubtitles);
		this.register_event(AddonUntertitel_ebu_tt.EVENT_TGGL_SUBTITLES, this.eventToggleSubtitles);

		this.log("Plugin registered: AddonUntertitel_ebu_tt");
	};

	p.super_dispose = p.dispose;
	p.dispose = function () {
		if (this.ebuSubtitleController)
			this.ebuSubtitleController.dispose();
		this.ebuSubtitleController = null;

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

		if ( this.ebuSubtitleController &&  this.ebuSubtitleController._lastCaptioningElement )
		{
			this.ebuSubtitleController._lastCaptioningElement.style = {};
			var event = $.extend($.Event(ns.EbuSubtitleController.TEXT_VALUE_CHANGED), {changedObject: this.ebuSubtitleController._lastCaptioningElement});
			$(this.ebuSubtitleController).trigger(event);
		}
	};

	/**
	 * Event: AddonUntertitel_ebu_tt.EVENT_SHOW_SUBTITLES
	 */
	p.eventShowSubtitles = function (event) {
		this.showSubtitles();
		this.showSubtitleState(true);
	};

	/**
	 * Event: AddonUntertitel_ebu_tt.EVENT_HIDE_SUBTITLES
	 */
	p.eventHideSubtitles = function (event) {
		this.hideSubtitles();
		this.showSubtitleState(false);
	};

	/**
	 * Event: AddonUntertitel_ebu_tt.eventToggleSubtitles
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
		this.ebuSubtitleController = ns.EbuSubtitleController.getInstance(this._player);
		this.ebuSubtitleControllerBindEventHandler();
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
			this.ebuSubtitleController.updateTimeFromPlyrCtrl(event.currentTime);
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

			if (this.vAlign == "bottom") {
				var tmpPos = parseInt(event.ctrlBarHeight);
				this.subtitlePlaceHolder.css({"top": "", "bottom": tmpPos});
			}
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
			that.subtitlePlaceHolder = vc.generateDiv(AddonUntertitel_ebu_tt.CLASS_SUBTITEL_PLACEHOLDER, vc.viewport, vc, target, classes);
			vc.addGeneratedElemetToList(vc, AddonUntertitel_ebu_tt.CLASS_SUBTITEL_PLACEHOLDER, AddonUntertitel_ebu_tt.CLASS_SUBTITEL_PLACEHOLDER, that.subtitlePlaceHolder, classes, false, false, false, false, false, true);

			that.hideSubtitles();

			that.subtitlePlaceHolder
				.off(vc.clickEventName)
				.on(vc.clickEventName, function (event) {
					that._player.getCtrl().togglePlay();

					return false;
				})
                .attr("aria-live","off");

			return that.subtitlePlaceHolder;
		}

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

				that.subtitle = vc.generateButton(AddonUntertitel_ebu_tt.CLASS_SUBTITEL, btnContainer, vc, target, classes)
					.attr({
						"title": "Untertitel ein-/ausblenden [(STRG +) U]",
						"role": "menuitem",
						"aria-pressed": false,
						"tabindex": "0"
					})
					.addClass("ardplayer-button-border-width-0 ardplayer-tabindex-focus")
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
			isSubTitleDivVisible = this.subtitle.hasClass(AddonUntertitel_ebu_tt.CLASS_SUBTITLE_SELECTED);

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
					this.subtitle.addClass(AddonUntertitel_ebu_tt.CLASS_SUBTITLE_SELECTED);
					break;
				case false:
					this.subtitle.removeClass(AddonUntertitel_ebu_tt.CLASS_SUBTITLE_SELECTED);
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
			value.dispatchCustomEvent(displaySubtitles ? AddonUntertitel_ebu_tt.EVENT_SHOW_SUBTITLES : AddonUntertitel_ebu_tt.EVENT_HIDE_SUBTITLES);
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
			this.ebuSubtitleController.loadTrackXML(this._player.viewCtrl.viewport, mc.getSubtitleUrl());
		} else {
			this.displaySubtitles = false;
		}
	};

	p.ebuSubtitleControllerBindEventHandler = function () {
		var that = this;

		$(this.ebuSubtitleController).on(ns.EbuSubtitleController.TEXT_VALUE_CHANGED, function (event) {
			if (that.subtitlePlaceHolder) {

				var ph = $(that.subtitlePlaceHolder);

				//Prüfe ob Text schon gesetzt ist
				if(this._lastCaptioningElement != event.changedObject){
					// Flaeche leeren
					ph.empty();

					//Render text in das DIV
					$(ph).append(event.changedObject.text);
				}

				// Auswertung der Schriftgrößen des XMLdiv, der p-tags und der enthaltenen spans
				// die variablen ergeben null, wenn keine schriftgröße für den tag gesetzt wurde.
				// Hintergrund ist, dass nicht alle Zulieferungen Schriftgrößen im p-tag enthalten, sondern tw nur im div!
				// wird jedoch pauschal die größe des divs übernommen, kommt es zur Größenverdopplung
				var divFontAspect = event.changedObject.divFontSize != null ? (parseFloat(event.changedObject.divFontSize) / 100) : null;
				var pFontAspect = event.changedObject.pFontSize != null ? (parseFloat(event.changedObject.pFontSize) / 100) : null;
				var spanFontAspect = event.changedObject.spanFontSize != null ? (parseFloat(event.changedObject.spanFontSize) / 100) : null;

				if ((divFontAspect != 0 || divFontAspect != null || divFontAspect != NaN) && (pFontAspect == null && spanFontAspect == null)) {
					var tmpAspect = divFontAspect;
				} else {
					tmpAspect = 1;
				}
				//schriftgröße skalierbar anpassen:
				//im verhältnis zu viewportgröße und irt-vorgabenverhältnis 30C-höhe
				//(Raster von 30 Höhenstufen aus dem PAL-fernsehen übernommen
				// und C als Multiplikator [laut IRT auf 1.6 geeinigt])
				var fontSize = (that._player.viewCtrl.viewport.height() / 30) * tmpAspect;

				// Untertitel und Untertitelbutton werden werden ab Schriftgröße <10 ausgeblendet
				var tmpFontSize = fontSize;
				if(event.changedObject.spanFontSize =="2c") spanFontAspect = 1.6;
				if(spanFontAspect!=null) tmpFontSize = fontSize * spanFontAspect;

				if(tmpFontSize<10) {
					$(ph).children().css('visibility', "hidden");
					$(".ardplayer-btn-subtitle").css('display', "none");
				}else{
					$(ph).children().css('visibility', "visible");
					$(".ardplayer-btn-subtitle").css('display', "inline-block");
				}

				$(ph).children().css('font-size', fontSize);

				//ermittle, wo der UT-block im Player positioniert wird
				that.vAlign = event.changedObject.vAlign;

				if (event.changedObject.vAlign == "top") {

					$(ph).css({"top": 0, "bottom": ""});

				} else if (event.changedObject.vAlign == "bottom") {
                    //ermittle die höhe der controlbar, um bei unterseitiger Positionierung den UT-Block exakt auf
                    // der controlbar aufsetzen zu können und nicht mit liftListener kollidiert
                    var tmpCtrlBarHeight = parseInt(that._player.viewCtrl.viewport.height()) - parseInt(that._player.viewCtrl.mainControlbar.position().top);


                    $(ph).css({"top": "", "bottom": tmpCtrlBarHeight});
                }

				if($(ph).isHiddenByClass())
					that.subtitlePlaceHolder.showWithClass();
			}

		});

		$(this.ebuSubtitleController).on(ns.EbuSubtitleController.HIDE_SUBTITLES, function (event) {
			if (that.subtitlePlaceHolder && !that.subtitlePlaceHolder.isHiddenByClass()) {
				that.subtitlePlaceHolder.hideWithClass();
			}
		});

		$(this.ebuSubtitleController).on(ns.EbuSubtitleController.ERROR_LOADING_XML, function (event) {
			if (that.subtitle) {
				that.subtitle.hideWithClass();

				that._player.errorCtrl.throwError(AddonUntertitel_ebu_tt.ERROR_LOADING_SUBTITLE_XML, ns.ErrorController.IS_CRITICAL_NO); //true);
				$(that.ebuSubtitleController).off();
			}
		});
	};

	ns.AddonUntertitel_ebu_tt = AddonUntertitel_ebu_tt;

}(ardplayer, ardplayer.jq, ardplayer.console));
