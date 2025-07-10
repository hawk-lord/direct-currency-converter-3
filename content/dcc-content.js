/*
 * © Per Johansson
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import DccFunctions from './dcc-functions.js';

let conversionQuotes = [];
let currencyCode = "";
let isEnabled = true;
let quoteAdjustmentPercent = 0;
let regexes1 = {};
let regexes2 = {};
const enabledCurrenciesWithRegexes = [];
let roundAmounts = false;
let showOriginalPrices = false;
let showOriginalCurrencies = false;
let showTooltip = true;
let convertFromCurrency = "GBP";
let alwaysConvertFromCurrency = false;
let showAsSymbol = false;
let ignoredElements = ["audio", "colgroup", "embed", "head", "html", "img", "object", "ol", "script", "select", "style", "table", "tbody", "textarea", "thead", "tr", "ul", "video"];

/**
 *
 * @param aNode
 * @param aCheckIfDataNode Check if dataNode has been created.
 * Seems it always has to be true, otherwise the conversion will be repeated because of
 * MutationHandler if the original currency is shown.
 */
const replaceCurrency = (aNode, aCheckIfDataNode) => {
    "use strict";
    if (!aNode || !aNode.parentNode || aNode.nodeType !== Node.TEXT_NODE) {
        console.log('replaceCurrency: Skipping invalid node', {node: aNode, nodeType: aNode?.nodeType});
        return;
    }
    const isSibling = aNode.previousSibling;
    const dataNode = isSibling ? aNode.previousSibling : aNode.parentNode;
    if (!dataNode || dataNode.nodeType !== Node.ELEMENT_NODE) {
        console.log('replaceCurrency: dataNode is not an element', {dataNode, nodeType: dataNode?.nodeType});
        return;
    }
    if (aCheckIfDataNode && dataNode.className && typeof dataNode.className === "string" && dataNode.className.includes("dccConverted")) {
        console.log('replaceCurrency: Skipping already converted node', {
            tagName: dataNode.tagName,
            className: dataNode.className
        });
        return;
    }
    if (!dataNode.dataset || typeof dataNode.dataset !== 'object') {
        console.log('replaceCurrency: dataNode.dataset is invalid', {tagName: dataNode.tagName});
        return;
    }
    if (ignoredElements.includes(dataNode.tagName.toLowerCase())) {
        console.log('replaceCurrency: Skipping ignored element', {tagName: dataNode.tagName});
        return;
    }
    let prices = [];
    try {
        if (alwaysConvertFromCurrency) {
            prices = DccFunctions.findNumbers(convertFromCurrency, currencyCode, aNode.nodeValue);
        } else {
            prices = DccFunctions.findPrices(enabledCurrenciesWithRegexes, currencyCode, aNode.nodeValue);
        }
    } catch (err) {
        console.error('replaceCurrency: Error finding prices', err);
        return;
    }

    if (prices.length === 0) {
        return;
    }
    const replacedUnit = prices[0].originalCurrency;
    const conversionQuote = conversionQuotes[replacedUnit] * (1 + quoteAdjustmentPercent / 100);
    let convertedContent = aNode.nodeValue;
    for (let price of prices) {
        try {
            convertedContent = DccFunctions.convertContent(price, conversionQuote, replacedUnit,
                currencyCode, roundAmounts, showOriginalPrices, showOriginalCurrencies, convertedContent);
        } catch (err) {
            console.error('replaceCurrency: Error converting content', err);
            continue;
        }
    }
    if (isSibling) {
        dataNode.dataset.dccConvertedContentSibling = convertedContent;
        if (!dataNode.dataset.dccOriginalContentSibling) {
            dataNode.dataset.dccOriginalContentSibling = aNode.nodeValue;
        }
        if (!dataNode.className.includes("dccConvertedSibling")) {
            dataNode.className += " dccConvertedSibling";
        }
    } else {
        dataNode.dataset.dccConvertedContent = convertedContent;
        if (!dataNode.dataset.dccOriginalContent) {
            dataNode.dataset.dccOriginalContent = aNode.nodeValue;
        }
        if (!dataNode.className.includes("dccConverted")) {
            dataNode.className += " dccConverted";
        }
    }

    let dccTitle = "";
    for (let price of prices) {
        try {
            const decimals = DccFunctions.checkMinorUnit(price, replacedUnit);
            let tempAmount = DccFunctions.parseAmount(price.amount) * Math.pow(10, -decimals);
            let tempConvertedAmount = conversionQuote * DccFunctions.parseAmount(price.amount) * Math.pow(10, -decimals);

            if (isEnabled && showTooltip) {
                console.log('Building tooltip for price', {price, isEnabled, showTooltip});
                dccTitle += "Converted value: ";
                dccTitle += price.iso4217Currency ?
                    DccFunctions.formatDefaultIso4217Price(tempConvertedAmount) :
                    DccFunctions.formatOther(tempConvertedAmount, price.currency);
                dccTitle += "\n";
                dccTitle += "Original value: ";
                dccTitle += price.iso4217Currency ?
                    DccFunctions.formatIso4217Price(navigator.language, tempAmount, price.originalCurrency) :
                    DccFunctions.formatOther(tempAmount, price.originalCurrency);
                dccTitle += "\n";
                dccTitle += "Conversion quote " + price.originalCurrency + "/" + price.currency + " = " +
                    DccFunctions.formatOther(conversionQuote, "") + "\n";
                dccTitle += "Conversion quote " + price.currency + "/" + price.originalCurrency + " = " +
                    DccFunctions.formatOther(1 / conversionQuote, "") + "\n";
            }
        } catch (err) {
            console.error('replaceCurrency: Error building tooltip', err);
            continue;
        }
    }

    if (isEnabled && showTooltip && dccTitle) {
        try {
            dataNode.dataset.dcctitle = dccTitle;
            console.log('Set data-dcctitle', {dccTitle, dataNode});
            const showOriginal = false;
            substituteOne(aNode, showOriginal, dccTitle);
        } catch (err) {
            console.error('replaceCurrency: Error setting data-dcctitle', err);
        }
    }

    if (aNode.baseURI && aNode.baseURI.includes("pdf.js")) {
        if (aNode.parentNode) {
            try {
                aNode.parentNode.style.color = "black";
                aNode.parentNode.style.backgroundColor = "lightyellow";
                if (aNode.parentNode.parentNode) {
                    aNode.parentNode.parentNode.style.opacity = "1";
                }
            } catch (err) {
                console.error('replaceCurrency: Error styling PDF node', err);
            }
        }
    }
};

