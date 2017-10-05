/**
 * netTrek GmbH & Co. KG
 * (c) 2015
 * @plugin Untertitel
 **/

(function (ns, $, console) {
	"use strict";

	var AddonLiveUntertitel = function () {
	};

	var p = AddonLiveUntertitel.prototype = new ns.AbstractCorePlugin();

	/**************************************************************************
	 * Plugin constants
	 *************************************************************************/

		// View
	AddonLiveUntertitel.CLASS_SUBTITEL = "ardplayer-btn-subtitle";
	AddonLiveUntertitel.CLASS_SUBTITEL_PLACEHOLDER = "ardplayer-untertitel";
	AddonLiveUntertitel.CLASS_SUBTITLE_SELECTED = "toggle";

	AddonLiveUntertitel.TYPE_ALTERNATIVE_MC = "untertitel";

	/**************************************************************************
	 * Plugin construction area
	 *************************************************************************/

	p.super_register = p.register;
	p.register = function (player) {
		this.super_register(player);

		this.ADDON_NAME = "AddonLiveUntertitel";
		this.VERSION = "1.0";

		this.register_event(ns.Player.EVENT_KEYBOARD_RELEASE, this.eventKeyboardRelease);
		this.register_event(ns.Player.SETUP_VIEW, this.eventSetupView);
		this.register_event(ns.Player.SETUP_VIEW_COMPLETE, this.eventViewSetupComplete);
		this.register_event(ns.Player.EVENT_LOAD_STREAM, this.eventLoadStream);

		this.log("Plugin registered: AddonLiveUntertitel");
	};

	p.super_dispose = p.dispose;
	p.dispose = function () {
		this.super_dispose();
	};

	/**************************************************************************
	 * Event related plugin functions
	 *************************************************************************/

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
		}
	};

	/**
	 * Event: Player.SETUP_VIEW_COMPLETE
	 */
	p.eventViewSetupComplete = function (event) {
		if (this.displaySubtitles)
			this.showSubtitleButtonState(true);
		else
			this.showSubtitleButtonState(false);
	};

	/**
	 * Event: Player.EVENT_END_STREAM
	 */
	p.eventLoadStream = function (event) {
		var mc = this._player.model.mediaCollection;
		if ( !mc.hasAlternativeMediaArrayByType(AddonLiveUntertitel.TYPE_ALTERNATIVE_MC) )
		{
			if ( this.subtitle )
			{
				this.subtitle.off().remove();
				this.subtitle = null;
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

		function generateSubtitel(vc, target, classes) {
			if (mc.hasAlternativeMediaArrayByType(AddonLiveUntertitel.TYPE_ALTERNATIVE_MC)) {

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

				that.subtitle = vc.generateButton(AddonLiveUntertitel.CLASS_SUBTITEL, btnContainer, vc, target, classes)
					.attr({
						"title": "Untertitel ein-/ausblenden [(STRG +) U]",
						"role": "menuitem",
						"aria-pressed": false,
						"tabindex": "0"
					})
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
		}

		if (mc.getType() === ns.MediaCollection.TYPE_VIDEO) {
			this.displaySubtitles = this._player.model.playerConfig.getShowSubtitelAtStart();

			var g = ns.GlobalModel.getInstance();
			if (g.hasSubtitlePreference()) {
				this.displaySubtitles = g.getSubtitleEnabled();
			}

			g.setSubtitleEnabled(this.displaySubtitles);

			if ( mc.hasAlternativeMediaArrayByType(AddonLiveUntertitel.TYPE_ALTERNATIVE_MC) )
			{
				mc.setUseAlternativeMediaArrayType(this.displaySubtitles ? AddonLiveUntertitel.TYPE_ALTERNATIVE_MC : false);
				generateSubtitel(vc);
			}

		}
	};

	p.hideSubtitles = function () {
		this._playMediaArray(false);
	};

	p.showSubtitles = function () {
		this._playMediaArray(AddonLiveUntertitel.TYPE_ALTERNATIVE_MC);
	};

	p._playMediaArray = function (type) {
		var mc = this._player.model.mediaCollection;
		mc.setUseAlternativeMediaArrayType(type);

		var pc = this._player.model.playerConfig;
		pc.setAutoPlay(true);

		this._player.viewCtrl.restoreDefaults();
		this._player.viewCtrl.updateOptionButtonVisibility();
		this._player.getCtrl().representationChanged();
	};

	p.showSubtitleButtonState = function (isVisible) {
		this.displaySubtitles = isVisible;

		if (this.subtitle) {
			switch (isVisible) {
				case true:
					this.subtitle.addClass(AddonLiveUntertitel.CLASS_SUBTITLE_SELECTED);
					break;
				case false:
					this.subtitle.removeClass(AddonLiveUntertitel.CLASS_SUBTITLE_SELECTED);
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
			value.dispatchCustomEvent(displaySubtitles ? AddonLiveUntertitel.EVENT_SHOW_SUBTITLES : AddonLiveUntertitel.EVENT_HIDE_SUBTITLES);
		});

		this.showSubtitleButtonState(this.displaySubtitles);

		if (this.displaySubtitles) {
			this.showSubtitles();
		} else {
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


	ns.AddonLiveUntertitel = AddonLiveUntertitel;

}(ardplayer, ardplayer.jq, ardplayer.console));
