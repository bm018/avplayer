// @version @PACKAGE_VERSION@

define("Slider", [], function() {

    var Slider = function(dom_element, options){

        this.dom_element = $(dom_element);

        this.options = {
            interval: 4000,
            fit_items: false,
            adjust_height: true,
            circular: false,
            onStateChanged: function(){},
            onResize: function(){},
            onUpdateLayout: function(){},
            onUpdateView: function(){},
            useTransform: true,
            focusin_start_element_selector: null
        };

        // 2D Transform für Firefox deaktivieren, da dieses nicht
        // mit Flash kompatibel ist
        // schlechter nebeneffekt: die höhenberechnung wird dadurch beeinflußt - > höhe 0 im newsticket bei height 100% oder inherit auf ul
        if (navigator.userAgent.indexOf("Firefox")!=-1)
        {
            this.options.useTransform = false;
        }

        $.extend(this.options, options);

        if (this.options.circular === "true")
        {
            this.options.circular = true;
        }

        if (this.options.circular === "false")
        {
            this.options.circular = false;
        }

        this.scrollstep = 0;
        this.scrollspeed = 300;
        this.viewport = null;
        this.scrollcontent = null;
        this.btn_left = null;
        this.btn_right = null;
        this.fout_timeout = 10;
        this.registerSwipeAction = (window.Modernizr && Modernizr.touch);
        this.swipeStarted = false;

        this.initialize();
    };

    Slider.prototype = {

        initialize: function()
        {
            var that = this;

            this.additional_width = ((navigator.userAgent.indexOf("Firefox") != -1 || navigator.userAgent.indexOf("MSIE")) && !this.options.fit_items ) ? 2 : 0; //Firefox width bugfix
            this.index = 0;
            this.x = 0;
            this.is_touch_device = 'ontouchstart' in window;

            this.viewport = $('.wrapper_slider', this.dom_element);
            this.viewport_width = this.viewport.width();
            this.scrollcontent = $('.scrollcontent', this.viewport);
            this.items = $('> li', this.scrollcontent);
            this.items.css('display', 'inline-block');
            this.item_width = this.items.first().width();
            this.item_outer_width = this.items.first().outerWidth(true);
            this.btn_left = $('.skip.back', this.dom_element);
            this.btn_right = $('.skip.forward', this.dom_element);
            this.states = {
                playing: false,
                paused: false
            };

            this.initControls();


            setTimeout(function(){
                that.refresh();
            }, 100);

            $(window).resize(_.debounce(function(e){
                that.onResize();
                that.options.onResize();
            }, 500));

            /* neu berechenen wenn webfont dann hoffentlich geladen ist */
            this.fout_interval = setInterval(function()
            {
                that.calculateContentDimensions();

                that.fout_timeout--;

                if (that.fout_timeout <= 0)
                {
                    clearInterval(that.fout_interval);
                }
            }, 1000);


        },


        initControls: function()
        {
            var that = this;

            var params = {
                hScrollbar: false,
                vScrollbar: false,
                snap: 'li',
                momentum: this.options.momentum || true,
                useTransform: this.options.useTransform || true,//this.is_touch_device,
                wheelAction: 'none',
                onScrollStart: function(e)
                {
                    that.updateView();
                    that.swipeStarted = true;
                },
                onBeforeScrollMove: function(e)
                {
                    that.stop();
                },
                onScrollEnd: function(e)
                {
                    that.updateIndex();
                    that.updateView();
                    // trigger scroll event to show lazy loading images
                	$(document).scroll();
                    that.calculateContentDimensions();
                    if (that.registerSwipeAction && that.swipeStarted && window.callAnalytics) {
                        that.swipeStarted = false;
                        callAnalytics('pi', 'slider-or-ticker', 'scroll');
                    };
                },
                onAnimationEnd: function(e)
                {
                    that.updateIndex();
                    that.updateView();
                }
            };

            $.extend(params, this.options);

            this.scroller = new iScroll(this.viewport.get(0), params);

            this.viewport.css('overflow','');

            this.btn_left.on('click', function(e){
                that.scrollLeft();
            });

            this.btn_right.on('click', function(e){
                that.scrollRight();
            });

            if (!this.is_touch_device)
            {

                this.dom_element.on('keyup', function(e){
                    switch (e.keyCode)
                    {
                        case 37:
                            that.scrollLeft();
                        break;
                        case 39:
                            that.scrollRight();
                        break;
                    }
                });

                if (this.options.tab_scroll !== false)
                {
                    this.items.first().on('keyup', function(event)
                    {
                        /* bei initialem focusin zu heute element springen */
                        if (event.keyCode == 9 && !event.shiftKey && that.options.focusin_start_element_selector)
                        {
                            var element = that.scrollcontent.find(that.options.focusin_start_element_selector);
                            var position = element.position();
                            var width = element.outerWidth(true);

                            event.preventDefault();
                            element.focus();

                            if (position.left + width + that.scroller.x >= that.viewport.width() && that.scroller.maxScrollX != that.scroller.x)
                            {
                                that.scrollRight();
                            }
                        }
                    });

                    this.scrollcontent.on('keydown', 'li', function(event)
                    {
                        if (event.keyCode == 9)
                        {
                            var element = $(event.currentTarget);
                            var position = element.position();
                            var width = element.outerWidth(true);

                            if (!event.shiftKey && (position.left + width + that.scroller.x >= that.viewport.width() && that.scroller.maxScrollX != that.scroller.x))
                            {
                                that.scrollRight();
                                event.preventDefault();
                            }
                            else if (event.shiftKey && (position.left + that.scroller.x <= 0 && that.scroller.x < 0))
                            {
                                that.scrollLeft();
                                event.preventDefault();
                            }
                        }
                    });
                }
            }
        },

        refresh: function()
        {
            this.updateLayout(true);
            this.scroller.refresh();
            this.scroller.scrollTo(0,0,0);
            this.updateView();
        },

        onStateChanged: function()
        {
            this.options.onStateChanged(this.states);
        },

        setItems: function(items)
        {
            var that = this;
            this.scrollcontent.empty();
            this.scrollcontent.append(items);
            this.items = $('li', this.scrollcontent);
            setTimeout(function(){
                that.refresh();
            }, 100);
        },

        onResize: function()
        {
            this.updateLayout(true);
            this.scroller.refresh();
            this.updateView();
        },

        scrollLeft: function()
        {
            var tar_x;
            if (this.options.circular === true){
                tar_x = (this.x + this.scrollstep <= 0) ? (this.x + this.scrollstep) : this.scroller.maxScrollX;
            } else{
                tar_x = (this.x + this.scrollstep < -1) ? (this.x + this.scrollstep) :  0;
            }

            if (tar_x !== this.x)
            {
                this.x = tar_x;
                this.scrollToPosition();
                if (window.callAnalytics) callAnalytics('pi', 'slider-or-ticker', 'scroll');
            }
        },

        scrollRight: function()
        {
            var tar_x;
            if (this.options.circular === true){
                tar_x = (this.x - this.scrollstep >= this.scroller.maxScrollX) ? (this.x - this.scrollstep) : 0;
            } else{
                tar_x = (this.x - this.scrollstep > this.scroller.maxScrollX) ? (this.x - this.scrollstep) : this.scroller.maxScrollX;
            }

            if (tar_x !== this.x)
            {
                this.x = tar_x;
                this.scrollToPosition();
                if (window.callAnalytics) callAnalytics('pi', 'slider-or-ticker', 'scroll');
            }
        },

        setIndex: function(index)
        {
            var pos = index * this.scrollstep * -1;
            var tar_x = (pos < this.scroller.maxScrollX) ? this.scroller.maxScrollX : (pos > -1) ? 0 : pos;
            this.index = index;
            if (tar_x !== this.x)
            {
                this.x = tar_x;
                this.scrollToPosition();
            }else{
                this.options.onUpdateView();
            }
        },

        play: function()
        {
            this.next();
            this.startTimer();
            this.states.playing = true;
            this.states.paused = false;
            this.onStateChanged();
        },

        pause: function(flag)
        {
            if ((this.states.paused && this.states.playing) || (flag === false && this.states.playing === true))
            {
                this.startTimer();
                this.states.playing = true;
                this.states.paused = false;
                this.onStateChanged();

            }else if (flag === true && this.states.playing === true) {
                this.stopTimer();
                this.states.paused = true;
            }else{
                this.stopTimer();
                this.states.paused = true;
            }
            this.onStateChanged();
        },

        stop: function()
        {
            this.stopTimer();
            this.states.playing = false;
            this.states.paused = false;
            this.onStateChanged();
        },

        next: function()
        {
            var index = (this.index + 1 < this.items.length) ? this.index + 1 : 0 ;
            this.setIndex(index);
        },


        scrollToPosition: function()
        {
            this.scroller.scrollTo(this.x, 0, this.scrollspeed);
        },

        updateIndex: function()
        {
            this.x = this.scroller.x;
            this.index = Math.floor(Math.abs(this.x/this.scrollstep));
            if(this.options.onIndexChanged)
            {
                this.options.onIndexChanged(this.index, this.states);
            }
        },

        calculateContentDimensions: function()
        {
            var w = 0;
            var h = 0;
            var item_h = 0;

            this.items.each(function(index, item)
            {
                var el = $(item);
                item_h = el.outerHeight(true);

                w += el.outerWidth(true);
                if (!el.is(':empty'))
                {
                    h = (item_h > h) ? item_h : h;
                }
            });

            if (w > 0 && h > 0)
            {
                this.viewport_height = h;
                this.scrollcontent_width = w  + this.additional_width;

                if (this.options.adjust_height !== false)
                {
                    this.viewport.css('height', this.viewport_height);
                }
                this.scrollcontent.css('width', this.scrollcontent_width);
                this.scrollable = (this.scrollcontent_width > this.viewport_width);
            }
        },

        updateLayout: function(force)
        {
            var viewport_width = this.viewport.width();
            if (viewport_width > 0 && (viewport_width != this.viewport_width || force === true))
            {
                this.viewport_width = viewport_width;

                if (this.options.fit_items || this.item_outer_width > this.viewport_width)
                {
                    this.items.css('width', this.viewport_width);
                }

                this.calculateContentDimensions();

                this.scrollstep = (this.options.fit_items === true) ? this.viewport_width : this.items.first().outerWidth();
                this.x = this.index * this.scrollstep * -1;
                this.scroller.setPosition(this.x, 0);
                this.options.onUpdateLayout();
            }
        },

        updateView: function()
        {
            this.btn_left.toggleClass('disabled', (this.scroller.x >= -1 && this.options.circular === false));
            this.btn_right.toggleClass('disabled',  ((this.scroller.maxScrollX === this.scroller.x || this.viewport_width > this.scrollcontent_width) && this.options.circular === false));
            this.dom_element.toggleClass('scrollable', this.scrollable);
            this.options.onUpdateLayout();
        },

        startTimer : function()
        {
            var that = this;

            this.interval = setInterval(function()
            {
                that.next();
            }, this.options.interval);
        },

        stopTimer : function()
        {
            if (this.interval) {
                clearInterval(this.interval);
            }
        }

    };

    jsb.registerHandler('Slider', Slider);

    return Slider;

});
