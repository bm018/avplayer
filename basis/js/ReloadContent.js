define('ReloadContent', ['Logging'], function(logging)
{
    "use strict";

    var ReloadContent = function(dom_element, options)
    {
        this.options = {
            interval: 60, /* sec */
            url: null
        };

        logging.applyLogging(this, 'ReloadContent', true);
        this.dom_element = $(dom_element);
        this.options = $.extend(this.options, options);

        if (!this.options.url)
        {
            this.logError('URL option is missing!');
            return;
        }

        this.initializeInterval();
    };

    jsb.registerHandler("ReloadContent", ReloadContent);

    ReloadContent.prototype.initializeInterval = function()
    {
        var that = this;
        this.interval = window.setInterval(function()
        {
            that.reload();

        }, this.options.interval * 1000);
    };

    ReloadContent.prototype.reload = function()
    {
        var that = this;
        $.ajax(this.options.url, {
            success: function(result)
            {
                that.dom_element.empty();
                that.dom_element.append(result);
            },
            error: function()
            {
                that.logError('Unable to reload content of element', that.dom_element);
            }
        });
    };

    return ReloadContent;
});
