// @version @PACKAGE_VERSION@

define("MetaNav", ['MobileMetaNavSubMenu'], function(MobileMetaNavSubMenu) {

    var MetaNav = function(dom_element, options) {
        this.scrollstep = 150;
        this.space_for_btn = 50;
        this.isIntranet = (/site\_intranet/gi).test(document.body.className);
        this.intranetHomeWidth = 110;
        this.dom_element = $(dom_element);
        this.options = options;
        var that = this;

        setTimeout(function()
        {
            if ( !$('html').hasClass('ie8') )
            {
                that.initialize();
            }
        }, 50);
    };

    jsb.registerHandler("MetaNav", MetaNav);


    MetaNav.prototype.centerItem = function(item) {
        if (item)
        {
            var item_x = $(item).position().left;
            var item_width = $(item).outerWidth(true);
            var viewport_width = this.dom_element.width();
            var offset_x = this.scrollcontent.position().left;

            if (offset_x + item_x + item_width > viewport_width)
            {
                var tar_x = -item_x + ((viewport_width - item_width) / 2);
                this.scroller.scrollTo(tar_x, 0, 300);
            }
            else if (item_width > viewport_width)
            {
                this.scroller.scrollToElement(item, 300);
            }
            else if (offset_x + item_x < 0)
            {
                this.scroller.scrollTo(Math.floor(offset_x + item_x) - 1, 0, 300, true);
            };
        }
    };

    if ( Modernizr.touch )
    {
        MetaNav.prototype.initialize = function()
        {
            var that = this;

            this.scrollcontent = this.dom_element.find('.level_2');
            this.items = this.scrollcontent.children('li');
            this.calculateLayout();

            // init iScroll
            this.scroller = new iScroll(this.dom_element.get(0),
            {
                vScroll : false,
                hScrollbar : false,
                useTransform: false,
                onScrollMove : function()
                {
                    that.hideSubMenu();
                }
            });

            this.dom_element.css('overflow', 'visible');

            // close subnav
            this.items.on('touchstart', function(e)
            {
                e.preventDefault();
                var item = e.currentTarget;

                if (item === that.current_item)
                {
                    that.hideSubMenu();
                }
                else
                {
                		if (item) {
                      var sub_menu = $(item).find('.link_list');

                      if (sub_menu.length > 0) {
                          that.current_item = item;
                          that.showSubMenu(item);
                          that.centerItem(item);
                      }
                		}
                }
            });

            /*
             * enables scrolling inside submenues on touch devices by avoiding event bubbling to outer li
             * which prevents default behaviour
             */
            $('.link_list > li', this.items).on('touchstart', function(e)
            {
                e.stopPropagation();
            });

            // find active elements and goto first one
            var active_elements = that.scrollcontent.find('.active');

            if ( active_elements.length > 0 ) {
                if (that.isIntranet) {
                    this.scroller.scrollTo(0 - $(active_elements[0]).position().left + this.intranetHomeWidth, 500);
                } else {
                    this.centerItem( active_elements[0]);
                    this.scroller.scrollToElement(active_elements[0], 500);
                }
            }

            // create new MobileNav
            if ( window.innerWidth <= 640 )
            {
                this.sub_menu = new MobileMetaNavSubMenu();
            }

            if (window.innerWidth <= 975)
            {
                    that.scrollcontent.css('position', 'absolute');
                    that.scrollcontent.css('width', that.content_width);
            }
            else
            {
                    that.scrollcontent.css('position', 'static');
                    that.scrollcontent.css('width', '975px');
            }

            jsb.on('MetaNav::HIDDEN', function()
            {
                that.onHideSubMenu();
            });

            // reInit on resize
            $(window).on('resize', _.debounce(function()
            {
                if (window.innerWidth <= 975)
                {
                    that.scrollcontent.css('position', 'absolute');
                    that.scrollcontent.css('width', that.content_width);
                }
                else
                {
                    that.scrollcontent.css('position', 'static');
                    that.scrollcontent.css('width', '975px');
                }

                that.scroller.refresh();

            }, 100));
        };

        MetaNav.prototype.calculateLayout = function()
        {
            var width = 0;

            this.items.each(function(index, el)
            {
                width += $(el).outerWidth(true) + 1;
            });

            this.content_width = width;
            this.scrollcontent.css('width', width);
        };

        /*
        MetaNav.prototype.centerItem = function(item) {
            if (item)
            {
                var item_x = $(item).position().left;
                var item_width = $(item).width();
                var viewport_width = this.dom_element.width();
                var offset_x = this.scrollcontent.position().left;

                if ((item_x + item_width > viewport_width && item_width < viewport_width))
                {
                    var tar_x = -item_x + ((viewport_width - item_width) / 2);
                    this.scroller.scrollTo(tar_x, 0, 300);
                }
                else if (item_width > viewport_width || item_x < 0)
                {
                    this.scroller.scrollToElement(item, 300);
                }
            }
        };
        */

        MetaNav.prototype.showSubMenu = function(item)
        {
            jsb.fireEvent('MetaNav::SHOW',
            {
                item : item
            });
        };

        MetaNav.prototype.hideSubMenu = function()
        {
            jsb.fireEvent('MetaNav::HIDE');
        };

        MetaNav.prototype.onHideSubMenu = function()
        {
            this.current_item = null;
            this.items.removeClass('toggled');
        };

    }
    // no touch device
    else
    {

        MetaNav.prototype.initialize = function()
        {
            var that = this;

            this.scrollcontent = this.dom_element.find('.level_2');
            this.items = this.scrollcontent.find(' > li');
            this.header = $('#header');
            this.btn_left = this.header.find('.btn_scroll_sub_nav.left');
            this.btn_right = this.header.find('.btn_scroll_sub_nav.right');

            this.calculateContentWidth();

            // handle next/prev buttons
            this.header.on('click', '.btn_scroll_sub_nav', function(e)
            {
                switch($(e.currentTarget).attr('data-direction')) {
                    case "left":
                        that.scroll(1);
                        break;
                    case "right":
                        that.scroll(-1);
                        break;
                }

            });

            // reInit on resize
            $(window).on('resize', _.debounce(function()
            {
                that.updateView();
            }, 500));

            this.initTabKeyNavigation();
            this.updateView();
        };

        MetaNav.prototype.initTabKeyNavigation = function()
        {
            var that = this;

            this.scrollcontent.children('li').on('focusin', function(event)
            {
                if (that.scroller)
                {
                    var index = that.items.index(event.currentTarget);
                    var focused_element = that.items.eq(index);
                    that.centerItem(focused_element.get(0));
                }
            });
        };

        MetaNav.prototype.scroll = function(direction)
        {
            var tar_x = this.scroller.x + (this.scrollstep * direction);

            if (direction < 0)
            {
                if (Math.abs(this.scroller.maxScrollX - tar_x) < this.scrollstep)
                {
                    tar_x = this.scroller.maxScrollX;
                }
            }
            else
            {
                if (Math.abs(tar_x) < this.scrollstep)
                {
                    tar_x = 0;
                }
            }

            this.scroller.scrollTo(tar_x, 0, 200);
        };

        MetaNav.prototype.calculateContentWidth = function()
        {
            var width = 0;

            this.items.each(function(index, el)
            {
                width += $(el).outerWidth(true) + 2;
            });

            this.content_width = width;
        }

        MetaNav.prototype.updateView = function()
        {
            var that = this;
            var scrollable = (this.content_width + this.space_for_btn) > this.dom_element.width();

            // add class scrollable when scrollable
            this.header.toggleClass('scrollable', scrollable);

            //init iScroll if scrollable
            if (scrollable)
            {
                this.scrollcontent.css('width', this.content_width + this.space_for_btn);

                if (!this.scroller)
                {
                    this.scroller = new iScroll(this.dom_element.get(0),
                    {
                        vScroll : false,
                        hScrollbar : false,
                        onScrollEnd : function() {
                            that.updateView();
                        }
                    });

                    if ($('.active', that.scrollcontent).get(0))
                    {
                        setTimeout(function() {
                            that.centerItem($('.active', that.scrollcontent).get(0), 500);
                        }, 1000);
                    }
                }

                this.dom_element.css('overflow', 'visible');
                this.scroller.refresh();
                this.btn_left.toggleClass('hide', (this.scroller.x === 0));
                this.btn_right.toggleClass('hide', (this.scroller.x === this.scroller.maxScrollX));
                this.header.toggleClass('scrollable', (this.scroller.maxScrollX !== 0));
            }
            // destroy iScroll if not scrollable
            else
            {
                if (this.scroller)
                {
                    this.scroller.destroy();
                    this.scrollcontent.css('position', 'static');
                    this.scrollcontent.css('width', '');
                    this.scroller = null;
                }
            }
        }
    };
});
