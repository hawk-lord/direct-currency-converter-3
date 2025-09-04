/*
 * © Per Johansson
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

"use strict";

export const QuotesServiceProvider = function (anEventAggregator) {

    let source;

    const onComplete = (aResponse) => {
        try {
            // console.log("onComplete aResponse " + aResponse);
            anEventAggregator.publish("quotesReceived" + source, aResponse);
        } catch (err) {
            console.error(err);
            anEventAggregator.publish("quotesError", new Error(`Failed to process quotes response: ${err.message}`));
        }
    };

    const onError = (error) => {
        console.error("QuotesServiceProvider error:", error);
        anEventAggregator.publish("quotesError", error);
    };

    const fetchQuotes = (aUrlString, aSource) => {
        source = aSource;

        fetch(aUrlString)
            .then((resp) => {
                // Check if response is ok (status 200-299)
                if (!resp.ok) {
                    throw new Error(`HTTP error! status: ${resp.status}`);
                }
                return resp.json();
            })
            .then(onComplete)
            .catch((error) => {
                // Handle network errors, JSON parsing errors, etc.
                const errorMessage = error.message || 'Unknown error occurred';
                onError(new Error(`Failed to fetch quotes from ${aSource}: ${errorMessage}`));
            });
    };
    return {
        fetchQuotes: fetchQuotes
    };
};