const mutationObserverInit = {
    childList: true,
    attributes: false,
    characterData: true,
    subtree: true,
    attributeOldValue: false,
    characterDataOldValue: false
};

// FIXME make this work again.
const mutationHandler = (aMutationRecord) => {
    "use strict";
    try {
        if (aMutationRecord.type === "childList") {
            for (let i = 0; i < aMutationRecord.addedNodes.length; ++i) {
                const node = aMutationRecord.addedNodes[i];
                traverseDomTree(node);
            }
        } else if (aMutationRecord.type === "characterData") {
            mutationObserver.disconnect();
            replaceCurrency(aMutationRecord.target, true);
            mutationObserver.observe(document, mutationObserverInit);
        }
    } catch (err) {
        console.error('mutationHandler: Error processing mutation', err);
    }
};

const mutationsHandler = (aMutations) => {
    "use strict";
    try {
        aMutations.forEach(mutationHandler);
    } catch (err) {
        console.error('mutationsHandler: Error processing mutations', err);
    }
};

const mutationObserver = new MutationObserver(mutationsHandler);

const startObserve = () => {
    "use strict";
    try {
        if (document && document.URL !== 'about:blank') {
            mutationObserver.observe(document, mutationObserverInit);
        }
    } catch (err) {
        console.error('startObserve: Error starting observer', err);
    }
};

