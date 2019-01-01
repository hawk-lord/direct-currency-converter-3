/*
 * © Per Johansson
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

"use strict";

/**
 * Stereotype Information holder
 *
 * Kitchen sink really.
 *
 * @param aStorageService
 * @param aCurrencyData
 * @param _ supposedly standard name for localisation
 * @returns {{conversionEnabled, conversionEnabled, convertToCountry, convertToCountry, convertToCurrency, convertToCurrency, getConversionQuotes: (function()), setConversionQuote: (function(*, *)), excludedDomains, excludedDomains, convertFroms, convertFroms, enableOnStart, enableOnStart, quoteAdjustmentPercent, quoteAdjustmentPercent, roundPrices, roundPrices, showOriginalPrices, showOriginalPrices, showOriginalCurrencies, showOriginalCurrencies, showTooltip, showTooltip, tempConvertUnits, tempConvertUnits, showDccToolsButton, showDccToolsButton, showDccConversionButton, showDccConversionButton, getCurrencyNames: (function()), isAllCurrenciesRead: (function()), getQuoteString: (function()), resetReadCurrencies: (function()), resetSettings: (function(*=))}}
 * @constructor
 */
const InformationHolder = function(aStorageService, aCurrencyData, _, aRegexes1, aRegexes2) {
    const conversionQuotes = {
        "inch": 25.4,
        "kcal": 4.184,
        "nmi": 1.852,
        "mile": 1.602,
        "mil": 10,
        "knots": 1.852,
        "hp": 0.73549875
    };
    const findCurrency = (aCountry) => {
        const regions = aCurrencyData.region;
        // TODO Default currency
        let foundCurrency = "GBP";
        const findCurrentCurrency = (aCurrency) =>{
            if (!aCurrency["@to"]) {
                if (aCurrency["@tender"] !== "false") {
                    foundCurrency = aCurrency["@iso4217"];
                    return true;
                }
            }
        };
        const found = Object.keys(regions).some((regionKey) => {
            if (aCountry === regions[regionKey]["@iso3166"]) {
                const currencies = regions[regionKey]["currency"];
                if (Array.isArray(currencies)) {
                    return currencies.some(findCurrentCurrency);
                }
                else {
                    findCurrentCurrency(currencies);
                }
            }
            return false;
        });
        return foundCurrency;
    };

    const addRegexesForEnabledCurrencies = () => {
        aStorageService.convertFroms.forEach((aCurrency) => {
            if (aCurrency.enabled) {
                for (let regex1 of aRegexes1) {
                    if (regex1.name === aCurrency.isoName) {
                        console.log(regex1);
                        regexes1[regex1.name] = regex1;
                        break;
                    }
                }
                for (let regex2 of aRegexes2) {
                    if (regex2.name === aCurrency.isoName) {
                        console.log(regex2);
                        regexes2[regex2.name] = regex2;
                        break;
                    }
                }
            }
        });
    }

    let numberOfReadCurrencies = 0;
    let conversionEnabled = aStorageService.enableOnStart;

    const currencyNames = {};
    const regexes1 = {};
    const regexes2 = {};
    // Add a localised name for each currency.
    aStorageService.convertFroms.forEach((aCurrency) => {
        currencyNames[aCurrency.isoName] = _(aCurrency.isoName);
    });


    addRegexesForEnabledCurrencies();

    let quoteStrings = [];

    const getConversionQuotes = () => {
        return conversionQuotes;
    };
    const setConversionQuote = (aConvertFromCurrencyName, aQuote) => {
        conversionQuotes[aConvertFromCurrencyName] = aQuote;
        numberOfReadCurrencies++;
    };
    const getCurrencyNames = () => {
        return currencyNames;
    };
    const isAllCurrenciesRead = () => {
        return numberOfReadCurrencies >= aStorageService.convertFroms.length;
    };
    const makeQuoteString = (aConvertFromCurrency) => {
        if (aConvertFromCurrency.isoName !== aStorageService.convertToCurrency) {
            const quote = parseFloat(conversionQuotes[aConvertFromCurrency.isoName]);
            if (isNaN(quote)) {
                const quoteString = "1 " + aConvertFromCurrency.isoName + " = - " + aStorageService.convertToCurrency;
                quoteStrings.push(quoteString);
            }
            else {
                const conversionQuote = quote.toFixed(4);
                const quoteString = "1 " + aConvertFromCurrency.isoName + " = " + conversionQuote + " " + aStorageService.convertToCurrency;
                quoteStrings.push(quoteString);
            }
        }
    };
    const getQuoteString = () => {
        quoteStrings = [];
        aStorageService.convertFroms.forEach(makeQuoteString);
        return quoteStrings.join("; ");
    };
    const resetReadCurrencies = () => {
        numberOfReadCurrencies = 0;
    };
    const resetSettings = (iso4217Currencies) => {
        aStorageService.resetSettings(iso4217Currencies);
    };

    return {
        get conversionEnabled () {
            return conversionEnabled;
        },
        set conversionEnabled (aConversionEnabled) {
            conversionEnabled = aConversionEnabled;
        },
        get convertToCountry () {
            return aStorageService.convertToCountry;
        },
        set convertToCountry (aCountry) {
            aStorageService.convertToCountry = aCountry;
                if (!aStorageService.convertToCurrency) {
                    aStorageService.convertToCurrency = findCurrency(aCountry);
                }
        },
        get convertToCurrency () {
            return aStorageService.convertToCurrency;
        },
        set convertToCurrency (aCurrency) {
            aStorageService.convertToCurrency = aCurrency;
        },
        getConversionQuotes: getConversionQuotes,
        setConversionQuote: setConversionQuote,
        get excludedDomains () {
            return aStorageService.excludedDomains;
        },
        set excludedDomains (anExcludedDomains) {
            aStorageService.excludedDomains = anExcludedDomains;
        },
        get convertFroms () {
            return aStorageService.convertFroms;
        },
        set convertFroms (aConvertFroms) {
            aStorageService.convertFroms = aConvertFroms;
        },
        get enableOnStart () {
            return aStorageService.enableOnStart;
        },
        set enableOnStart (anEnableOnStart) {
            aStorageService.enableOnStart = anEnableOnStart;
        },
        get quoteAdjustmentPercent () {
            return aStorageService.quoteAdjustmentPercent;
        },
        set quoteAdjustmentPercent (aQuoteAdjustmentPercent) {
            aStorageService.quoteAdjustmentPercent = aQuoteAdjustmentPercent;
        },
        get roundPrices () {
            return aStorageService.roundPrices;
        },
        set roundPrices (aRoundPrices) {
            aStorageService.roundPrices = aRoundPrices;
        },
        get showOriginalPrices () {
            return aStorageService.showOriginalPrices;
        },
        set showOriginalPrices (aShowOriginalPrices) {
            aStorageService.showOriginalPrices = aShowOriginalPrices;
        },
        get showOriginalCurrencies () {
            return aStorageService.showOriginalCurrencies;
        },
        set showOriginalCurrencies (aShowOriginalCurrencies) {
            aStorageService.showOriginalCurrencies = aShowOriginalCurrencies;
        },
        get showTooltip () {
            return aStorageService.showTooltip;
        },
        set showTooltip (aShowTooltip) {
            aStorageService.showTooltip = aShowTooltip;
        },
        get tempConvertUnits () {
            return aStorageService.tempConvertUnits;
        },
        set tempConvertUnits (aTempConvertUnits) {
            aStorageService.tempConvertUnits = aTempConvertUnits;
        },
        get apiKey () {
            return aStorageService.apiKey;
        },
        set apiKey (anApiKey) {
            aStorageService.apiKey = anApiKey;
        },
        get quotesProvider () {
            return aStorageService.quotesProvider;
        },
        set quotesProvider (aQuotesProvider) {
            aStorageService.quotesProvider = aQuotesProvider;
        },
        get showDccToolsButton () {
            return aStorageService.showDccToolsButton;
        },
        set showDccToolsButton (aShowDccToolsButton) {
            aStorageService.showDccToolsButton = aShowDccToolsButton;
        },
        get showDccConversionButton () {
            return aStorageService.showDccConversionButton;
        },
        set showDccConversionButton (aShowDccConversionButton) {
            aStorageService.showDccConversionButton = aShowDccConversionButton;
        },
        get convertFromCurrency () {
            return aStorageService.convertFromCurrency;
        },
        set convertFromCurrency (aConvertFromCurrency) {
            aStorageService.convertFromCurrency = aConvertFromCurrency;
        },
        get alwaysConvertFromCurrency () {
            return aStorageService.alwaysConvertFromCurrency;
        },
        set alwaysConvertFromCurrency (anAlwaysConvertFromCurrency) {
            aStorageService.alwaysConvertFromCurrency = anAlwaysConvertFromCurrency;
        },
        get showAsSymbol () {
            return aStorageService.showAsSymbol;
        },
        set showAsSymbol (aShowAsSymbol) {
            aStorageService.showAsSymbol = aShowAsSymbol;
        },
        get regexes1 () {
            return regexes1;
        },
        get regexes2 () {
            return regexes2;
        },
        getCurrencyNames: getCurrencyNames,
        isAllCurrenciesRead: isAllCurrenciesRead,
        getQuoteString: getQuoteString,
        resetReadCurrencies: resetReadCurrencies,
        resetSettings: resetSettings,
        addRegexesForEnabledCurrencies: addRegexesForEnabledCurrencies
    }
};

if (typeof exports === "object") {
    exports.InformationHolder = InformationHolder;
}
