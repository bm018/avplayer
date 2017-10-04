define("playerInitialize-audio", [], function() {

    var audioPlayersOutsideViewPort = [],
        $window = $(window);

    var loadScripts = function() {
        $.getScript("./src/dist/js/audio.min.js");
    };

    var isInViewPort = function(elm) {
        var $elm = $(elm),
            elmTop = $elm.offset().top,
            elmBottom = elmTop + $elm.outerHeight(),
            viewPortTop = $window.scrollTop(),
            viewPortBottom = viewPortTop + $window.height();

        return elmBottom > viewPortTop && elmTop < viewPortBottom;
    };

    var playerInitialize = function(dom_element, options) {
        this.$dom_element = $(dom_element);
        this.options = options;

        // When the page is called, check whether the element is in the visible range.
        // If yes, initialize this, otherwise set scroll event and initialize this later

        // Exception for audio in content tabs
        // Here we must check whether the tab is active in which this audio is located
        if (this.$dom_element.closest('.tab_content').length) {
            isInViewPort(this.$dom_element && this.$dom_element.closest('li.active').length) ? this.initialize(this.$dom_element) : this.initOnScroll(this.$dom_element);
        } else {
            isInViewPort(this.$dom_element) ? this.initialize(this.$dom_element) : this.initOnScroll(this.$dom_element);
        }
    };

    var playerScrollHandler = function() {
        var eventName = 'resize scroll';

        audioPlayersOutsideViewPort.forEach(function(view) {
            if (isInViewPort(view.$dom_element)) {
                view.initialize(view.$dom_element);

                // Remove the audio player from the array after initialization
                audioPlayersOutsideViewPort.splice(audioPlayersOutsideViewPort.indexOf(view),1);
            }
        });

        if (audioPlayersOutsideViewPort.length === 0) {
            // Take out the handler if there are no more audio players outside of the visible range
            $window.off(eventName, playerScrollHandler);
        }
    };

    var playerInitializeScrollHandler = function() {
        var eventName = 'resize scroll',
            initialized = false;

        // Set the scroll event on window
        // Make sure we attach event only once
        if (!initialized) {
            $window.on(eventName, playerScrollHandler);
        }
    };

    playerInitialize.prototype = {

        initOnScroll: function(elm) {
            audioPlayersOutsideViewPort.push(this);
            playerInitializeScrollHandler();
        },

        initialize: function() {
            var that = this.$dom_element[0],
                $this = this,
                mediaJsonData = this.options.media,
                analyticsData = this.options.analytics,
                mediaSrc = null,
                audioBtn = '<a class="audio-btn" title="Audio abspielen" tabindex=0></a>',
                eventName = (window.touch) ? 'touchstart' : 'click';


            // Get audio src from media.json
            // Call the function createAudio() on click/touch on the play button
            $.getJSON(mediaJsonData, function(data) {
                mediaSrc = data._mediaArray[0]._mediaStreamArray[0]._stream;

                if (mediaSrc !== null) {
                    $(that).append(audioBtn);
                    // Set class for initialization on scroll
                    $(that).addClass('hasMedia');
                    $(that).find('.audio-btn').on(eventName, function() {
                        $this.createAudio($(that), mediaSrc);
                        $this.sendAnalyticsData(analyticsData);
                        return false;
                    });
                }
            });
        },

        createAudio: function(elm, src) {
            var audioElm = '<audio class="audio-element" controls>',
                audioSrc = src,
                $elm = $(elm);

            // Append audio element to player element
            $elm.append($(audioElm));

            // Set src for audio element
            $elm.find('audio').attr('src', audioSrc);

            // Initialize audioPlayer on audio element
            $elm.find('audio').audioPlayer({
                classPrefix: 'audioplayer'
            });

            // Start the audio
            // If another audio is running, stop it
            // Hide the play button because the audio is already running
            if ($('.audioplayer-playing').length) {
                $('.audioplayer-playing').find('.audioplayer-playpause a').click();
            }
            $elm.find('.audioplayer-playpause a').click();

            $elm.find('.audio-btn').hide();
        },

        sendAnalyticsData: function(data) {
            if (window.callAnalytics) callAnalytics('pi', 'player', 'initialize ' + data.rbbhandle + ' ' + data.rbbtitle);
        }
    };

    loadScripts();

    jsb.registerHandler('playerInitialize-audio', playerInitialize);

});
