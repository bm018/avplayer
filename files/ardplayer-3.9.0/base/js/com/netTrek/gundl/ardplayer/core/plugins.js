/**
 * Created by netTrek GmbH & Co. KG
 * User: netTrek - Saban Uenlue
 * @module core
 **/
(function (ns, $, console) {

	// Bind polyfill
	Function.prototype.bind = Function.prototype.bind || function (b) {
			if (typeof this !== "function") {
				throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
			}
			var a = Array.prototype.slice, f = a.call(arguments, 1), e = this, c = function () {
			}, d = function () {
				return e.apply(this instanceof c ? this : b || window, f.concat(a.call(arguments)));
			};
			c.prototype = this.prototype;
			d.prototype = new c();
			return d;
		};

	// IndexOf Polyfill
	if (!Array.prototype.indexOf) {
		Array.prototype.indexOf = function (searchElement, fromIndex) {
			if ( this === undefined || this === null ) {
				throw new TypeError( '"this" is null or not defined' );
			}

			var length = this.length >>> 0; // Hack to convert object.length to a UInt32

			fromIndex = +fromIndex || 0;

			if (Math.abs(fromIndex) === Infinity) {
				fromIndex = 0;
			}

			if (fromIndex < 0) {
				fromIndex += length;
				if (fromIndex < 0) {
					fromIndex = 0;
				}
			}

			for (;fromIndex < length; fromIndex++) {
				if (this[fromIndex] === searchElement) {
					return fromIndex;
				}
			}

			return -1;
		};
	}

	// Loest ggf. noch vorhandene Instanzen, die unsere GarbadgeCollections stoeren.
	ns.purge = function (d) {
		if ( !d )
			return;
		var a = d.attributes, i, l, n;
		if (a) {
			for (i = a.length - 1; i >= 0; i -= 1) {
				n = a[i].name;
				if (typeof d[n] === 'function') {
					if (d[n] !== null )
					{
						d[n] = null;
					}
				}
			}
		}
		a = d.childNodes;
		if (a) {
			l = a.length;
			for (i = 0; i < l; i += 1) {
				ns.purge(d.childNodes[i]);
			}
		}
	};

	// Entfernt alle, oder nur angegebene Player komplett aus dem Speicher.
	ns.removeArdPlayer = function ()
	{
		var purgeAll = arguments.length == 0 || arguments[0] == "all";

		var argumentsPlayerIds = [];
		$.each(arguments, function (key, value) {
			if ( value.toLowerCase() != "all" )
			{
				argumentsPlayerIds.push(value);
			}
		});

		var disposePlayers = [];
		$.each(ns.PlayerModel.getAllPlayer(), function (key, value) {
			var playerId = value.getId();

			if ( purgeAll || argumentsPlayerIds.indexOf(playerId) >= 0 )
			{
				disposePlayers.push(playerId);
			}
		});

		while ( disposePlayers.length > 0 )
		{
			var playerId = disposePlayers.pop();

			var player = ns.PlayerModel.getPlayerById(playerId);

			player.stop();
			player.dispose();

			ns.PlayerModel.forceRemovePlayer(player);
			ns.ViewController.forceRemovePlayer(player);

			if ( ns.PlayerModel.autoPlayerAlreadyActive == playerId )
				ns.PlayerModel.autoPlayerAlreadyActive = false;

			var playerDom = $("#" + playerId);

			$(playerDom).remove();
			ns.purge(playerDom[0]);
		}

		if ( purgeAll )
		{
			ns.GlobalModel.resetSingleton();
			ns.ErrorController.resetSingleton();
			ns.ViewController.resetSingleton();
			ns.PlayerModel.resetSingleton();
			ns.Cookie.resetSingleton();
			ns.QueryParser.resetSingleton();
		}
	};

	// Dispatcher für Flash Plugins, die nach erfolgreicher Initialisierung die "PluginReady" aufrufen.
	ns.pluginCallbacks = {};
	ns.pluginReady = function (id) {
		if (ns.pluginCallbacks[ id ] && typeof ns.pluginCallbacks[ id ] === "function")
			ns.pluginCallbacks[ id ]();
	};
	ns.pluginAddListener = function (id, callback) {
		ns.pluginCallbacks[id] = callback;
	};
	ns.pluginRemoveListener = function (id) {
		ns.pluginCallbacks[id] = null;
		delete ns.pluginCallbacks[id];
	};
	ns.pluginHasListener = function (id) {
		return ns.pluginCallbacks[id] != null && ns.pluginCallbacks[id] != undefined;
	};

	// place any jQuery/helper plugins in here, instead of separate, slower script files.
	var Delegate = new Object();
	Delegate.create = function create(obj, func) {
		var f = function () {
			var arg = new Array();
			for (var i = 0; i < arguments.length; i++)
				arg.push(arguments [i]);
			return func.apply(obj, arg);
		};
		return f;
	};
	ns.Delegate = Delegate;

    /**
     * Create and return a "version 4" RFC-4122 UUID string.
     * Original author Robert Kieffer,
     *
     * randomUUID.js - Version 1.0
     *
     * Copyright 2008, Robert Kieffer
     *
     * This software is made available under the terms of the Open Software License
     * v3.0 (available here: http://www.opensource.org/licenses/osl-3.0.php )
     *
     * The latest version of this file can be found at:
     * http://www.broofa.com/Tools/randomUUID.js
     *
     * For more information, or to comment on this, please go to:
     * http://www.broofa.com/blog/?p=151
     */
    $.randomUUID = function () {
        var s = [], itoh = '0123456789ABCDEF';

        // Make array of random hex digits. The UUID only has 32 digits in it, but we
        // allocate an extra items to make room for the '-'s we'll be inserting.
        for (var i = 0; i < 36; i++) s[i] = Math.floor(Math.random() * 0x10);

        // Conform to RFC-4122, section 4.4
        s[14] = 4;  // Set 4 high bits of time_high field to version
        s[19] = (s[19] & 0x3) | 0x8;  // Specify 2 high bits of clock sequence

        // Convert to hex chars
        for (var i = 0; i < 36; i++) s[i] = itoh[s[i]];

        // Insert '-'s
        s[8] = s[13] = s[18] = s[23] = '-';

        return s.join('');
    };

    $.crossbrowserPosition = function (event, baseCalcOnElement) {

        // Shift event to touch for mobile devices (clientX available again)
        if ((event.type || "").indexOf("touch") === 0) {
            event = event.originalEvent.changedTouches[0];
        }
        
        var obj = baseCalcOnElement || event.target,
            boundingRect = obj.getBoundingClientRect(),
            relativeX = event.clientX - boundingRect.left,
            relativeY = event.clientY - boundingRect.top;

        return {left: relativeX, top: relativeY};
    };

    $.loadImages = function (sources, callback) {
        var images = {};
        var loadedImages = 0;
        var numImages = 0;
        // get num of sources
        for (var src in sources) {
            numImages++;
        }
        for (var src in sources) {
            images[src] = new Image();
            images[src].onload = function () {
                if (++loadedImages >= numImages) {
                    callback(images);
                }
            };
            images[src].src = sources[src];
        }
    };

    $.isBlank = function (obj) {
        return(!obj || $.trim(obj) === "");
    };

    $.randomRange = function (min, max) {
        return ((Math.random() * (max - min)) + min);
    };

    $.fn.ctrl = function (key, callback) {
        if (typeof key != 'object') key = [key];
        callback = callback || function () {
            return false;
        };
        return $(this).keydown(function (e) {
            var ret = true;
            $.each(key, function (i, k) {
                if (e.keyCode == k.toUpperCase().charCodeAt(0) && e.ctrlKey) {
                    ret = callback(e);
                }
            });
            return ret;
        });
    };

    $.fn.exists = function(){return this.length>0;}

	$.fn.isHiddenByClass = function () {
		return this.hasClass("ardplayer-hideclass");
	};

    $.fn.hideWithClass = function () {
        return this.each(function () {
            return $(this).addClass("ardplayer-hideclass");
        });
    };

    $.fn.showWithClass = function () {
        return this.each(function () {
            return $(this).removeClass("ardplayer-hideclass");
        });
    };

    $.fn.disableSelection = function () {
        $(ns).ctrl(['a', 's', 'c']);
        return this.each(function () {
            $(this).attr('unselectable', 'on')
                .addClass("disableUserSelectionOption")
                .each(function () {
                    $(this).attr('unselectable', 'on')
                        .on('selectstart', function () {
                            return false;
                        });
                });
        });
    };

	$.fn.removeClassPrefix = function(prefix) {
		this.each(function(i, el) {
			var classes = el.className.split(" ").filter(function(c) {
				return c.lastIndexOf(prefix, 0) !== 0;
			});
			el.className = $.trim(classes.join(" "));
		});
		return this;
	};

})(ardplayer, ardplayer.jq, ardplayer.console);