const resetDomTree = (aNode) => {
    "use strict";
    try {
        if (!aNode) {
            console.log('resetDomTree: Node is null');
            return;
        }
        const nodeList = aNode.querySelectorAll(".dccConverted");
        for (let i = 0; i < nodeList.length; ++i) {
            const node = nodeList[i];
            if (node.dataset && node.dataset.dccOriginalContent) {
                delete node.dataset.dccOriginalContent;
            }
            if (node.dataset && node.dataset.dccConvertedContent) {
                delete node.dataset.dccConvertedContent;
            }
            try {
                node.className = node.className.replace("dccConverted", "").trim();
            } catch (err) {
                console.error('resetDomTree: Error removing class', {node, err});
            }
        }
        const nodeSiblingList = aNode.querySelectorAll(".dccConvertedSibling");
        for (let i = 0; i < nodeSiblingList.length; ++i) {
            const node = nodeSiblingList[i];
            try {
                node.className = node.className.replace("dccConvertedSibling", "").trim();
            } catch (err) {
                console.error('resetDomTree: Error removing sibling class', {node, err});
            }
        }
    } catch (err) {
        console.error('resetDomTree: Error processing reset', err);
    }
};

const filter = {
    acceptNode: (node) => {
        try {
            if (!node || !node.parentNode) {
                return NodeFilter.FILTER_REJECT;
            }
            const tagName = node.parentNode.tagName.toLowerCase();
            if (!ignoredElements.includes(tagName) && /\d/.test(node.textContent)) {
                return NodeFilter.FILTER_ACCEPT;
            }
            return NodeFilter.FILTER_REJECT;
        } catch (err) {
            console.error('filter.acceptNode: Error filtering node', err);
            return NodeFilter.FILTER_REJECT;
        }
    }
};

const traverseDomTree = (aNode) => {
    "use strict";
    if (!aNode || document.URL === 'about:blank') {
        console.log('traverseDomTree: Skipping due to null node or about:blank', {node: aNode, url: document.URL});
        return;
    }
    try {
        const treeWalker = document.createTreeWalker(
            aNode,
            NodeFilter.SHOW_TEXT,
            filter
        );
        while (treeWalker.nextNode()) {
            replaceCurrency(treeWalker.currentNode, true);
        }
    } catch (err) {
        console.error('traverseDomTree: Error creating or walking tree', err);
    }
};

const substituteOne = (aNode, isShowOriginal, aDccTitle) => {
    "use strict";
    if (!aNode || !aNode.parentNode || aNode.nodeType !== Node.TEXT_NODE) {
        console.log('substituteOne: Skipping invalid node', {node: aNode, nodeType: aNode?.nodeType});
        return;
    }
    const isSibling = aNode.previousSibling;
    const dataNode = isSibling ? aNode.previousSibling : aNode.parentNode;
    if (!dataNode || dataNode.nodeType !== Node.ELEMENT_NODE) {
        console.log('substituteOne: dataNode is not an element', {dataNode, nodeType: dataNode?.nodeType});
        return;
    }
    if (isSibling) {
        if (dataNode.dataset && dataNode.dataset.dccOriginalContentSibling) {
            if (aDccTitle) {
                try {
                    dataNode.dataset.dcctitle = aDccTitle;
                    console.log('substituteOne: Set data-dcctitle', {aDccTitle, dataNode});
                } catch (err) {
                    console.error('substituteOne: Error setting dcctitle', err);
                }
            }
            if (dataNode.dataset.dccConvertedContentSibling) {
                try {
                    aNode.nodeValue = isShowOriginal ? dataNode.dataset.dccOriginalContentSibling : dataNode.dataset.dccConvertedContentSibling;
                } catch (err) {
                    console.error('substituteOne: Error setting nodeValue', err);
                }
            }
        }
    } else {
        if (dataNode.dataset && dataNode.dataset.dccOriginalContent) {
            if (aDccTitle) {
                try {
                    dataNode.dataset.dcctitle = aDccTitle;
                    console.log('substituteOne: Set data-dcctitle', {aDccTitle, dataNode});
                } catch (err) {
                    console.error('substituteOne: Error setting dcctitle', err);
                }
            }
            if (dataNode.dataset.dccConvertedContent) {
                try {
                    aNode.nodeValue = isShowOriginal ? dataNode.dataset.dccOriginalContent : dataNode.dataset.dccConvertedContent;
                } catch (err) {
                    console.error('substituteOne: Error setting nodeValue', err);
                }
            }
        }
    }
};

