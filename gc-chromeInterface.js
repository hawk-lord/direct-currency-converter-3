/*
 * © Per Johansson
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

"use strict";

import {eventAggregator} from './common/eventAggregator.js';

export const GcChromeInterface = function () {
    let buttonStatus = false;
    let errorMessage = null;
    const setButtonAppearance = () => {
        const colour = errorMessage ? "red" : buttonStatus ? "green" : "orange";
        const text = errorMessage ? "!" : buttonStatus ? "On" : "Off";
        chrome.action.setBadgeBackgroundColor(
            {color: colour}
        );
        chrome.action.setBadgeText(
            {text: text}
        );
        if (errorMessage) {
            chrome.action.setTitle({title: `Error: ${errorMessage}`});
        } else {
            const title = buttonStatus ? "Conversion On" : "Conversion Off";
            chrome.action.setTitle({title: title});
        }
    };

    setButtonAppearance();


    const onBrowserAction = (tab) => {

        // If there's an error, trigger quotes reset
        if (errorMessage) {
            //  console.log("GcChromeInterface: Retrying quotes after error:", errorMessage);
            eventAggregator.publish("resetQuotes");
            return;
        }

        buttonStatus = !buttonStatus;
        setButtonAppearance();
        eventAggregator.publish("toggleConversion", {conversionEnabled: buttonStatus, url: tab.url});
    };

    //  console.log("gc-chromeInterface chrome.action.onClicked.addListener");
    chrome.action.onClicked.addListener(onBrowserAction);

    const setButtonStatus = (aButtonStatus, anErrorMessage = null) => {
        //  console.log("GcChromeInterface: setButtonStatus called with:", aButtonStatus, "errorMessage:", anErrorMessage);
        buttonStatus = aButtonStatus;
        errorMessage = anErrorMessage;
        setButtonAppearance();
    };

    // Send ready signal when a new quotes tab is created
    chrome.tabs.onCreated.addListener((tab) => {
        if (tab.url && tab.url.includes("quotes.html")) {
            chrome.runtime.sendMessage({
                command: "ready",
                requestId: crypto.randomUUID()
            });
        }
    });

    // Add context menu items
    chrome.contextMenus.create({
        id: "toggle-conversion",
        title: "Toggle conversion",
        contexts: ["page"]
    });

    chrome.contextMenus.create({
        id: "open-quotes",
        title: "Open quotes page",
        contexts: ["page"]
    });

    chrome.contextMenus.create({
        id: "open-test",
        title: "Open test page",
        contexts: ["page"]
    });

    // Handle context menu clicks
    chrome.contextMenus.onClicked.addListener((info, tab) => {
        switch (info.menuItemId) {
            case "toggle-conversion":
                onBrowserAction(tab);
                break;
            case "open-quotes":
                eventAggregator.publish("showQuotesTab");
                break;
            case "open-test":
                eventAggregator.publish("showTestTab");
                break;
        }
    });

    return {
        setButtonStatus: setButtonStatus
    };
};
