/*
 * © Per Johansson
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

"use strict";

const EcbQuotesServiceProvider = function(anEventAggregator, anInformationHolder) {

    const eventAggregator = anEventAggregator;

    eventAggregator.subscribe("quotesReceivedEcb", (eventArgs) => {
        // Convert from ECB response.
        const response = eventArgs.responseXml;
        const cubes = response.getElementsByTagName("Cube");
        let quote = 1;
        for (let cube of cubes) {
            // ECB always converts from EUR.
            // Check quote between ECB and target currency.
            if (cube.getAttribute("time")) {
                for (let childCube of cube.childNodes) {
                    if (childCube.nodeType === Node.ELEMENT_NODE) {
                        if (anInformationHolder.convertToCurrency === childCube.getAttribute("currency")) {
                            quote = childCube.getAttribute("rate");
                            anInformationHolder.setConversionQuote("EUR", quote);
                            break;
                        }
                    }
                }
                for (let childCube of cube.childNodes) {
                    if (childCube.nodeType === Node.ELEMENT_NODE) {
                        anInformationHolder.setConversionQuote(childCube.getAttribute("currency"), quote / childCube.getAttribute("rate"));
                    }
                }
                break;
            }
        }

        eventAggregator.publish("quotesParsed");
    });

    const loadQuotes = (aQuotesService) => {
        const urlString = "http://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml";
        aQuotesService.fetchQuotes(urlString, "Ecb");
    };
    return {
        loadQuotes: loadQuotes
    };
};

if (typeof exports === "object") {
    exports.CurrencylayerQuotesServiceProvider = CurrencylayerQuotesServiceProvider;
}