const substituteAll = (aNode, isShowOriginal) => {
    "use strict";
    if (!aNode) {
        console.log('substituteAll: Node is null');
        return;
    }
    const nodeList = aNode.querySelectorAll(".dccConverted");
    for (let i = 0; i < nodeList.length; ++i) {
        const node = nodeList[i];
        const textNode = node.firstChild ? node.firstChild : node.nextSibling;
        if (!textNode || textNode.nodeType !== Node.TEXT_NODE) {
            console.log('substituteAll: Skipping invalid textNode', {node, textNode});
            continue;
        }
        if (node.dataset && node.dataset.dccOriginalContent && node.dataset.dccConvertedContent) {
            try {
                textNode.nodeValue = isShowOriginal ? node.dataset.dccOriginalContent : node.dataset.dccConvertedContent;
            } catch (err) {
                console.error('substituteAll: Error setting nodeValue for dccConverted', {node, err});
            }
        }
    }
    const nodeSiblingList = aNode.querySelectorAll(".dccConvertedSibling");
    for (let i = 0; i < nodeSiblingList.length; ++i) {
        const node = nodeSiblingList[i];
        const textNode = node.nextSibling;
        if (!textNode || textNode.nodeType !== Node.TEXT_NODE) {
            console.log('substituteAll: Skipping invalid sibling textNode', {node, textNode});
            continue;
        }
        if (node.dataset && node.dataset.dccOriginalContentSibling && node.dataset.dccConvertedContentSibling) {
            try {
                textNode.nodeValue = isShowOriginal ? node.dataset.dccOriginalContentSibling : node.dataset.dccConvertedContentSibling;
            } catch (err) {
                console.error('substituteAll: Error setting nodeValue for dccConvertedSibling', {node, err});
            }
        }
    }
};

const onSendEnabledStatus = (aStatus) => {
    "use strict";
    try {
        isEnabled = aStatus.isEnabled;
        console.log('onSendEnabledStatus:', aStatus);
        if (aStatus.isEnabled && !aStatus.hasConvertedElements) {
            startObserve();
            traverseDomTree(document);
        }
        const showOriginal = !aStatus.isEnabled;
        substituteAll(document, showOriginal);
    } catch (err) {
        console.error('onSendEnabledStatus: Error processing status', err);
    }
};


const readParameters = (aSettings) => {
    "use strict";
    try {
        conversionQuotes.length = 0;
        Object.assign(conversionQuotes, aSettings.conversionQuotes || {});
        currencyCode = aSettings.convertToCurrency || "";
        roundAmounts = aSettings.roundAmounts || false;
        showOriginalPrices = aSettings.showOriginalPrices || false;
        showOriginalCurrencies = aSettings.showOriginalCurrencies || false;
        showTooltip = aSettings.showTooltip || true;
        quoteAdjustmentPercent = +aSettings.quoteAdjustmentPercent || 0;
        convertFromCurrency = aSettings.convertFromCurrency || "GBP";
        alwaysConvertFromCurrency = aSettings.alwaysConvertFromCurrency || false;
        showAsSymbol = aSettings.showAsSymbol || false;
        ignoredElements.length = 0;
        if (aSettings.ignoredElements && Array.isArray(aSettings.ignoredElements)) {
            ignoredElements.push(...aSettings.ignoredElements);
        } else {
            ignoredElements.push("audio", "colgroup", "embed", "head", "html", "img", "object", "ol", "script", "select", "style", "table", "tbody", "textarea", "thead", "tr", "ul", "video");
        }
        Object.assign(regexes1, aSettings.regexes1 || {});
        Object.assign(regexes2, aSettings.regexes2 || {});
    } catch (err) {
        console.error('readParameters: Error reading settings', err);
    }
};

const begin = "(?:^|\\s|\\()";
const value = "((?:\\d{1,3}(?:[,.\\s']\\d{3})+|(?:\\d+))(?:[.,:]\\d{1,9})?)";
const space = "(?:\\s?)";
const end = "(?!\\p{L})";

