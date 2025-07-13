/*
 * © Per Johansson
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

const DirectCurrencyQuotes = (function () {
    "use strict";

    let conversionQuotes = [];
    let currencyCode = "";
    let isEnabled = true;
    let quoteAdjustmentPercent = 0;
    const regex1 = {};
    const regex2 = {};
    const enabledCurrenciesWithRegexes = [];

    const numberFormat = new Intl.NumberFormat(window.navigator.language, {minimumFractionDigits: 6});
    let ascending = false;

    /**
     *
     * @param aSettings
     */
    const readParameters = (aSettings) => {
        conversionQuotes = aSettings.conversionQuotes;
        currencyCode = DOMPurify.sanitize(aSettings.convertToCurrency);
    };

    const populateTable = (aSortByValue) => {
        const caption = document.getElementById("caption");
        while (caption.hasChildNodes()) {
            caption.removeChild(caption.lastChild);
        }
        const textNodeCaption = document.createTextNode("Quotes XXX / " + currencyCode + " = ");
        caption.append(textNodeCaption);

        const tableBody = document.getElementById("tableBody");
        while (tableBody.hasChildNodes()) {
            tableBody.removeChild(tableBody.lastChild);
        }
        const conversionQuotesArray = [];
        for (let conversionQuote in conversionQuotes) {
            if (!conversionQuotes[conversionQuote]) {
                continue;
            }
            if (!conversionQuote.match(/[A-Z][A-Z][A-Z]/)) {
                continue;
            }
            conversionQuotesArray.push({
                name: DOMPurify.sanitize(conversionQuote),
                value: DOMPurify.sanitize(conversionQuotes[conversionQuote])
            });
        }
        const sortByValue = (anA, aB) => {
            const a = ascending ? aB : anA;
            const b = ascending ? anA : aB;
            return aSortByValue ? b.value - a.value : a.name.localeCompare(b.name);
        };
        const conversionQuotesArraySorted = conversionQuotesArray.sort(sortByValue);
        for (let conversionQuote of conversionQuotesArraySorted) {
            const tableRow = document.createElement("tr");
            const tableCell1 = document.createElement("td");
            const textNode1 = document.createTextNode(conversionQuote.name);
            tableCell1.append(textNode1);
            tableRow.append(tableCell1);
            const tableCell2 = document.createElement("td");
            const textNode2 = document.createTextNode(numberFormat.format(conversionQuote.value));
            tableCell2.append(textNode2);
            tableRow.append(tableCell2);
            tableBody.append(tableRow);
        }
        ascending = !ascending;
    };

    const sortByCurrency = () => {
        populateTable(false);
    };
    const sortByValue = () => {
        populateTable(true);
    };
    const currencyElement = document.getElementById("currency");
    currencyElement.addEventListener("click", sortByCurrency);
    const valueElement = document.getElementById("value");
    valueElement.addEventListener("click", sortByValue);

    /**
     *
     * @param aSettings
     */
    const onUpdateQuotes = (aSettings) => {
        readParameters(aSettings);
        populateTable(true);
    };
    return {
        onUpdateQuotes: onUpdateQuotes
    };
})();

export default DirectCurrencyQuotes;