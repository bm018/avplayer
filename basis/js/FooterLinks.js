// @version @PACKAGE_VERSION@

define("FooterLinks", [], function() {

    var FooterLinks = function(dom_element, options)
    {
        this.dom_element = $(dom_element);
        this.options = options;
        this.firstEntry = 'Auswahl';
        /*
        this.viewportmeta = document.querySelector && document.querySelector('meta[name="viewport"]');
        this.vpcontentstring = 'width=device-width, user-scalable=yes, initial-scale=1, maximum-scale=';
        */
        this.initialize();
    };

    FooterLinks.prototype = {

        initialize: function()
        {
            var that = this;
            var selects = $('select', this.dom_element);

            $('<option selected>' + that.firstEntry + '</option>').prependTo(selects);

            selects.on('change', function(e){
                var link = this.options[this.selectedIndex].value;
                if (link) window.location.href = link;
            });

            /*

            if (this.viewportmeta && this.viewportmeta.content) {
                selects.on('focus', function () {
                    that.viewportmeta.content = that.vpcontentstring + '1';
                });

                selects.on('blur', function () {
                    that.viewportmeta.content = that.vpcontentstring + '10';
                });
            };

            */
        }
    };

    jsb.registerHandler('FooterLinks', FooterLinks);

});
