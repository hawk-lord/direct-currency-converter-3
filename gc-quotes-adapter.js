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

if (!this.QuotesAdapter) {
    const QuotesAdapter = function() {
        chrome.runtime.sendMessage({"command": "getQuotes"}, (response) => {
            DirectCurrencyQuotes.onUpdateQuotes(response);
        });
    }();
    this.QuotesAdapter = QuotesAdapter;
}