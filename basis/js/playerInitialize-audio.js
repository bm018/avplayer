define("playerInitialize-audio", [], function () {
    /** 
     * Loads audio player script 
     */
    var loadScripts = function () {
        $.getScript("./src/dist/js/audio.min.js");
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
            var uniqueId = +new Date() + Math.floor((Math.random() * (999 - 100) + 100));
            var mediaJsonURL = this.options.media;
            var analyticsData = this.options.analytics;
            var mediaSrc = '';
            var $audioBtn = $('<a class="audio-btn" title="Audio abspielen" tabindex=0></a>');

            this.$dom_element.addClass('isLoading');

            // Get audio src from media.json
            $.getJSON(mediaJsonURL, function (data) {
                mediaSrc = (data && data._mediaArray && data._mediaArray[0] && data._mediaArray[0]._mediaStreamArray && data._mediaArray[0]._mediaStreamArray[0] && data._mediaArray[0]._mediaStreamArray[0]._stream);

                if (mediaSrc) {
                    that.$dom_element.removeClass('isLoading').addClass('isReady playerId-' + uniqueId);

                    $audioBtn.on('click keypress', function (e) {
                        if (e.type === 'click' || e.which === 13) {
                            e.preventDefault();

                            // ignore when player is already initialized
                            if (!that.isInitialized) {
                                that.createAudio(mediaSrc);
                                that.sendAnalyticsData(analyticsData);
                            }
                            return false;
                        }
                    }).appendTo(that.$dom_element);;
                }
            });
        },

        /**
         * Creates <audio> element and initializes audio player
         * 
         * @param { String } src
         */
        createAudio: function (src) {
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

            // attach event handler on initial audio button
            // to start / stop the player 
            // primarily used for audio list player
            this.$dom_element.find('.audio-btn').on('click keypress', function (e) {
                if (e.type === 'click' || e.which === 13) {
                    e.preventDefault();

                    that.toggle();
                    return false;
                }
            });
        },

        /** 
         * toggles play/pause
         */
        toggle: function () {
            if (this.$dom_element.closest('.audioplayer-playing').length === 1) {
                this.pauseAll();
            } else {
                this.play();
            }
        },

        /**
         * pause all running players
         */
        pauseAll: function () {
            $('.audioplayer-playing .audioplayer-playpause a').click();
        },

        /**
         * start player
         * ensures all other players will be paused first
         */
        play: function () {
            if (this.$dom_element.closest('.audioplayer-playing').length === 0) {
                this.pauseAll();
                this.$dom_element.find('.audioplayer-playpause a').click();
            }
        },

        /**
         * Sends web analytics information via callAnalytics function
         * TODO!
         * 
         * @param { Object } data
         */
        sendAnalyticsData: function (data) {
            if (window.callAnalytics) callAnalytics('pi', 'player', 'initialize ' + data.rbbhandle + ' ' + data.rbbtitle);
        }
    };

    jsb.registerHandler('playerInitialize-audio', playerInitialize);

});
