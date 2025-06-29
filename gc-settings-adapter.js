/*
 * © Per Johansson
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

"use strict";

let settingsLoaded = false;

const SettingsAdapter = {
    save(aSettings) {
        console.log("SettingsAdapter.save");
        chrome.runtime.sendMessage(
            {command: "saveSettings", settings: aSettings},
            (response) => {
                if (chrome.runtime.lastError) {
                    console.error("Error sending saveSettings:", chrome.runtime.lastError);
                    return;
                }
                console.log("saveSettings response:", response);
                window.close();
            }
        );
    },
    reset() {
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
    resetQuotes() {
        console.log("SettingsAdapter.resetQuotes");
        chrome.runtime.sendMessage(
            {command: "resetQuotes"},
            (response) => {
                if (chrome.runtime.lastError) {
                    console.error("Error sending resetQuotes:", chrome.runtime.lastError);
                    return;
                }
                console.log("resetQuotes response:", response);
            }
        );
    },
    loadSettings(callback) {
        if (settingsLoaded) {
            console.log("Settings already loaded, ignoring request");
            return;
        }
        settingsLoaded = true;
        console.log("Requesting settings from background script");
        chrome.runtime.sendMessage({command: "show"}, (response) => {
            console.log("Background script response:", response);
            if (chrome.runtime.lastError) {
                console.error("Error fetching settings:", chrome.runtime.lastError);
                callback({});
                return;
            }
            if (!response) {
                console.error("Invalid or missing settings in response:", response);
                callback({});
                return;
            }
            callback(response);
        });
    }
};

export default SettingsAdapter;