/**
 * Created by netTrek GmbH & Co. KG
 * User: netTrek - Florian Diesner
 * @module core
 **/

(function (ns, $, console) {
    "use strict";

    var AbstractCorePlugin = function () {
    };

    var p = AbstractCorePlugin.prototype;

    p.register = function (player) {
        this._player = player;
    };

    p.register_event = function (eventId, clazzFnc) {
        if (!this._eventMap) {
            this._eventMap = [];
        }

        var delegateFunction = ns.Delegate.create(this, clazzFnc);
        this._eventMap.push({id: eventId, fnc: delegateFunction});

        $(this._player).on(eventId, delegateFunction);
    };

    p.dispose = function () {
        if (this._eventMap) {
            var player = this.player;
            $.each(this._eventMap, function (key, value) {
                $(player).off(value.id, value.fnc);
            });
        }
    };

	p.log = function (message) {
		//console.log(message);
	};

    ns.AbstractCorePlugin = AbstractCorePlugin;

})(ardplayer, ardplayer.jq, ardplayer.console);
