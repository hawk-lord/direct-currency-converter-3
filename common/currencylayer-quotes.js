/*
 * © Per Johansson
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

"use strict";

export const CurrencylayerQuotesServiceProvider = function (anEventAggregator, anInformationHolder, mockMode = false) {
    const eventAggregator = anEventAggregator;

    // Embedded cl.json content for mock mode
    const mockCurrencylayerData = {
        "success": true,
        "timestamp": 1751137205,
        "source": "USD",
        "quotes": {
            "USDAED": 3.672504,
            "USDAFN": 70.181275,
            "USDALL": 83.642568,
            "USDAMD": 383.706547,
            "USDANG": 1.789623,
            "USDAOA": 917.000367,
            "USDARS": 1187.638217,
            "USDAUD": 1.529286,
            "USDAWG": 1.8025,
            "USDAZN": 1.70397,
            "USDBAM": 1.668415,
            "USDBBD": 2.017658,
            "USDBDT": 122.217957,
            "USDBGN": 1.67402,
            "USDBHD": 0.375858,
            "USDBIF": 2976.327575,
            "USDBMD": 1,
            "USDBND": 1.275069,
            "USDBOB": 6.904671,
            "USDBRL": 5.479504,
            "USDBSD": 0.999275,
            "USDBTC": 9.331057e-6,
            "USDBTN": 85.44935,
            "USDBWP": 13.359778,
            "USDBYN": 3.270207,
            "USDBYR": 19600,
            "USDBZD": 2.007251,
            "USDCAD": 1.37105,
            "USDCDF": 2881.000362,
            "USDCHF": 0.808798,
            "USDCLF": 0.024262,
            "USDCLP": 931.047132,
            "USDCNY": 7.172504,
            "USDCNH": 7.17292,
            "USDCOP": 4037.193431,
            "USDCRC": 503.988057,
            "USDCUC": 1,
            "USDCUP": 26.5,
            "USDCVE": 94.0627,
            "USDCZK": 21.101704,
            "USDDJF": 177.94839,
            "USDDKK": 6.365604,
            "USDDOP": 59.449776,
            "USDDZD": 128.922158,
            "USDEGP": 49.689913,
            "USDERN": 15,
            "USDETB": 134.993559,
            "USDEUR": 0.853304,
            "USDFJD": 2.24125,
            "USDFKP": 0.72893,
            "USDGBP": 0.738089,
            "USDGEL": 2.720391,
            "USDGGP": 0.72893,
            "USDGHS": 10.343357,
            "USDGIP": 0.72893,
            "USDGMD": 71.503851,
            "USDGNF": 8657.709533,
            "USDGTQ": 7.685221,
            "USDGYD": 208.974195,
            "USDHKD": 7.84935,
            "USDHNL": 26.110471,
            "USDHRK": 6.429504,
            "USDHTG": 131.004479,
            "USDHUF": 340.380388,
            "USDIDR": 16236.25,
            "USDILS": 3.38671,
            "USDIMP": 0.72893,
            "USDINR": 85.50715,
            "USDIQD": 1309.021113,
            "USDIRR": 42125.000352,
            "USDISK": 121.160386,
            "USDJEP": 0.72893,
            "USDJMD": 160.14502,
            "USDJOD": 0.70904,
            "USDJPY": 144.64504,
            "USDKES": 129.153338,
            "USDKGS": 87.394039,
            "USDKHR": 4005.971422,
            "USDKMF": 420.503794,
            "USDKPW": 900.01979,
            "USDKRW": 1364.350383,
            "USDKWD": 0.30579,
            "USDKYD": 0.832758,
            "USDKZT": 519.85498,
            "USDLAK": 21549.157603,
            "USDLBP": 89534.058435,
            "USDLKR": 299.680102,
            "USDLRD": 199.85498,
            "USDLSL": 17.895244,
            "USDLTL": 2.95274,
            "USDLVL": 0.60489,
            "USDLYD": 5.411815,
            "USDMAD": 9.022393,
            "USDMDL": 16.923011,
            "USDMGA": 4393.260823,
            "USDMKD": 52.488804,
            "USDMMK": 2099.584165,
            "USDMNT": 3583.706825,
            "USDMOP": 8.080529,
            "USDMRU": 39.851567,
            "USDMUR": 45.160378,
            "USDMVR": 15.403739,
            "USDMWK": 1732.736191,
            "USDMXN": 18.825039,
            "USDMYR": 4.228504,
            "USDMZN": 63.960377,
            "USDNAD": 17.895244,
            "USDNGN": 1543.740377,
            "USDNIO": 36.775432,
            "USDNOK": 10.07728,
            "USDNPR": 136.71913,
            "USDNZD": 1.651392,
            "USDOMR": 0.383109,
            "USDPAB": 0.999275,
            "USDPEN": 3.546854,
            "USDPGK": 4.121988,
            "USDPHP": 56.610375,
            "USDPKR": 283.416336,
            "USDPLN": 3.621341,
            "USDPYG": 7974.408189,
            "USDQAR": 3.642397,
            "USDRON": 4.335904,
            "USDRSD": 99.961612,
            "USDRUB": 78.609512,
            "USDRWF": 1442.951589,
            "USDSAR": 3.7503,
            "USDSBD": 8.347338,
            "USDSCR": 14.665216,
            "USDSDG": 600.503676,
            "USDSEK": 9.489504,
            "USDSGD": 1.275904,
            "USDSHP": 0.785843,
            "USDSLE": 22.503667,
            "USDSLL": 20969.503664,
            "USDSOS": 571.038601,
            "USDSRD": 37.796038,
            "USDSTD": 20697.981008,
            "USDSVC": 8.743869,
            "USDSYP": 13002.157508,
            "USDSZL": 17.891235,
            "USDTHB": 32.555038,
            "USDTJS": 9.852762,
            "USDTMT": 3.51,
            "USDTND": 2.921305,
            "USDTOP": 2.342104,
            "USDTRY": 39.815038,
            "USDTTD": 6.782683,
            "USDTWD": 29.103038,
            "USDTZS": 2633.226701,
            "USDUAH": 41.663638,
            "USDUGX": 3592.237151,
            "USDUYU": 40.255918,
            "USDUZS": 12577.52186,
            "USDVES": 106.603504,
            "USDVND": 26095,
            "USDVUV": 119.690832,
            "USDWST": 2.737549,
            "USDXAF": 559.570911,
            "USDXAG": 0.027788,
            "USDXAU": 0.000305,
            "USDXCD": 2.70255,
            "USDXDR": 0.695927,
            "USDXOF": 559.570911,
            "USDXPF": 101.735978,
            "USDYER": 242.250363,
            "USDZAR": 17.86976,
            "USDZMK": 9001.203587,
            "USDZMW": 23.657923,
            "USDZWL": 321.999592
        }
    };

    eventAggregator.subscribe("quotesReceivedCurrencylayer", (eventArgs) => {
        // Convert from Currencylayer response.
//        const response = JSON.parse(eventArgs.response);
        const response = eventArgs;
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
        // Workaround for missing currencies
        if (!response.quotes["USDSTN"] && response.quotes["USDSTD"]) {
            anInformationHolder.setConversionQuote("STN", quote / response.quotes["USDSTD"] * 1000);
        }
        if (!response.quotes["USDVED"] && response.quotes["USDVES"]) {
            anInformationHolder.setConversionQuote("VED", quote / response.quotes["USDVES"] * 1000000);
        }
        if (!response.quotes["USDXCG"] && response.quotes["USDANG"]) {
            anInformationHolder.setConversionQuote("XCG", quote / response.quotes["USDANG"]);
        }
        if (!response.quotes["USDZWG"] && response.quotes["USDZWL"]) {
            anInformationHolder.setConversionQuote("ZWG", quote / response.quotes["USDZWL"] * 2498.7242);
        }

        //console.log('Quotes parsed (Currencylayer)');
        eventAggregator.publish("quotesParsed");
    });

    const loadQuotes = (aQuotesService, apiKey) => {
        if (mockMode) {
            //console.log('Using mock Currencylayer API');
            //console.log('Mock response:', mockCurrencylayerData);
            eventAggregator.publish('quotesReceivedCurrencylayer', mockCurrencylayerData);
        } else {
            //console.log('Using real Currencylayer API');
            const urlString = "https://apilayer.net/api/live?access_key=" + apiKey + "&source=USD";
            aQuotesService.fetchQuotes(urlString, "Currencylayer");
        }
    };
    return {
        loadQuotes: loadQuotes
    };
};


