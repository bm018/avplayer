define("playerInitialize-audio", [], function() {

    var loadScripts = function() {
        $.getScript("./src/dist/js/audio.min.js");
    };

    var playerInitialize = function(dom_element, options) {
        this.$dom_element = $(dom_element);
        this.options = options;
        this.initialize();
    };

    playerInitialize.prototype = {

        initialize: function() {
            var that = this.$dom_element[0],
                $this = this,
                mediaJsonData = this.options.media,
                analyticsData = this.options.analytics,
                items = null,
                mediaData = [],
                mediaSteamData = [],
                mediaSrc = null,
                audioBtn = '<a class="audio-btn" title="Audio abspielen" tabindex=0></a>',
                eventName = (window.touch) ? 'touchstart' : 'click';

            // get audio src from media.json
            // call the function createAudio() on click/touch on the play button
            $.getJSON(mediaJsonData, function(data) {
                items = data,

                    $.each(items, function(k, v) {
                        if (k === '_mediaArray') {
                            mediaData = v;
                            $.each(mediaData[0], function(k, v) {
                                if (k === '_mediaStreamArray') {
                                    mediaSteamData = v;
                                    mediaSrc = mediaSteamData[0]._stream;
                                    if (mediaSrc !== null) {
                                        $(that).append(audioBtn);
                                        $(that).find('.audio-btn').on(eventName, function() {
                                            $this.createAudio($(that), mediaSrc);
                                            $this.sendAnalyticsData(analyticsData);
                                            return false;
                                        });
                                    }
                                }
                            });
                        }
                    });
            });
        },

        createAudio: function(elm, src) {
            var audioElm = '<audio class="audio-element" controls>',
                audioSrc = src;

            // append audio element to player element
            $(elm).append($(audioElm));

            // set src for audio element
            $(elm).find('audio').attr('src', audioSrc);

            // initialize audioPlayer on audio element
            $(elm).find('audio').audioPlayer({
                classPrefix: 'audioplayer'
            });

            // start the audio
            // if another audio is running, stop it
            // hide the play button because the audio is already running
            if ($('.audioplayer-playing').length) {
                $('.audioplayer-playing').find('.audioplayer-playpause a').click();
            }
            $(elm).find('.audioplayer-playpause a').click();

            $(elm).find('.audio-btn').hide();
        },

        sendAnalyticsData: function(data) {
            if (window.callAnalytics) callAnalytics('pi', 'player', 'initialize ' + data.rbbhandle + ' ' + data.rbbtitle);
        }
    };

    loadScripts();

    jsb.registerHandler('playerInitialize-audio', playerInitialize);

});
