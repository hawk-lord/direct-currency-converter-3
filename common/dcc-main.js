/*
 * © Per Johansson
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 *
 */

"use strict";

import {eventAggregator} from './eventAggregator.js';
import {InformationHolder} from './informationHolder.js';
import {QuotesServiceProvider} from './quotes-service.js';
import {EcbQuotesServiceProvider} from './ecb-quotes.js';
import {ParseSettings} from './parseSettings.js';
import {CurrencylayerQuotesServiceProvider} from './currencylayer-quotes.js';

export const DirectCurrencyConverter = function() {

    const defaultExcludedDomains = ["images.google.com", "docs.google.com", "drive.google.com", "twitter.com"];
    const defaultIncludedDomains = [];

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
        iso4217CurrencyMetaData = result;
        onSettingsRead();
    };
    // TODO Do not use chrome funtions here
	fetch(chrome.runtime.getURL('common/currencyData.json'))
    	.then((resp) => resp.json())
    	.then(onCurrencyDataRead);
    

    /**
     * Read currencies enabled
     * @param result
     */
    const onIso4217CurrenciesRead = (result) => {
        iso4217CurrenciesEnabled = result;
        onSettingsRead();
    };
	fetch(chrome.runtime.getURL('common/iso4217Currencies.json'))
    	.then((resp) => resp.json())
    	.then(onIso4217CurrenciesRead);
    

    /**
     * Read default regexes
     * @param result
     */
    const onRegexes1RequestRead = (result) => {
        regexes1 = result;
        onSettingsRead();
    };
	fetch(chrome.runtime.getURL('common/regexes1.json'))
    	.then((resp) => resp.json())
    	.then(onRegexes1RequestRead);

    /**
     * Read default regexes
     * @param result
     */
    const onRegexes2RequestRead = (result) => {
        regexes2 = result;
        onSettingsRead();
    };
	fetch(chrome.runtime.getURL('common/regexes2.json'))
    	.then((resp) => resp.json())
    	.then(onRegexes2RequestRead);


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

        //geoServiceFreegeoip = new FreegeoipServiceProvider();
        //geoServiceNekudo = new NekudoServiceProvider();
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
        get defaultIncludedDomains(){
            return defaultIncludedDomains;
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

