// Avoid overwriting prototype if not neccessary
[].indexOf||(Array.prototype.indexOf=function(a,b,c){for(c=this.length,b=(c+~~b)%c;b<c&&(!(b in this)||this[b]!==a);b++);return b^c?b:-1;});
[].forEach||(Array.prototype.forEach=function( func, ctx ){
    var i = 0
      , self = Object(this)
      , length = self.length
      , nullErr = 'this is null or not defined'
      , funcErr = func + ' is not a function.';
    if ( this == null ) throw new TypeError(nullErr);
    if ( 'function' != typeof func ) throw new TypeError(funcErr);
    for ( ; i < length; ++i ) 
      func.call(ctx, self[i], i, self);
});

/* 
 * If no console is defined, let's replace the console with empty functions! 
 */
/*global console:true*/
if (typeof(console) === "undefined")
{
    var empty_function = function()
    {
    };

    console = {};
    console.log = empty_function;
    console.error = empty_function;
    console.info = empty_function;
    console.debug = empty_function;
    console.trace = empty_function;
}
else
{
    if (typeof console.log === 'object')
    {
        // IE hacks :(
        console.trace = function()
        {
            console.log(arguments);
        };
    }
    else
    {
        console.trace = function()
        {
            console.log.apply(this, arguments);
        };
    }
}

define("Logging", [], function()
{
    var logWithPrefix = function(prefix, log_type, args)
    {
        var i = 0;

        var logging_exclude_length = Logging.exclude.length;
        for (i = 0; i < logging_exclude_length; i++)
        {
            if (prefix.match(Logging.exclude[i]))
            {
                return ;
            }
        }

        var logging_include_length = Logging.include.length;
        for (i = 0; i < logging_include_length; i++)
        {
            if (prefix.match(Logging.include[i]))
            {
                var args_two = Array.prototype.slice.apply(args);
                args_two.unshift("[" + prefix + "]");
                if (typeof console[log_type] === "function")
                {
                    console[log_type].apply(console, args_two);
                }
                else
                {
                    console[log_type](args_two);
                }
                return ;
            }
        }
    };

    var Logging = function()
    {
    };

    Logging.prototype.logTrace = function()
    {
        if (Logging.level >= Logging.LEVEL_TRACE)
        {
            logWithPrefix(this.logging_prefix, 'trace', arguments);
        }
    };

    Logging.prototype.logDebug = function()
    {
        if (Logging.level >= Logging.LEVEL_DEBUG)
        {
            logWithPrefix(this.logging_prefix, 'log', arguments);
        }
    };

    Logging.prototype.logInfo = function()
    {
        if (Logging.level >= Logging.LEVEL_INFO)
        {
            logWithPrefix(this.logging_prefix, 'info', arguments);
        }
    };

    Logging.prototype.logWarn = function()
    {
        if (Logging.level >= Logging.LEVEL_WARN)
        {
            logWithPrefix(this.logging_prefix, 'info', arguments);
        }
    };

    Logging.prototype.logError = function()
    {
        if (Logging.level >= Logging.LEVEL_ERROR)
        {
            logWithPrefix(this.logging_prefix, 'error', arguments);
        }
    };

    Logging.prototype.addTracing = function(included_names, excluded_names) {
        var that = this;

        var excluded_logging_names = ['logTrace', 'logError', 'logDebug', 'logWarn', 'logInfo', 'addTracing'];
        excluded_names = excluded_names || [];
        if (!included_names)
        {
            included_names = [];
            for (var key in this)
            {
                if (typeof this[key] === 'function' && excluded_names.indexOf(key) === -1)
                {
                    if (excluded_logging_names.indexOf(key) === -1)
                    {
                        included_names.push(key);
                    }
                }
            }
        }

        included_names.forEach(function(function_name) {
            var original_function = that[function_name];
            that[function_name] = function() {
                that.logTrace(function_name, arguments);
                return original_function.apply(that, arguments);
            };
        });
    };

    Logging.applyLogging = function(element, class_name, add_tracing)
    {
        element.logging_prefix = class_name;
        var logging_functions = ['logTrace', 'logError', 'logDebug', 'logWarn', 'logInfo', 'addTracing'];
        for (var i = 0; i < logging_functions.length; i++)
        {
            var function_name = logging_functions[i];
            element[function_name] = element[function_name] || this.prototype[function_name];
        }

        if ((typeof add_tracing !== "undefined" && add_tracing) || false)
        {
            element.addTracing();
        }
    };

    Logging.LEVEL_ALL = 127;
    Logging.LEVEL_TRACE = 6;
    Logging.LEVEL_LOG = 5;
    Logging.LEVEL_DEBUG = 5;
    Logging.LEVEL_INFO = 4;
    Logging.LEVEL_WARN = 3;
    Logging.LEVEL_ERROR = 2;
    Logging.LEVEL_FATAL = 1;
    Logging.LEVEL_OFF = 0;

    try
    {
        Logging.level = project.logging_level;
    }
    catch(e)
    {
        Logging.level = Logging.LEVEL_OFF;
    }

    Logging.include = [
        /.*/
    ];

    Logging.exclude = [
        // /^FlashLogger/
    ];

    return Logging;
});
