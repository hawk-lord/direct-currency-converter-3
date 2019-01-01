/*
 * © Per Johansson
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Based on code from Simple Currency Converter
 * https://addons.mozilla.org/addon/simple-currency-converter/
 *
 * Module pattern is used.
 */

"use strict";

if (!this.ContentAdapter) {

    const ContentAdapter = function() {

        const sendResponse = (hasConvertedElements) => {
            return {"hasConvertedElements": hasConvertedElements, "url": document.URL};
        };

        const messageListener = (message, sender, sendResponse) => {
            //console.log("DCC messageListener URL " + document.URL);
            //console.log("DCC msq.url " + msg.url);
            if (message.conversionQuotes) {
                DirectCurrencyContent.onUpdateSettings(message);
            }
            else {
                if (message.url === "" || message.url === document.URL) {
                    //console.log("DCC msg.url === " + document.URL);
                    DirectCurrencyContent.onSendEnabledStatus(message);
                }
            }
            // async
            return true;
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
            chrome.runtime.sendMessage({"command": "getEnabledState", "hasConvertedElements": hasConvertedElements, "url": document.URL});
        };

        return {
            loaded: loaded,
            finish: finish
        };

    }();

    this.ContentAdapter = ContentAdapter;

}