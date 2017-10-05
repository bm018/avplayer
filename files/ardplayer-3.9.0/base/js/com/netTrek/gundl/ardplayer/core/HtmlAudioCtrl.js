/**
 * Created by netTrek GmbH & Co. KG
 * User: netTrek - Saban Uenlue
 * @module core
 **/

(function (ns, $, console) {
    "use strict";
    /**
     * Diese Klasse wird als Kontroll-Klasse für das HTML-Audio-Objekt genutzt.
     * @class HtmlAudioCtrl
     * @constructor
     * @public
     * @extends AbstractPlayerCtrl
     **/
    var HtmlAudioCtrl = function (player, mediaCanvas) {
        this.pluginId = ns.GlobalModel.HTML5;
        this.initialize(player, mediaCanvas);
    };
    var p = HtmlAudioCtrl.prototype = new ns.AbstractPlayerCtrl();
    p.PlayerCtrl_Override_initialize = p.initialize;

    /**
     * @inheritDoc
     **/
    p.initialize = function (player, mediaCanvas) {

		player.model.currentPluginID = ns.GlobalModel.HTML5;

        this.__inited = false;
        this.jqPlayer = $(mediaCanvas);
        this.htmlPlayer = this.jqPlayer[0];

        // Defaults für Volume aus Cookie lesen, und der FP-Instanz setzen.
        this.setVolume(this.getVolume());
        this.setMuteState(this.getMuteState());

        this.PlayerCtrl_Override_initialize(player, mediaCanvas);
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

        this.jqPlayer
            .on('canplay', function (event) {
				if (that.htmlPlayer.readyState >= that.htmlPlayer.HAVE_CURRENT_DATA) {
					that._ready = true;

					if (that._pendingSeek > 0) {
						that.setCurrenttime(that._pendingSeek);
						that._pendingSeek = 0;
					}

					var offset = that.pc.getInitialPlayhead();
					if (offset > 0) {
						that.pc.setInitialPlayhead(0);
						that.htmlPlayer.currentTime = offset;
					}
				}

				if (that.htmlPlayer.readyState >= that.htmlPlayer.HAVE_FUTURE_DATA) {
					that.bufferingEventHandler(null, false);
				}
        	})
            .on('play', function (event) {
                that._playing = true;
                that._stopped = false;
                that._paused = false;

                that.bufferingEventHandler(event, false);
                that.playEventHandler(event);
            })
            .on('pause', function (event) {
                that._playing = false;
                that._paused = true;

                that.pauseEventHandler(event);
            })
            .on('waiting', function (event) {
                that.bufferingEventHandler(event, true);
            })
            .on('error', function (event) {
				that._errorState = true;
                that.player.errorCtrl.throwStreamError(ns.ErrorController.ERROR_PLAYBACK);
            })
            .on('ended', function (event) {
                that._playing = false;
                that._stopped = true;
                that._paused = false;

                that.htmlPlayer.pause();

                that.endEventHandler(event);
            })
            .on('timeupdate', function (event) {
                var data = {};
                data.duration = that._duration;
                data.time = that.htmlPlayer.currentTime;

                that.onTimeChange(event, data)
            })
            .on('durationchange', function (event) {
                that._duration = that.htmlPlayer.duration;
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

    p._override_endEventHandler = p.endEventHandler;
    /**
     * @inheritDoc
     **/
    p.endEventHandler = function (event) {
        this.jumpToStart();
        this._override_endEventHandler(event);
    };

    p._override_dispose = p.dispose;
    /**
     * @inheritDoc
     **/
    p.dispose = function () {
        this._override_dispose.apply(this, arguments);
    };

    p._override_handelAutoplay = p.handelAutoplay;
    /**
     * @inheritDoc
     **/
    p.handelAutoplay = function (autoplay) {
        if (this.pc && this.pc.getAutoPlayBoolean() == false)
		{
            this.vc.showBufferingIndicator();
        }

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
        if ( !this._failedStreams )
            this._failedStreams = 1;
        else
            this._failedStreams ++;

        console.log(" Failed " + this._failedStreams + " / " + this._totalStreams, failedSource );

        if ( this._failedStreams == this._totalStreams )
		{
			this._errorState = true;
            this.player.errorCtrl.throwStreamError(ns.ErrorController.ERROR_PLAYBACK);
		}
    };

    p._override_loadStream = p.loadStream;
    /**
     * @inheritDoc
     **/
    p.loadStream = function () {

        this._override_loadStream();

        var streamURL;
        if (arguments && arguments [0] && typeof arguments [0] === "string")
            streamURL = arguments [0];
        else
		{
			var streamObject = this.getPlayingStreamObject();
			if ( streamObject )
			{
				streamURL = streamObject.getStream();
			} else
			{
				return;
			}
		}

        if (this._lastStreamUrl == streamURL)
		{
			if ( this._errorState )
			{
				// rethrow error
				this.player.errorCtrl.throwStreamError(ns.ErrorController.ERROR_PLAYBACK);
			}

            return; // do not load twice
		}

		this._lastStreamUrl = streamURL;
		this._errorState = false;

        // Alte Quellen entfernen  #11528
        this.jqPlayer.empty();

        var that = this;

        var addStreams;
        if ( streamURL instanceof Array )
        {
            addStreams = streamURL;
        } else
        {
            addStreams = [ streamURL ];
        }

        // Merken, für Fehlerabfrage.
        this._totalStreams = 0;

        for( var i = 0; i < addStreams.length; i++ )
        {
            var currentStream = addStreams[i];
			var extension = "";

			var curStreamToLower = currentStream.toLowerCase();
			var dotIdx = curStreamToLower.lastIndexOf(".");
			var slashIdx = curStreamToLower.lastIndexOf("/");
			if ( dotIdx > 0 && slashIdx < dotIdx )
			{
				extension = curStreamToLower.substr(dotIdx +1);

                // Remove any params if found
                var paramsIdx = extension.indexOf("?");
                if ( paramsIdx > 0 )
                    extension = extension.substr(0, paramsIdx);
                paramsIdx = extension.indexOf("#");
                if ( paramsIdx > 0 )
                    extension = extension.substr(0, paramsIdx);
			}

			if ( extension != "" && !this.g.support.audioExtensions[extension])
			{
				console.log("[ARD Player] Extension " + extension + " not supported, skipping");
				continue;
			}

            if ( i == 0 )
            {
				this.player.pixelController.loadStream(currentStream);
            }

            if (this.g.html5mp3AudioSupported) {

                this._totalStreams++;
                $("<source>")
                    .attr("src", currentStream)
                    .attr("type", "audio/mpeg")
                    .on('error', function (event) {
                        that.onSourceError($(this).attr("src"));
                    })
                    .appendTo(this.jqPlayer);
            }

            if (this.g.html5oggAudioSupported && currentStream.toLowerCase().indexOf(".ogg") > 0) {

                this._totalStreams++;

                $("<source>")
                    .attr("src", currentStream)
                    .attr("type", "audio/ogg")
                    .on('error', function (event) {
                        that.onSourceError($(this).attr("src"));
                    })
                    .appendTo(this.jqPlayer);
            }

            if (this.g.html5wavAudioSupported && currentStream.toLowerCase().indexOf(".wav") > 0) {

                this._totalStreams++;

                $("<source>")
                    .attr("src", currentStream)
                    .on('error', function (event) {
                        that.onSourceError($(this).attr("src"));
                    })
                    .appendTo(this.jqPlayer);
            }
        }

		if ( this._totalStreams > 0)
		{
			this.htmlPlayer.load();
		}
		else
		{
			this._errorState = true;
		}

        // HTML unterstuetzt keine DVR Features
        if (this.mc.getIsLive() && this.mc.getDVREnabled())
            this.player.viewCtrl.onDVRCallback(false, 0, false);
    };

    p._override_play = p.play;
    /**
     * @inheritDoc
     **/
    p.play = function () {

		if ( this._errorState )
        {
            this.player.errorCtrl.throwStreamError(ns.ErrorController.ERROR_PLAYBACK);
			return;
        }

		this.player.viewCtrl.setCtrlBarFading(true);

        this.htmlPlayer.play();
    };

    p._override_pause = p.pause;
    /**
     * @inheritDoc
     **/
    p.pause = function () {
        this.htmlPlayer.pause();
    };

    p._override_togglePlay = p.togglePlay;
    /**
     * @inheritDoc
     **/
    p.togglePlay = function () {

		if ( this._errorState )
		{
			if ( this.player )
				this.player.errorCtrl.throwStreamError(ns.ErrorController.ERROR_PLAYBACK);
			return;
		}

		if (this._playing) {
            this.htmlPlayer.pause();
        } else {
            this.htmlPlayer.play();
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

        if ( volume >= 0 && volume <= 1)
            this.htmlPlayer.volume = volume;
    };

    p._override_setCurrenttime = p.setCurrenttime;
    /**
     * @inheritDoc
     **/
    p.setCurrenttime = function (seconds, preventPlay) {
        if (this._ready) {
            if (!this.canSeek())
                return;
            
            this.htmlPlayer.currentTime = seconds;
        } else {
            this._pendingSeek = seconds;
        }

        this._override_setCurrenttime(seconds, preventPlay);
    };

    p._override_getCurrenttime = p.getCurrenttime;
    /**
     * @inheritDoc
     **/
    p.getCurrenttime = function () {
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
        return this.htmlPlayer.duration;
    };

    ns.HtmlAudioCtrl = HtmlAudioCtrl;

})(ardplayer, ardplayer.jq, ardplayer.console);
