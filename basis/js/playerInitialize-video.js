define("playerInitialize-video", [], function () {
    /** 
     * Loads video player script 
     */
    var loadScripts = function () {
        $('<script src="/src/dist/js/video.min.js"></script>').appendTo('head');
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
     * Subscribes to Gallery::INDEX_CHANGED event 
     * to set running players on pause
     * when using the gallery slider
     */
    jsb.on('Gallery::INDEX_CHANGED', function (e) {
        var playerIDsInGallery = [];

        if (e.gallery_id) {
            // collect all video player ids in gallery that fired the event
            $('#' + e.gallery_id + ' .ardplayer').each(function () {
                playerIDsInGallery.push("" + $(this).attr('id'));
            });

            if (playerIDsInGallery.length > 0) {
                var allVideoPlayers = window.ardplayer && ardplayer.PlayerModel && ardplayer.PlayerModel.players;
                if (allVideoPlayers && allVideoPlayers.length > 0) {
                    var i = allVideoPlayers.length;

                    // iterate over all video players and check if one of them is contained by gallery
                    while (i--) {
                        if ($.inArray("" + ardplayer.PlayerModel.players[i]._id, playerIDsInGallery) > -1) {
                            ardplayer.PlayerModel.players[i].pause();
                        }
                    }
                }
            };
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
         * Sets Event Listener for play button
         * Calls createVideo() function
         */
        initialize: function () {
            var that = this;
            var analyticsData = this.options.analytics;
            var $videoBtn = $('<div role="button" tabindex="0" class="video-btn" title="Video abspielen"></div>');

            this.$dom_element.addClass('isReady');

            $videoBtn.on('click keypress', function (e) {
                if (e.type === 'click' || e.which === 13 || e.which === 32) {
                    e.preventDefault();

                    // ignore when player is already initialized
                    if (!that.isInitialized) {
                        that.createVideo();
                        // TODO!
                        // that.sendAnalyticsData(analyticsData);
                    }
                    return false;
                }
            }).appendTo(this.$dom_element);
        },

        /**
         * Creates <div> element and initializes video player
         * 
         * @param { String } src
         * @param { Boolean } isKeyboardControl
         */
        createVideo: function (src, isKeyboardControl) {
            var that = this;
            var uniqueId = +new Date() + Math.floor((Math.random() * (999 - 100) + 100));
            var $videoElm = $('<div id="' + uniqueId + '" />');

            this.isInitialized = true;

            // Append video element to player container
            // and initialize videoPlayer on video element
            $videoElm.appendTo(this.$dom_element);

            // instantiate player
            if (window.ardplayer) {
                var p = new ardplayer.Player(uniqueId, this.options.config, this.options.media);
            }

            // bind events
            this.bindEvents(p);

            this.$dom_element.removeClass('isReady').addClass('isInitialized');
        },

        /**
         * Binds various events on player object
         * 
         * @param { Object } player
         */
        bindEvents: function (player) {
            var that = this;

            $(player).bind(ardplayer.Player.EVENT_PLAY_STREAM, function (event) {
                that.setState('playing');
            });

            $(player).bind(ardplayer.Player.EVENT_PAUSE_STREAM, function (event) {
                that.setState('paused');
            });

            $(player).bind(ardplayer.Player.EVENT_STOP_STREAM, function (event) {
                that.setState('stopped');
            });
        },

        /**
         * Exposes current player state via css class on DOM object
         * 
         * @param { String } state
         */
        setState: function (state) {
            if (state) {
                this.$dom_element.removeClass(function (index, className) {
                    return (className.match(/(^|\s)state-\S+/g) || []).join(' ');
                });

                this.$dom_element.addClass('state-' + state);
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

    jsb.registerHandler('playerInitialize-video', playerInitialize);

});