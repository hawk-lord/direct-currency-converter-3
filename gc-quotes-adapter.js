/*
 * © Per Johansson
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import DirectCurrencyQuotes from './content/dcc-quotes.js';

// Get requestId from URL
const urlParams = new URLSearchParams(window.location.search);
const requestId = urlParams.get('requestId');

const QuotesAdapter = async function () {
    "use strict";

    if (!requestId) {
        console.error("No requestId found in URL");
        return null;
    }

    // Wait for ready signal with matching requestId
    const ready = await new Promise(resolve => {
        const readyListener = (message, sender, sendResponse) => {
            if (message.command === "ready" && message.requestId === requestId) {
                chrome.runtime.onMessage.removeListener(readyListener);
                resolve(true);
            }
        };
        chrome.runtime.onMessage.addListener(readyListener);
    });

    if (ready) {
        try {
            console.log("QuotesAdapter sendMessage requestId " + requestId);
            const response = await chrome.runtime.sendMessage({
                command: "getQuotes",
                target: "quotesTab",
                requestId: requestId
            });
            console.log("QuotesAdapter after sendMessage " + response);
            if (response && !response.error) {
                DirectCurrencyQuotes.onUpdateQuotes(response);
            } else {
                console.error("Invalid response:", response);
            }
            return null;
        } catch (error) {
            console.error("Error sending getQuotes:", error);
            return null;
        }
    }
}();

export default QuotesAdapter;