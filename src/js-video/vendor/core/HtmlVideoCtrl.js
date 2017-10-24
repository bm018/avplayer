/**
 * Created by netTrek GmbH & Co. KG
 * User: netTrek - Saban Uenlue
 * @module core
 **/

(function (ns, $, console) {
	"use strict";
	/**
	 * Diese Klasse wird als Kontroll-Klasse für das HTML-Video-Objekt genutzt.
	 * @class HtmlVideoCtrl
	 * @constructor
	 * @public
	 * @extends AbstractPlayerCtrl
	 **/
	var HtmlVideoCtrl = function (player, mediaCanvas) {
		this.pluginId = ns.GlobalModel.HTML5;
		this.initialize(player, mediaCanvas);
	};
	var p = HtmlVideoCtrl.prototype = new ns.AbstractPlayerCtrl();
	p.PlayerCtrl_Override_initialize = p.initialize;

	/**
	 * @inheritDoc
	 **/
	p.initialize = function (player, mediaCanvas) {

		player.model.currentPluginID = ns.GlobalModel.HTML5;

		this._isiPad = ns.GlobalModel.getInstance().isIPadDevice;
		this._isIOS = ns.GlobalModel.getInstance().isIOSDevice;
		this._isAndroid =  ns.GlobalModel.getInstance().isAndroidDevice;

		this.__inited = false;
		this.jqPlayer = $(mediaCanvas);
		this.htmlPlayer = this.jqPlayer[0];

		// Defaults für Volume aus Cookie lesen, und der FP-Instanz setzen.
		this.setVolume(this.getVolume());
		this.setMuteState(this.getMuteState());

		this.PlayerCtrl_Override_initialize(player, mediaCanvas);
	};

	p.evalInitialSeek = function () {
		if (this._pendingSeek > 0) {
			var targetSeekTime = this._pendingSeek;
			this._pendingSeek = 0;

			this.setCurrenttime(targetSeekTime);
		}
	};

	p._override_addEventListeners = p.addEventListeners;
	/**
	 * @inheritDoc
	 **/
	p.addEventListeners = function () {
		this._override_addEventListeners();

		var that = this;

		this._playing = false;
		this._stopped = true;
		this._paused = false;
		this._ready = false;
		this._pendingSeek = 0;
		this._duration = 0;
		this.__inited = true;

        this.__dropTimeUpdates = 0;
        this.__lastRoundedTime = -1;
        this.__seeking = false;

		this.__lastTimeUpdate = 0;

		this.__playEventTrigger = 0;

		// hlsjs
		this._dvrModeEnabled = false;
		this._dvrWindow = 0;
		this._dvrIsLive = false;
		this._dvrTime = -1;
		this._dvrRightToLiveOffset = 0;

		this._useAndroidInitialSeekFallback = false;

		this.jqPlayer
			.on('loadstart', function (event) {
				if ( that._isAndroid &&
					(that.htmlPlayer.currentSrc ||"").toLowerCase().indexOf(".m3u8") > 0 )
				{
					that._useAndroidInitialSeekFallback = true;
				}
			})
			.on('canplay', function (event) {
				if (that.htmlPlayer.readyState >= that.htmlPlayer.HAVE_FUTURE_DATA) {
					that.bufferingEventHandler(null, false);
				}
			})
			.on('play', function (event) {
				that._stopped = false;
				that._paused = false;
				that._playing = true;

				that.playEventHandler(event);
				that.bufferingEventHandler(event, false);
			})
			.on('pause', function (event) {
				that._playing = false;
				that._paused = true;

				that.pauseEventHandler(event);
			})
			.on('error', function (event) {

				// Eventuell wartende Play-Event Trigger löschen.
				clearTimeout(that.__playEventTrigger);

                if ( that._hls ) {
                    if (event.type === 'error') {
                        var mediaError = event.currentTarget.error;
                        if (mediaError.code === mediaError.MEDIA_ERR_DECODE) {
                            that.handleHLSMediaError();
                        }
                    }
                } else {
                    that._errorState = true;
                    that.player.errorCtrl.throwStreamError(ns.ErrorController.ERROR_PLAYBACK);
                }

			})
			.on('waiting', function (event) {
				that.bufferingEventHandler(event, that.htmlPlayer.readyState < that.htmlPlayer.HAVE_FUTURE_DATA);
			})
			.on('ended', function (event) {
				that._playing = false;
				that._stopped = true;
				that._paused = false;

				that.htmlPlayer.pause();

				that.endEventHandler(event);

				// Not all browsers will trigger a timeupdate on rewind so we do it here. #9347
				that.onTimeChange(event, {duration:that._duration, time:0});
			})
			.on('timeupdate', function (event) {

				var currentTime = that.htmlPlayer.currentTime;

				if ( that._useAndroidInitialSeekFallback && currentTime > 0.1 )
					that.evalInitialSeek();

				// Throttle time update to 1s
				var now = new Date().getTime();
				if ( now - that.__lastTimeUpdate < 500 && that.__lastTimeUpdate != 0)
					return;
				that.__lastTimeUpdate = now;

                if ( that.__dropTimeUpdates > 0 || that.__seeking )
                {
                    that.__dropTimeUpdates--;

					if ( that.__dropTimeUpdates <= 0 )
					{
						// Reset
						that.__dropTimeUpdates = 0;
						that.__seeking = false;
					}

					return;
                }

				var data = {};
				data.duration = that._duration;
				data.time = currentTime;

				var roundedTime = Math.round(currentTime);
                if ( Math.round(currentTime) == that.__lastRoundedTime )
                    return;
                that.__lastRoundedTime = roundedTime;

				if ( !that._dvrModeEnabled )
					that.onTimeChange(event, data);
				else
				{

					if ( that._dvrWindow ){
						data.duration = that.getDuration();
						data.time = that._dvrTime >= 0 ? that._dvrTime : that.getDuration();
						that.onTimeChange(event, data)
					}

				}
			})
			.on('seeking', function (event) {
                // 7089 - drop followup time updates
                that.__seeking = true;

                that.bufferingEventHandler(null, true);
            })
			.on('seeked', function (event) {
				// 7089 - drop followup time updates
                that.__seeking = false;
                that.__dropTimeUpdates = 1;

                that.bufferingEventHandler(null, false);

                if ( !that._playing )
                    that.startDVRTicker();

				that.updateDVRValues();
            })
			.on('loadedmetadata', function (event) {
				that._ready = true;
			})
			.on('durationchange', function (event) {
				that._duration = that.htmlPlayer.duration;
				that._ready = true;

				if ( !that._useAndroidInitialSeekFallback && !that._hls)
					that.evalInitialSeek();

				if ( that._hls ) {

                    var newDvrRight = that.htmlPlayer.duration - that._dvrRightToLiveOffset;
                    var newDvrLeft  = newDvrRight - that._dvrWindow;

                    /*
                    if ( !isNaN(that._dvrWindowLeft) && !isNaN(newDvrLeft) )
                        console.log("New dvr window, offset", (that._dvrWindowLeft-newDvrLeft));
					*/

                    that._dvrWindowRight = newDvrRight;
                    that._dvrWindowLeft = newDvrLeft;

				}

			})
			.on('progress waiting stalled suspend', function (event, data) {
				var bufferRange = that.getBufferedRange();
				var position = that.getCurrenttime();
				var duration = that.getDuration();

				var curRange = null;

				for (var i = 0; i < bufferRange.length; i++) {
					curRange = bufferRange[i];
					if (position >= curRange.start && position <= curRange.end)
						break;
				}

				// Noch nicht aussreichend Daten im Speicher, um eine Range zu ermitteln.
				if (curRange == null) {
					return;
				}

                if ( event.type == "waiting" && (that.__dropTimeUpdates > 0 || that.__seeking) )
                    return;

				var percentLoaded = Math.round(curRange.end / duration * 100);
				that.progressEventHandler(event, percentLoaded);
			});
	};

	p._override_removeEventListeners = p.removeEventListeners;
	/**
	 * @inheritDoc
	 **/
	p.removeEventListeners = function () {
		this.jqPlayer
			.off('canplay play pause waiting ended timeupdate durationchange progress waiting stalled suspend');
	};

	p.getBufferedRange = function () {
		var ranges = [];

		var htag = this.htmlPlayer;

		if (htag.buffered.length) {
			for (var i = 0; i < htag.buffered.length; i++) {
				var rangeObj = {};
				rangeObj.start = Math.round(htag.buffered.start(i));
				rangeObj.end = Math.round(htag.buffered.end(i));
				ranges.push(rangeObj);
			}
		}
		return ranges;
	};

	/**
	 * Diese Methode wird getriggerd, wenn ein onTimeChange gefeuert wird.
	 * Es wird in der Funktion dann die updateDuration- und die updateTime-Methode aufgerufen.
	 * @method onTimeChange
	 * @public
	 * @param event. Event das getrigged werden soll.
	 * @param data. Number. Wert des aktuellen Fortschritts.
	 *
	 */
	p.onTimeChange = function (event, data) {
		this.updateDuration(data.duration);
		this.updateTime(data.time);
	};

	p._override_playeventHandler = p.playEventHandler;
	p.playEventHandler = function (event) {
		// Die Weitergabe des Play-Eventhandlers wird um 500ms verzögert, um auf eventuell auftretende
		// Fehler reagieren zu können. #9677
		// In diesem Fall darf das Play-Event nicht aufgerufen werden.

		clearTimeout(this.__playEventTrigger);
		this.__playEventTrigger = setTimeout(
			function () {
				this._override_playeventHandler(event);
			}.bind(this),
			500
		);
	};

	p._override_endEventHandler = p.endEventHandler;
	/**
	 * @inheritDoc
	 **/
	p.endEventHandler = function (event) {

		var showPoster = false;

		// #6061
		if ( !this.player.isPlaylistPlayer() )
		{
        	this.jumpToStart();
		} else
		{
			showPoster = ns.GlobalModel.getInstance().isIOSDevice &&
					!this.player._playlistController._hasNext();
		}

		this._override_endEventHandler(event);

		if ( showPoster )
			this.vc.bindPosterframe();
	};

	p._override_dispose = p.dispose;
	/**
	 * @inheritDoc
	 **/
	p.dispose = function () {

		// Eventuell wartende Play-Event Trigger löschen.
		clearTimeout(this.__playEventTrigger);

		if (this._hls)
		{
			this._hls.destroy();
			this._hls = null;
		}

		this._override_dispose.apply(this, arguments);
	};

	p._override_handelAutoplay = p.handelAutoplay;
	/**
	 * @inheritDoc
	 **/
	p.handelAutoplay = function (autoplay) {
		if (this.pc && this.pc.getAutoPlayBoolean() == false)
			this.vc.showBufferingIndicator();

		this._override_handelAutoplay.apply(this, arguments);
	};

	p._override_initAutoPlayStream = p.initAutoPlayStream;
	/**
	 * @inheritDoc
	 **/
	p.initAutoPlayStream = function () {
		this._override_initAutoPlayStream.apply(this, arguments);
	};

	p.onSourceError = function (failedSource) {

        this.stopDVRTicker();

		// Eventuell wartende Play-Event Trigger löschen.
		clearTimeout(this.__playEventTrigger);

		if (!this._failedStreams)
			this._failedStreams = 1;
		else
			this._failedStreams++;

		//console.log(" Failed " + this._failedStreams + " / " + this._totalStreams );

		if (this._failedStreams == this._totalStreams)
		    this.handleError();
	};

	p._override_loadStream = p.loadStream;
	/**
	 * @inheritDoc
	 **/
	p.loadStream = function () {

		this._failedStreams = 0;
		this._override_loadStream();

		this._ready = false; // Reset ready state on 2nd load
		this.__seeking = false;
		this.__lastTimeUpdate = 0;

		var streamURL;
		if (arguments && arguments [0] && typeof arguments [0] === "string")
			streamURL = arguments [0];
		else
		{
			var streamObject = this.getPlayingStreamObject();

			if ( !streamObject )
				return;

			streamURL = streamObject.getStream();
		}

		var beginOffset = this.pc.getInitialPlayhead();
		if (beginOffset <= 0) {
			beginOffset = this.pc.getStartTime();

			if (beginOffset <= 0) {
				beginOffset = this.mc.getStartTime();
			}
		}
		this._pendingSeek = beginOffset;

		if (this._lastStreamUrl == streamURL)
		{
			if ( this._errorState )
			{
				// rethrow error
                this.handleError();
			}

			return; // do not load twice
		}

		this._lastStreamUrl = streamURL;
		this._errorState = false;

		// Alte Quellen entfernen  #2148
		this.jqPlayer.empty();

		var that = this;

		var addStreams;
		if (streamURL instanceof Array) {
			addStreams = streamURL;
		} else {
			addStreams = [ streamURL ];
		}

		// Merken, für Fehlerabfrage.
		this._totalStreams = 0;

		// HLS.js Integration
		var _useHlsJS = Hls.isSupported() &&
						addStreams.length === 1 &&
						addStreams[0].indexOf(".m3u8") > 0;

		// dispose any old hls instances
        if (this._hls)
        {
            this._hls.destroy();
            this._hls = null;
        }

		for (var i = 0; i < addStreams.length && !_useHlsJS; i++) {
			var currentStream = addStreams[i];

			if (i == 0) {
				if ( this.player.pixelController )
					this.player.pixelController.loadStream(currentStream);
			}

			if (this.g.html5streamingVideoSupported && currentStream.toLowerCase().indexOf(".m3u8") > 0) {
				this._totalStreams++;

				if ( this._isIOS && this._pendingSeek > 0 )
				{
					currentStream += "#t=" + this._pendingSeek;
					this._pendingSeek = 0;
					this.__seeking = true;
				}

				$("<source>")
					.attr("src", currentStream)
					.attr("type", "application/x-mpegURL")
					.on('error', function (event) {
						that.onSourceError($(this).attr("src"));
					})
					.appendTo(this.jqPlayer);
			}

			if (this.g.html5mp4VideoSupported && currentStream.toLowerCase().indexOf(".mp4") > 0) {
				this._totalStreams++;

				$("<source>")
					.attr("src", currentStream)
					.attr("type", "video/mp4")
					.on('error', function (event) {
						that.onSourceError($(this).attr("src"));
					})
					.appendTo(this.jqPlayer);
			}

			if (this.g.html5oggVideoSupported && currentStream.toLowerCase().indexOf(".ogv") > 0) {
				this._totalStreams++;

				$("<source>")
					.attr("src", currentStream)
					.attr("type", "video/ogg")
					.on('error', function (event) {
						that.onSourceError($(this).attr("src"));
					})
					.appendTo(this.jqPlayer);
			}

			if (this.g.html5webmVideoSupported && currentStream.toLowerCase().indexOf(".webm") > 0) {
				this._totalStreams++;

				$("<source>")
					.attr("src", currentStream)
					.attr("type", "video/webm")
					.on('error', function (event) {
						that.onSourceError($(this).attr("src"));
					})
					.appendTo(this.jqPlayer);
			}
		}

		if (_useHlsJS ) {

			var hlsConfig = {
				debug: false,
				liveSyncDurationCount: 2
			};

        	if ( this._pendingSeek >0 )
        		hlsConfig.startPosition = this._pendingSeek;

			hlsConfig.startLevel = this.g.getLastUsedHlsLevelIndex();

			console.log("[ARD Player] HLS.js config:", hlsConfig);
			var hls = this._hls = new Hls(hlsConfig);

            this.recoverDecodingErrorDate = null;
            this.recoverSwapAudioCodecDate = null;

			hls.attachMedia(this.htmlPlayer);
			hls.on(Hls.Events.MEDIA_ATTACHED, function () {
				hls.loadSource(addStreams[0]);

				hls.on(Hls.Events.ERROR, function (event, data) {

					if (data.fatal) {
						switch (data.type) {
							case Hls.ErrorTypes.NETWORK_ERROR:
								// try to recover network error
								console.log("fatal network error encountered, try to recover", data.details);
								//hls.startLoad();
                                this.handleHLSMediaError();
								break;
							case Hls.ErrorTypes.MEDIA_ERROR:
								console.log("fatal media error encountered, try to recover");
                                this.handleHLSMediaError();

								break;
							default:
								// cannot recover
                                this.destroy();

								// Eventuell wartende Play-Event Trigger löschen.
								clearTimeout(this.__playEventTrigger);

								// error event an den player delegieren
                                this.handleError();

								break;
						}
					}
				}.bind(this));

				hls.on(Hls.Events.LEVEL_LOADED, function (event, data) {
                    this._dvrModeEnabled = data.details.live;

                    this._dvrSegmentDuration = data.details.targetduration;
                    this._dvrRightToLiveOffset = this._hls.config.liveSyncDurationCount * this._dvrSegmentDuration +1;

                    this._dvrWindow = data.details.totalduration - this._dvrRightToLiveOffset;

					if ( this._dvrTime < 0 || isNaN(this._dvrTime)) {
                        this._dvrTime = this.getDuration();
					}

                    this.updateDVRValues();
				}.bind(this));

				hls.on(Hls.Events.LEVEL_UPDATED, function (event, data) {
					//console.log("level updated", event, data);
                    this.g.setLastUsedHlsLevelIndex(data.level || -1);
				}.bind(this))
			}.bind(this));

		}
		else if ( this._totalStreams > 0) // Neue Quellen erfassen  #2148
		{
			this.htmlPlayer.load();
		}
		else
		{
            this.handleError();
		}

		// HTML unterstuetzt keine DVR Features
		if (this.mc.getIsLive() && this.mc.getDVREnabled())
			this.player.viewCtrl.onDVRCallback(false, 0, false);
	};

	p.updateDVRValues = function () {
		if ( !this._hls )
			return;

		this._dvrIsLive = this._dvrTime >= this.getDuration();

		this.onDVRCallback(this._dvrModeEnabled, this._dvrWindow, this._dvrIsLive);
	};

	/**
	 * @inheritDoc
	 **/
	p.seekToLive = function () {
		if (!this.canSeek())
			return;

		this.setCurrenttime(this.getDuration());
		if ( this._hls )
			this.play();
	};

	/**
	 * @inheritDoc
	 **/
	p._override_canSeek = p.canSeek;
	p.canSeek = function() {
		return this._override_canSeek() || this._dvrModeEnabled;
	};

	/**
	 * Handles any hls media errors and tries to recover it.
     */
	p.handleHLSMediaError = function () {
		if ( !this._hls )
			return;

        var now = Date.now();
        if (!this.recoverDecodingErrorDate || (now - this.recoverDecodingErrorDate) > 3000) {
            this.recoverDecodingErrorDate = Date.now();
            console.log(",try to recover media Error @ " + this.getCurrenttime());
            this._hls.recoverMediaError();
        } else {
            if (!this.recoverSwapAudioCodecDate || (now - this.recoverSwapAudioCodecDate) > 3000) {
                this.recoverSwapAudioCodecDate = Date.now();
                console.log(",try to swap Audio Codec and recover media Error @ " + this.getCurrenttime());

                this._hls.swapAudioCodec();
                this._hls.recoverMediaError();
            } else {
                console.log(",cannot recover, last media error recovery failed ...");

                // cannot recover
                this._hls.destroy();

                // Eventuell wartende Play-Event Trigger löschen.
                clearTimeout(this.__playEventTrigger);

                // error event an den player delegieren
                this.handleError();
            }
        }
	};

	p._override_play = p.play;
	/**
	 * @inheritDoc
	 **/
	p.play = function () {

		if ( this._errorState )
		{
			this.handleError();
			return;
		}

		this.player.viewCtrl.setCtrlBarFading(true);

		if ( this._hls && this._dvrModeEnabled )
			this.setCurrenttime(this._dvrTime);

		this.htmlPlayer.play();
	};

	p._override_pause = p.pause;
	/**
	 * @inheritDoc
	 **/
	p.pause = function () {
		this.htmlPlayer.pause();

		// #11221 - Posterframe auf iPad nicht pauschal anzeigen!
		// if ( this.g.isIPadDevice )
		//	this.vc.showPosterFrame();
	};

	p._override_togglePlay = p.togglePlay;
	/**
	 * @inheritDoc
	 **/
	p.togglePlay = function () {
		if ( this._errorState )
		{
		    this.handleError();
			return;
		}

		if (this._playing) {
			this.pause();
		} else {
			this.play();
		}
	};

	p._override_isPlaying = p.isPlaying;
	/**
	 * @inheritDoc
	 **/
	p.isPlaying = function () {
		return this._playing;
	};

	p._override_setMuteState = p.setMuteState;
	/**
	 * @inheritDoc
	 **/
	p.setMuteState = function (muteState) {
		this.htmlPlayer.muted = muteState;
		ns.GlobalModel.getInstance().setMuted(muteState);

		if (this.vc)
			this.vc.showMutedState(muteState);
	};

	/**
	 * @inheritDoc
	 **/
	p.getMuteState = function () {
		return ns.GlobalModel.getInstance().getMuted();
	};

	/**
	 * @inheritDoc
	 **/
	p.toggleMuteState = function () {
		this.setMuteState(!this.getMuteState());
	};

	p._override_setVolume = p.setVolume;
	/**
	 * @inheritDoc
	 **/
	p.setVolume = function (volume) {
		this._override_setVolume(volume);

        if (volume >= 0 && volume <= 1)
		    this.htmlPlayer.volume = volume;
	};

	p._override_setCurrenttime = p.setCurrenttime;
	/**
	 * @inheritDoc
	 **/
	p.setCurrenttime = function (seconds, preventPlay, preventSeek) {

		if (this._ready) {
			if (!this.canSeek())
				return;

			// limit seek to actual possible values.
			seconds = Math.min(seconds, this.getDuration());

			var performSeekToTime = seconds;

			if ( this._dvrModeEnabled )
			{
				var percent = seconds/this.getDuration();
				performSeekToTime = this._dvrWindowLeft + (this._dvrWindowRight-this._dvrWindowLeft)*percent;
			}

			if (this._dvrModeEnabled)
				this._dvrTime = seconds;

			// By default, set to 0.
			this._pendingSeek = 0;

			try {
			    if ( !preventSeek )
				    this.htmlPlayer.currentTime = performSeekToTime;

				// Dispatch time change event
				this.onTimeChange(null, {duration: this.getDuration(), time: seconds});

			} catch (Exception) {
				this._pendingSeek = seconds;
			}

		} else {
			// perform seek as soon as loadedMetadata Event occurs
			this._pendingSeek = seconds;
		}

		this._override_setCurrenttime(seconds, preventPlay);
	};

	p._override_getCurrenttime = p.getCurrenttime;
	/**
	 * @inheritDoc
	 **/
	p.getCurrenttime = function () {
	    if ( this._dvrModeEnabled )
	        return this._dvrTime;

		if ( this._pendingSeek > 0 )
			return this._pendingSeek;

		return this.htmlPlayer.currentTime;
	};

	/**
	 * @inheritDoc
	 **/
	p._override_setTimeByPercent = p.setTimeByPercent;
	p.setTimeByPercent = function (percent) {
		var targetTime = percent / 100 * this.getDuration();
		this.setCurrenttime(targetTime);

		this._override_setTimeByPercent(percent);

		return targetTime;
	};

	p._override_getTimeAsPercent = p.getTimeAsPercent;
	/**
	 * @inheritDoc
	 **/
	p.getTimeAsPercent = function () {
		return Math.round(this.getCurrenttime() / this.getDuration() * 100);
	};

	p._override_getDuration = p.getDuration;
	/**
	 * @inheritDoc
	 **/
	p.getDuration = function () {
		if ( this._dvrModeEnabled)
			return this._dvrWindow;

		return this.htmlPlayer.duration;
	};

	p.handleError = function () {
        this.stopDVRTicker();

        clearTimeout(this.__playEventTrigger);

        this._errorState = true;
        this.player.errorCtrl.throwStreamError(ns.ErrorController.ERROR_PLAYBACK);
    };

	ns.HtmlVideoCtrl = HtmlVideoCtrl;

})(ardplayer, ardplayer.jq, ardplayer.console);
