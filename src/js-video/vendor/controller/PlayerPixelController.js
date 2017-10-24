/**
 * Created by netTrek GmbH & Co. KG
 * User: netTrek - Kadir Uludag
 * @module controller
 **/

(function (ns, $, console) {
	//"use strict";

	var PlayerPixelController = function (player) {
		this.player = player;
		this.loadedJSONConfiguration = false;

		this.initialize();
	};

	var p = PlayerPixelController.prototype;

	/**
	 * Initialization method.
	 * @method initialize
	 * @protected
	 **/
	p.initialize = function () {

		this.playButtonClickedCounter = 0;
		this.previousCalledPixel = "";
		this.pixelMapping = {};

		/**
		 * Gibt an, ob der Player bereits abgespielt wurde.
		 * @type {boolean}
		 * @private
		 */
		this._isInitialPlay = true;

        /**
         * Gibt an, ob ein Clip bis zum Ende abgespielt wurde
         * @type {boolean}
         * @private
         */
        this._isReplay = false;

		/**
		 * Gibt an, ob seit der Initialisierung die Qualität gewechselt wurde.
		 * @type {boolean}
		 * @private
		 */
		this._isQualityChanged = false;

		/**
		 * Gibt an, ob seit der Initialisierung das Plugin gewechselt wurde.
		 * @type {boolean}
		 * @private
		 */
		this._isPluginChanged = false;

		/*
		#5342

		// Fehlermeldungen werden nur einmalig geladen
		if (this.loadedJSONConfiguration) {
			return;
		}

		var that = this;

		var path = "";
		if (this.player && this.player.model && this.player.model.playerConfig) {
			path = this.player.model.playerConfig.getPixelConfig();
		}

		if (path != "") {
			$.ajax({
				type: "GET",
				async: false,
				url: path,
				dataType: "text",
				encoding: "UTF-8",
				success: Delegate.create(that, that.loadPixelConfigSuccess)
			});
		}
		*/
	};

	/**
	 * liest aus erfolgreich geladenem JSON alle Meldungen aus setzt sie in die Klasse/überschreibt sie ggf.
	 * @method getInstanceByPlayerID
	 * @public
	 * @static
	 * @param data
	 */
	p.loadPixelConfigSuccess = function (data) {

		try {
			this.pixelMapping = eval(data);

			// Alle Funktions-Keys in Kleinbuchstaben umwandeln, um Tippfehlern in der JSON vorzubeugen.
			var tmpFnc;
			for (var curKey in this.pixelMapping )
			{
				tmpFnc = this.pixelMapping[curKey];
				this.pixelMapping[ curKey ] = undefined;
				delete this.pixelMapping[ curKey ];

				this.pixelMapping[ curKey.toLowerCase() ] = tmpFnc;
				tmpFnc = null;
			}

		} catch (error) {
			//console.error("Fehler beim Verarbeiten der Pixel-Informationen: " + error);
		}

		this.loadedJSONConfiguration = true;
		data = null;
	};

	/**
	 * Don´t call the triggerEvent-method.
	 * This will be called from the loadStream-, triggerTrackingPixelPlay-, triggerTrackingPixelReplay- and triggerCustomPixel-method.
	 * The reason is to write as little as possible, when calling a trackingPixel.
	 * @method triggerEvent
	 **/
	p.triggerEvent = function (ctrl, type, data) {
		data = data || {};
		data.type = type;

		var event = $.extend($.Event(type), data);
		$(ctrl.player).trigger(event);

		try {
			var fnc = this.pixelMapping[ type.toLowerCase() ];
			if (fnc) {
				fnc(data);
			}
		} catch (error) {
		}
	};

 	/**
	 * Call this method, when a specific stream will be loaded
	 * @method loadStream
	 **/
	p.loadStream = function (streamurl) {
		var isQualityChanged = this._isQualityChanged;
		var isPluginChanged = this._isPluginChanged;

		this.triggerEvent(
			this,
			PlayerPixelController.STREAM_LOAD,
			{
				streamurl: 			streamurl,
				isQualityChanged: 	isQualityChanged,
				isPluginChanged: 	isPluginChanged
			}
		);

		this._isQualityChanged = false;
		this._isPluginChanged = false;
	};

	p.initialPlayTrigger = function () {
		if ( this._isInitialPlay )
		{
			this._isInitialPlay = false;
			this.triggerCustomPixel (PlayerPixelController.SUPER_INITIAL_PLAY);
		}
	};

	p.triggerQualityChanged = function (eventName) {
		this._isQualityChanged = true;
		this.triggerCustomPixel (eventName);
		this.triggerCustomPixel(PlayerPixelController.SUPER_QUALITY_CHANGE);
	};

	p.triggerPluginChanged = function (eventName) {
		this._isPluginChanged = true;
		this.triggerCustomPixel (eventName);
		this.triggerCustomPixel (PlayerPixelController.SUPER_PLUGIN_CHANGE);
	};

	p.triggerTrackingPixelPlay = function (pixelName) {
		if (this.playButtonClickedCounter == 0) {
			this.triggerEvent(this, pixelName);
			this.playButtonClickedCounter++;
		}
	};

	p.dispose = function () {
	};

	p.triggerCustomPixel = function (pixelName, suppressSecondCall, data) {
		if (suppressSecondCall === true && pixelName === this.previousCalledPixel)
			return;
		this.triggerEvent(this, pixelName, data);
		//
		this.previousCalledPixel = pixelName;
	};

	/* Maus-Pixel */
	PlayerPixelController.IA_MOUSE_SUBTITLE_ACTIVATION = "ia_mouse_subtitle_activation"; // Mouse-Click
	PlayerPixelController.IA_MOUSE_SUBTITLE_DEACTIVATION = "ia_mouse_subtitle_deactivation"; // Mouse-Click
	PlayerPixelController.IA_MOUSE_VOLUME_MUTE = "ia_mouse_volume_mute"; // Mouse-Click
	PlayerPixelController.IA_MOUSE_VOLUME_UNMUTE = "ia_mouse_volume_unmute"; // Mouse-Click
	PlayerPixelController.IA_MOUSE_VOLUME_CHANGE = "ia_mouse_volume_change"; // Mouse-Click
	PlayerPixelController.IA_MOUSE_SCRUBBAR_CHANGE_POSITION_FORWARD = "ia_mouse_scrubbar_change_position_forward"; // Mouse-Move
	PlayerPixelController.IA_MOUSE_SCRUBBAR_CHANGE_POSITION_REWIND = "ia_mouse_scrubbar_change_position_rewind"; // Mouse-Move
	PlayerPixelController.IA_MOUSE_SCRUBBAR_CHANGE_POSITION_REWIND_TIMESHIFT = "ia_mouse_scrubbar_change_position_rewind_timeshift"; // Mouse-Move
	PlayerPixelController.IA_MOUSE_VIEW_COLOR_SETTINGS = "ia_mouse_view_color_settings"; // Mouse-Click
	PlayerPixelController.IA_MOUSE_FULLSCREEN_ACTIVATION_BUTTON = "ia_mouse_fullscreen_activation_button"; // Mouse-Click
	PlayerPixelController.IA_MOUSE_FULLSCREEN_ACTIVATION_VIEWPORT = "ia_mouse_fullscreen_activation_viewport"; // Double Mouse-Click on Viewport
	PlayerPixelController.IA_MOUSE_FULLSCREEN_DEACTIVATION_BUTTON = "ia_mouse_fullscreen_deactivation_button"; // Mouse-Click
	PlayerPixelController.IA_MOUSE_FULLSCREEN_DEACTIVATION_VIEWPORT = "ia_mouse_fullscreen_deactivation_viewport"; // Double Mouse-Click on Viewport
	PlayerPixelController.IA_MOUSE_PLAY_BUTTON = "ia_mouse_play_button"; // Mouse-Click
	PlayerPixelController.IA_MOUSE_PLAY_VIEWPORT = "ia_mouse_play_viewport"; // Mouse-Click
	PlayerPixelController.IA_MOUSE_PAUSE_BUTTON = "ia_mouse_pause_button"; // Mouse-Click
	PlayerPixelController.IA_MOUSE_PAUSE_VIEWPORT = "ia_mouse_pause_viewport"; // Mouse-Click
	PlayerPixelController.IA_MOUSE_PLAY_AGAIN_BUTTON = "ia_mouse_play_again_button"; // Mouse-Click
	PlayerPixelController.IA_MOUSE_PLAY_AGAIN_VIEWPORT = "ia_mouse_play_again_viewport"; // Mouse-Click
	PlayerPixelController.IA_MOUSE_PLUGIN_CHANGE = "ia_mouse_plugin_change"; // Mouse-Click
	PlayerPixelController.IA_MOUSE_PODCAST = "ia_mouse_podcast"; // Mouse-Click
	PlayerPixelController.IA_MOUSE_DOWNLOAD = "ia_mouse_download"; // Mouse-Click
	PlayerPixelController.IA_MOUSE_BACK_TO_LIVE = "ia_mouse_back_to_live"; // Mouse-Click (only when player is dvr)
	PlayerPixelController.IA_MOUSE_QUALITY_CHANGE = "ia_mouse_quality_change"; //
	PlayerPixelController.IA_MOUSE_SKIP_PREROLL = "ia_mouse_skip_preroll"; //

	/* Tastatur-Pixel */
	PlayerPixelController.IA_KEY_SUBTITLE_ACTIVATION = "ia_key_subtitle_activation"; // Key U
	PlayerPixelController.IA_KEY_SUBTITLE_DEACTIVATION = "ia_key_subtitle_deactivation"; // Key U
	PlayerPixelController.IA_KEY_VOLUME_MUTE = "ia_key_volume_mute"; // Key M
	PlayerPixelController.IA_KEY_VOLUME_UNMUTE = "ia_key_volume_unmute"; // Key M
	PlayerPixelController.IA_KEY_VOLUME_CHANGE = "ia_key_volume_change"; // Key Arrow Up and Down
	PlayerPixelController.IA_KEY_SCRUBBAR_CHANGE_POSITION_FORWARD = "ia_key_scrubbar_change_position_forward"; // Key Arrow Right
	PlayerPixelController.IA_KEY_SCRUBBAR_CHANGE_POSITION_REWIND = "ia_key_scrubbar_change_position_rewind"; // Key Arrow Left
	PlayerPixelController.IA_KEY_SCRUBBAR_CHANGE_POSITION_REWIND_TIMESHIFT = "ia_key_scrubbar_change_position_rewind_timeshift"; // Key Arrow Left
	PlayerPixelController.IA_KEY_PLAY = "ia_key_play"; // Key Space
	PlayerPixelController.IA_KEY_PAUSE = "ia_key_pause"; // Key Space
	PlayerPixelController.IA_KEY_PLAY_AGAIN = "ia_key_play_again"; // Key Space
	PlayerPixelController.IA_KEY_QUALITY_CHANGE = "ia_key_quality_change"; //

	/* Status-Pixel */
	PlayerPixelController.STREAM_LOAD = "stream_load";
	PlayerPixelController.INTERACTION_INITIAL_PLAY = "interaction_initial_play";
	PlayerPixelController.CLIP_ENDED = "clip_ended"; // clip finished (play-again-button appears)
	PlayerPixelController.CLIP_ERROR = "clip_error"; // clip cannot loaded
	PlayerPixelController.STREAM_ERROR = "Stream_error"; // stream cannot be played
	PlayerPixelController.PLAYER_LOADING = "player_loading"; //
	PlayerPixelController.PLAYER_UNLOAD = "player_unloading"; //

	/* Super-Pixel */
	PlayerPixelController.SUPER_SUBTITLE_ACTIVATION = "super_subtitle_activation"; //
	PlayerPixelController.SUPER_SUBTITLE_DEACTIVATION = "super_subtitle_deactivation"; //
	PlayerPixelController.SUPER_VOLUME_MUTE = "super_volume_mute"; //
	PlayerPixelController.SUPER_VOLUME_UNMUTE = "super_volume_unmute"; //
	PlayerPixelController.SUPER_VOLUME_CHANGE = "super_volume_change"; //
	PlayerPixelController.SUPER_SCRUBBAR_CHANGE_POSITION_FORWARD = "super_scrubbar_change_position_forward"; //
	PlayerPixelController.SUPER_SCRUBBAR_CHANGE_POSITION_REWIND = "super_scrubbar_change_position_rewind"; //
	PlayerPixelController.SUPER_FULLSCREEN_ACTIVATION = "super_fullscreen_activation"; //
	PlayerPixelController.SUPER_FULLSCREEN_DEACTIVATION = "super_fullscreen_deactivation"; //
	PlayerPixelController.SUPER_PLAY = "super_play"; //
	PlayerPixelController.SUPER_PAUSE = "super_pause"; //
	PlayerPixelController.SUPER_REPLAY = "super_replay"; //
	PlayerPixelController.SUPER_INITIAL_PLAY = "super_initial_play"; //
	PlayerPixelController.SUPER_QUALITY_CHANGE = "super_quality_change"; //
	PlayerPixelController.SUPER_PLUGIN_CHANGE = "super_plugin_change"; //
	PlayerPixelController.SUPER_BACK_TO_LIVE = "super_back_to_live"; //
	PlayerPixelController.SUPER_DVR_ACTIVE = "super_dvr_active"; //
	PlayerPixelController.SUPER_PLAYHEAD_POSITION = "super_playhead_position"; //

	ns.PlayerPixelController = PlayerPixelController;

})(ardplayer, ardplayer.jq, ardplayer.console);


