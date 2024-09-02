/*
 * © Per Johansson
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

"use strict";

import {eventAggregator} from './common/eventAggregator.js';

export const GcChromeInterface = function(conversionEnabled) {
    let buttonStatus = false;
    const setButtonAppearance = () => {
        const colour = buttonStatus ? "green" : "red";
        const text = buttonStatus ? "On" : "Off";
		chrome.action.setBadgeBackgroundColor(
		  {color: colour}
		);
		chrome.action.setBadgeText(
		  {text: text}
		);

    };
    setButtonAppearance();
    const onBrowserAction = (tab) => {
		if (tab) {
			console.log("onBrowserAction tab id: " + tab.id )
		}
		console.log("Before: " + buttonStatus);
		buttonStatus = !buttonStatus;
		console.log("After: " + buttonStatus);
        setButtonAppearance();
        console.log("toggleConversion");
        eventAggregator.publish("toggleConversion", {conversionEnabled: buttonStatus, url: ""});
    };
	console.log("gc-chromeInterface chrome.action.onClicked.addListener");
    chrome.action.onClicked.addListener(onBrowserAction);
    
    const setButtonStatus = (aButtonStatus) => {
		buttonStatus = aButtonStatus;
		setButtonAppearance();
	}

    const onMessageFromPanel = (message, sender, sendResponse) => {
        if (message.command === "toggleConversion") {
            onBrowserAction();
        }
        else if (message.command === "showQuotesTab") {
            eventAggregator.publish("showQuotesTab");
        }
        else if (message.command === "showTestTab") {
            eventAggregator.publish("showTestTab");
        }
    };
    chrome.runtime.onMessage.addListener(onMessageFromPanel);
    
	return {
        setButtonStatus: setButtonStatus
    }

};
