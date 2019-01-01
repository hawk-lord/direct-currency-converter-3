/*
 *
 * Event function from SOLID Javascript
 * http://aspiringcraftsman.com/series/solid-javascript/
 *
 */

"use strict";

const eventAggregator = (function() {
    const grep = function grep( elems, callback, inv ) {
        let retVal,
            ret = [],
            i = 0,
            length = elems.length;
        inv = !!inv;
        // Go through the array, only saving the items
        // that pass the validator function
        for ( ; i < length; i++ ) {
            retVal = !!callback( elems[ i ], i );
            if ( inv !== retVal ) {
                ret.push( elems[ i ] );
            }
        }
        return ret;
    };
    const Event = function(name) {
        this._handlers = [];
        this.name = name;
    };
    Event.prototype.addHandler = function(handler) {
        this._handlers.push(handler);
    };
    Event.prototype.removeHandler = function(handler) {
        for (let i = 0; i < this._handlers.length; i++) {
            if (this._handlers[i] == handler) {
                this._handlers.splice(i, 1);
                break;
            }
        }
    };
    Event.prototype.fire = function(eventArgs) {
        this._handlers.forEach(function(h) {
            h(eventArgs);
        });
    };
    const events = [];
    const getEvent = function(eventName) {
        const ev = grep(events, function(event) {
            return event.name === eventName;
        });
        return ev.length > 0 ? ev[0] : null;
    };
    return {
        publish: function(eventName, eventArgs) {
            let event = getEvent(eventName);
            if (!event) {
                event = new Event(eventName);
                events.push(event);
            }
            event.fire(eventArgs);
        },
        subscribe: function(eventName, handler) {
            let event = getEvent(eventName);
            if (!event) {
                event = new Event(eventName);
                events.push(event);
            }
            event.addHandler(handler);
        }
    };
})();

if (typeof exports === "object") {
    exports.publish = eventAggregator.publish;
    exports.subscribe = eventAggregator.subscribe;
}

