/*
 * © Per Johansson
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

"use strict";

/**
 * Used for the settings window and also for content scripts, so some values are only used in one context.
 *
 * @param anInformationHolder
 * @constructor
 */
const Settings = function(anInformationHolder) {
    this.conversionQuotes = anInformationHolder.getConversionQuotes();
    this.convertToCurrency = anInformationHolder.convertToCurrency;
    this.convertToCountry = anInformationHolder.convertToCountry;
    this.enableOnStart = anInformationHolder.enableOnStart;
    this.excludedDomains = anInformationHolder.excludedDomains;
    // To <li id ="SEK" ... />
    this.convertFroms = anInformationHolder.convertFroms;
    this.quoteAdjustmentPercent = anInformationHolder.quoteAdjustmentPercent;
    this.roundAmounts = anInformationHolder.roundPrices;
    this.showOriginalPrices = anInformationHolder.showOriginalPrices;
    this.showOriginalCurrencies = anInformationHolder.showOriginalCurrencies;
    this.showTooltip = anInformationHolder.showTooltip;
    this.tempConvertUnits = anInformationHolder.tempConvertUnits;
    this.apiKey = anInformationHolder.apiKey;
    this.quotesProvider = anInformationHolder.quotesProvider;
    this.isEnabled = anInformationHolder.conversionEnabled;
    // To <li><label>Swedish krona</label></li>
    this.currencyNames = anInformationHolder.getCurrencyNames();
    this.convertFromCurrency = anInformationHolder.convertFromCurrency;
    this.alwaysConvertFromCurrency = anInformationHolder.alwaysConvertFromCurrency;
    this.showAsSymbol = anInformationHolder.showAsSymbol;
    this.regexes1 = anInformationHolder.regexes1;
    this.regexes2 = anInformationHolder.regexes2;


    /*
    // Values for testing script injection
    this.convertFroms[0].isoName = "<script>alert(1)</script>";
    this.quoteAdjustmentPercent = "<script>alert(2)</script>";;
    this.apiKey = "<script>alert(4)</script>";
    this.currencyNames.AED = "<script>alert(3)</script>";
    */

};

if (typeof exports === "object") {
    exports.Settings = Settings;
}
