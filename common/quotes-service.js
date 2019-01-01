/*
 * © Per Johansson
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

"use strict";

const QuotesServiceProvider = function(anEventAggregator) {

    // Perhaps better with separate classes.
    let source;

    const onComplete = (aResponse) => {
        try {
            // console.log("onComplete aResponse " + aResponse);
            anEventAggregator.publish("quotesReceived" + source, aResponse);
        }
        catch(err) {
            console.error("err " + err);
        }
    };
    const fetchQuotes = (aUrlString, aSource) => {
        // console.log("fetchQuotes ");
        source = aSource;
        const urlString = aUrlString;
        const request = new XMLHttpRequest();
        request.open("GET", aUrlString, true);
        request.onreadystatechange = () => {
            if (request.readyState === XMLHttpRequest.DONE && request.status === 200) {
                onComplete({response: request.response, responseXml: request.responseXML});
            }
        };
        request.send(null);
    };
    return {
        fetchQuotes: fetchQuotes
    };
};

if (typeof exports === "object") {
    exports.GcQuotesServiceProvider = GcQuotesServiceProvider;
}
