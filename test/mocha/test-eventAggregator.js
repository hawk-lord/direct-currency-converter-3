
"use strict";

const eventAggregator = require("../../common/eventAggregator");
const assert = require("chai").assert;


describe("EventAggregator", () => {

    it("should subscribe and publish", () => {
        let called = false;
        const eventName = "message";
        const eventArgs = { foo : "bar" };
        const callback = (data) => {
                called = (data === eventArgs);
            };
        eventAggregator.subscribe(eventName, callback);
        eventAggregator.publish(eventName, eventArgs);
        assert(called);
    });

});

