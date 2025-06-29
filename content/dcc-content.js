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
        if (!aNode || !aNode.parentNode) {
            return;
        }
        const isSibling = aNode.previousSibling;
        const dataNode = isSibling ? aNode.previousSibling : aNode.parentNode;
        // Can be [object SVGAnimatedString]
        // Extra check of "string" for Chrome
        if (aCheckIfDataNode && dataNode
            && dataNode.className
            && typeof dataNode.className === "string"
            && dataNode.className.includes("dccConverted")) {
            return;
        }
        let prices = [];
        if (this.alwaysConvertFromCurrency) {
            prices = DccFunctions.findNumbers(this.convertFromCurrency, this.currencyCode, aNode.nodeValue);
        } else {
            prices = DccFunctions.findPrices(this.enabledCurrenciesWithRegexes, this.currencyCode, aNode.nodeValue);
        }
        if (prices.length === 0) {
            return;
        }
        const replacedUnit = prices[0].originalCurrency;
        const conversionQuote = this.conversionQuotes[replacedUnit] * (1 + this.quoteAdjustmentPercent / 100);
        let convertedContent = aNode.nodeValue;
        for (let price of prices) {
            convertedContent = DccFunctions.convertContent(price, conversionQuote, replacedUnit,
                this.currencyCode, this.roundAmounts, this.showOriginalPrices, this.showOriginalCurrencies, convertedContent);
        }
        if (dataNode.dataset) {
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
        } else {
            console.error("dataNode.dataset is undefined or null");
        }

        let dccTitle = "";

        for (let price of prices) {
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
        }

        if (this.isEnabled && this.showTooltip) {
            const showOriginal = false;
            this.substituteOne(aNode, showOriginal, dccTitle);
        }

        // TODO Does not work anymore in Firefox
        if (aNode.baseURI && aNode.baseURI.includes("pdf.js")) {
            if (aNode.parentNode) {
                aNode.parentNode.style.color = "black";
                aNode.parentNode.style.backgroundColor = "lightyellow";
                if (aNode.parentNode.parentNode) {
                    aNode.parentNode.parentNode.style.opacity = "1";
                }
            }
        }
    },

    substituteOne(aNode, isShowOriginal, aDccTitle) {
        "use strict";
        if (!aNode || !aNode.parentNode || aNode.nodeType !== Node.TEXT_NODE) {
            return;
        }
        const isSibling = aNode.previousSibling;
        const dataNode = isSibling ? aNode.previousSibling : aNode.parentNode;
        if (isSibling) {
            if (dataNode.dataset && dataNode.dataset.dccOriginalContentSibling) {
                if (aDccTitle) {
                    aNode.parentNode.dataset.dcctitle = aNode.parentNode.dataset.dcctitle ? aNode.parentNode.dataset.dcctitle : "";
                    aNode.parentNode.dataset.dcctitle += aDccTitle + "\n";
                }
                if (dataNode.dataset.dccConvertedContentSibling) {
                    aNode.nodeValue = isShowOriginal ? dataNode.dataset.dccOriginalContentSibling : dataNode.dataset.dccConvertedContentSibling;
                }
            }
        } else {
            if (dataNode.dataset && dataNode.dataset.dccOriginalContent) {
                if (aDccTitle) {
                    aNode.parentNode.dataset.dcctitle = aNode.parentNode.dataset.dcctitle ? aNode.parentNode.dataset.dcctitle : "";
                    aNode.parentNode.dataset.dcctitle += aDccTitle + "\n";
                }
                if (dataNode.dataset.dccConvertedContent) {
                    aNode.nodeValue = isShowOriginal ? dataNode.dataset.dccOriginalContent : dataNode.dataset.dccConvertedContent;
                }
            }
        }
    },

    substituteAll(aNode, isShowOriginal) {
        "use strict";
        if (!aNode) {
            return;
        }
        const nodeList = aNode.querySelectorAll(".dccConverted");

        for (let i = 0; i < nodeList.length; ++i) {
            const node = nodeList[i];
            const textNode = node.firstChild ? node.firstChild : node.nextSibling;
            if (node.dataset && node.dataset.dccOriginalContent && node.dataset.dccConvertedContent) {
                textNode.nodeValue = isShowOriginal ? node.dataset.dccOriginalContent : node.dataset.dccConvertedContent;
            }
        }

        const nodeSiblingList = aNode.querySelectorAll(".dccConvertedSibling");
        for (let i = 0; i < nodeSiblingList.length; ++i) {
            const node = nodeSiblingList[i];
            const textNode = node.nextSibling;
            if (node.dataset && node.dataset.dccOriginalContentSibling && node.dataset.dccConvertedContentSibling) {
                textNode.nodeValue = isShowOriginal ? node.dataset.dccOriginalContentSibling : node.dataset.dccConvertedContentSibling;
            }
        }
    },

    onSendEnabledStatus(aStatus) {
        "use strict";
        this.isEnabled = aStatus.isEnabled;
        if (aStatus.isEnabled && !aStatus.hasConvertedElements) {
            this.startObserve();
            this.traverseDomTree(document);
        }
        const showOriginal = !aStatus.isEnabled;
        this.substituteAll(document, showOriginal);
    },

    readParameters(aSettings) {
        "use strict";
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
    },

    readEnabledCurrencies(aSettings) {
        "use strict";
        this.enabledCurrenciesWithRegexes.length = 0;
        let iso4217Currency = true;
        for (let currency of aSettings.convertFroms) {
            if (currency.enabled) {
                try {
                    const regex1 = RegExp("\\b" + this.regexes1[currency.isoName].regex + "\\s+([0-9]+[0-9\\s,.':]*\\d)\\s*" + this.regexes1[currency.isoName].mult + "?", "g");
                    const regex2 = RegExp("([0-9]+[0-9\\s,.':]*\\d)\\s*" + this.regexes2[currency.isoName].mult + "?\\s+" + this.regexes2[currency.isoName].regex + "\\b", "g");
                    this.enabledCurrenciesWithRegexes.push(new DccFunctions.CurrencyRegex(iso4217Currency, currency.isoName, regex1, regex2));
                } catch (e) {
                    console.error(currency.isoName + " " + e.message);
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
    },

    onUpdateSettings(aSettings) {
        "use strict";
        const showOriginal = true;
        this.substituteAll(document, showOriginal);
        this.resetDomTree(document);
        this.readParameters(aSettings);
        DccFunctions.saveDefaultCurrencyNumberFormat(navigator.language, this.roundAmounts, this.currencyCode, this.showAsSymbol);
        DccFunctions.saveNumberFormat(navigator.language, this.roundAmounts);

        const startConversion = () => {
            this.readEnabledCurrencies(aSettings);
            let process = true;
            let hasConvertedElements = false;
            if (aSettings.isEnabled && process) {
                this.startObserve();
                if (document) {
                    this.traverseDomTree(document);
                    const showOriginal = false;
                    this.substituteAll(document, showOriginal);
                    hasConvertedElements = true;
                }
            }
            this.isEnabled = aSettings.isEnabled;
        };

        startConversion();
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
    },

    mutationsHandler(aMutations) {
        "use strict";
        aMutations.forEach(this.mutationHandler.bind(this));
    },

    mutationObserver: new MutationObserver(function (mutations) {
        DirectCurrencyContent.mutationsHandler(mutations);
    }),

    startObserve() {
        "use strict";
        if (document) {
            this.mutationObserver.observe(document, this.mutationObserverInit);
        }
    },

    resetDomTree(aNode) {
        "use strict";
        if (!aNode) {
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
            node.className = node.className.replace("dccConverted", "");
        }
    },

    filter: {
        acceptNode: function (node) {
            if (!DirectCurrencyContent.ignoredElements || !DirectCurrencyContent.ignoredElements.includes(node.parentNode.tagName.toLowerCase()) && /\d/.test(node.textContent)) {
                return NodeFilter.FILTER_ACCEPT;
            } else {
                return NodeFilter.FILTER_REJECT;
            }
        }
    },

    traverseDomTree(aNode) {
        "use strict";
        if (!aNode) {
            return;
        }
        const treeWalker = document.createTreeWalker(
            aNode,
            NodeFilter.SHOW_TEXT,
            this.filter);
        while (treeWalker.nextNode()) {
            this.replaceCurrency(treeWalker.currentNode, true);
        }
    },

    loaded() {
        "use strict";
        // Initialization logic for DOMContentLoaded
    }
};

// Set up DOMContentLoaded listener
document.addEventListener("DOMContentLoaded", function () {
    DirectCurrencyContent.loaded();
});

export default DirectCurrencyContent;