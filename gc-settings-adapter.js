/*
 * © Per Johansson
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Module pattern is used.
 */

"use strict";

if (!window.SettingsAdapter) {
    const SettingsAdapter = function () {
        const options = null;
        console.log("Showing Settings Adapter");
        chrome.runtime.sendMessage({command: "show"}, DirectCurrencySettings.showSettings);
        document.addEventListener("DOMContentLoaded", DirectCurrencySettings);
        return {
            save: (aSettings) => {
                console.log("SettingsAdapter.save");
                chrome.runtime.sendMessage(
                    {command: "saveSettings", settings: aSettings},
                    (response) => {
                        if (chrome.runtime.lastError) {
                            console.error("Error sending saveSettings:", chrome.runtime.lastError);
                            return;
                        }
                        console.log("saveSettings response:", response);
                        window.close(); // Close after response
                    }
                );
            },
            reset: () => {
                console.log("SettingsAdapter.reset");
                chrome.runtime.sendMessage(
                    {command: "reset"},
                    (response) => {
                        if (chrome.runtime.lastError) {
                            console.error("Error sending reset:", chrome.runtime.lastError);
                            return;
                        }
                        console.log("reset response:", response);
                        window.close();
                    }
                );
            },
            resetQuotes: () => {
                console.log("SettingsAdapter.resetQuotes");
                chrome.runtime.sendMessage(
                    {command: "resetQuotes"},
                    (response) => {
                        if (chrome.runtime.lastError) {
                            console.error("Error sending resetQuotes:", chrome.runtime.lastError);
                            return;
            }
                        console.log("resetQuotes response:", response);
                        // Optional: window.close() if desired
        }
                );
            }
        };
    }();
    window.SettingsAdapter = SettingsAdapter;
}