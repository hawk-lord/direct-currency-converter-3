/*
 * © Per Johansson
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Module pattern is used.
 */

"use strict";

if (!window.QuotesAdapter) {
    const QuotesAdapter = function () {
        chrome.runtime.sendMessage({"command": "getQuotes"}, (response) => {
            if (chrome.runtime.lastError) {
                console.error("Error sending getQuotes:", chrome.runtime.lastError);
                return;
            }
            DirectCurrencyQuotes.onUpdateQuotes(response);
        });
    }();
    window.QuotesAdapter = QuotesAdapter;
}