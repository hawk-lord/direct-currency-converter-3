/*
 * © Per Johansson
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Based on code from Simple Currency Converter
 * https://addons.mozilla.org/addon/simple-currency-converter/
 *
 * Module pattern is used.
 */

"use strict";

if (!this.DirectCurrencySettings) {
    const DirectCurrencySettings = (function() {
        const escapeHtml = function(aString) {
            return DOMPurify.sanitize(aString);
        };
        jQuery(document).ready(function() {
            jQuery( "#toggleCurrencies" ).click(function() {
                jQuery("fieldset.currencies").toggleClass( "minimised" );
            });
            jQuery("#fromCurrencies").sortable({
                revert: true
            });
            // Why was this used?        jQuery("ol, li").disableSelection();
            jQuery("#convert_to_currency").change(function() {
                const currencyCountry = jQuery(this).val();
                convertToCurrency = currencyCountry.substr(0, 3);
                convertToCountry = currencyCountry.substr(-2);
                onCurrencyChange(convertToCurrency);
            });
            jQuery("#enable_conversion").change(function() {
                enableOnStart = jQuery(this).is(":checked");
            });
            jQuery("#adjustment_percentage").change(function() {
                const tmp = jQuery(this).val();
                if (!isNaN(tmp)) {
                    quoteAdjustmentPercent = tmp;
                }
            });
            jQuery("#always_round").change(function() {
                roundAmounts = jQuery(this).is(":checked");
            });
            jQuery("#show_original_prices").change(function() {
                showOriginalPrices = jQuery(this).is(":checked");
            });
            jQuery("#showOriginalCurrencies").change(function() {
                showOriginalCurrencies = jQuery(this).is(":checked");
            });
            jQuery("#showTooltip").change(function() {
                showTooltip = jQuery(this).is(":checked");
            });
            jQuery("#temp_convert_units").change(function() {
                tempConvertUnits = jQuery(this).is(":checked");
            });
            jQuery("#api_key").change(function() {
                apiKey = jQuery(this).val();
            });
            jQuery("#quotesProvider").change(function() {
                quotesProvider = jQuery(this).val();
            });
            jQuery("#convertFromCurrency").change(function() {
                convertFromCurrency = jQuery(this).val();
            });
            jQuery("#alwaysConvertFromCurrency").change(function() {
                alwaysConvertFromCurrency = jQuery(this).is(":checked");
            });
            jQuery("#showAsSymbol").change(function() {
                showAsSymbol = jQuery(this).is(":checked");
            });
            jQuery("#save-button").click(function() {
                const excludedTextAreaString = escapeHtml(jQuery("#excluded_domains").val());
                let excludedLines = excludedTextAreaString.replace(/\r\n/g, "\n").split("\n");
                // remove empty entries
                excludedLines = jQuery.grep(excludedLines, function(n){ return(n); });
                if (excludedLines === null || excludedLines[0] === "") {
                    excludedLines = [];
                }
                excludedDomains = excludedLines;
                convertFroms = [];
                const liFromCurrencies = jQuery("#fromCurrencies").find("li");
                liFromCurrencies.each(function () {
                    let inputs = jQuery(this).find("input");
                    let input = jQuery(inputs)[0];
                    if (input && input.checked) {
                        convertFroms.push({"isoName": jQuery(this).attr("id"), "enabled": true});
                    }
                    else {
                        convertFroms.push({"isoName": jQuery(this).attr("id"), "enabled": false});
                    }
                });
                const settings = {};
                settings.convertToCurrency = escapeHtml(convertToCurrency);
                settings.convertToCountry = escapeHtml(convertToCountry);
                settings.enableOnStart = enableOnStart;
                settings.excludedDomains = excludedDomains;
                Object.keys(settings.excludedDomains).forEach(escapeHtml);
                settings.convertFroms = convertFroms;
                //Object.keys(settings.convertFroms).forEach(escapeHtml);
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
            });
            jQuery("#reset-button").click(function() {
                SettingsAdapter.reset();
            });
            jQuery("#reset-quotes-button").click(function() {
                SettingsAdapter.resetQuotes();
            });
            jQuery("#select-all-button").click(function() {
                const liFromCurrencies = jQuery("#fromCurrencies").find("li");
                liFromCurrencies.each(function () {
                    let inputs = jQuery(this).find("input");
                    let input = jQuery(inputs)[0];
                    if (input) {
                        jQuery(input).prop("checked", true);
                    }
                });
            });
            jQuery("#select-none-button").click(function() {
                const liFromCurrencies = jQuery("#fromCurrencies").find("li");
                liFromCurrencies.each(function () {
                    let inputs = jQuery(this).find("input");
                    let input = jQuery(inputs)[0];
                    if (input) {
                        jQuery(input).prop("checked", false);
                    }
                });
            });
        });
        let convertToCurrency = null;
        let convertToCountry = null;
        let enableOnStart = null;
        let excludedDomains = [];
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
        const setUIFromPreferences = function() {
            jQuery("#convert_to_currency").val(convertToCurrency + "_" + convertToCountry);
            onCurrencyChange(convertToCurrency);
            jQuery("#enable_conversion").prop("checked", enableOnStart);
            const excludedText = excludedDomains.join("\n").replace(/\n/g, "\r\n");
            jQuery("#excluded_domains").val(excludedText);
            for (let currency of convertFroms) {
                let li = jQuery(document.createElement("li")).attr({
                    class: "ui-state-default",
                    id: currency.isoName
                });
                jQuery("#fromCurrencies").append(li);
                let label = jQuery(document.createElement("label"));
                li.append(label);
                if (currency.enabled) {
                    label.append(jQuery(document.createElement("input")).attr({
                        type: "checkbox",
                        checked: "checked"
                    }));
                }
                else {
                    label.append(jQuery(document.createElement("input")).attr({
                        type: "checkbox"
                    }));
                }
                label.append(currencyNames[currency.isoName]);
            }
            jQuery("#adjustment_percentage").val(quoteAdjustmentPercent);
            jQuery("#always_round").prop("checked", roundAmounts);
            jQuery("#show_original_prices").prop("checked", showOriginalPrices);
            jQuery("#showOriginalCurrencies").prop("checked", showOriginalCurrencies);
            jQuery("#showTooltip").prop("checked", showTooltip);
            jQuery("#showTooltip").prop("checked", showTooltip);
            jQuery("#temp_convert_units").prop("checked", tempConvertUnits);
            jQuery("#api_key").val(apiKey);
            jQuery("#quotesProvider").val(quotesProvider);
            const selectedOption = jQuery('#convert_to_currency').val();
            const selectList = jQuery("#convert_to_currency").find("option");
            selectList.sort(function(a,b){
                const A = jQuery(a).text().toLowerCase();
                const B = jQuery(b).text().toLowerCase();
                if (A < B){
                    return -1;
                }
                else if (A > B){
                    return 1;
                }
                else{
                    return 0;
                }
            });
            jQuery("#convert_to_currency").html(selectList);
            jQuery('#convert_to_currency').val(selectedOption);
            jQuery("#convertFromCurrency").val(convertFromCurrency);
            jQuery("#alwaysConvertFromCurrency").prop("checked", alwaysConvertFromCurrency);
            jQuery("#showAsSymbol").prop("checked", showAsSymbol);
        };
        const onCurrencyChange = function(val) {
            let currencyVal = escapeHtml(val);
            jQuery("#preview_left").html(currencyVal);
            jQuery("#preview_right").html(currencyVal);
        };
        const showSettings = function(aSettings) {
            convertToCurrency = escapeHtml(aSettings.convertToCurrency);
            convertToCountry = escapeHtml(aSettings.convertToCountry);
            enableOnStart = aSettings.enableOnStart;
            excludedDomains = aSettings.excludedDomains;
            excludedDomains.map(escapeHtml);
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