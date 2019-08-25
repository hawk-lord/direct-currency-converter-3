/*
 * © Per Johansson
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Module pattern is used.
 */

"use strict";

if (!this.DirectCurrencySettings) {

    const DirectCurrencySettings = (function() {

        let convertToCurrency = null;
        let convertToCountry = null;
        let enableOnStart = null;
        let excludedDomains = [];
        let includedDomains = [];
        let convertFroms = [];
        let quoteAdjustmentPercent = null;
        let roundAmounts = null;
        let showOriginalPrices = null;
        let showOriginalCurrencies = null;
        let showTooltip = null;
        let tempConvertUnits = null;
        let currencyNames = {};
        let convertFromCurrency = null;
        let apiKey = null;
        let quotesProvider = null;
        let alwaysConvertFromCurrency = null;
        let showAsSymbol = null;

        const escapeHtml = function(aString) {
            return DOMPurify.sanitize(aString);
        };

        const targetCurrencyChanged = (event) => {
            const currencyCountry = event.target.value;
            convertToCurrency = currencyCountry.substring(0, 3);
            convertToCountry = currencyCountry.substring(currencyCountry.length - 2, currencyCountry.length);
        };

        const enableConversionChanged = (event) => {
            enableOnStart = event.target.checked;
        };

        const adjustmentPercentageChanged = (event) => {
            if (!isNaN(event.target.value)) {
                quoteAdjustmentPercent = parseFloat(event.target.value);
            }
            else if (event.target.value === "") {
                quoteAdjustmentPercent = 0;
            }
        };

        const alwaysRoundChanged = (event) => {
            roundAmounts = event.target.checked;
        };

        const showOriginalAmountsChanged = (event) => {
            showOriginalPrices = event.target.checked;
        };

        const showOriginalCurrenciesChanged = (event) => {
            showOriginalCurrencies = event.target.checked;
        };

        const showTooltipChanged = (event) => {
            showTooltip = event.target.checked;
        };

        const tempConvertUnitsChanged = (event) => {
            tempConvertUnits = event.target.checked;
        };

        const apiKeyChanged = (event) => {
            apiKey = event.target.value;
        };

        const quotesProviderChanged = (event) => {
            quotesProvider = event.target.value;
        };

        const convertFromCurrencyChanged = (event) => {
            convertFromCurrency = event.target.value;
        };

        const alwaysConvertFromCurrencyChanged = (event) => {
            alwaysConvertFromCurrency = event.target.checked;
        };

        const showAsSymbolChanged = (event) => {
            showAsSymbol = event.target.checked;
        };

        const textToArray = (excludedTextAreaString) => {
            let excludedLines = excludedTextAreaString.replace(/\r\n/g, "\n").split("\n");
            // remove empty entries
            excludedLines = excludedLines.filter(entry => /\S/.test(entry));
            return excludedLines;
        };

        const saveSettings = () => {
            excludedDomains = textToArray(escapeHtml(document.getElementById("excluded_domains").value));
            includedDomains = textToArray(escapeHtml(document.getElementById("included_domains").value));
            const sourceCurrencies = [];
            const sourceCurrencyList = document.getElementById("sourceCurrencies").children;
            for (let sourceCurrencyListElement of sourceCurrencyList) {
                const inputs = sourceCurrencyListElement.getElementsByTagName("input");
                const input = inputs.item(0);
                if (input) {
                    const sourceCurrency = {"isoName": input.id, "enabled": input.checked};
                    sourceCurrencies.push(sourceCurrency);
                }
            }

            const settings = {};
            settings.convertToCurrency = escapeHtml(convertToCurrency);
            settings.convertToCountry = escapeHtml(convertToCountry);
            settings.enableOnStart = enableOnStart;
            settings.excludedDomains = excludedDomains;
            Object.keys(settings.excludedDomains).forEach(escapeHtml);
            settings.includedDomains = includedDomains;
            Object.keys(settings.includedDomains).forEach(escapeHtml);
            settings.convertFroms = convertFroms;
            //Object.keys(settings.convertFroms).forEach(escapeHtml);
            settings.convertFroms = sourceCurrencies;
            settings.quoteAdjustmentPercent = escapeHtml(quoteAdjustmentPercent);
            settings.roundAmounts = roundAmounts;
            settings.showOriginalPrices = showOriginalPrices;
            settings.showOriginalCurrencies = showOriginalCurrencies;
            settings.showTooltip = showTooltip;
            settings.tempConvertUnits = tempConvertUnits;
            settings.apiKey = apiKey;
            settings.quotesProvider = quotesProvider;
            settings.convertFromCurrency = convertFromCurrency;
            settings.alwaysConvertFromCurrency = alwaysConvertFromCurrency;
            settings.showAsSymbol = showAsSymbol;
            SettingsAdapter.save(settings);
        };

        const resetSettings = () => {
            SettingsAdapter.reset();
        };

        const resetQuotes = () => {
            SettingsAdapter.resetQuotes();
        };

        const selectAllCurrencies = () => {
            const sourceCurrencyList = document.getElementById("sourceCurrencies").children;
            for (let sourceCurrencyListElement of sourceCurrencyList) {
                const inputs = sourceCurrencyListElement.getElementsByTagName("input");
                const input = inputs.item(0);
                if (input) {
                    input.checked = "checked";
                }
            }
        };

        const selectNoCurrencies = () => {
            const sourceCurrencyList = document.getElementById("sourceCurrencies").children;
            for (let sourceCurrencyListElement of sourceCurrencyList) {
                const inputs = sourceCurrencyListElement.getElementsByTagName("input");
                const input = inputs.item(0);
                if (input) {
                    input.checked = "";
                }
            }
        };

        const onLoaded = () => {
            document.getElementById("targetCurrencyOptions").addEventListener("input", targetCurrencyChanged);
            document.getElementById("enableConversion").addEventListener("input", enableConversionChanged);
            document.getElementById("adjustmentPercentage").addEventListener("input", adjustmentPercentageChanged);
            document.getElementById("alwaysRound").addEventListener("input", alwaysRoundChanged);
            document.getElementById("showOriginalAmounts").addEventListener("input", showOriginalAmountsChanged);
            document.getElementById("showOriginalCurrencies").addEventListener("input", showOriginalCurrenciesChanged);
            document.getElementById("showTooltip").addEventListener("input", showTooltipChanged);
            document.getElementById("tempConvertUnits").addEventListener("input", tempConvertUnitsChanged);
            document.getElementById("apiKey").addEventListener("input", apiKeyChanged);
            document.getElementById("quotesProvider").addEventListener("input", quotesProviderChanged);
            document.getElementById("convertFromCurrency").addEventListener("input", convertFromCurrencyChanged);
            document.getElementById("alwaysConvertFromCurrency").addEventListener("input", alwaysConvertFromCurrencyChanged);
            document.getElementById("showAsSymbol").addEventListener("input", showAsSymbolChanged);
            document.getElementById("save-button").addEventListener("click", saveSettings);
            document.getElementById("reset-button").addEventListener("click", resetSettings);
            document.getElementById("reset-quotes-button").addEventListener("click", resetQuotes);
            document.getElementById("select-all-button").addEventListener("click", selectAllCurrencies);
            document.getElementById("select-none-button").addEventListener("click", selectNoCurrencies);
        };

        document.addEventListener("DOMContentLoaded", onLoaded);

        const setUIFromPreferences = function() {
            const targetCurrencyOptions = document.getElementById("targetCurrencyOptions");
            targetCurrencyOptions.value = convertToCurrency + "_" + convertToCountry;
            document.getElementById("enableConversion").checked = enableOnStart ? "checked" : "";
            const excludedText = excludedDomains.join("\n").replace(/\n/g, "\r\n");
            document.getElementById("excluded_domains").value = excludedText;
            const includedText = includedDomains.join("\n").replace(/\n/g, "\r\n");
            document.getElementById("included_domains").value = includedText;

            let dragSrcEl;
            const handleDragStart = (event) => {
                dragSrcEl = event.target;
                event.dataTransfer.effectAllowed = 'move';

            };
            const handleDragOver = (event) => {
                event.preventDefault();
                event.target.classList.add('over');
                event.dataTransfer.dropEffect = 'move';
            };
            /**
             * Drag the label but move the parent li element.
             * @param event
             */
            const handleDrop = (event) => {
                event.preventDefault();
                if (event.target.draggable) {
                    event.target.parentNode.insertAdjacentElement('beforebegin', dragSrcEl.parentNode);
                }
            };

            const handleDragLeave = (event) => {
                // e.target is previous target element.
                event.target.classList.remove('over');
            };

            const fragment = document.createDocumentFragment();

            const makeDraggable = (element) => {
                element.draggable = true;
                element.addEventListener("dragstart", handleDragStart, false);
                element.addEventListener("drop", handleDrop, false);
                element.addEventListener("dragover", handleDragOver, false);
                element.addEventListener("dragleave", handleDragLeave, false);
            };

            for (let currency of convertFroms) {
                const li = document.createElement("li");
                const label = document.createElement("label");
                const input = document.createElement("input");

                makeDraggable(label);

                input.id = currency.isoName;
                input.type = "checkbox";
                if (currency.enabled) {
                    input.checked = "checked";
                }
                li.append(input);
                label.htmlFor = input.id;
                label.append(currencyNames[currency.isoName]);
                li.append(label);
                fragment.append(li);
            }

            document.getElementById("sourceCurrencies").append(fragment);

            document.getElementById("adjustmentPercentage").value = quoteAdjustmentPercent;
            document.getElementById("alwaysRound").checked = roundAmounts ? "checked" : "";
            document.getElementById("showOriginalAmounts").checked = showOriginalPrices ? "checked" : "";
            document.getElementById("showOriginalCurrencies").checked = showOriginalCurrencies ? "checked" : "";
            document.getElementById("showTooltip").checked = showTooltip ? "checked" : "";
            document.getElementById("tempConvertUnits").checked = tempConvertUnits ? "checked" : "";
            document.getElementById("apiKey").value = apiKey;
            document.getElementById("quotesProvider").value = quotesProvider;
            document.getElementById("convertFromCurrency").value = convertFromCurrency;
            document.getElementById("alwaysConvertFromCurrency").checked = alwaysConvertFromCurrency ? "checked" : "";
            document.getElementById("showAsSymbol").checked = showAsSymbol ? "checked" : "";
        };

        const showSettings = function(aSettings) {
            convertToCurrency = escapeHtml(aSettings.convertToCurrency);
            convertToCountry = escapeHtml(aSettings.convertToCountry);
            enableOnStart = aSettings.enableOnStart;
            excludedDomains = aSettings.excludedDomains;
            excludedDomains.map(escapeHtml);
            includedDomains = aSettings.includedDomains;
            includedDomains.map(escapeHtml);
            convertFroms = aSettings.convertFroms;
            convertFroms.map( (item) => { item.isoName = escapeHtml(item.isoName) });
            quoteAdjustmentPercent = escapeHtml(aSettings.quoteAdjustmentPercent);
            roundAmounts = aSettings.roundAmounts;
            showOriginalPrices = aSettings.showOriginalPrices;
            showOriginalCurrencies = aSettings.showOriginalCurrencies;
            showTooltip = aSettings.showTooltip;
            tempConvertUnits = aSettings.tempConvertUnits;
            currencyNames = aSettings.currencyNames;
            Object.keys(currencyNames).forEach( (key) => { currencyNames[key] = escapeHtml(currencyNames[key]) });
            convertFromCurrency = aSettings.convertFromCurrency;
            apiKey = escapeHtml(aSettings.apiKey);
            quotesProvider = aSettings.quotesProvider;
            alwaysConvertFromCurrency = aSettings.alwaysConvertFromCurrency;
            showAsSymbol = aSettings.showAsSymbol;
            setUIFromPreferences();
        };

        return {
            showSettings : showSettings
        };
    })();

    this.DirectCurrencySettings = DirectCurrencySettings;

}