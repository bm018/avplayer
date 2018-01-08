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
     * 
     * @param { Array } queuedPlayers
     */
    var watchPlayers = function (queuedPlayers) {
        var events = 'unload load orientationchange resize scroll touchmove blur focus';

        $(window).on(events, _.debounce(function () {
            checkVisibility(queuedPlayers);
        }, 200));

        // run checkVisibility once without any triggering events
        setTimeout(function () {
            checkVisibility(queuedPlayers);
        }, 200);

        function checkVisibility(queuedPlayers) {
            var i = queuedPlayers.length;
            while (i--) {
                if (queuedPlayers[i].isVisible()) {
                    queuedPlayers[i].initialize();
                    queuedPlayers.splice(i, 1);
                }
            }
        }
    };

    watchPlayers(queuedPlayers);

    /**
     * get all currently instantiated video players
     * 
     * @return { Array } player objects from ardplayer.PlayerModel
     */
    var getAllVideoPlayers = function () {
        var allVideoPlayers = window.ardplayer && ardplayer.PlayerModel && ardplayer.PlayerModel.players;

        if ($.isArray(allVideoPlayers)) {
            return allVideoPlayers;
        } else {
            return false;
        }
    };

    /**
     * Pauses all video players mentioned by IDs in players array.
     * If no array is provided, all video players are paused.
     *
     * @param { Array } players
     */
    var pauseVideoPlayers = function (players) {
        var allPlayers = getAllVideoPlayers();
        var i = allPlayers.length;

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
        this.player = {};
        this.options = {};
        $.extend(this.options, options);

        queuedPlayers.push(this);
    };

    playerInitialize.prototype = {
        /**
         * Checks if element is visible
         * 
         * @return { Boolean }
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
         * initialize function
         */
        initialize: function () {
            this.$dom_element.addClass('isReady');
            this.createInitializeButton();
        },

        /**
         * creates initial play button
         * sets event listener on button and calls createVideo function when clicked
         */
        createInitializeButton: function () {
            var that = this;
            var $videoBtn = $('<div role="button" tabindex="0" class="video-btn" title="Video abspielen"></div>');

            $videoBtn.on('click touchstart keypress', function (e) {
                if (e.type === 'click' || e.type === 'touchstart' || e.which === 13 || e.which === 32) {
                    e.preventDefault();

                    // ignore when player is already initialized
                    if (!that.isInitialized) {
                        // var analyticsData = this.options.analytics;
                        that.createVideo();

                        // that.sendAnalyticsData(analyticsData);
                    } else {
                        that.player.play();
                    }

                    return false;
                }
            }).appendTo(this.$dom_element);
        },

        /**
         * Creates close button to stop playback 
         * and remove expanded layout on premium stage
         */
        createCloseButton: function () {
            var that = this;
            var $videoCloseBtn = $('<div role="button" tabindex="0" class="video-close-btn" title="Wiedergabe beenden"></div>');

            $videoCloseBtn.on('click touchstart keypress', function (e) {
                if (e.type === 'click' || e.type === 'touchstart' || e.which === 13 || e.which === 32) {
                    e.preventDefault();

                    that.player.pause();
                    that.$dom_element.closest('#contentheader').removeClass('expanded');

                    return false;
                }
            }).appendTo(this.$dom_element);
        },

        /**
         * Creates <div> container and initializes video player
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
                this.player = new ardplayer.Player(this.uniqueId, this.options.config, this.options.media);
                this.bindEvents(this.player);
                this.$dom_element.removeClass('isReady').addClass('isInitialized');
                this.createCloseButton();
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

                that.$dom_element.closest('#contentheader').addClass('expanded');
            });

            $(player).bind(ardplayer.Player.EVENT_INIT, function (e) {
                that.$dom_element.closest('#contentheader').addClass('expanded');
            });

            $(player).bind(ardplayer.Player.EVENT_PAUSE_STREAM, function (event) {
                that.setState('paused');
            });

            $(player).bind(ardplayer.Player.EVENT_STOP_STREAM, function (event) {
                that.setState('stopped');
            });

            $(player).bind(ardplayer.Player.EVENT_READY, function (event) {
                that.$dom_element.find('.ardplayer-postercontrol').click();
            });

            $(player).bind(ardplayer.Player.TOGGLE_FULLSCREEN, function (event) {
                that.$dom_element.toggleClass('stage-fullscreen');
            });
        },

        /**
         * Exposes current player state via class name on DOM object
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