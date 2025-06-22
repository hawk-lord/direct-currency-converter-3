/*
 * © Per Johansson
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

"use strict";

import {eventAggregator} from '../../common/eventAggregator.js';
import {assert} from 'chai';


describe("EventAggregator", () => {

    it("should subscribe and publish", () => {
        let called = false;
        const eventName = "message";
        const eventArgs = {foo: "bar"};
        const callback = (data) => {
            called = (data === eventArgs);
        };
        eventAggregator.subscribe(eventName, callback);
        eventAggregator.publish(eventName, eventArgs);
        assert(called);
    });

});

