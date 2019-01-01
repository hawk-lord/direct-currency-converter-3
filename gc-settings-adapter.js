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

if (!this.SettingsAdapter) {
    const SettingsAdapter = function() {
        const options = null;
        chrome.runtime.sendMessage({command: "show"}, DirectCurrencySettings.showSettings);
        document.addEventListener("DOMContentLoaded", DirectCurrencySettings);
        return {
            save : (aSettings) => {
                chrome.runtime.sendMessage({command: "save", settings: aSettings});
                window.close();
            },
            reset : () => {
                chrome.runtime.sendMessage({command: "reset"});
                window.close();
            },
            resetQuotes : () => {
                chrome.runtime.sendMessage({command: "resetQuotes"});
            }
        }
    }();
    this.SettingsAdapter = SettingsAdapter;
}