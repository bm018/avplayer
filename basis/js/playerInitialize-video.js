define('playerInitialize-video', [], function () {
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
     * Iterates through array containing player placeholders and checks if they are visible.
     * Calls initialize method when visible and removes element from array.
     */
    var watchPlayers = function (queuedPlayers) {
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

    watchPlayers(queuedPlayers);

    /**
     * Pauses all video players mentioned by IDs in players array.
     * If no array is provided, all video players are paused.
     * 
     * @param { Array } players 
     */
    var pauseVideoPlayers = function (players) {
        // get all currently instantiated video players
        var allVideoPlayers = window.ardplayer && ardplayer.PlayerModel && ardplayer.PlayerModel.players;
        if ($.isArray(allVideoPlayers) && allVideoPlayers.length > 0) {
            var i = allVideoPlayers.length;

            // iterate through all video players
            while (i--) {
                if ($.isArray(players) && players.length > 0) {
                    // if attribute players is defined, only stop players mentioned in players array
                    if ($.inArray('' + ardplayer.PlayerModel.players[i]._id, players) > -1) {
                        ardplayer.PlayerModel.players[i].pause();
                    }
                } else {
                    // otherwise stop all players
                    ardplayer.PlayerModel.players[i].pause();
                }
            }
        }
    };

    /**
     * Subscribes to Player::AUDIO_STARTED event
     * to set running players on pause
     * when audio is started
     */
    jsb.on('Player::AUDIO_STARTED', function () {
        pauseVideoPlayers();
    });

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
                playerIDsInGallery.push('' + $(this).attr('id'));
            });

            if (playerIDsInGallery.length > 0) pauseVideoPlayers(playerIDsInGallery);
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
                        that.sendAnalyticsData(analyticsData);
                    }
                    return false;
                }
            }).appendTo(this.$dom_element);
        },

        /**
         * Creates <div> element and initializes video player
         * 
         * @param { Boolean } isKeyboardControl
         */
        createVideo: function () {
            this.uniqueId = +new Date() + Math.floor((Math.random() * (999 - 100) + 100));
            this.isInitialized = true;

            var that = this;
            var $videoElm = $('<div id="' + this.uniqueId + '" />');

            // Append video element to player container
            // and initialize videoPlayer on video element
            $videoElm.appendTo(this.$dom_element);

            // instantiate player
            if (window.ardplayer) {
                var p = new ardplayer.Player(this.uniqueId, this.options.config, this.options.media);
                this.bindEvents(p);
                this.$dom_element.removeClass('isReady').addClass('isInitialized');
            }
        },

        /**
         * Binds various events on player object
         * 
         * @param { Object } player
         */
        bindEvents: function (player) {
            var that = this;

            $(player).bind(ardplayer.Player.EVENT_PLAY_STREAM, function (e) {
                that.setState('playing');

                jsb.fireEvent('Player::VIDEO_STARTED', {
                    playerId: that.uniqueId,
                    originalEvent: e
                });
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
            // if (window.callAnalytics) callAnalytics('pi', 'player', 'initialize ' + data.rbbhandle + ' ' + data.rbbtitle);
        }
    };

    jsb.registerHandler('playerInitialize-video', playerInitialize);

});
