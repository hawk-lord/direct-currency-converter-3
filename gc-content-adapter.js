/*
 * © Per Johansson
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

"use strict";

import DirectCurrencyContent from './content/dcc-content.js';

const ContentAdapter = {

    messageListener(message, sender, sendResponse) {
        const isTopFrame = window.top === window.self;
        const isInternalPage = document.URL.startsWith('chrome-extension://');
      //console.log(`messageListener [isTopFrame: ${isTopFrame}, isInternal: ${isInternalPage}, url: ${document.URL}]`);
      //console.log("message: ", message);
      //console.log("from:", sender);
      //console.log("message.url: ", message.url);
      //console.log("document.URL: ", document.URL);
        try {
            if (message.action === 'ping') {
              //console.log("Handling ping message");
                sendResponse({status: 'pong'});
                return true;
            } else if (message.conversionQuotes && (isTopFrame || isInternalPage)) {
              //console.log("onUpdateSettings");
                DirectCurrencyContent.onUpdateSettings(message);
                sendResponse({success: true});
                return false;
            } else if ((message.url === "" || message.url === document.URL) && (isTopFrame || isInternalPage)) {
              //console.log("onSendEnabledStatus");
                DirectCurrencyContent.onSendEnabledStatus(message);
                sendResponse({success: true});
                return false;
            } else {
              //console.log(`Skipping message processing in ${isTopFrame ? 'main frame' : 'iframe'}${isInternalPage ? ' (internal page)' : ''}`);
                sendResponse({error: "Unknown command or processed in main frame/internal page only"});
                return false;
            }
        } catch (err) {
            console.error(`messageListener error:`, err);
            sendResponse({error: `Message processing failed: ${err.message}`});
            return false;
        }
    }
};

if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.onMessage) {
    // Use chrome.runtime.id to ensure unique flag per extension instance
    const listenerFlag = `DCCListenerAdded_${chrome.runtime.id}`;
    if (!window[listenerFlag] && (window.top === window.self || document.URL.startsWith('chrome-extension://'))) {
      //console.log(`Adding messageListener [isTopFrame: ${window.top === window.self}, isInternal: ${document.URL.startsWith('chrome-extension://')}]`);
        chrome.runtime.onMessage.addListener(ContentAdapter.messageListener);
        window[listenerFlag] = true;
    }
}

export default ContentAdapter;
