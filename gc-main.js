/*
 * © Per Johansson
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 *
 */

"use strict";

const GcDirectCurrencyConverter = (function() {

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
        if (message.command === "show") {
            sendResponse(new Settings(dcc.informationHolder));
        }
        else if (message.command === "save") {
            eventAggregator.publish("saveSettings", {
                settings: message.settings
            })
        }
        else if (message.command === "reset") {
            eventAggregator.publish("resetSettings");
        }
        else if (message.command === "resetQuotes") {
            eventAggregator.publish("resetQuotes");
        }
    };
    chrome.runtime.onMessage.addListener(onMessageFromSettings);

    /**
     * Called when JSON settings have been read so we can read correct data from storage.
     */
    eventAggregator.subscribe("allSettingsRead", () => {

        console.log("allSettingsRead");

        eventAggregator.subscribe("storageInitDone", () => {
            dcc.createInformationHolder(gcStorageServiceProvider, _);
            const contentInterface = new GcContentInterface(dcc.informationHolder);
            const chromeInterface = new GcChromeInterface(dcc.informationHolder.conversionEnabled);
            eventAggregator.subscribe("quotesParsed", () => {
                console.log("quotesParsed");
                contentInterface.watchForPages();
            });

            eventAggregator.subscribe("toggleConversion", (eventArgs) => {
                console.log("toggleConversion" + eventArgs);
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
        gcStorageServiceProvider.initSettings(dcc.iso4217CurrenciesEnabled, dcc.defaultExcludedDomains);

    });

})();
