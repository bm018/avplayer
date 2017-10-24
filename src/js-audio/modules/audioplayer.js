/*
    By Osvaldas Valutis, www.osvaldas.info
    Available for use under the MIT License
*/

; (function ($, window, document, undefined) {
    var isTouch = 'ontouchstart' in window,
        eStart = isTouch ? 'touchstart' : 'mousedown',
        eMove = isTouch ? 'touchmove' : 'mousemove',
        eEnd = isTouch ? 'touchend' : 'mouseup',
        eCancel = isTouch ? 'touchcancel' : 'mouseup',

        secondsToTime = function (secs) {
            var hoursDiv = secs / 3600, hours = Math.floor(hoursDiv), minutesDiv = secs % 3600 / 60, minutes = Math.floor(minutesDiv), seconds = Math.ceil(secs % 3600 % 60);

            if (seconds > 59) {
                seconds = 0; minutes = Math.ceil(minutesDiv);
            }

            if (minutes > 59) {
                minutes = 0; hours = Math.ceil(hoursDiv);
            }

            return (hours == 0 ? '' : hours > 0 && hours.toString().length < 2 ? '0' + hours + ':' : hours + ':') + (minutes.toString().length < 2 ? '0' + minutes : minutes) + ':' + (seconds.toString().length < 2 ? '0' + seconds : seconds);
        },

        canPlayType = function (file) {
            var audioElement = document.createElement('audio');
            return !!(audioElement.canPlayType && audioElement.canPlayType('audio/' + file.split('.').pop().toLowerCase() + ';').replace(/no/, ''));
        };

    $.fn.audioPlayer = function (_params) {
        var params = $.extend({ classPrefix: 'audioplayer', strPlay: 'Abspielen', strPause: 'Pause', strVolume: 'Lautst&auml;rke', strSkipBwd: 'Minuten zur&uuml;ckspringen', strSkipFwd: 'Minuten vorspringen', skipMinutes: 5, skipSeconds: 5 }, _params),
            cssClass = {},
            cssClassSub =
                {
                    playPause: 'playpause',
                    playing: 'playing',
                    stopped: 'stopped',
                    focused: 'focused',
                    time: 'time',
                    timeCurrent: 'time-current',
                    timeDuration: 'time-duration',
                    bar: 'bar',
                    barLoaded: 'bar-loaded',
                    barPlayed: 'bar-played',
                    skipBwd: 'skip-bwd skip-btn',
                    skipFwd: 'skip-fwd skip-btn',
                    volume: 'volume',
                    volumeButton: 'volume-button',
                    volumeAdjust: 'volume-adjust',
                    noVolume: 'novolume',
                    muted: 'muted',
                    mini: 'mini'
                };

        for (var subName in cssClassSub)
            cssClass[subName] = params.classPrefix + '-' + cssClassSub[subName];

        this.each(function () {
            if ($(this).prop('tagName').toLowerCase() != 'audio')
                return false;

            var $this = $(this),
                audioFile = $this.attr('src'),
                isAutoPlay = $this.get(0).getAttribute('autoplay'),
                isLoop = $this.get(0).getAttribute('loop'),
                isSupport = false;

            isAutoPlay = isAutoPlay === '' || isAutoPlay === 'autoplay' ? true : false;
            isLoop = isLoop === '' || isLoop === 'loop' ? true : false;

            if (typeof audioFile === 'undefined') {
                $this.find('source').each(function () {
                    audioFile = $(this).attr('src');
                    if (typeof audioFile !== 'undefined' && canPlayType(audioFile)) {
                        isSupport = true;
                        return false;
                    }
                });
            }
            else if (canPlayType(audioFile)) isSupport = true;

            var thePlayer = $('<div class="' + params.classPrefix + '">' + (isSupport ? $('<div>').append($this.eq(0).clone()).html() : '<embed src="' + audioFile + '" width="0" height="0" volume="100" autostart="' + isAutoPlay.toString() + '" loop="' + isLoop.toString() + '" />') + '<div role="button" tabindex="0" class="' + cssClass.playPause + '" title="' + params.strPlay + '"></div></div>'),
                theAudio = isSupport ? thePlayer.find('audio') : thePlayer.find('embed');
            theAudio = theAudio.get(0);

            if (isSupport) {
                thePlayer.find('audio').css({ 'width': 0, 'height': 0, 'visibility': 'hidden' });
                thePlayer.append('<div class="' + cssClass.time + ' ' + cssClass.timeCurrent + '"></div><div class="' + cssClass.bar + '"><div class="' + cssClass.barLoaded + '"></div><div class="' + cssClass.barPlayed + '"></div></div><div class="' + cssClass.time + ' ' + cssClass.timeDuration + '"></div><div role="button" tabindex="0" class="' + cssClass.skipBwd + '" title="' + params.skipMinutes + ' ' + params.strSkipBwd + '"></div><div role="button" tabindex="0" class="' + cssClass.skipFwd + '" title="' + params.skipMinutes + ' ' + params.strSkipFwd + '"></div><div class="' + cssClass.volume + '"><div role="button" tabindex="0" class="' + cssClass.volumeButton + '" title="' + params.strVolume + '"></div><div class="' + cssClass.volumeAdjust + '"><div><div></div></div></div></div>');

                var theBar = thePlayer.find('.' + cssClass.bar),
                    barPlayed = thePlayer.find('.' + cssClass.barPlayed),
                    barLoaded = thePlayer.find('.' + cssClass.barLoaded),
                    timeCurrent = thePlayer.find('.' + cssClass.timeCurrent),
                    timeDuration = thePlayer.find('.' + cssClass.timeDuration),
                    skipButtons = thePlayer.find('.skip-btn'),
                    volumeButton = thePlayer.find('.' + cssClass.volumeButton),
                    volumeAdjuster = thePlayer.find('.' + cssClass.volumeAdjust + ' > div'),
                    volumeDefault = 0,
                    isFocused = false,

                    adjustCurrentTime = function (e) {
                        theRealEvent = isTouch ? e.originalEvent.touches[0] : e;
                        theAudio.currentTime = Math.round((theAudio.duration * (theRealEvent.pageX - theBar.offset().left)) / theBar.width());
                    },

                    adjustVolume = function (e) {
                        theRealEvent = isTouch ? e.originalEvent.touches[0] : e;
                        theAudio.volume = Math.abs((theRealEvent.pageY - (volumeAdjuster.offset().top + volumeAdjuster.height())) / volumeAdjuster.height());
                    },

                    updateLoadBar = function () {
                        var interval = setInterval(function () {
                            if (theAudio.buffered.length < 1) return true;
                            barLoaded.width((theAudio.buffered.end(0) / theAudio.duration) * 100 + '%');
                            if (Math.floor(theAudio.buffered.end(0)) >= Math.floor(theAudio.duration)) clearInterval(interval);
                        }, 100);
                    };

                var volumeTestDefault = theAudio.volume, volumeTestValue = theAudio.volume = 0.111;
                if (Math.round(theAudio.volume * 1000) / 1000 == volumeTestValue) theAudio.volume = volumeTestDefault;
                else thePlayer.addClass(cssClass.noVolume);

                timeDuration.html('&hellip;');
                timeCurrent.html(secondsToTime(0));

                theAudio.addEventListener('loadeddata', function () {
                    updateLoadBar();
                    timeDuration.html($.isNumeric(theAudio.duration) ? secondsToTime(theAudio.duration) : '&hellip;');
                    volumeAdjuster.find('div').height(theAudio.volume * 100 + '%');
                    volumeDefault = theAudio.volume;
                });

                theAudio.addEventListener('timeupdate', function () {
                    timeCurrent.html(secondsToTime(theAudio.currentTime));
                    barPlayed.width((theAudio.currentTime / theAudio.duration) * 100 + '%');
                });

                theAudio.addEventListener('volumechange', function () {
                    volumeAdjuster.find('div').height(theAudio.volume * 100 + '%');
                    if (theAudio.volume > 0 && thePlayer.hasClass(cssClass.muted)) thePlayer.removeClass(cssClass.muted);
                    if (theAudio.volume <= 0 && !thePlayer.hasClass(cssClass.muted)) thePlayer.addClass(cssClass.muted);
                });

                theAudio.addEventListener('ended', function () {
                    thePlayer.removeClass(cssClass.playing).addClass(cssClass.stopped);
                    thePlayer.closest('.player.audio').removeClass(cssClass.playing).addClass(cssClass.stopped);
                });

                theBar.on(eStart, function (e) {
                    adjustCurrentTime(e);
                    theBar.on(eMove, function (e) { adjustCurrentTime(e); });
                }).on(eCancel, function () {
                    theBar.unbind(eMove);
                });

                skipButtons.on('click keypress', function (e) {
                    if (e.type === 'click' || e.which === 13 || e.which === 32) {
                        e.preventDefault();

                        var factor = e.target.className.match(/bwd/i) ? -1 : 1;
                        var skip = factor * 60 * params.skipMinutes;

                        theAudio.currentTime += skip;

                        return false;
                    }
                }).on('mouseup', function () {
                    $(this).blur();
                });

                volumeButton.on('click keypress', function (e) {
                    if (e.type === 'click' || e.which === 13 || e.which === 32) {
                        e.preventDefault();

                        if (thePlayer.hasClass(cssClass.muted)) {
                            thePlayer.removeClass(cssClass.muted);
                            theAudio.volume = volumeDefault;
                        } else {
                            thePlayer.addClass(cssClass.muted);
                            volumeDefault = theAudio.volume;
                            theAudio.volume = 0;
                        }
                        return false;
                    }
                }).on('mouseup', function () {
                    $(this).blur();
                });

                volumeAdjuster.on(eStart, function (e) {
                    adjustVolume(e);
                    volumeAdjuster.on(eMove, function (e) { adjustVolume(e); });
                }).on(eCancel, function () {
                    volumeAdjuster.unbind(eMove);
                });

                thePlayer.on('mouseover', function () {
                    if (thePlayer.closest('.slider.gallery').length) {
                        thePlayer.closest('.slider.gallery').addClass('audioplayer-manipulated');
                    }
                }).on('mouseout', function () {
                    if (thePlayer.closest('.slider.gallery').length) {
                        thePlayer.closest('.slider.gallery').removeClass('audioplayer-manipulated');
                    }
                });

                thePlayer.on('focusin', function () {
                    thePlayer.addClass(cssClass.focused);
                    isFocused = true;
                }).on('focusout', function () {
                    thePlayer.removeClass(cssClass.focused);
                    isFocused = false;
                });

                thePlayer.on('keydown', function (e) {
                    if (isFocused) {
                        switch (e.which) {
                            case 37:
                                // TODO im Slider
                                e.stopPropagation();
                                theAudio.currentTime -= params.skipSeconds;
                                break;
                            case 39:
                                // TODO im Slider
                                e.stopPropagation();
                                theAudio.currentTime += params.skipSeconds;
                                break;
                            default:
                                break;
                        }
                    }
                });
            }
            else thePlayer.addClass(cssClass.mini);

            thePlayer.addClass(isAutoPlay ? cssClass.playing : cssClass.stopped);

            thePlayer.find('.' + cssClass.playPause).on('click keypress', function (e) {
                if (e.type === 'click' || e.which === 13 || e.which === 32) {
                    e.preventDefault();

                    var audioContainer = thePlayer.closest('.player.audio');
                    if (thePlayer.hasClass(cssClass.playing)) {
                        $(this).attr('title', params.strPlay);
                        thePlayer.removeClass(cssClass.playing).addClass(cssClass.stopped);
                        $(audioContainer).removeClass(cssClass.playing).addClass(cssClass.stopped);

                        if (isSupport) {
                            theAudio.pause();
                        } else {
                            theAudio.Stop();
                        }
                    } else {
                        // pause all running players
                        $('.player.audio.audioplayer-playing .audioplayer-playpause').click();
                        $(this).attr('title', params.strPause);
                        thePlayer.addClass(cssClass.playing).removeClass(cssClass.stopped);
                        $(audioContainer).addClass(cssClass.playing).removeClass(cssClass.stopped);

                        if (isSupport) {
                            theAudio.play();
                        } else {
                            theAudio.Play();
                        }
                    }
                    return false;
                }
            }).on('mouseup', function () {
                $(this).blur();
            });

            $this.replaceWith(thePlayer);
        });
        return this;
    };
})(jQuery, window, document);