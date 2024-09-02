/*
 * © Per Johansson
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

"use strict";

export const EcbQuotesServiceProvider = function(anEventAggregator, anInformationHolder) {

	const eventAggregator = anEventAggregator;

	// Old version. Unused because there is no XML converter in content scripts.
	eventAggregator.subscribe("quotesReceivedEcbOld", (eventArgs) => {
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

	eventAggregator.subscribe("quotesReceivedEcb", (eventArgs) => {
		// Convert from ECB response.
		const data = eventArgs;
		const cs = [];
		// First quotes
		Object.keys(data.dataSets[0].series).forEach(key => cs.push({ currency: "", quote: data.dataSets[0].series[key].observations[0][0] }));
		// Then currencies
		Object.keys(data.structure.dimensions.series[1].values).forEach(key => cs[key].currency = data.structure.dimensions.series[1].values[key].id);
		const eurCurrencyQuote = cs.find((element) => element.currency === anInformationHolder.convertToCurrency);
		let eurQuote = 1;
		if (eurCurrencyQuote) {
			eurQuote = eurCurrencyQuote.quote;
		}
		anInformationHolder.setConversionQuote("EUR", eurQuote);
		cs.forEach((element) => anInformationHolder.setConversionQuote(element.currency, eurQuote / element.quote));
		eventAggregator.publish("quotesParsed");
	});

	const loadQuotes = (aQuotesService) => {
		// const today = new Date().toISOString().substring(0, 10);
		const today = new Date();
		today.setDate(today.getDate() - 7);
		// console.log(today);
		const dayString = today.toISOString().split("T")[0];
		// console.log(dayString);
		const urlString = "https://data-api.ecb.europa.eu/service/data/EXR/D..EUR.SP00.A?lastNObservations=1&format=jsondata&detail=dataonly&startPeriod=" + dayString;
		aQuotesService.fetchQuotes(urlString, "Ecb");
	};
	return {
		loadQuotes: loadQuotes
	};
};



