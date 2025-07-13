/*
 * © Per Johansson
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

"use strict";

import {Settings} from './common/settings.js';
import {DccFunctions} from './common/functions.js';
import {TabState} from './common/tab-state.js';


export const GcContentInterface = function (anInformationHolder, aChromeInterface) {

    const tabIdStates = [];

    const checkScriptInjected = (tabId, callback) => {
        let tabIdState = tabIdStates.find(t => t.tabId === tabId);
        if (tabIdState && tabIdState.isInjected) {
          //console.log(`checkScriptInjected: Tab ${tabId} already marked as injected`);
            callback(true);
            return;
        }

        chrome.tabs.sendMessage(tabId, {action: 'ping'}, {frameId: 0}, (response) => {
            if (chrome.runtime.lastError || !response || response.status !== 'pong') {
              //console.log(`checkScriptInjected: Ping failed for tab ${tabId}, error:`, chrome.runtime.lastError?.message);
                callback(false);
            } else {
              //console.log(`checkScriptInjected: Ping succeeded for tab ${tabId}`);
                if (!tabIdState) {
                    tabIdState = new TabState(tabId, false, true);
                    tabIdStates.push(tabIdState);
                } else {
                    tabIdState.isInjected = true;
                }
                callback(true);
            }
        });
    };

    /**
     status.isEnabled = aParameters.conversionEnabled;
     status.hasConvertedElements = false;
     status.url = aParameters.url;
     */
    const sendEnabledStatus = (tabId, status) => {
      //console.log(`sendEnabledStatus: Processing tab ${tabId}, isEnabled: ${status.isEnabled}, url: ${status.url}`);
        const settings = new Settings(anInformationHolder);

        const injectScript = () => {
            try {
                chrome.scripting.insertCSS({
                    target: {tabId: tabId, allFrames: true},
                    files: ["title.css"]
                }).catch((err) => {
                    console.error(`Failed to insert CSS for tab ${tabId}:`, err);
                });
                chrome.scripting.executeScript({
                    target: {tabId: tabId, allFrames: true},
                    files: ["content-bundle.js"]
                }).then(() => {
                    let tabIdState = tabIdStates.find(t => t.tabId === tabId);
                    if (!tabIdState) {
                        tabIdState = new TabState(tabId, false, true);
                        tabIdStates.push(tabIdState);
                    } else {
                        tabIdState.isInjected = true;
                    }
                  //console.log(`sendEnabledStatus: Script injected into tab ${tabId}`);
                    sendMessage();
                }).catch((err) => {
                    console.error(`Failed to execute script for tab ${tabId}:`, err);
                });

            } catch (err) {
                console.error(`Failed to execute script for tab ${tabId}:`, err);
            }
        };

        const sendMessage = () => {
            try {
                const frameId = status.url.startsWith(`chrome-extension://${chrome.runtime.id}/`) ? undefined : 0;
                chrome.tabs.sendMessage(tabId, settings, {frameId}, (response) => {
                    if (chrome.runtime.lastError) {
                        console.error(`Failed to send message to tab ${tabId}, frameId: ${frameId || 'all'}:`, chrome.runtime.lastError.message);
                        if (chrome.runtime.lastError.message.includes('message port closed') && !status.url.startsWith(`chrome-extension://${chrome.runtime.id}/`)) {
                          //console.log(`sendEnabledStatus: Retrying injection for tab ${tabId} due to closed port`);
                            let tabIdState = tabIdStates.find(t => t.tabId === tabId);
                            if (tabIdState) {
                                tabIdState.isInjected = false;
                            }
                            injectScript();
                        }
                    } else {
                      //console.log(`Settings message sent to tab ${tabId}, frameId: ${frameId || 'all'}, isEnabled: ${status.isEnabled}`);
                    }
                });
            } catch (err) {
                console.error(`Failed to send message to tab ${tabId}:`, err);
            }
        };

        if (settings.includedDomains && settings.includedDomains.length > 0 && !DccFunctions.isUrlInArray(settings.includedDomains, status.url)) {
          //console.log(`sendEnabledStatus: Tab ${tabId} URL ${status.url} not in includedDomains`);
            return;
        }

        if (DccFunctions.isUrlInArray(settings.excludedDomains, status.url)) {
          //console.log(`sendEnabledStatus: Tab ${tabId} URL ${status.url} is in excludedDomains`);
            return;
        }

        const internalPageUrl = `chrome-extension://${chrome.runtime.id}/`;
        if (status.url.startsWith(internalPageUrl)) {
          //console.log(`sendEnabledStatus: Internal page ${status.url}, assuming script injected, sending settings`);
            sendMessage();
            return;
        }

        checkScriptInjected(tabId, (isInjected) => {
            if (isInjected) {
              //console.log(`sendEnabledStatus: Script already injected in tab ${tabId}, sending settings`);
                sendMessage();
                return;
            }

            if (!status.isEnabled) {
              //console.log(`sendEnabledStatus: Conversion disabled for tab ${tabId}, sending settings without injection`);
                sendMessage();
                return;
            }

            injectScript();
        });
    };

    const tabOnUpdated = (tabId, changeInfo, tab) => {
        let tabIdState = tabIdStates.find(t => t.tabId === tabId);
        if (!tabIdState) {
            tabIdState = new TabState(tabId, false, false);
            tabIdStates.push(tabIdState);
        } else if (changeInfo.status === 'complete') {
            tabIdState.isInjected = false;
            tabIdState.state = false;
          //console.log(`tabOnUpdated: Reset tab ${tabId} state and isInjected on status complete`);
        }
        aChromeInterface.setButtonStatus(tabIdState.state);
    };

    const tabOnActivated = (tab) => {
        let tabIdState = tabIdStates.find(t => t.tabId === tab.tabId);
        if (!tabIdState) {
            tabIdState = new TabState(tab.tabId, false, false);
            tabIdStates.push(tabIdState);
        }

        aChromeInterface.setButtonStatus(tabIdState.state);
    };

    const watchForPages = () => {
        chrome.tabs.onUpdated.addListener(tabOnUpdated);
        chrome.tabs.onActivated.addListener(tabOnActivated);
        chrome.tabs.onRemoved.addListener((tabId) => {
            const index = tabIdStates.findIndex(t => t.tabId === tabId);
            if (index !== -1) {
                tabIdStates.splice(index, 1);
              //console.log(`tabOnRemoved: Removed tab ${tabId} from tabIdStates`);
            }
        });
    };

    /**
     * aParameters {conversionEnabled: buttonStatus, url: ""}
     */
    const toggleConversion = (aParameters) => {
        const updateTab = (aTab) => {
            if (aTab.url && aTab.url.startsWith("chrome://")) {
              //console.log(`toggleConversion: Skipping chrome:// URL for tab ${aTab.id}`);
                return;
            }
            anInformationHolder.conversionEnabled = aParameters.conversionEnabled;
            const makeEnabledStatus = (tabId) => {
                const status = {};
                status.isEnabled = aParameters.conversionEnabled;
                status.hasConvertedElements = false;
                status.url = aParameters.url || aTab.url;
              //console.log(`makeEnabledStatus: Tab ${tabId}, isEnabled: ${status.isEnabled}, url: ${status.url}`);
                try {
                    sendEnabledStatus(tabId, status);
                } catch (err) {
                    console.error(`ContentInterface: Error in makeEnabledStatus for tab ${tabId}:`, err);
                }
                let tabIdState = tabIdStates.find(t => t.tabId === tabId);
                if (tabIdState && tabIdState.state !== status.isEnabled) {
                    tabIdState.state = status.isEnabled;
                  //console.log(`makeEnabledStatus: Updated tabIdState.state to ${tabIdState.state} for tab ${tabId}`);
                }
            };
            makeEnabledStatus(aTab.id);
        };
        const updateActiveTabs = (aTabs) => {
          //console.log(`updateActiveTabs: Processing ${aTabs.length} tabs`);
            aTabs.map(updateTab);
        };
        chrome.tabs.query({active: true, currentWindow: true}, updateActiveTabs);
    };

    const showQuotesTab = () => {
        const requestId = crypto.randomUUID();
        chrome.tabs.create({
            url: chrome.runtime.getURL("quotes.html") + `?requestId=${requestId}`
        }, (tab) => {
            const onTabUpdated = (updatedTabId, changeInfo, updatedTab) => {
                if (updatedTabId === tab.id && changeInfo.status === "complete") {
                    chrome.runtime.sendMessage({
                        command: "ready",
                        requestId: requestId
                    });
                    chrome.tabs.onUpdated.removeListener(onTabUpdated);
                }
            };
            chrome.tabs.onUpdated.addListener(onTabUpdated);
        });
    };

    const showTestTab = () => {
        const requestId = crypto.randomUUID();
        chrome.tabs.create({
            url: chrome.runtime.getURL("prices.html") + `?requestId=${requestId}`
        });
    };

    return {
        watchForPages: watchForPages,
        toggleConversion: toggleConversion,
        showQuotesTab: showQuotesTab,
        showTestTab: showTestTab
    };
};

