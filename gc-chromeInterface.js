/*
 * © Per Johansson
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

"use strict";

const GcChromeInterface = function(conversionEnabled) {
    let buttonStatus = conversionEnabled;
    const setButtonAppearance = () => {
        const colour = buttonStatus ? "#00FF00" : "#FF0000";
        const text = buttonStatus ? "On" : "Off";
        if (typeof chrome.browserAction.setBadgeBackgroundColor === "function") {
            chrome.browserAction.setBadgeBackgroundColor({color: colour});
        }
        if (typeof chrome.browserAction.setBadgeText === "function") {
            chrome.browserAction.setBadgeText({text: text});
        }


    };
    setButtonAppearance();
    const onBrowserAction = () => {
        buttonStatus = !buttonStatus;
        setButtonAppearance();
        eventAggregator.publish("toggleConversion", {conversionEnabled: buttonStatus, url: ""});
    };
    chrome.browserAction.onClicked.addListener(onBrowserAction);

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
};
