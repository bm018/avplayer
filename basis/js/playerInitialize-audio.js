define("playerInitialize-audio", [], function () {
    /** 
     * Loads audio player script 
     */
    var loadScripts = function () {
        $.getScript("./src/dist/js/audio.min.js");
    };

    /**
     * Array for collecting player placeholders
     */
    var queuedPlayers = [];

    /**
     * Iterates through all queued players and checks if visible
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
        }, 333));
    };

    watchQueuedPlayers();

    var playerInitialize = function (dom_element, options) {
        this.dom_element = dom_element;
        this.$dom_element = $(dom_element);
        this.options = {};
        $.extend(this.options, options);

        // queue all players
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
            var mediaJsonData = this.options.media;
            var analyticsData = this.options.analytics;
            var mediaSrc = '';
            var $audioBtn = $('<a class="audio-btn" title="Audio abspielen" tabindex=0></a>');
            var eventName = (window.touch) ? 'touchstart' : 'click';

            // Get audio src from media.json
            $.getJSON(mediaJsonData, function (data) {
                mediaSrc = (data && data._mediaArray && data._mediaArray[0] && data._mediaArray[0]._mediaStreamArray && data._mediaArray[0]._mediaStreamArray[0] && data._mediaArray[0]._mediaStreamArray[0]._stream);

                if (mediaSrc) {
                    that.$dom_element.addClass('isInitialized playerId-' + uniqueId);
                    
                    $audioBtn.on(eventName, function () {
                        that.createAudio(mediaSrc);
                        that.sendAnalyticsData(analyticsData);
                        return false;
                    }).appendTo(that.$dom_element);;
                }
            });
        },

        /**
         * Creates <audio> element and initializes audio player
         */
        createAudio: function (src) {
            var $audioElm = $('<audio src="' + src + '" class="audio-element" controls>');

            // Append audio element to player container
            // and initialize audioPlayer on audio element
            $audioElm.appendTo(this.$dom_element).audioPlayer({
                classPrefix: 'audioplayer'
            });

            this.isInitialized = true;

            // If another audio is running, stop it
            $('.audioplayer-playing .audioplayer-playpause a').click();

            // Start the audio
            this.$dom_element.find('.audioplayer-playpause a').click();

            // Hide the play button
            this.$dom_element.find('.audio-btn').hide();
        },

        /**
         * Sends web analytics information via callAnalytics function
         */
        sendAnalyticsData: function (data) {
            // TODO!
            if (window.callAnalytics) callAnalytics('pi', 'player', 'initialize ' + data.rbbhandle + ' ' + data.rbbtitle);
        }
    };

    loadScripts();

    jsb.registerHandler('playerInitialize-audio', playerInitialize);

});
