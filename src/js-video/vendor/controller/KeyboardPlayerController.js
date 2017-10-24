/**
 * Created by netTrek GmbH & Co. KG
 * User: netTrek - Kadir Uludag
 * @module controller
 **/

(function (ns, $, console) {
	"use strict";

	var KeyboardPlayerController = function () {
		if (KeyboardPlayerController.instance) {
			return KeyboardPlayerController.instance;
		}
		KeyboardPlayerController.instance = this;

		this.initialize();
	};

	/**
	 * Singletonfactory für eine Playerinstanz
	 * @method getInstance
	 * @public
	 * @static
	 * @return KeyboardPlayerController
	 */
	KeyboardPlayerController.getInstance = function () {
		return new KeyboardPlayerController();
	};

	/**
	 * Löscht die Parameter die zum Erstellen eines Singeltons genutzt werden
	 * @method resetSingleton
	 * @public
	 * @param void
	 * @return void
	 * */
	KeyboardPlayerController.resetSingleton = function () {
		KeyboardPlayerController.instance = undefined;
	};
	var p = KeyboardPlayerController.prototype;

	/**
	 * Initialization method.
	 * @method initialize
	 * @protected
	 **/
	p.initialize = function () {
		this.lastPlayingPlayer = undefined;
		this.initListeners();
	};

	p.initListeners = function () {
		var that = this;
		$("body").on("activeplay", function (event, data) {
				event.preventDefault();
				that.lastPlayingPlayer = event.player;
				that.attachNativeListeners();
			}
		);
        /* Shortcuts für den Betrieb mit Screen-Readern */
		shortcut.add("Ctrl+Space", ns.Delegate.create(this, this.handleKeySpace), { 'type': 'keydown', 'propagate': false, 'disable_in_input': true, 'target': window });
		shortcut.add("Ctrl+,", ns.Delegate.create(this, this.handleKeyLeft), { 'type': 'keydown', 'propagate': false, 'disable_in_input': true, 'target': window });
		shortcut.add("Ctrl+.", ns.Delegate.create(this, this.handleKeyRight), { 'type': 'keydown', 'propagate': false, 'disable_in_input': true, 'target': window });
		shortcut.add("Ctrl+B", ns.Delegate.create(this, this.handleKeyUp), { 'type': 'keydown', 'propagate': false, 'disable_in_input': true, 'target': window });
		shortcut.add("Ctrl+V", ns.Delegate.create(this, this.handleKeyDown), { 'type': 'keydown', 'propagate': false, 'disable_in_input': true, 'target': window });
		shortcut.add("Ctrl+K", ns.Delegate.create(this, this.handleBackToLive), { 'type': 'keydown', 'propagate': false, 'disable_in_input': true, 'target': window });
		shortcut.add("Ctrl+E", ns.Delegate.create(this, this.handleReplay), { 'type': 'keydown', 'propagate': false, 'disable_in_input': true, 'target': window });
		shortcut.add("Ctrl+M", ns.Delegate.create(this, this.handleMute), { 'type': 'keydown', 'propagate': false, 'disable_in_input': true, 'target': window });
		shortcut.add("Ctrl+U", ns.Delegate.create(this, this.handleSubtitle), { 'type': 'keydown', 'propagate': false, 'disable_in_input': true, 'target': window });

		// Vollbildmodus im Div-Konstrukt verlassen (#5779)
		shortcut.add("ESC", ns.Delegate.create(this, this.handleExitFullscreen), { 'type': 'keydown', 'propagate': false, 'disable_in_input': true, 'target': window });
	};

	p.attachNativeListeners = function () {
		if (this._isNativeAttached)
			return;
		this._isNativeAttached = true;

         /* Standard-shortcuts */
		shortcut.add("Space", ns.Delegate.create(this, this.handleKeySpace), { 'type': 'keydown', 'propagate': false, 'disable_in_input': true, 'target': window });
		shortcut.add("Left", ns.Delegate.create(this, this.handleKeyLeft), { 'type': 'keydown', 'propagate': false, 'disable_in_input': true, 'target': window });
		shortcut.add("Right", ns.Delegate.create(this, this.handleKeyRight), { 'type': 'keydown', 'propagate': false, 'disable_in_input': true, 'target': window });
		shortcut.add("Up", ns.Delegate.create(this, this.handleKeyUp), { 'type': 'keydown', 'propagate': false, 'disable_in_input': true, 'target': window });
		shortcut.add("Down", ns.Delegate.create(this, this.handleKeyDown), { 'type': 'keydown', 'propagate': false, 'disable_in_input': true, 'target': window });
		shortcut.add("K", ns.Delegate.create(this, this.handleBackToLive), { 'type': 'keydown', 'propagate': false, 'disable_in_input': true, 'target': window });
		shortcut.add("E", ns.Delegate.create(this, this.handleReplay), { 'type': 'keydown', 'propagate': false, 'disable_in_input': true, 'target': window });
		shortcut.add("M", ns.Delegate.create(this, this.handleMute), { 'type': 'keydown', 'propagate': false, 'disable_in_input': true, 'target': window });
		shortcut.add("U", ns.Delegate.create(this, this.handleSubtitle), { 'type': 'keydown', 'propagate': false, 'disable_in_input': true, 'target': window });
		shortcut.add("1", ns.Delegate.create(this, this.handleQuality1), { 'type': 'keydown', 'propagate': false, 'disable_in_input': true, 'target': window });
		shortcut.add("2", ns.Delegate.create(this, this.handleQuality2), { 'type': 'keydown', 'propagate': false, 'disable_in_input': true, 'target': window });
		shortcut.add("3", ns.Delegate.create(this, this.handleQuality3), { 'type': 'keydown', 'propagate': false, 'disable_in_input': true, 'target': window });
		shortcut.add("4", ns.Delegate.create(this, this.handleQuality4), { 'type': 'keydown', 'propagate': false, 'disable_in_input': true, 'target': window });

        // Version des Player anzeigen (#10822)
        shortcut.add("V", ns.Delegate.create(this, this.handleVersion), { 'type': 'keydown', 'propagate': false, 'disable_in_input': true, 'target': window });

    };

    p.handleKeyByString = function (keyString) {

        keyString = (keyString||"").toLowerCase();

        switch ( keyString )
        {
            case "esc":
            case "escape":
                this.handleExitFullscreen();
                break;

            case "space":
                this.handleKeySpace();
                break;

            case "left":
                this.handleKeyLeft();
                break;

            case "right":
                this.handleKeyRight();
                break;

            case "up":
                this.handleKeyUp();
                break;

            case "down":
                this.handleKeyDown();
                break;

            case "k":
                this.handleBackToLive();
                break;

            case "e":
                this.handleReplay();
                break;

            case "m":
                this.handleMute();
                break;

            case "u":
                this.handleSubtitle();
                break;

			case "v":
				this.handleVersion();
				break;

			case "1":
                this.handleQuality1();
                break;

            case "2":
                this.handleQuality2();
                break;

            case "3":
                this.handleQuality3();
                break;

            case "4":
                this.handleQuality4();
                break;

            default:
                break;
        }

    };

	p.bindAutoplay = function () {

		if ( this._boundAutoplay )
			return;
		this._boundAutoplay = true;

		var interactionHandler = function (event) {

			if ( event && event.keyCode == 13 )
			{
				if ( this.lastPlayingPlayer && this.lastPlayingPlayer.getCtrl().isPlaying() )
				{
					this.lastPlayingPlayer.getCtrl().pause();

					// Fade-in UI Delay
					setTimeout( function () {
						this.lastPlayingPlayer.viewCtrl.playPause.focus();
					}.bind(this),500);
				}
			}

			$(window).off("click", interactionHandler);
			$(window).off("keydown", interactionHandler);

		}.bind(this);

		$(window).on("click", interactionHandler);
		$(window).on("keydown", interactionHandler);
	};

    p.handleExitFullscreen = function () {
        if (this.lastPlayingPlayer === undefined)
            return;
        this.lastPlayingPlayer.viewCtrl.handleLeaveFullscreenEmulation();
    };

	p.handleQuality1 = function () {
		if (this.lastPlayingPlayer === undefined)
			return;
		this.lastPlayingPlayer.viewCtrl.setQualityByQualValue(ns.MediaCollection.DEFAULT_STREAM_QUALITY_S);
		this.lastPlayingPlayer.pixelController.triggerQualityChanged(ns.PlayerPixelController.IA_KEY_QUALITY_CHANGE);
	};

	p.handleQuality2 = function () {
		if (this.lastPlayingPlayer === undefined)
			return;
		this.lastPlayingPlayer.viewCtrl.setQualityByQualValue(ns.MediaCollection.DEFAULT_STREAM_QUALITY_M);
		this.lastPlayingPlayer.pixelController.triggerQualityChanged(ns.PlayerPixelController.IA_KEY_QUALITY_CHANGE);
	};

	p.handleQuality3 = function () {
		if (this.lastPlayingPlayer === undefined)
			return;
		this.lastPlayingPlayer.viewCtrl.setQualityByQualValue(ns.MediaCollection.DEFAULT_STREAM_QUALITY_L);
		this.lastPlayingPlayer.pixelController.triggerQualityChanged(ns.PlayerPixelController.IA_KEY_QUALITY_CHANGE);
	};

	p.handleQuality4 = function () {
		if (this.lastPlayingPlayer === undefined)
			return;
		this.lastPlayingPlayer.viewCtrl.setQualityByQualValue(ns.MediaCollection.DEFAULT_STREAM_QUALITY_XL);
		this.lastPlayingPlayer.pixelController.triggerQualityChanged(ns.PlayerPixelController.IA_KEY_QUALITY_CHANGE);
	};

	p.handleSubtitle = function () {
		if (this.lastPlayingPlayer === undefined)
			return;

		// Plugin hook
		this.lastPlayingPlayer.dispatchCustomEvent(ns.Player.EVENT_KEYBOARD_RELEASE, {shortcut: "u"});
	};

	p.handleVersion = function() {
		if (this.lastPlayingPlayer === undefined)
			return;

		var lastPlayingPlayer = document.getElementById(this.lastPlayingPlayer._id);

		var versionLabel = lastPlayingPlayer.getElementsByClassName("ardplayer-versionlabel")[0];
		$(versionLabel).toggleClass("hidden");
	};

	p.handleMute = function () {
		if (this.lastPlayingPlayer === undefined)
			return;

		if (ns.GlobalModel.getInstance().getMuted() === true) {
			this.lastPlayingPlayer.pixelController.triggerCustomPixel(ns.PlayerPixelController.IA_KEY_VOLUME_UNMUTE);
			this.lastPlayingPlayer.pixelController.triggerCustomPixel(ns.PlayerPixelController.SUPER_VOLUME_UNMUTE);
		}
		else {
			this.lastPlayingPlayer.pixelController.triggerCustomPixel(ns.PlayerPixelController.IA_KEY_VOLUME_MUTE);
			this.lastPlayingPlayer.pixelController.triggerCustomPixel(ns.PlayerPixelController.SUPER_VOLUME_MUTE);
		}

		this.lastPlayingPlayer.getCtrl().toggleMuteState();
	};

	p.handleReplay = function () {
		if (this.lastPlayingPlayer === undefined)
			return;

		var playerIsPlaying = this.lastPlayingPlayer.getCtrl().isPlaying(),
			isAtEnd = this.lastPlayingPlayer.getCtrl().isAtEnd;
		if (isAtEnd == true && playerIsPlaying == false) {
			this.lastPlayingPlayer.getCtrl().play();
		}
	};

	p.handleBackToLive = function () {
		if (this.lastPlayingPlayer === undefined)
			return;

		var isFlashCtrl = this.lastPlayingPlayer.isFlashCtrl(),
			dvrBtn = this.lastPlayingPlayer.viewCtrl.dvrBacktoLiveButton,
			dvrIsLive = this.lastPlayingPlayer.getCtrl()._dvrIsLive;

		if (isFlashCtrl && dvrBtn && !dvrBtn.isHiddenByClass() && !dvrIsLive) {
			this.lastPlayingPlayer.pixelController.triggerCustomPixel(ns.PlayerPixelController.IA_MOUSE_BACK_TO_LIVE);
			this.lastPlayingPlayer.pixelController.triggerCustomPixel(ns.PlayerPixelController.SUPER_BACK_TO_LIVE);

			this.lastPlayingPlayer.viewCtrl.player
				.seekTo(this.lastPlayingPlayer.viewCtrl._lastDuration);
		}
	};

	p.handleKeySpace = function () {
		if (this.lastPlayingPlayer === undefined)
			return;

		if (this.lastPlayingPlayer.getCtrl().loadStreamInitialized) {

			this.lastPlayingPlayer.resume();

			if (this.lastPlayingPlayer.getCtrl().isPlaying() === true) {
				//the sending of an PAUSE-Tracking-Pixel is correct, because at this position, the isPlaying-flag has not been changed
				this.lastPlayingPlayer.pixelController.triggerCustomPixel(ns.PlayerPixelController.IA_KEY_PAUSE);
				this.lastPlayingPlayer.pixelController.triggerCustomPixel(ns.PlayerPixelController.SUPER_PAUSE, true);
			}
			else if (this.lastPlayingPlayer.getCtrl().isPlaying() === false) {
				if (this.lastPlayingPlayer.getCtrl().isAtEnd == false) {
					this.lastPlayingPlayer.pixelController.triggerCustomPixel(ns.PlayerPixelController.IA_KEY_PLAY);
					this.lastPlayingPlayer.pixelController.triggerCustomPixel(ns.PlayerPixelController.SUPER_PLAY);
				}
				else {
					this.lastPlayingPlayer.pixelController.triggerCustomPixel(ns.PlayerPixelController.IA_KEY_PLAY_AGAIN);
				}
			}
		}
		else {
			this.lastPlayingPlayer.getCtrl().posterframeClickHandler();
		}
	};

	p.handleKeyUp = function () {
		if (this.lastPlayingPlayer === undefined)
			return;

		var currVol = this.lastPlayingPlayer.getCtrl().currentVolumeValue;
		currVol += 0.1;
		if (currVol >= 1)
			currVol = 1;

		this.lastPlayingPlayer.pixelController.triggerCustomPixel(ns.PlayerPixelController.IA_KEY_VOLUME_CHANGE, true, {volume: currVol});
		this.lastPlayingPlayer.pixelController.triggerCustomPixel(ns.PlayerPixelController.SUPER_VOLUME_CHANGE, true, {volume: currVol});

		this.lastPlayingPlayer.getCtrl().setVolume(currVol);
		this.lastPlayingPlayer.viewCtrl.setVolumeSliderCssValue(currVol);
	};

	p.handleKeyDown = function () {
		if (this.lastPlayingPlayer === undefined)
			return;

		var currVol = this.lastPlayingPlayer.getCtrl().currentVolumeValue;
		currVol -= 0.1;
		if (currVol < 0.1)
			currVol = 0;

		this.lastPlayingPlayer.pixelController.triggerCustomPixel(ns.PlayerPixelController.IA_KEY_VOLUME_CHANGE, true, {volume: currVol});
		this.lastPlayingPlayer.pixelController.triggerCustomPixel(ns.PlayerPixelController.SUPER_VOLUME_CHANGE, true, {volume: currVol});

		this.lastPlayingPlayer.getCtrl().setVolume(currVol);
		this.lastPlayingPlayer.viewCtrl.setVolumeSliderCssValue(currVol);
	};

	p.handleKeyLeft = function () {
		if (this.lastPlayingPlayer === undefined)
			return;

		// Calculate dvr timings
		var dvrRelativeFrom = 0,
			dvrRelativeTo = 0,
			previousPos = this.lastPlayingPlayer.getCtrl().getCurrenttime(),
			targetPos = this.lastPlayingPlayer.getCtrl().getCurrenttime() - 10;

		var vc = this.lastPlayingPlayer.viewCtrl;
		if (vc._dvrEnabledAndRequested) {
			dvrRelativeFrom = Math.min(vc._lastDuration - previousPos, vc._lastDuration);
			dvrRelativeTo = Math.min(vc._lastDuration - targetPos, vc._lastDuration);
		}

		var data = {
			seekto: targetPos,
			current: previousPos,
			dvrRelativeFrom: dvrRelativeFrom,
			dvrRelativeTo: dvrRelativeTo
		};

		if (this.lastPlayingPlayer.getCtrl().mc.getIsLive() === false) {
			this.lastPlayingPlayer.pixelController.triggerCustomPixel(ns.PlayerPixelController.IA_KEY_SCRUBBAR_CHANGE_POSITION_REWIND, false, data);
		}
		else {
			this.lastPlayingPlayer.pixelController.triggerCustomPixel(ns.PlayerPixelController.IA_KEY_SCRUBBAR_CHANGE_POSITION_REWIND_TIMESHIFT, false, data);
		}

		this.lastPlayingPlayer.pixelController.triggerCustomPixel(ns.PlayerPixelController.SUPER_SCRUBBAR_CHANGE_POSITION_REWIND, false, data);

		this.lastPlayingPlayer.getCtrl().rewind();
	};

	p.handleKeyRight = function () {
		if (this.lastPlayingPlayer === undefined)
			return;

		// Calculate dvr timings
		var dvrRelativeFrom = 0,
			dvrRelativeTo = 0,
			previousPos = this.lastPlayingPlayer.getCtrl().getCurrenttime(),
			targetPos = this.lastPlayingPlayer.getCtrl().getCurrenttime() + 10;

		var vc = this.lastPlayingPlayer.viewCtrl;
		if (vc._dvrEnabledAndRequested) {
			dvrRelativeFrom = Math.min(vc._lastDuration - previousPos, vc._lastDuration);
			dvrRelativeTo = Math.min(vc._lastDuration - targetPos, vc._lastDuration);
		}

		var data = {
			seekto: targetPos,
			current: previousPos,
			dvrRelativeFrom: dvrRelativeFrom,
			dvrRelativeTo: dvrRelativeTo
		};

		this.lastPlayingPlayer.pixelController.triggerCustomPixel(ns.PlayerPixelController.SUPER_SCRUBBAR_CHANGE_POSITION_FORWARD, false, data);
		this.lastPlayingPlayer.pixelController.triggerCustomPixel(ns.PlayerPixelController.IA_KEY_SCRUBBAR_CHANGE_POSITION_FORWARD, false, data);

		this.lastPlayingPlayer.getCtrl().forward();
	};

	p.removeNativeListeners = function () {
		if (!this._isNativeAttached)
			return;
		this._isNativeAttached = false;

		shortcut.remove("Space");
		shortcut.remove("Left");
		shortcut.remove("Right");
		shortcut.remove("Up");
		shortcut.remove("Down");
		shortcut.remove("E");
		shortcut.remove("K");
		shortcut.remove("M");
		shortcut.remove("U");
		shortcut.remove("V");
		shortcut.remove("1");
		shortcut.remove("2");
		shortcut.remove("3");
		shortcut.remove("4");
	};

	ns.KeyboardPlayerController = KeyboardPlayerController;

})(ardplayer, ardplayer.jq, ardplayer.console);


