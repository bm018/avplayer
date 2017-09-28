// @version @PACKAGE_VERSION@

define("GalleryThumblist", ["Slider"], function(Slider) {

    var GalleryThumblist = function(dom_element, options) {
        this.dom_element = dom_element;
        this.options = options;
        this.initialize();
    };

    GalleryThumblist.prototype = {

        initialize : function() {

            this.slider = null;
            this.index = 0;
            this.viewport = $('.wrapper_slider', this.dom_element);
            this.list = $('.scrollcontent', this.dom_element);
            this.items = $('li', this.list);

            this.initView();

        },

        initView : function() {
            var that = this;

            this.slider = new Slider(this.dom_element, {
                bounce : true,
                onUpdateView : function() {
                    that.updateFlyoutPositions();
                },
                onUpdateLayout : function() {
                    that.updateFlyoutPositions();
                }
            });

            //We are the thumblist
            //listen for Gallery Changes and Thumb Clicks
            jsb.on('Gallery::INDEX_CHANGED', {
                "gallery_id" : this.options.gallery_id
            }, function(event) {
                that.index = event.index;
                that.updateView();
            });

            this.list.on('click', 'li', function(event)
            {
                event.preventDefault();
                that.index = that.items.index(event.currentTarget);
                that.updateIndex(that.index);
                that.updateView();
                that.updateFlyoutPositions();
                if (window.callAnalytics) callAnalytics('pi', 'gallery-slider', 'thumb-select');
            });

            /*
             * auf touch devices touchstart abfragen, um doppelte klick events auf android 4 zu verhindern
             * @see RBBIP-722
             */
            if (Modernizr.touch)
            {
                this.list.on('click', 'li', function(event)
                {
                    event.preventDefault();
                });
            }

            this.items.attr('tabindex', -1);

            $('a', this.items).attr('tabindex', -1);

        },

        updateIndex : function(index) {
            if (index >= 0 && index < this.items.length) {
                jsb.fireEvent('Gallery::INDEX_CHANGED', {
                    thumb_list_id : this.options.gallery_id ? this.options.id : null,
                    index : index
                });
            }
        },

        updateFlyoutPositions : function() {
            var that = this;
            this.items.removeClass('align_right');
            this.items.each(function(i, el) {
                var el = $(el);
                var left = el.position().left;
                if (left - that.slider.x > that.slider.viewport_width - 200) {
                    el.addClass('align_right');
                }
            });
        },

        updateView : function() {
            this.items.removeClass('selected');
            $(this.items[this.index]).addClass('selected');
            this.slider.setIndex(this.index);
        }
    };

    jsb.registerHandler('GalleryThumblist', GalleryThumblist);

});
