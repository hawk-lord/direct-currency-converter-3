/*
 * © Per Johansson
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

"use strict";

/*

Used API methods old version

chrome.runtime.onMessage.addListener(finishedTabProcessingHandler);
chrome.runtime.onMessage.addListener(quotesListener);
chrome.runtime.onMessage.hasListener(finishedTabProcessingHandler)) {
chrome.tabs.create({"url": "http://home.aland.net/ma37296-p1/extensions/prices.html"});
chrome.tabs.create({"url": chrome.extension.getURL("common/quotes.html")}, quotesCallback);
chrome.tabs.executeScript(tabId, {file: "common/dcc-content.js", allFrames: true}, () => {
chrome.tabs.executeScript(tabId, {file: "common/dcc-regexes.js", allFrames: true}, () => {
chrome.tabs.executeScript(tabId, {file: "dcc-chrome-content-adapter.js", allFrames: true},
chrome.tabs.insertCSS(tabId, {file: "title.css", allFrames: true});
chrome.tabs.onUpdated.addListener(sendSettingsToPage);
chrome.tabs.onUpdated.hasListener(sendSettingsToPage)) {
chrome.tabs.query({}, updateActiveTabs);
chrome.tabs.sendMessage(tabId, new Settings(anInformationHolder))
chrome.tabs.sendMessage(tabId, status)

 */

/*

State machine.

On install and activate:

Send scripts to every page visited, except blacklisted.
OR
Send scripts to every page in whitelist.

When script is loaded, ask for state.

If ON, send message to convert.

If OFF -> ON, send message to convert

If ON -> OFF, remove conversions.

If HIDE -> SHOW, show converted.

If SHOW -> HIDE, hide converted.


On new tab or navigate
Same as above.


Keep conversion regexes in main and send them with settings somehow.



 */



const GcContentInterface = function(anInformationHolder) {
    const sendEnabledStatus = (tabId, status) => {
        try {
            chrome.tabs.sendMessage(tabId, status)
        }
        catch (err) {
            console.error(err);
        }
    };
    const finishedTabProcessingHandler = (aParameters) => {
        if (aParameters.command === "getEnabledState") {
            try {
                //console.log("finishedTabProcessingHandler " + aParameters.url);
                eventAggregator.publish("toggleConversion",
                    {"conversionEnabled": anInformationHolder.conversionEnabled, "url": aParameters.url});
            }
            catch (err) {
                console.error("finishedTabProcessingHandler " + err);
            }
        }
    };

    /**
     * Called from tabs.onUpdated
     *
     * @param tabId
     * @param changeInfo
     * @param tab
     */
    const sendSettingsToPage = (tabId, changeInfo, tab) => {
        console.log("sendSettingsToPage " + tabId + " status " + changeInfo.status + " url " + changeInfo.url);
        const onScriptExecuted = () => {
            // console.log("onScriptExecuted tabId " + tabId);
            try {
                if (!chrome.runtime.onMessage.hasListener(finishedTabProcessingHandler)) {
                    console.log("Add finishedTabProcessingHandler");
                    chrome.runtime.onMessage.addListener(finishedTabProcessingHandler);
                }
                chrome.tabs.sendMessage(tabId, new Settings(anInformationHolder))
            }
            catch (err) {
                console.error(err);
            }
        };
        if (changeInfo.status === "complete" && tab && tab.url && tab.url.includes("http")
            && !tab.url.includes("https://chrome.google.com/webstore")
            && !tab.url.includes("https://addons.opera.com") ) {
            console.log("DCC executeScript tabId " + tabId + " URL " + tab.url);
            // console.log("customTabObjects[tabId] " + customTabObjects[tabId]);
            chrome.tabs.insertCSS(tabId, {file: "title.css", allFrames: true});
            //chrome.tabs.executeScript(tabId, {file: "common/dcc-regexes.js", allFrames: true}, () => {
                chrome.tabs.executeScript(tabId, {file: "content/dcc-content.js", allFrames: true}, () => {
                    chrome.tabs.executeScript(tabId, {file: "gc-content-adapter.js", allFrames: true},
                        onScriptExecuted);
                });
            //});
        }
    };

    const watchForPages = () => {
        if (!chrome.tabs.onUpdated.hasListener(sendSettingsToPage)) {
            console.log("Add sendSettingsToPage");
            chrome.tabs.onUpdated.addListener(sendSettingsToPage);
        }
    };

    const toggleConversion = (aParameters) => {
        //console.log("DCC toggleConversion " + aParameters.conversionEnabled);
        const updateTab = (aTab) => {
            // console.log("updateTab " + aTab.id + " " + aStatus);
            anInformationHolder.conversionEnabled = aParameters.conversionEnabled;
            const makeEnabledStatus = (tabId) => {
                const status = {};
                status.isEnabled = aParameters.conversionEnabled;
                status.hasConvertedElements = false;
                status.url = aParameters.url;
                try {
                    sendEnabledStatus(tabId, status);
                }
                catch(err) {
                    console.error("ContentInterface: " + err);
                }
            };
            makeEnabledStatus(aTab.id);
        };
        const updateActiveTabs = (aTabs) => {
            aTabs.map(updateTab);
        };
        chrome.tabs.query({}, updateActiveTabs);
    };

    const showQuotesTab = () => {
        const quotesListener = (message, sender, sendResponse) => {
            sendResponse(new Settings(anInformationHolder));
        };
        const quotesCallback = (aTab) => {
            chrome.runtime.onMessage.addListener(quotesListener);
        };
        chrome.tabs.create({"url": chrome.extension.getURL("quotes.html")}, quotesCallback);
    };

    const showTestTab = () => {
        chrome.tabs.create({"url": "http://home.aland.net/ma37296-p1/extensions/prices.html"});
    };

    return {
        watchForPages: watchForPages,
        toggleConversion: toggleConversion,
        showQuotesTab: showQuotesTab,
        showTestTab: showTestTab
    }
};

if (typeof exports === "object") {
    exports.GcContentInterface = GcContentInterface;
}
