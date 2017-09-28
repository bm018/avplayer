// @version @PACKAGE_VERSION@

define("MobileMainNav", [], function(MobileMainNavSubMenu) {


    var MobileMainNav = function(dom_element, options)
    {
        this.dom_element = $(dom_element);
        this.options = options;
        this.initialize();
    };

    jsb.registerHandler("MobileMainNav", MobileMainNav);


    MobileMainNav.prototype = {

        initialize: function()
        {
             var that = this;

              var tpl = ['<div class="mobile_nav_container mobile_main_nav collapsed">',
                         '    <div class="event_catcher"></div>',
                         '    <div class="view">',
                         '        <div class="inner">',
                         '            <div class="scrollbox mobile_list_view">',
                         '                <div class="scrollcontent"></div>',
                         '                <span tabindex="0"></span>',
                         '           </div>',
                         '       </div>',
                         '    </div>',
                         '</div>'];


             var menu = $('.level_1', this.dom_element).clone();
             var rbb = $('<li></li>');
             rbb.append($('.js_about_rbb > a').first().clone());
             menu.append(rbb);
             $('li', menu).first().remove();
             $('li', menu).addClass('item');

             this.view = $(tpl.join(''));
             this.scrollbox = $('.scrollbox', this.view);
             this.scrollcontent = $('.scrollcontent', this.view);
             this.scrollcontent.append(menu);

             this.btn_toggle = $('.js_menu_toggle', this.dom_element);

             this.btn_toggle.on('click', function(){
                 that.btn_toggle.blur();
                 that.toggleView();
             });

             /* close flyout when clicked somewhere else */
             $('.event_catcher', this.view).on('click touchstart', function(e){
                 e.preventDefault();
                 e.stopPropagation();
                 that.hide();
             });

             jsb.on('MetaNav::SHOW', function(){
                 that.hide();
             });

             $('body').append(this.view);

             $('li a', '.mobile_main_nav .level_1').last().on('focusout', function()
             {
                that.hide();
             });

        },

        calculateLayout: function()
        {
            var width = 0;
            this.items.each(function(index, el){
                width += $(el).outerWidth(true);
            });
            this.scrollcontent.css('width', width);
        },

        toggleView: function()
        {
            if (this.view.hasClass('collapsed'))
            {
                this.show();

                if (!Modernizr.touch) {
                    $('.mobile_main_nav .level_1 li a').first().focus();
                }
            }else{
                this.hide();
            }
        },

        show: function()
        {
            jsb.fireEvent('MetaNav::HIDE');
            this.view.removeClass('collapsed');
            $('.view', this.view).css('max-height', this.scrollcontent.height() + 5);
        },

        hide: function()
        {
            this.view.addClass('collapsed');
        }
    };

});
