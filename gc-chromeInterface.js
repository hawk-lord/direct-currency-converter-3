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
        // console.log("GcChromeInterface onBrowserAction", tab);
        // console.log("GcChromeInterface: Action button clicked, current buttonStatus:", buttonStatus);

        if (tab) {
            // console.log("onBrowserAction tab id: " + tab.id )
        }
        // console.log("Before: " + buttonStatus);
        buttonStatus = !buttonStatus;
        // console.log("After: " + buttonStatus);
        // console.log("GcChromeInterface: New buttonStatus:", buttonStatus);

        setButtonAppearance();
        // console.log("GcChromeInterface: Publishing toggleConversion with:", {conversionEnabled: buttonStatus, url: tab.url || ""});

        eventAggregator.publish("toggleConversion", {conversionEnabled: buttonStatus, url: tab.url});
    };
    // console.log("gc-chromeInterface chrome.action.onClicked.addListener");
    chrome.action.onClicked.addListener(onBrowserAction);

    const setButtonStatus = (aButtonStatus) => {
        buttonStatus = aButtonStatus;
        setButtonAppearance();
    };

    // Send ready signal when a new quotes tab is created
    chrome.tabs.onCreated.addListener((tab) => {
        if (tab.url && tab.url.includes("quotes.html")) {
            chrome.runtime.sendMessage({
                command: "ready",
                requestId: crypto.randomUUID() // Generate a new ID for each tab
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
