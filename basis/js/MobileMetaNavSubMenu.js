// @version @PACKAGE_VERSION@

define("MobileMetaNavSubMenu", [], function() {
    
    
    var MobileMetaNavSubMenu = function(options)
    {
        this.options = options || {};
        this.initialize();
    };

    
    MobileMetaNavSubMenu.prototype = {
        
        initialize: function()
        {
             var that = this;
             
              var tpl = ['<div class="mobile_nav_container mobile_meta_nav collapsed">',
                         '    <div class="event_catcher"></div>',
                         '    <div class="view">',
                         '        <div class="inner">',
                         '            <div class="scrollbox mobile_list_view">',
                         '                <div class="scrollcontent"></div>',
                         '           </div>',
                         '       </div>',
                         '    </div>',
                         '</div>'];
            
            
             this.page = $('.page_margins');
             this.dom_element = $(tpl.join(''));
             this.view = $('.view', this.dom_element);
             this.scrollbox = $('.scrollbox', this.dom_element);
             this.scrollcontent = $('.scrollcontent', this.dom_element);
             this.scroller = new iScroll(this.scrollbox.get(0));
             
             $('.event_catcher', this.dom_element).on('click touchstart', function(e){
                 e.preventDefault();
                 that.hide();
             });
             
             this.scrollbox.on('touchstart', function(e)
             {
                 e.preventDefault();
             });
             
             jsb.on('MetaNav::SHOW', function(e){
                 that.show(e.item);
                 if (e.stopPropagation) e.stopPropagation();
             });
             
             jsb.on('MetaNav::HIDE', function(e){
                that.hide();
             });
        },
        
        setPosition: function(li)
        {
            var x = 0;
            if ($(window).width() > 767)
            {
                x = $(li).position().left;
                this.view.css({'left': x});
                $('.page_margins').append(this.dom_element);
            } else {
                this.view.css({'top': 100 - $(document).scrollTop()});
                $('body').append(this.dom_element);
            }     
        },
        
        show: function(li)
        {
            var that = this;
            var menu = $('.link_list', li).clone();
            this.setPosition(li);
            this.scrollcontent.empty();
            $('li', menu).addClass('item');
            this.scrollcontent.append(menu);
            setTimeout(function(){
                that.scroller.refresh();
            }, 100);
            
            this.dom_element.removeClass('collapsed');
        },
        
        hide: function()
        {
            this.dom_element.addClass('collapsed');
            jsb.fireEvent('MetaNav::HIDDEN');
        }
    };
    
    return MobileMetaNavSubMenu;
    
});
