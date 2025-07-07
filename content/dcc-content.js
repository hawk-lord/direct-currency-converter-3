/*
 * © Per Johansson
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

"use strict";

import DccFunctions from './dcc-functions.js';

const DirectCurrencyContent = {
    conversionQuotes: [],
    currencyCode: "",
    isEnabled: true,
    quoteAdjustmentPercent: 0,
    regexes1: {},
    regexes2: {},
    enabledCurrenciesWithRegexes: [],
    roundAmounts: false,
    showOriginalPrices: false,
    showOriginalCurrencies: false,
    showTooltip: true,
    convertFromCurrency: "GBP",
    alwaysConvertFromCurrency: false,
    showAsSymbol: false,
    ignoredElements: ["audio", "colgroup", "embed", "head", "html", "img", "object", "ol", "script", "select", "style", "table", "tbody", "textarea", "thead", "tr", "ul", "video"],

    /**
     * @param aNode
     * @param aCheckIfDataNode Check if dataNode has been created.
     * Seems it always has to be true, otherwise the conversion will be repeated because of
     * MutationHandler if the original currency is shown.
     */
    replaceCurrency(aNode, aCheckIfDataNode) {
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
        if (this.ignoredElements && this.ignoredElements.includes(dataNode.tagName.toLowerCase())) {
            console.log('replaceCurrency: Skipping ignored element', {tagName: dataNode.tagName});
            return;
        }
        let prices = [];
        try {
            if (this.alwaysConvertFromCurrency) {
                prices = DccFunctions.findNumbers(this.convertFromCurrency, this.currencyCode, aNode.nodeValue);
            } else {
                prices = DccFunctions.findPrices(this.enabledCurrenciesWithRegexes, this.currencyCode, aNode.nodeValue);
            }
        } catch (err) {
            console.error('replaceCurrency: Error finding prices', err);
            return;
        }

        if (prices.length === 0) {
            return;
        }
        const replacedUnit = prices[0].originalCurrency;
        const conversionQuote = this.conversionQuotes[replacedUnit] * (1 + this.quoteAdjustmentPercent / 100);
        let convertedContent = aNode.nodeValue;
        for (let price of prices) {
            try {
                convertedContent = DccFunctions.convertContent(price, conversionQuote, replacedUnit,
                    this.currencyCode, this.roundAmounts, this.showOriginalPrices, this.showOriginalCurrencies, convertedContent);
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

                if (this.isEnabled && this.showTooltip) {
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

        if (this.isEnabled && this.showTooltip) {
            const showOriginal = false;
            this.substituteOne(aNode, showOriginal, dccTitle);
        }

        // TODO Does not work anymore in Firefox
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
    },

    substituteOne(aNode, isShowOriginal, aDccTitle) {
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
                        dataNode.dataset.dcctitle = dataNode.dataset.dcctitle || "";
                        dataNode.dataset.dcctitle += aDccTitle + "\n";
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
                        dataNode.dataset.dcctitle = dataNode.dataset.dcctitle || "";
                        dataNode.dataset.dcctitle += aDccTitle + "\n";
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
    },

    substituteAll(aNode, isShowOriginal) {
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
    },

    onSendEnabledStatus(aStatus) {
        "use strict";
        try {
            this.isEnabled = aStatus.isEnabled;
            console.log('onSendEnabledStatus:', aStatus);
            if (aStatus.isEnabled && !aStatus.hasConvertedElements) {
                this.startObserve();
                this.traverseDomTree(document);
            }
            const showOriginal = !aStatus.isEnabled;
            this.substituteAll(document, showOriginal);
        } catch (err) {
            console.error('onSendEnabledStatus: Error processing status', err);
        }
    },

    readParameters(aSettings) {
        "use strict";
        try {
            this.conversionQuotes = aSettings.conversionQuotes;
            this.currencyCode = aSettings.convertToCurrency;
            this.roundAmounts = aSettings.roundAmounts;
            this.showOriginalPrices = aSettings.showOriginalPrices;
            this.showOriginalCurrencies = aSettings.showOriginalCurrencies;
            this.showTooltip = aSettings.showTooltip;
            this.quoteAdjustmentPercent = +aSettings.quoteAdjustmentPercent;
            this.convertFromCurrency = aSettings.convertFromCurrency;
            this.alwaysConvertFromCurrency = aSettings.alwaysConvertFromCurrency;
            this.showAsSymbol = aSettings.showAsSymbol;
            this.ignoredElements = aSettings.ignoredElements;
            this.regexes1 = aSettings.regexes1;
            this.regexes2 = aSettings.regexes2;
        } catch (err) {
            console.error('readParameters: Error reading settings', err);
        }
    },

    readEnabledCurrencies(aSettings) {
        "use strict";
        try {
            this.enabledCurrenciesWithRegexes.length = 0;
            let iso4217Currency = true;
            for (let currency of aSettings.convertFroms) {
                if (currency.enabled) {
                    if (this.regexes1[currency.isoName] && this.regexes2[currency.isoName]) {
                        // TODO Handle better if an invalid currency is read, the above is null
                        try {
                            const regex1 = RegExp(
                                "\\b" +
                                this.regexes1[currency.isoName].regex +
                                "\\s+" +
                                "([0-9]+[0-9\\s,.\\u00A0\\u2002\\u2003\\u2009\\u202F':]*(?:[0-9](?![\\s,.\\u00A0\\u2002\\u2003\\u2009\\u202F'][0-9])))" +
                                "\\s*" +
                                this.regexes1[currency.isoName].mult + "?",
                                "g"
                            );

                            const regex2 = RegExp(
                                "([0-9]+[0-9\\s,.\\u00A0\\u2002\\u2003\\u2009\\u202F':]*(?:[0-9](?![\\s,.\\u00A0\\u2002\\u2003\\u2009\\u202F'][0-9])))" +
                                "\\s*" +
                                this.regexes2[currency.isoName].mult + "?\\s+" +
                                this.regexes2[currency.isoName].regex +
                                "\\b",
                                "g"
                            );
                            console.log(regex1);
                            console.log(regex2);
                            this.enabledCurrenciesWithRegexes.push(new DccFunctions.CurrencyRegex(iso4217Currency, currency.isoName, regex1, regex2));
                        } catch (e) {
                            console.error(currency.isoName + " " + e.message);
                        }
                    }
                }
            }
            iso4217Currency = false;
            if (aSettings.tempConvertUnits) {
                const regexObj_inch = new DccFunctions.CurrencyRegex(iso4217Currency, "inch", this.regexes1["inch"], this.regexes2["inch"]);
                this.enabledCurrenciesWithRegexes.push(regexObj_inch);
                const regexObj_kcal = new DccFunctions.CurrencyRegex(iso4217Currency, "kcal", this.regexes1["kcal"], this.regexes2["kcal"]);
                this.enabledCurrenciesWithRegexes.push(regexObj_kcal);
                const regexObj_nmi = new DccFunctions.CurrencyRegex(iso4217Currency, "nmi", this.regexes1["nmi"], this.regexes2["nmi"]);
                this.enabledCurrenciesWithRegexes.push(regexObj_nmi);
                const regexObj_mile = new DccFunctions.CurrencyRegex(iso4217Currency, "mile", this.regexes1["mile"], this.regexes2["mile"]);
                this.enabledCurrenciesWithRegexes.push(regexObj_mile);
                const regexObj_mil = new DccFunctions.CurrencyRegex(iso4217Currency, "mil", this.regexes1["mil"], this.regexes2["mil"]);
                this.enabledCurrenciesWithRegexes.push(regexObj_mil);
                const regexObj_knots = new DccFunctions.CurrencyRegex(iso4217Currency, "knots", this.regexes1["knots"], this.regexes2["knots"]);
                this.enabledCurrenciesWithRegexes.push(regexObj_knots);
                const regexObj_hp = new DccFunctions.CurrencyRegex(iso4217Currency, "hp", this.regexes1["hp"], this.regexes2["hp"]);
                this.enabledCurrenciesWithRegexes.push(regexObj_hp);
            }
        } catch (err) {
            console.error('readEnabledCurrencies: Error processing currencies', err);
        }
    },

    onUpdateSettings(aSettings) {
        "use strict";
        try {
            const showOriginal = true;
            this.substituteAll(document, showOriginal);
            this.resetDomTree(document);
            this.readParameters(aSettings);
            DccFunctions.saveDefaultCurrencyNumberFormat(navigator.language, this.roundAmounts, this.currencyCode, this.showAsSymbol);
            DccFunctions.saveNumberFormat(navigator.language, this.roundAmounts);

            const startConversion = () => {
                this.readEnabledCurrencies(aSettings);
                if (aSettings.isEnabled) {
                    this.startObserve();
                    if (document) {
                        this.traverseDomTree(document);
                        const showOriginal = false;
                        this.substituteAll(document, showOriginal);
                    }
                }
                this.isEnabled = aSettings.isEnabled;
            };

            startConversion();
        } catch (err) {
            console.error('onUpdateSettings: Error processing settings', err);
        }
    },

    mutationObserverInit: {
        childList: true,
        attributes: false,
        characterData: true,
        subtree: true,
        attributeOldValue: false,
        characterDataOldValue: false
    },

    mutationHandler(aMutationRecord) {
        "use strict";
        try {
            if (aMutationRecord.type === "childList") {
                for (let i = 0; i < aMutationRecord.addedNodes.length; ++i) {
                    const node = aMutationRecord.addedNodes[i];
                    this.traverseDomTree(node);
                }
            } else if (aMutationRecord.type === "characterData") {
                this.mutationObserver.disconnect();
                this.replaceCurrency(aMutationRecord.target, true);
                // Reconnect observer after processing
                this.mutationObserver.observe(document, this.mutationObserverInit);
            }
        } catch (err) {
            console.error('mutationHandler: Error processing mutation', err);
        }
    },

    mutationsHandler(aMutations) {
        "use strict";
        try {
            aMutations.forEach(this.mutationHandler.bind(this));
        } catch (err) {
            console.error('mutationsHandler: Error processing mutations', err);
        }
    },

    mutationObserver: new MutationObserver(function (mutations) {
        DirectCurrencyContent.mutationsHandler(mutations);
    }),

    startObserve() {
        "use strict";
        try {
            if (document && document.URL !== 'about:blank') {
                this.mutationObserver.observe(document, this.mutationObserverInit);
            }
        } catch (err) {
            console.error('startObserve: Error starting observer', err);
        }
    },

    resetDomTree(aNode) {
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
    },

    filter: {
        acceptNode: function (node) {
            try {
                if (!node || !node.parentNode) {
                    return NodeFilter.FILTER_REJECT;
                }
                const tagName = node.parentNode.tagName.toLowerCase();
                if (!DirectCurrencyContent.ignoredElements || !DirectCurrencyContent.ignoredElements.includes(tagName) && /\d/.test(node.textContent)) {
                    return NodeFilter.FILTER_ACCEPT;
                }
                return NodeFilter.FILTER_REJECT;
            } catch (err) {
                console.error('filter.acceptNode: Error filtering node', err);
                return NodeFilter.FILTER_REJECT;
            }
        }
    },

    traverseDomTree(aNode) {
        "use strict";
        if (!aNode || document.URL === 'about:blank') {
            console.log('traverseDomTree: Skipping due to null node or about:blank', {node: aNode, url: document.URL});
            return;
        }
        try {
            const treeWalker = document.createTreeWalker(
                aNode,
                NodeFilter.SHOW_TEXT,
                this.filter);
            while (treeWalker.nextNode()) {
                this.replaceCurrency(treeWalker.currentNode, true);
            }
        } catch (err) {
            console.error('traverseDomTree: Error creating or walking tree', err);
        }
    },

    startConversion() {
        "use strict";
        try {
            if (document.URL === 'about:blank') {
                console.log('startConversion: Skipping about:blank frame');
                return;
            }
            console.log('startConversion: Processing DOM for', document.URL);
            if (document.body) {
                this.traverseDomTree(document.body);
            } else {
                console.log('startConversion: document.body is null');
            }
        } catch (err) {
            console.error('startConversion: Error starting conversion', err);
        }
    },

    loaded() {
        "use strict";
        try {
            console.log('loaded: DOMContentLoaded for', document.URL);
            // Initialization logic for DOMContentLoaded
        } catch (err) {
            console.error('loaded: Error in DOMContentLoaded', err);
        }
    }
};

// Set up DOMContentLoaded listener
try {
    document.addEventListener("DOMContentLoaded", function () {
        DirectCurrencyContent.loaded();
    });
} catch (err) {
    console.error('Error adding DOMContentLoaded listener', err);
}

export default DirectCurrencyContent;