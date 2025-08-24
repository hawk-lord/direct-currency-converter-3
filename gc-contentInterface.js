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

    let tabIdStates = [];
    let isLoaded = false;

    // Load tabIdStates from storage.session
    const loadTabIdStates = async () => {
        if (isLoaded) return;

        try {
            // console.log('Loading tabIdStates from storage...');
            const result = await chrome.storage.session.get({tabIdStates: []});
            // console.log('Raw storage result:', JSON.stringify(result));

            const storedStates = result.tabIdStates || [];
            tabIdStates = storedStates.map(state =>
                new TabState(state.tabId, state.state, state.isInjected)
            );

            // console.log(`Loaded ${tabIdStates.length} tab states`);
            isLoaded = true;
        } catch (error) {
            console.error('Failed to load tabIdStates:', error);
            tabIdStates = [];
            isLoaded = true;
        }
    };

    // Save tabIdStates to storage.session
    const saveTabIdStates = async () => {
        try {
            // console.log('Saving tabIdStates:', tabIdStates.length, 'items');

            await chrome.storage.session.set({tabIdStates});
            // console.log('Saved tabIdStates successfully');

            // Verify save worked (for Firefox debugging)
            const verification = await chrome.storage.session.get({tabIdStates: []});
            // console.log('Verification - storage now contains:', verification.tabIdStates?.length || 0, 'items');

        } catch (error) {
            console.error('Failed to save tabIdStates:', error);
        }
    };

    // Ensure state is loaded before any operation that needs it
    const withLoadedState = async (operation) => {
        if (!isLoaded) {
            await loadTabIdStates();
        }
        return operation();
    };

    const checkScriptInjected = (tabId, callback) => {
        withLoadedState(() => {
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
                    saveTabIdStates();
                    callback(true);
                }
            });
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
                    withLoadedState(() => {
                        let tabIdState = tabIdStates.find(t => t.tabId === tabId);
                        if (!tabIdState) {
                            tabIdState = new TabState(tabId, false, true);
                            tabIdStates.push(tabIdState);
                        } else {
                            tabIdState.isInjected = true;
                        }
                        saveTabIdStates();
                        //console.log(`sendEnabledStatus: Script injected into tab ${tabId}`);
                        sendMessage();
                    });
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
                            withLoadedState(() => {
                                let tabIdState = tabIdStates.find(t => t.tabId === tabId);
                                if (tabIdState) {
                                    tabIdState.isInjected = false;
                                }
                                injectScript();
                            });
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
        // console.log('tabOnUpdated', tabId, changeInfo, tab);
        withLoadedState(() => {
            let tabIdState = tabIdStates.find(t => t.tabId === tabId);
            if (!tabIdState) {
                tabIdState = new TabState(tabId, false, false);
                tabIdStates.push(tabIdState);
            } else if (changeInfo.status === 'complete') {
                // Only reset injection status, not conversion state
                tabIdState.isInjected = false;
                // Don't reset tabIdState.state - let user's toggle preference persist
            }

            // Only update button if this is the active tab in current window
            chrome.tabs.query({active: true, currentWindow: true}, (activeTabs) => {
                if (activeTabs[0] && activeTabs[0].id === tabId) {
                    aChromeInterface.setButtonStatus(tabIdState.state);
                }
            });

            saveTabIdStates();
        });
    };

    const tabOnActivated = (tab) => {
        withLoadedState(() => {
            let tabIdState = tabIdStates.find(t => t.tabId === tab.tabId);
            if (!tabIdState) {
                tabIdState = new TabState(tab.tabId, false, false);
                tabIdStates.push(tabIdState);
            }

            aChromeInterface.setButtonStatus(tabIdState.state);
            saveTabIdStates();
        });
    };

    const watchForPages = () => {
        // console.log('watchForPages');
        chrome.tabs.onUpdated.addListener(tabOnUpdated);
        chrome.tabs.onActivated.addListener(tabOnActivated);
        chrome.tabs.onRemoved.addListener((tabId) => {
            withLoadedState(() => {
                const index = tabIdStates.findIndex(t => t.tabId === tabId);
                if (index !== -1) {
                    tabIdStates.splice(index, 1);
                    //console.log(`tabOnRemoved: Removed tab ${tabId} from tabIdStates`);
                    saveTabIdStates();
                }
            });
        });

        chrome.windows.onFocusChanged.addListener((windowId) => {
            if (windowId !== chrome.windows.WINDOW_ID_NONE) {
                chrome.tabs.query({active: true, windowId: windowId}, (tabs) => {
                    if (tabs[0]) {
                        withLoadedState(() => {
                            let tabIdState = tabIdStates.find(t => t.tabId === tabs[0].id);
                            if (!tabIdState) {
                                tabIdState = new TabState(tabs[0].id, false, false);
                                tabIdStates.push(tabIdState);
                                saveTabIdStates();
                            }
                            aChromeInterface.setButtonStatus(tabIdState.state);
                        });
                    }
                });
            }
        });
    };

    /**
     * aParameters {conversionEnabled: buttonStatus, url: ""}
     */
    const toggleConversion = (aParameters) => {
        // console.log("toggleConversion called with:", aParameters);

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
                // console.log(`makeEnabledStatus: Tab ${tabId}, isEnabled: ${status.isEnabled}, url: ${status.url}`);
                try {
                    sendEnabledStatus(tabId, status);
                } catch (err) {
                    console.error(`ContentInterface: Error in makeEnabledStatus for tab ${tabId}:`, err);
                }
                withLoadedState(() => {
                    let tabIdState = tabIdStates.find(t => t.tabId === tabId);
                    if (!tabIdState) {
                        // Create new TabState with the toggled state
                        tabIdState = new TabState(tabId, status.isEnabled, false);
                        tabIdStates.push(tabIdState);
                        // console.log(`makeEnabledStatus: Created new tabIdState for tab ${tabId} with state ${status.isEnabled}`);
                        saveTabIdStates();
                    } else if (tabIdState.state !== status.isEnabled) {
                        tabIdState.state = status.isEnabled;
                        // console.log(`makeEnabledStatus: Updated tabIdState.state to ${tabIdState.state} for tab ${tabId}`);
                        saveTabIdStates();
                    } else {
                        // console.log(`makeEnabledStatus: Tab ${tabId} state already ${status.isEnabled}, no change needed`);
                    }
                });
            };
            makeEnabledStatus(aTab.id);
        };
        const updateActiveTabs = (aTabs) => {
            // console.log(`updateActiveTabs: Processing ${aTabs.length} tabs`);
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

    // Initialize tabIdStates when the module loads
    loadTabIdStates();

    return {
        watchForPages: watchForPages,
        toggleConversion: toggleConversion,
        showQuotesTab: showQuotesTab,
        showTestTab: showTestTab,
        tabOnActivated: tabOnActivated
    };
};

