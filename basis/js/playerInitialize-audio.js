define("playerInitialize-audio", [], function () {
    /** 
     * Loads audio player script 
     */
    var loadScripts = function () {
        $('<script src="/src/dist/js/audio.min.js"></script>').appendTo('head');
    };

    loadScripts();

    /**
     * Array for collecting player placeholders
     */
    var queuedPlayers = [];

    /**
     * Iterates through all queued players and checks if they are visible
     * Calls initialize method when visible
     * and removes element from queuedPlayers array
     */
    var watchQueuedPlayers = function () {
        var events = 'load orientationchange resize scroll touchmove focus';
        var i = 0;

        $(window).on(events, _.debounce(function () {
            i = queuedPlayers.length;
            while (i--) {
                if (queuedPlayers[i].isVisible()) {
                    queuedPlayers[i].initialize();
                    queuedPlayers.splice(i, 1);
                }
            }
        }, 200));
    };

    watchQueuedPlayers();

    /**
     * pause all running audio players
     */
    var pauseAllAudioPlayers = function () {
        $('.audioplayer-playing .audioplayer-playpause').click();
    };

    /**
     * Subscribes to Player::VIDEO_STARTED event
     * to set running players on pause
     * when video is started
     */
    jsb.on('Player::VIDEO_STARTED', function () {
        pauseAllAudioPlayers();
    });

    /**
     * Subscribes to Gallery::INDEX_CHANGED event 
     * to set running players on pause
     * when using the gallery slider
     */
    jsb.on('Gallery::INDEX_CHANGED', function (e) {
        if (e.gallery_id) {
            // find running players in gallery and stop
            $('#' + e.gallery_id + ' .audioplayer-playing .audioplayer-playpause').click();
        };
    });

    /**
     * function playerInitialize
     * is called for each player
     * It pushes each placeholder to queuedPlayers array
     * 
     * @param { Object } dom_element 
     * @param { String } options 
     */
    var playerInitialize = function (dom_element, options) {
        this.dom_element = dom_element;
        this.$dom_element = $(dom_element);
        this.options = {};
        $.extend(this.options, options);

        queuedPlayers.push(this);
    };

    playerInitialize.prototype = {
        /** 
         * Checks if element is visible 
         */
        isVisible: function () {
            var elm = this.dom_element;

            if (!!elm.offsetParent && !!(elm.offsetWidth || elm.offsetHeight || elm.getClientRects().length)) {
                var bcRect = elm.getBoundingClientRect();
                return (bcRect.left < window.innerWidth && bcRect.right >= 0 && bcRect.top < window.innerHeight && bcRect.bottom >= 0);
            } else {
                return false;
            }
        },

        isInitialized: false,

        /** 
         * Creates initial play button (e.g. on picture),
         * Generates unique ID,
         * Gets Media JSON,
         * Sets Event Listener for play button
         * Calls createAudio() function
         */
        initialize: function () {
            var that = this;
            var mediaJsonURL = this.options.media;
            var analyticsData = this.options.analytics;
            var mediaSrc = '';
            var $audioBtn = $('<div role="button" tabindex="0" class="audio-btn" title="Audio abspielen"></div>');

            this.uniqueId = +new Date() + Math.floor((Math.random() * (999 - 100) + 100));            

            this.$dom_element.addClass('isLoading');

            // Get audio src from media.json
            $.getJSON(mediaJsonURL)
                .done(function (data) {
                    mediaSrc = (data && data._mediaArray && data._mediaArray[0] && data._mediaArray[0]._mediaStreamArray && data._mediaArray[0]._mediaStreamArray[0] && data._mediaArray[0]._mediaStreamArray[0]._stream);

                    if (mediaSrc) {
                        that.$dom_element.removeClass('isLoading').addClass('isReady playerId-' + that.uniqueId);

                        $audioBtn.on('click keypress', function (e) {
                            if (e.type === 'click' || e.which === 13 || e.which === 32) {
                                e.preventDefault();

                                // ignore when player is already initialized
                                if (!that.isInitialized) {
                                    that.createAudio(mediaSrc, !!(e.which === 13 || e.which === 32));
                                    that.sendAnalyticsData(analyticsData);
                                    $(this).blur();
                                }
                                return false;
                            }
                        }).appendTo(that.$dom_element);;
                    } else {
                        that.showErr(1, 'Referenz zur Audio-Datei nicht gefunden.');
                    }
                })
                .fail(function (jqxhr, textStatus, error) {
                    that.showErr(1, 'Fehler beim Abruf der Medien-Informationen.', textStatus + ' ' + error);
                });
        },

        /**
         * Creates <audio> element and initializes audio player
         * 
         * @param { String } src
         * @param { Boolean } isKeyboardControl
         */
        createAudio: function (src, isKeyboardControl) {
            var that = this;
            var $audioElm = $('<audio src="' + src + '" class="audio-element" controls>');

            // Append audio element to player container
            // and initialize audioPlayer on audio element
            $audioElm.appendTo(this.$dom_element).audioPlayer({
                classPrefix: 'audioplayer'
            });

            this.isInitialized = true;

            this.$dom_element.removeClass('isReady').addClass('isInitialized');

            // start the audio
            this.play();

            // if player is initialized via keyboard control, set focus to play/pause button
            if (isKeyboardControl) this.$dom_element.find('.audioplayer-playpause').focus();

            // attach event handler on initial audio button
            // to start / stop the player 
            // primarily used for audio list player
            this.$dom_element.find('.audio-btn').on('click keypress', function (e) {
                if (e.type === 'click' || e.which === 13 || e.which === 32) {
                    e.preventDefault();
                    that.toggle();

                    if (e.type === 'click') $(this).blur();
                    return false;
                }
            });

            // subscribe to play event
            // and fire jsb event to pause video players
            this.$dom_element.find('audio').on('play', function (e) {
                jsb.fireEvent('Player::AUDIO_STARTED', {
                    playerId: that.uniqueId,
                    originalEvent: e
                });
            });

            // subscribe to AUDIO_STARTED event
            // and stop player (if it's not the one that triggered the event)
            jsb.on('Player::AUDIO_STARTED', function (e) {
                if (e.playerId !== that.uniqueId) {
                    that.pause();
                }
            });
        },

        /**
         * Zeigt Information über Fehler an
         * 
         * @param { Integer } level
         * @param { String } msg
         * @param { String } consoleMsg
         */
        showErr: function (level, msg, consoleMsg) {
            this.$dom_element.removeClass('isLoading isReady isInitialized').addClass('error');
            this.$dom_element.append('<div class="audioplayer-error">' + msg + '</div>');
            if (consoleMsg) console.warn(consoleMsg);
        },

        /** 
         * toggles play/pause
         */
        toggle: function () {
            if (this.$dom_element.closest('.audioplayer-playing').length === 1) {
                this.pause();
            } else {
                this.play();
            }
        },

        pause: function () {
            if (this.$dom_element.closest('.audioplayer-playing').length === 1) {
                this.$dom_element.find('.audioplayer-playpause').click();
            }
        },

        /**
         * start player
         * ensures all other players will be paused first
         */
        play: function () {
            if (this.$dom_element.closest('.audioplayer-playing').length === 0) {
                this.$dom_element.find('.audioplayer-playpause').click();
            }
        },

        /**
         * Sends web analytics information via callAnalytics function
         * TODO!
         * 
         * @param { Object } data
         */
        sendAnalyticsData: function (data) {
            // if (window.callAnalytics) callAnalytics('pi', 'player', 'initialize ' + data.rbbhandle + ' ' + data.rbbtitle);
        }
    };

    jsb.registerHandler('playerInitialize-audio', playerInitialize);

});
