/*
 * © Per Johansson
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

"use strict";

if (!window.ContentAdapter) {

    const ContentAdapter = function () {

        const messageListener = (message, sender, sendResponse) => {
            console.log("messageListener:", message, "from:", sender);
            if (message.conversionQuotes) {
                DirectCurrencyContent.onUpdateSettings(message);
                sendResponse({success: true});
                return false;
            } else if (message.url === "" || message.url === document.URL) {
                DirectCurrencyContent.onSendEnabledStatus(message);
                sendResponse({success: true});
                return false;
            } else {
                sendResponse({error: "Unknown command"});
                return false;
            }
        };

        /**
         * Messages from the main script
         */
        chrome.runtime.onMessage.addListener(messageListener);

        /**
         * When DOM is loaded
         */
        const loaded = () => {

        };

        /**
         * When conversion is done
         */
        const finish = (hasConvertedElements) => {
            if (document.visibilityState === "hidden") {
                console.warn("Skipping message send due to page unload");
                return;
            }
            chrome.runtime.sendMessage(
                {
                    command: "getEnabledState",
                    hasConvertedElements,
                    url: document.URL
                },
                (response) => {
                    if (chrome.runtime.lastError) {
                        console.error("Error sending message:", chrome.runtime.lastError);
                        return;
                    }
                    console.log("Response:", response);
                }
            );
        };

        return {
            loaded: loaded //,
            //finish: finish
        };

    }
    ();

    window.ContentAdapter = ContentAdapter;

}