const readEnabledCurrencies = (aSettings) => {
    "use strict";
    try {
        enabledCurrenciesWithRegexes.length = 0;
        let iso4217Currency = true;
        for (let currency of aSettings.convertFroms || []) {
            if (currency.enabled) {
                if (regexes1[currency.isoName] && regexes2[currency.isoName]) {
                    try {
                        const regex1 = RegExp(
                            begin +
                            regexes1[currency.isoName].regex +
                            space +
                            value +
                            "\\s*" +
                            regexes1[currency.isoName].mult + "?" +
                            end,
                            "gu"
                        );
                        const regex2 = RegExp(
                            begin +
                            value +
                            "\\s*" +
                            regexes2[currency.isoName].mult + "?" +
                            space +
                            regexes2[currency.isoName].regex +
                            end,
                            "gu"
                        );
                        //console.log(regex1.source);
                        //console.log(regex2.source);
                        enabledCurrenciesWithRegexes.push(new DccFunctions.CurrencyRegex(iso4217Currency, currency.isoName, regex1, regex2));
                    } catch (e) {
                        console.error(currency.isoName + " " + e.message);
                    }
                }
            }
        }
        iso4217Currency = false;
        if (aSettings.tempConvertUnits) {
            const regexObj_inch = new DccFunctions.CurrencyRegex(iso4217Currency, "inch", regexes1["inch"], regexes2["inch"]);
            enabledCurrenciesWithRegexes.push(regexObj_inch);
            const regexObj_kcal = new DccFunctions.CurrencyRegex(iso4217Currency, "kcal", regexes1["kcal"], regexes2["kcal"]);
            enabledCurrenciesWithRegexes.push(regexObj_kcal);
            const regexObj_nmi = new DccFunctions.CurrencyRegex(iso4217Currency, "nmi", regexes1["nmi"], regexes2["nmi"]);
            enabledCurrenciesWithRegexes.push(regexObj_nmi);
            const regexObj_mile = new DccFunctions.CurrencyRegex(iso4217Currency, "mile", regexes1["mile"], regexes2["mile"]);
            enabledCurrenciesWithRegexes.push(regexObj_mile);
            const regexObj_mil = new DccFunctions.CurrencyRegex(iso4217Currency, "mil", regexes1["mil"], regexes2["mil"]);
            enabledCurrenciesWithRegexes.push(regexObj_mil);
            const regexObj_knots = new DccFunctions.CurrencyRegex(iso4217Currency, "knots", regexes1["knots"], regexes2["knots"]);
            enabledCurrenciesWithRegexes.push(regexObj_knots);
            const regexObj_hp = new DccFunctions.CurrencyRegex(iso4217Currency, "hp", regexes1["hp"], regexes2["hp"]);
            enabledCurrenciesWithRegexes.push(regexObj_hp);
        }
    } catch (err) {
        console.error('readEnabledCurrencies: Error processing currencies', err);
    }
};


const startConversion = () => {
    "use strict";
    try {
        if (document.URL === 'about:blank') {
            console.log('startConversion: Skipping about:blank frame');
            return;
        }
        console.log('startConversion: Processing DOM for', document.URL);
        if (document.body) {
            traverseDomTree(document.body);
        } else {
            console.log('startConversion: document.body is null');
        }
    } catch (err) {
        console.error('startConversion: Error starting conversion', err);
    }
};

const loaded = () => {
    "use strict";
    try {
        console.log('loaded: DOMContentLoaded for', document.URL);
        startConversion();
    } catch (err) {
        console.error('loaded: Error in DOMContentLoaded', err);
    }
};

const onUpdateSettings = (aSettings) => {
    "use strict";
    try {
        const showOriginal = true;
        substituteAll(document, showOriginal);
        resetDomTree(document);
        readParameters(aSettings);
        DccFunctions.saveDefaultCurrencyNumberFormat(navigator.language, roundAmounts, currencyCode, showAsSymbol);
        DccFunctions.saveNumberFormat(navigator.language, roundAmounts);

        const startConversionLocal = () => {
            readEnabledCurrencies(aSettings);
            if (aSettings.isEnabled) {
                startObserve();
                if (document) {
                    traverseDomTree(document);
                    const showOriginal = false;
                    substituteAll(document, showOriginal);
                }
            }
            isEnabled = aSettings.isEnabled;
        };

        startConversionLocal();
    } catch (err) {
        console.error('onUpdateSettings: Error processing settings', err);
    }
};

const DirectCurrencyContent = {
    onSendEnabledStatus,
    onUpdateSettings
};

try {
    document.addEventListener("DOMContentLoaded", loaded);
} catch (err) {
    console.error('Error adding DOMContentLoaded listener', err);
}

export default DirectCurrencyContent;
