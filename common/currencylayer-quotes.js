/*
 * © Per Johansson
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

"use strict";

const CurrencylayerQuotesServiceProvider = function(anEventAggregator, anInformationHolder) {
    const eventAggregator = anEventAggregator;

    eventAggregator.subscribe("quotesReceivedCurrencylayer", (eventArgs) => {
        // Convert from Currencylayer response.
        const response = JSON.parse(eventArgs.response);
        let quote = 1;
        // Currencylayer free subscription always converts from USD.
        // Check quote between USD and target currency.
        for (let resource in response.quotes) {

            if (anInformationHolder.convertToCurrency === resource.substring(3, 6)) {
                quote = response.quotes[resource];
                anInformationHolder.setConversionQuote("USD", quote);
                break;
            }
        }
        for (let resource in response.quotes) {
            anInformationHolder.setConversionQuote(resource.substring(3, 6), quote / response.quotes[resource]);
        }
        // Workaround for missing MRU and STN
        if (!response.quotes["USDMRU"]) {
            anInformationHolder.setConversionQuote("MRU", quote / response.quotes["USDMRO"] * 10);
        }
        if (!response.quotes["USDSTN"]) {
            anInformationHolder.setConversionQuote("STN", quote / response.quotes["USDSTD"] * 1000);
        }

        eventAggregator.publish("quotesParsed");
    });

    const loadQuotes = (aQuotesService, apiKey) => {
        const urlString = "http://apilayer.net/api/live?access_key=" + apiKey + "&source=USD";
        aQuotesService.fetchQuotes(urlString, "Currencylayer");
    };
    return {
        loadQuotes: loadQuotes
    };
};

if (typeof exports === "object") {
    exports.CurrencylayerQuotesServiceProvider = CurrencylayerQuotesServiceProvider;
}


