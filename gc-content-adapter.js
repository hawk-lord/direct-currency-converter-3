/*
 * © Per Johansson
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

"use strict";

import DirectCurrencyContent from './content/dcc-content.js';

const ContentAdapter = {

    messageListener(message, sender, sendResponse) {
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
    }
};

if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.onMessage) {
    chrome.runtime.onMessage.addListener(ContentAdapter.messageListener);
}

export default ContentAdapter;
