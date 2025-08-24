/*
 * © Per Johansson
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 *
 */

"use strict";

import {GcLocalisation} from './gc-l10n.js';
import {DirectCurrencyConverter} from './common/dcc-main.js';
import {eventAggregator} from './common/eventAggregator.js';
import {GcContentInterface} from './gc-contentInterface.js';
import {Settings} from './common/settings.js';
import {GcStorageServiceProvider} from './gc-storage-service.js';
import {GcChromeInterface} from './gc-chromeInterface.js';


const GcDirectCurrencyConverter = (function () {

    const localisation = new GcLocalisation();
    const _ = localisation._;
    const dcc = new DirectCurrencyConverter();
    const chromeInterface = new GcChromeInterface();

    const quotesListener = (message, sender, sendResponse) => {
        //console.log("quotesListener:", message, "from:", sender);
        if (message.target === "quotesTab" && message.command === "getQuotes") {
            sendResponse(new Settings(dcc.informationHolder));
        }
        return false;  // No response if not targeted
    };
    chrome.runtime.onMessage.addListener(quotesListener);


    /**
     * Communicate with the Settings tab
     * @param message
     * @param sender
     * @param sendResponse
     */
    const onMessageFromSettings = (message, sender, sendResponse) => {
        //console.log("onMessageFromSettings:", message);
        if (message.target !== "quotesTab" && message.command === "show") {
            sendResponse(new Settings(dcc.informationHolder));
        } else if (message.target !== "quotesTab" && message.command === "saveSettings") {
            eventAggregator.publish("saveSettings", {settings: message.settings});
            sendResponse({success: true});
        } else if (message.target !== "quotesTab" && message.command === "reset") {
            eventAggregator.publish("resetSettings");
            sendResponse({success: true});
        } else if (message.target !== "quotesTab" && message.command === "resetQuotes") {
            eventAggregator.publish("resetQuotes");
            sendResponse({success: true});
        }
        return false;
    };
    chrome.runtime.onMessage.addListener(onMessageFromSettings);

    /**
     * Called when JSON settings have been read so we can read correct data from storage.
     */
    eventAggregator.subscribe("allSettingsRead", () => {

        // console.log("allSettingsRead");

        eventAggregator.subscribe("storageInitDone", () => {
            dcc.createInformationHolder(gcStorageServiceProvider, _);
            const contentInterface = new GcContentInterface(dcc.informationHolder, chromeInterface);
            eventAggregator.subscribe("quotesParsed", () => {
                // console.log("quotesParsed");
                contentInterface.watchForPages();
                // Initialize button state for current active tab
                chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
                    if (tabs[0]) {
                        // Trigger the existing tabOnActivated logic to set button state
                        contentInterface.tabOnActivated({tabId: tabs[0].id});
                    }
                });
            });

            eventAggregator.subscribe("toggleConversion", (eventArgs) => {
                //console.log("toggleConversion" + eventArgs);
                contentInterface.toggleConversion(eventArgs);
            });

            eventAggregator.subscribe("showQuotesTab", () => {
                contentInterface.showQuotesTab();
            });

            eventAggregator.subscribe("showTestTab", () => {
                contentInterface.showTestTab();
            });

            dcc.onStorageServiceInitDone();
        });
        /*
        eventAggregator.subscribe("storageReInitDone", () => {
            onStorageServiceReInitDone();
        });
        */
        const gcStorageServiceProvider = new GcStorageServiceProvider();
        gcStorageServiceProvider.initSettings(dcc.iso4217CurrenciesEnabled, dcc.defaultExcludedDomains, dcc.defaultIncludedDomains);

    });

    chrome.runtime.onInstalled.addListener((details) => {
        if (details.reason === "install" || details.reason === "update") {
            //TODO This is annoying while testing, but needs to be present in final test and prod.
            chrome.tabs.create({url: chrome.runtime.getURL("common/help.html")});
        }
    });

    return {
        init: () => {
        } // Provide an init method for external use if needed
    };

})();

export default GcDirectCurrencyConverter;