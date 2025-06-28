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


    /**
     * Communicate with the Settings tab
     * @param message
     * @param sender
     * @param sendResponse
     */
    const onMessageFromSettings = (message, sender, sendResponse) => {
        console.log("onMessageFromSettings:", message);
        if (message.command === "show") {
            sendResponse(new Settings(dcc.informationHolder));
        } else if (message.command === "saveSettings") {
            eventAggregator.publish("saveSettings", {settings: message.settings});
            sendResponse({success: true});
        } else if (message.command === "reset") {
            eventAggregator.publish("resetSettings");
            sendResponse({success: true});
        } else if (message.command === "resetQuotes") {
            eventAggregator.publish("resetQuotes");
            sendResponse({success: true});
        } else {
            sendResponse({error: "Unknown command"});
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
            const chromeInterface = new GcChromeInterface(dcc.informationHolder.conversionEnabled);
            const contentInterface = new GcContentInterface(dcc.informationHolder, chromeInterface);
            eventAggregator.subscribe("quotesParsed", () => {
                // console.log("quotesParsed");
                contentInterface.watchForPages();
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
            //FIXME chrome.tabs.create({url: chrome.runtime.getURL("common/help.html")});
        }
    });


})();
