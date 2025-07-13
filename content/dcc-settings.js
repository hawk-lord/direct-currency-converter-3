/*
 * © Per Johansson
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

"use strict";

import SettingsAdapter from '../gc-settings-adapter.js';

const DirectCurrencySettings = (function () {

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
    let ignoredElements = null;

    const escapeHtml = function (aString) {
        if (!window.DOMPurify) {
            console.error("DOMPurify is not loaded");
            return String(aString);
        }
        return window.DOMPurify.sanitize(aString);
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
        } else if (event.target.value === "") {
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
        excludedLines = excludedLines.filter(entry => /\S/.test(entry));
        return excludedLines;
    };

    const saveSettings = () => {
        excludedDomains = textToArray(escapeHtml(document.getElementById("excluded_domains").value));
        includedDomains = textToArray(escapeHtml(document.getElementById("included_domains").value));
        ignoredElements = textToArray(escapeHtml(document.getElementById("ignoredElements").value));
        const sourceCurrencies = [];
        const sourceCurrencyList = document.getElementById("sourceCurrencies").children;
        for (let sourceCurrencyListElement of sourceCurrencyList) {
            const inputs = sourceCurrencyListElement.getElementsByTagName("input");
            const input = inputs.item(0);
            if (input) {
                const sourceCurrency = {isoName: input.id, enabled: input.checked};
                sourceCurrencies.push(sourceCurrency);
            }
        }

        const settings = {
            convertToCurrency: escapeHtml(convertToCurrency || ''),
            convertToCountry: escapeHtml(convertToCountry || ''),
            enableOnStart,
            excludedDomains: excludedDomains.map(escapeHtml),
            includedDomains: includedDomains.map(escapeHtml),
            convertFroms: sourceCurrencies,
            quoteAdjustmentPercent: quoteAdjustmentPercent || 0,
            roundAmounts,
            showOriginalPrices,
            showOriginalCurrencies,
            showTooltip,
            tempConvertUnits,
            apiKey: escapeHtml(apiKey || ''),
            quotesProvider: escapeHtml(quotesProvider || ''),
            convertFromCurrency: escapeHtml(convertFromCurrency || ''),
            alwaysConvertFromCurrency,
            showAsSymbol,
            ignoredElements: ignoredElements.map(escapeHtml)
        };
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
                input.checked = true;
            }
        }
    };

    const selectNoCurrencies = () => {
        const sourceCurrencyList = document.getElementById("sourceCurrencies").children;
        for (let sourceCurrencyListElement of sourceCurrencyList) {
            const inputs = sourceCurrencyListElement.getElementsByTagName("input");
            const input = inputs.item(0);
            if (input) {
                input.checked = false;
            }
        }
    };

    const onLoaded = () => {
        if (document.getElementById("targetCurrencyOptions").dataset.initialized) {
            //console.log("onLoaded already called, skipping");
            return;
        }
        document.getElementById("targetCurrencyOptions").dataset.initialized = true;
        //console.log("onLoaded started");
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
        SettingsAdapter.loadSettings(showSettings);
    };

    document.addEventListener("DOMContentLoaded", onLoaded);

    const setUIFromPreferences = function () {
        //console.log("setUIFromPreferences - excludedDomains:", excludedDomains);
        const targetCurrencyOptions = document.getElementById("targetCurrencyOptions");
        targetCurrencyOptions.value = (convertToCurrency && convertToCountry) ? `${convertToCurrency}_${convertToCountry}` : '';
        document.getElementById("enableConversion").checked = enableOnStart || false;
        const excludedText = excludedDomains.join("\n").replace(/\n/g, "\r\n");
        document.getElementById("excluded_domains").value = excludedText;
        const includedText = includedDomains.join("\n").replace(/\n/g, "\r\n");
        document.getElementById("included_domains").value = includedText;
        const ignoredElementsText = ignoredElements.join("\n").replace(/\n/g, "\r\n");
        document.getElementById("ignoredElements").value = ignoredElementsText;

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

            input.id = currency.isoName || '';
            input.type = "checkbox";
            if (currency.enabled) {
                input.checked = true;
            }
            li.append(input);
            label.htmlFor = input.id;
            label.append(currencyNames[currency.isoName] || currency.isoName || '');
            li.append(label);
            fragment.append(li);
        }

        document.getElementById("sourceCurrencies").append(fragment);

        document.getElementById("adjustmentPercentage").value = quoteAdjustmentPercent || '';
        document.getElementById("alwaysRound").checked = roundAmounts || false;
        document.getElementById("showOriginalAmounts").checked = showOriginalPrices || false;
        document.getElementById("showOriginalCurrencies").checked = showOriginalCurrencies || false;
        document.getElementById("showTooltip").checked = showTooltip || false;
        document.getElementById("tempConvertUnits").checked = tempConvertUnits || false;
        document.getElementById("apiKey").value = apiKey || '';
        document.getElementById("quotesProvider").value = quotesProvider || '';
        document.getElementById("convertFromCurrency").value = convertFromCurrency || '';
        document.getElementById("alwaysConvertFromCurrency").checked = alwaysConvertFromCurrency || false;
        document.getElementById("showAsSymbol").checked = showAsSymbol || false;
    };

    const showSettings = function (aSettings) {
        //console.log("showSettings input:", aSettings);
        convertToCurrency = escapeHtml(aSettings.convertToCurrency || '');
        convertToCountry = escapeHtml(aSettings.convertToCountry || '');
        enableOnStart = aSettings.enableOnStart || false;
        excludedDomains = Array.isArray(aSettings.excludedDomains) ? aSettings.excludedDomains.map(escapeHtml) : [];
        //console.log("excludedDomains after assignment:", excludedDomains);
        includedDomains = Array.isArray(aSettings.includedDomains) ? aSettings.includedDomains.map(escapeHtml) : [];
        convertFroms = Array.isArray(aSettings.convertFroms) ? aSettings.convertFroms.map((item) => ({
            ...item,
            isoName: escapeHtml(item.isoName || '')
        })) : [];
        quoteAdjustmentPercent = aSettings.quoteAdjustmentPercent || 0;
        roundAmounts = aSettings.roundAmounts || false;
        showOriginalPrices = aSettings.showOriginalPrices || false;
        showOriginalCurrencies = aSettings.showOriginalCurrencies || false;
        showTooltip = aSettings.showTooltip || false;
        tempConvertUnits = aSettings.tempConvertUnits || false;
        currencyNames = aSettings.currencyNames || {};
        Object.keys(currencyNames).forEach((key) => {
            currencyNames[key] = escapeHtml(currencyNames[key] || '');
        });
        convertFromCurrency = escapeHtml(aSettings.convertFromCurrency || '');
        apiKey = escapeHtml(aSettings.apiKey || '');
        quotesProvider = aSettings.quotesProvider || '';
        alwaysConvertFromCurrency = aSettings.alwaysConvertFromCurrency || false;
        showAsSymbol = aSettings.showAsSymbol || false;
        ignoredElements = Array.isArray(aSettings.ignoredElements) ? aSettings.ignoredElements.map(escapeHtml) : [];
        setUIFromPreferences();
    };

    return {
        showSettings
    };
})();

export default DirectCurrencySettings;