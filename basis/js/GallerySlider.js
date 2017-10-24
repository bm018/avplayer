// @version @PACKAGE_VERSION@

define("GallerySlider", ["Slider"], function(Slider) {

    var GallerySlider = function(dom_element, options) {
        this.dom_element = $(dom_element);
        this.options = options;
        this.initialize();
    };

    GallerySlider.prototype = {

        initialize: function() {

            var that = this;

            this.index = 0;
            this.interval = null;
            this.viewport = 0;
            this.viewport_width = 0;

            this.list = null;
            this.list_width = 0;

            this.items = [];
            this.item_width = 700;

            this.slider = null;

            this.viewport = $('.wrapper_slider', this.dom_element);
            this.list = $('.scrollcontent', this.dom_element);
            this.items = $('li', this.list);
            this.teaser_contents = $('.gallery_content .teasercontent', this.dom_element);
            this.teaser_content_display = $('<div class="description"><div class="inner"></div></div>');
            this.teaser_content_inner = $('.inner', this.teaser_content_display);
            this.teaser_content_height = 0;
            this.dom_element.append(this.teaser_content_display);

            this.play_icons = $('.play_icon_layer', this.list);
            this.pause_btn = $('.pause', this.dom_element).first();
            this.play_btn = $('.play', this.dom_element).first();
            this.lightbox_btn = $('.fullscreen', this.dom_element).first();

            this.backlink = $('.gallery_back');
            this.textbox = $('.teaser', this.list);

            this.count = this.items.length;

            setTimeout(function() {
                that.initView();
                that.initializeButtonEvents();
                that.updateTeaserContent();
            }, 500);

            /*
             * links mit target blank in iscroll box nicht doppelt öffnen auf ios
             * @see https://docs.rbb-online.de/jira/browse/RBBIP-1080
             */
            this.list.find('a[target=_blank]').on('touchstart', function(event) {
                event.stopPropagation();
            });

            jsb.on('Player::INITIALIZED', function(data) {
                that.slider.stop();
            });
        },

        initView: function() {
            var that = this;
            this.teaser_contents.addClass('hide');
            this.play_icons.attr('tabindex', -1);

            this.slider = new Slider(this.dom_element, {
                onIndexChanged: function(index, states) {
                    that.onSliderIndexChanged(index, states);
                },
                onStateChanged: function(states) {
                    that.updateControlsView(states);
                },
                tab_scroll: false,
                fit_items: true,
                momentum: false,
                snap: true,
                circular: this.options.circular || false
            });

            jsb.on('Gallery::INDEX_CHANGED', {
                'thumb_list_id': this.options.thumb_list_id
            }, function(event) {
                that.index = event.index;
                that.slider.setIndex(event.index);
            });

            this.dom_element.attr('tabindex', 0);

            if (!Modernizr.touch) {
                this.list.on('mouseenter', function(event) {
                    that.slider.pause(true);
                });

                this.list.on('mouseleave', function(event) {
                    that.slider.pause(false);
                });

                this.dom_element.on('focus', function() {
                    that.has_focus = true;
                });
            }

            if (that.options.auto === true) {
                that.slider.play();
            }

            $(window).on('resize', _.debounce(function() {
                that.calculateTeaserHeight();
            }, 300));

            if (typeof isRBBurl !== 'undefined' && document.referrer && history.length > 1 && isRBBurl(document.referrer)) this.backlink.show();

            this.textbox.each(function() {
                if ($.trim($(this).text()) == '') $(this).hide();
            });

        },

        initializeButtonEvents: function() {

            var that = this;

            this.lightbox_btn.on('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                that.slider.stop();

                /* ALT *

                var li = $(that.items[that.index]);
                var title = $('.teasercontent h3', li).html();
                var src = $('img', li).first().attr('data-src-lightbox');
                if (!src) {
                    src = $('img', li).first().attr('src');
                }
                jsb.fireEvent('Lightbox::SHOW', {src: src, title: title});
                */

                var descriptions = that.items.find('.manualteasershorttext');
                var captions = [];
                var more = {};
                var more_href = '';

                descriptions.each(function() {
                    var desc = $(this).clone();
                    /*
                    // mehr-Links aus Beschreibung entfernen und in separater Variable speichern
                    more = desc.find('a');
                    if (more.length) {
                        more_href = more.eq(0).attr('href');
                    };
                    more.remove();
                    */
                    desc = desc.html();
                    captions.push(desc);
                });

                var images = that.items.find('.enlargeable img');
                var sources = [];

                images.each(function() {
                    var src = $(this).attr('data-src-lightbox') || $(this).attr('src');
                    sources.push(src);
                });

                jsb.fireEvent('Lightbox::SHOW', {
                    gallery: true,
                    sources: sources,
                    captions: captions,
                    index: that.index,
                    more_href: more_href,
                    slider: that.slider,
                    options: that.options
                });
                //if (window.callAnalytics) callAnalytics('pi', 'lightbox', 'open-img ' + title);
            });

            if (this.pause_btn.length && this.play_btn.length) {
                this.pause_btn.click(
                    function(e) {
                        e.preventDefault();
                        that.slider.stop();
                    }
                );
                this.pause_btn.keydown(
                    function(e) {
                        if (e.keyCode == '13') {
                            e.preventDefault();
                            that.slider.stop();
                        }
                    }
                );

                this.play_btn.click(
                    function(e) {
                        e.preventDefault();
                        that.slider.play();
                    }
                );

                this.play_btn.keydown(
                    function(e) {
                        if (e.keyCode == '13') {
                            e.preventDefault();
                            that.slider.play();
                        }
                    }
                );
            }
        },

        onSliderIndexChanged: function(index, states) {
            this.index = index;
            this.updateTeaserContent();

            jsb.fireEvent('Gallery::INDEX_CHANGED', {
                gallery_id: this.options.thumb_list_id ? this.options.id : null,
                index: this.index,
                isPlaying: states.playing
            });
        },

        updateControlsView: function(states) {
            this.play_btn.toggleClass('hide', states.playing);
            this.pause_btn.toggleClass('hide', !states.playing);
            if (this.has_focus) {
                if (states.playing) {
                    this.pause_btn.focus();
                } else {
                    this.play_btn.focus();
                }
            }
        },

        updateTeaserContent: function() {
            if (this.teaser_content_display.length) {
                this.teaser_content_inner.empty();
                this.teaser_content_inner.append($(this.teaser_contents[this.index]).clone().children());
                this.calculateTeaserHeight();
            }
            if (this.has_focus) {
                if (this.play_btn) {
                    this.play_btn.focus();
                } else {
                    this.dom_element.focus();
                }
            }
            this.play_icons.attr('tabindex', -1);
            $('.play_icon_layer', this.items[this.index]).attr('tabindex', 0);
        },

        calculateTeaserHeight: function() {
            var height = this.teaser_content_inner.height();
            if (height > this.teaser_content_height) {
                this.teaser_content_height = height;
                this.teaser_content_display.css('height', height);
            }
        }
    };

    jsb.registerHandler('GallerySlider', GallerySlider);


});
