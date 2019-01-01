/*
 * © Per Johansson
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

"use strict";

const GcStorageServiceProvider = function() {

    let storage = {};

    const initSettings = (aConvertFroms, anExcludedDomains) => {
        chrome.storage.local.get((aStorage) => {
            storage = aStorage;
            if (!storage.excludedDomains) {
                storage.excludedDomains = anExcludedDomains;
            }
            if (!storage.dccPrefs) {
                storage.dccPrefs = {
                    //convertToCurrency: "CHF",
                    //convertToCountry: "CH",
                    enableOnStart: true,
                    quoteAdjustmentPercent: 0,
                    roundAmounts: false,
                    showOriginalPrices: false,
                    showOriginalCurrencies: false,
                    showTooltip: true,
                    tempConvertUnits: false,
                    apiKey: "",
                    quotesProvider: "ECB",
                    convertFroms: aConvertFroms,
                    convertFromCurrency: "GBP",
                    alwaysConvertFromCurrency: false,
                    showAsSymbol: false
                };
            }
            else {
                if (!storage.dccPrefs.convertToCurrency) {
                    storage.dccPrefs.convertToCurrency = "CHF";
                }
                if (!storage.dccPrefs.convertToCountry) {
                    storage.dccPrefs.convertToCountry = "CH";
                }
                if (storage.dccPrefs.enableOnStart === null || storage.dccPrefs.enableOnStart == null) {
                    storage.dccPrefs.enableOnStart = true;
                }
                if (!storage.dccPrefs.quoteAdjustmentPercent) {
                    storage.dccPrefs.quoteAdjustmentPercent = 0;
                }
                if (storage.dccPrefs.roundAmounts === null || storage.dccPrefs.roundAmounts == null) {
                    storage.dccPrefs.roundAmounts = false;
                }
                if (storage.dccPrefs.showOriginalPrices === null || storage.dccPrefs.showOriginalPrices == null) {
                    storage.dccPrefs.showOriginalPrices = false;
                }
                if (storage.dccPrefs.showOriginalCurrencies === null || storage.dccPrefs.showOriginalCurrencies == null) {
                    storage.dccPrefs.showOriginalCurrencies = false;
                }
                if (storage.dccPrefs.showTooltip === null || storage.dccPrefs.showTooltip == null) {
                    storage.dccPrefs.showTooltip = true;
                }
                if (storage.dccPrefs.tempConvertUnits === null || storage.dccPrefs.tempConvertUnits == null) {
                    storage.dccPrefs.tempConvertUnits = false;
                }
                if (!storage.dccPrefs.apiKey) {
                    storage.dccPrefs.apiKey = "";
                }
                if (!storage.dccPrefs.quotesProvider) {
                    storage.dccPrefs.quotesProvider = "ECB";
                }
                if (!storage.dccPrefs.convertFroms) {
                    storage.dccPrefs.convertFroms = aConvertFroms;
                }
                else {
                    for (let currency of aConvertFroms) {
                        let found = false;
                        for (let storedCurrency of storage.dccPrefs.convertFroms) {
                            if (currency.isoName === storedCurrency.isoName) {
                                found = true;
                                break;
                            }
                        }
                        if (!found){
                            storage.dccPrefs.convertFroms.push(currency);
                        }
                    }
                }
                storage.dccPrefs.enabledCurrencies = null;
                if (!storage.dccPrefs.convertFromCurrency) {
                    storage.dccPrefs.convertFromCurrency = "GBP";
                }
                if (storage.dccPrefs.alwaysConvertFromCurrency === null || storage.dccPrefs.alwaysConvertFromCurrency == null) {
                    storage.dccPrefs.alwaysConvertFromCurrency = false;
                }
                if (storage.dccPrefs.showAsSymbol === null || storage.dccPrefs.showAsSymbol == null) {
                    storage.dccPrefs.showAsSymbol = false;
                }
            }
            chrome.storage.local.set(storage);
            eventAggregator.publish("storageInitDone");
        });
    };
    const resetSettings = (aDefaultEnabled) => {
        const currentApiKey = storage.dccPrefs.apiKey;
        storage.dccPrefs = {
            convertToCurrency: "CHF",
            convertToCountry: "CH",
            enableOnStart: true,
            quoteAdjustmentPercent: 0,
            roundAmounts: false,
            showOriginalPrices: false,
            showOriginalCurrencies: false,
            showTooltip: true,
            tempConvertUnits: false,
            apiKey: currentApiKey,
            quotesProvider: "ECB",
            convertFroms: aDefaultEnabled,
            convertFromCurrency: "GBP",
            alwaysConvertFromCurrency: false,
            showAsSymbol: false
        };
        chrome.storage.local.set(storage);
        eventAggregator.publish("storageReInitDone");
    };
    return {
        get convertToCurrency () {
            return storage.dccPrefs.convertToCurrency;
        },
        set convertToCurrency (aCurrency) {
            storage.dccPrefs.convertToCurrency = aCurrency;
            chrome.storage.local.set(storage);
        },
        get convertToCountry () {
            return storage.dccPrefs.convertToCountry;
        },
        set convertToCountry (aCountry) {
            storage.dccPrefs.convertToCountry = aCountry;
            chrome.storage.local.set(storage);
        },
        get enableOnStart () {
            if (storage.dccPrefs) {
                return storage.dccPrefs.enableOnStart;
            }
            return true;
        },
        set enableOnStart (anEnableOnStart) {
            storage.dccPrefs.enableOnStart = anEnableOnStart;
            chrome.storage.local.set(storage);
        },
        get excludedDomains () {
            return storage.excludedDomains;
        },
        set excludedDomains (anExcludedDomains) {
            storage.excludedDomains = anExcludedDomains;
            chrome.storage.local.set(storage);
        },
        get convertFroms () {
            return storage.dccPrefs.convertFroms;
        },
        set convertFroms (aConvertFroms) {
            storage.dccPrefs.convertFroms = aConvertFroms;
            chrome.storage.local.set(storage);
        },
        get quoteAdjustmentPercent () {
            return storage.dccPrefs.quoteAdjustmentPercent;
        },
        set quoteAdjustmentPercent (aQuoteAdjustmentPercent) {
            storage.dccPrefs.quoteAdjustmentPercent = aQuoteAdjustmentPercent;
            chrome.storage.local.set(storage);
        },
        get roundPrices () {
            return storage.dccPrefs.roundAmounts;
        },
        set roundPrices (aRoundPrices) {
            storage.dccPrefs.roundAmounts = aRoundPrices;
            chrome.storage.local.set(storage);
        },
        get showOriginalPrices () {
            return storage.dccPrefs.showOriginalPrices;
        },
        set showOriginalPrices (aShowOriginalPrices) {
            storage.dccPrefs.showOriginalPrices = aShowOriginalPrices;
            chrome.storage.local.set(storage);
        },
        get showOriginalCurrencies () {
            return storage.dccPrefs.showOriginalCurrencies;
        },
        set showOriginalCurrencies (aShowOriginalCurrencies) {
            storage.dccPrefs.showOriginalCurrencies = aShowOriginalCurrencies;
            chrome.storage.local.set(storage);
        },
        get showTooltip () {
            return storage.dccPrefs.showTooltip;
        },
        set showTooltip (aShowTooltip) {
            storage.dccPrefs.showTooltip = aShowTooltip;
            chrome.storage.local.set(storage);
        },
        get tempConvertUnits () {
            return storage.dccPrefs.tempConvertUnits;
        },
        set tempConvertUnits (aTempConvertUnits) {
            storage.dccPrefs.tempConvertUnits = aTempConvertUnits;
            chrome.storage.local.set(storage);
        },
        get apiKey () {
            return storage.dccPrefs.apiKey;
        },
        set apiKey (anApiKey) {
            storage.dccPrefs.apiKey = anApiKey;
            chrome.storage.local.set(storage);
        },
        get quotesProvider () {
            return storage.dccPrefs.quotesProvider;
        },
        set quotesProvider (aQuotesProvider) {
            storage.dccPrefs.quotesProvider = aQuotesProvider;
            chrome.storage.local.set(storage);
        },
        get convertFromCurrency () {
            return storage.dccPrefs.convertFromCurrency;
        },
        set convertFromCurrency (aConvertFromCurrency) {
            storage.dccPrefs.convertFromCurrency = aConvertFromCurrency;
            chrome.storage.local.set(storage);
        },
        get alwaysConvertFromCurrency () {
            return storage.dccPrefs.alwaysConvertFromCurrency;
        },
        set alwaysConvertFromCurrency (anAlwaysConvertFromCurrency) {
            storage.dccPrefs.alwaysConvertFromCurrency = anAlwaysConvertFromCurrency;
            chrome.storage.local.set(storage);
        },
        get showAsSymbol () {
            return storage.dccPrefs.showAsSymbol;
        },
        set showAsSymbol (aShowAsSymbol) {
            storage.dccPrefs.showAsSymbol = aShowAsSymbol;
            chrome.storage.local.set(storage);
        },
        setEnabledCurrency(aCurrency, anEnabled) {
            let found = false;
            for (let storedCurrency of storage.dccPrefs.convertFroms) {
                if (aCurrency.isoName === storedCurrency.isoName) {
                    found = true;
                    aCurrency.enabled = anEnabled;
                    break;
                }
            }
            if (!found){
                storage.dccPrefs.convertFroms.push({isoName: currency, enabled: anEnabled});
            }
            chrome.storage.local.set(storage);
        },
        initSettings: initSettings,
        resetSettings: resetSettings
    };
};

