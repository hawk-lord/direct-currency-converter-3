/*
 * © Per Johansson
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

"use strict";

/**
 *
 * @param aSettings
 * @param anInformationHolder
 * @constructor
 */
export const ParseSettings = function (aSettings, anInformationHolder) {
    anInformationHolder.convertToCurrency = aSettings.convertToCurrency;
    anInformationHolder.convertToCountry = aSettings.convertToCountry;
    anInformationHolder.enableOnStart = aSettings.enableOnStart;
    anInformationHolder.excludedDomains = aSettings.excludedDomains;
    anInformationHolder.includedDomains = aSettings.includedDomains;
    anInformationHolder.convertFroms = aSettings.convertFroms;
    anInformationHolder.quoteAdjustmentPercent = aSettings.quoteAdjustmentPercent;
    anInformationHolder.roundPrices = aSettings.roundAmounts;
    anInformationHolder.showOriginalPrices = aSettings.showOriginalPrices;
    anInformationHolder.showOriginalCurrencies = aSettings.showOriginalCurrencies;
    anInformationHolder.showTooltip = aSettings.showTooltip;
    anInformationHolder.tempConvertUnits = aSettings.tempConvertUnits;
    anInformationHolder.apiKey = aSettings.apiKey;
    anInformationHolder.quotesProvider = aSettings.quotesProvider;
    anInformationHolder.convertFromCurrency = aSettings.convertFromCurrency;
    anInformationHolder.alwaysConvertFromCurrency = aSettings.alwaysConvertFromCurrency;
    anInformationHolder.showAsSymbol = aSettings.showAsSymbol;
    anInformationHolder.ignoredElements = aSettings.ignoredElements;
};
