/*
 * © Per Johansson
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 *
 */

"use strict";

const DirectCurrencyConverter = function() {

    const defaultExcludedDomains = ["images.google.com", "docs.google.com", "drive.google.com", "twitter.com"];

    /**
     * Fractions, regions, and dates.
     */
    let iso4217CurrencyMetaData;

    /**
     * Currency converted or not.
     */
    let iso4217CurrenciesEnabled;

    /**
     * Unit before currency: EUR 1,00
     */
    let regexes1;

    /**
     * Unit after currency: 1,00 EUR
     */
    let regexes2;

    /**
     * Kitchen sink for all sorts of information.
     */
    let informationHolder;

    let geoServiceFreegeoip;
    let geoServiceNekudo;
    let commonQuotesService;
    let quotesService;


    /**
     * All JSON data files are read.
     */
    const onSettingsRead = () => {
        if (iso4217CurrencyMetaData && iso4217CurrenciesEnabled && regexes1 && regexes2) {
            eventAggregator.publish("allSettingsRead");
        }
    };


    /**
     * Read currency data
     * @param result
     */
    const onCurrencyDataRead = (result) => {
        const currencyDataJson = result;
        iso4217CurrencyMetaData = JSON.parse(currencyDataJson);
        onSettingsRead();
    };
    const currencyDataRequest = new XMLHttpRequest();
    currencyDataRequest.overrideMimeType("application/json");
    currencyDataRequest.open("GET", "main-common/currencyData.json", true);
    currencyDataRequest.onreadystatechange = () => {
        if (currencyDataRequest.readyState === XMLHttpRequest.DONE && currencyDataRequest.status === 200) {
            onCurrencyDataRead(currencyDataRequest.responseText);
        }
    };
    currencyDataRequest.send();

    /**
     * Read currencies enabled
     * @param result
     */
    const onIso4217CurrenciesRead = (result) => {
        const iso4217CurrenciesJson = result;
        iso4217CurrenciesEnabled = JSON.parse(iso4217CurrenciesJson);
        onSettingsRead();
    };
    const iso4217CurrenciesRequest = new XMLHttpRequest();
    iso4217CurrenciesRequest.overrideMimeType("application/json");
    iso4217CurrenciesRequest.open("GET", "main-common/iso4217Currencies.json", true);
    iso4217CurrenciesRequest.onreadystatechange = () => {
        if (iso4217CurrenciesRequest.readyState === XMLHttpRequest.DONE && iso4217CurrenciesRequest.status === 200) {
            onIso4217CurrenciesRead(iso4217CurrenciesRequest.responseText);
        }
    };
    iso4217CurrenciesRequest.send();

    /**
     * Read default regexes
     * @param result
     */
    const onRegexes1RequestRead = (result) => {
        const regexes1Json = result;
        regexes1 = JSON.parse(regexes1Json);
        onSettingsRead();
    };
    const regexes1Request = new XMLHttpRequest();
    regexes1Request.overrideMimeType("application/json");
    regexes1Request.open("GET", "main-common/regexes1.json", true);
    regexes1Request.onreadystatechange = () => {
        if (regexes1Request.readyState === XMLHttpRequest.DONE && regexes1Request.status === 200) {
            onRegexes1RequestRead(regexes1Request.responseText);
        }
    };
    regexes1Request.send();

    /**
     * Read default regexes
     * @param result
     */
    const onRegexes2RequestRead = (result) => {
        const regexes2Json = result;
        regexes2 = JSON.parse(regexes2Json);
        onSettingsRead();
    };
    const regexes2Request = new XMLHttpRequest();
    regexes2Request.overrideMimeType("application/json");
    regexes2Request.open("GET", "main-common/regexes2.json", true);
    regexes2Request.onreadystatechange = () => {
        if (regexes2Request.readyState === XMLHttpRequest.DONE && regexes2Request.status === 200) {
            onRegexes2RequestRead(regexes2Request.responseText);
        }
    };
    regexes2Request.send();


    /**
     *
     * @param aStorageServiceProvider
     * @param _
     */
    const createInformationHolder = (aStorageServiceProvider, _) => {
        informationHolder = new InformationHolder(aStorageServiceProvider, iso4217CurrencyMetaData, _,
            regexes1, regexes2);
    }


    /**
     * Called when storage has been read.
     * Loads region and currency quotes.
     * Sets up various subscribers.
     *
     * @param informationHolder
     */
    const onStorageServiceInitDone = () => {

        geoServiceFreegeoip = new FreegeoipServiceProvider();
        geoServiceNekudo = new NekudoServiceProvider();
        commonQuotesService = new QuotesServiceProvider(eventAggregator);
        if (informationHolder.quotesProvider === "ECB") {
            quotesService = new EcbQuotesServiceProvider(eventAggregator, informationHolder);
        }
        else if (informationHolder.quotesProvider === "Currencylayer") {
            quotesService = new CurrencylayerQuotesServiceProvider(eventAggregator, informationHolder);
        }

        eventAggregator.subscribe("countryReceivedFreegeoip", (countryCode) => {
            if (countryCode !== "") {
                informationHolder.convertToCountry = countryCode;
                quotesService.loadQuotes(commonQuotesService, informationHolder.apiKey);
            }
            else {
                geoServiceNekudo.loadUserCountry();
            }
        });

        eventAggregator.subscribe("countryReceivedNekudo", (countryCode) => {
            if (countryCode !== "") {
                informationHolder.convertToCountry = countryCode;
            }
            else {
                informationHolder.convertToCountry = "CH";
            }
            quotesService.loadQuotes(commonQuotesService, informationHolder.apiKey);
        });

        eventAggregator.subscribe("saveSettings", (eventArgs) => {
            const toCurrencyChanged = informationHolder.convertToCurrency !== eventArgs.settings.convertToCurrency;
            const quotesProviderChanged = informationHolder.quotesProvider !== eventArgs.settings.quotesProvider;
            if (quotesProviderChanged) {
                if (eventArgs.settings.quotesProvider === "ECB") {
                    quotesService = new EcbQuotesServiceProvider(eventAggregator, informationHolder);
                }
                else if (eventArgs.settings.quotesProvider === "Currencylayer") {
                    quotesService = new CurrencylayerQuotesServiceProvider(eventAggregator, informationHolder);
                }
            }
            informationHolder.resetReadCurrencies();
            new ParseSettings(eventArgs.settings, informationHolder);
            if (toCurrencyChanged || quotesProviderChanged) {
                quotesService.loadQuotes(commonQuotesService, informationHolder.apiKey);
            }
            informationHolder.addRegexesForEnabledCurrencies();
        });

        eventAggregator.subscribe("resetQuotes", (eventArgs) => {
            informationHolder.resetReadCurrencies();
            quotesService.loadQuotes(commonQuotesService, informationHolder.apiKey);
        });

        eventAggregator.subscribe("resetSettings", () => {
            informationHolder.resetSettings(iso4217Currencies);
            informationHolder.resetReadCurrencies();
            geoServiceFreegeoip.loadUserCountry();
        });

        if (!informationHolder.convertToCountry) {
            geoServiceFreegeoip.loadUserCountry();
        }
        else {
            quotesService.loadQuotes(commonQuotesService, informationHolder.apiKey);
        }

    };


    return {
        get iso4217CurrenciesEnabled () {
            return iso4217CurrenciesEnabled;
        },
        get defaultExcludedDomains(){
            return defaultExcludedDomains;
        },
        get informationHolder(){
            return informationHolder;
        },
        get regexes1(){
            return regexes1;
        },
        get regexes2(){
            return regexes2;
        },
        createInformationHolder: createInformationHolder,
        onStorageServiceInitDone: onStorageServiceInitDone
    }

};

if (typeof exports === "object") {
    exports.DirectCurrencyConverter = DirectCurrencyConverter;
}
