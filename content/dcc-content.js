/*
 * © Per Johansson
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Module pattern is used.
 */

"use strict";


if (!this.DirectCurrencyContent) {

    const DirectCurrencyContent = (function(aDccFunctions) {

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
        let ignoredElements = ["audio", "colgroup", "embed", "head", "html", "img", "object",  "ol", "script", "select", "style", "table", "tbody", "textarea", "thead", "tr", "ul", "video"];

        /**
         *
         * @param aNode
         * @param aCheckIfDataNode Check if dataNode has been created.
         * Seems it always has to be true, otherwise the conversion will be repeated because of
         * MutationHandler if the original currency is shown.
         */
        const replaceCurrency = (aNode, aCheckIfDataNode) => {
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
            if (alwaysConvertFromCurrency) {
                prices = aDccFunctions.findNumbers(convertFromCurrency, currencyCode, aNode.nodeValue);
            }
            else {
                prices = aDccFunctions.findPrices(enabledCurrenciesWithRegexes, currencyCode, aNode.nodeValue);
            }
            if (prices.length === 0) {
                return;
            }
            const replacedUnit = prices[0].originalCurrency;
            const conversionQuote = conversionQuotes[replacedUnit] * (1 + quoteAdjustmentPercent / 100);
            let tempAmount;
            let tempConvertedAmount;
            let convertedContent = aNode.nodeValue;
            for (let price of prices) {
                convertedContent = aDccFunctions.convertContent(price, conversionQuote, replacedUnit,
                    currencyCode, roundAmounts, showOriginalPrices, showOriginalCurrencies, convertedContent);
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
                }
                else {
                    dataNode.dataset.dccConvertedContent = convertedContent;
                    if (!dataNode.dataset.dccOriginalContent) {
                        dataNode.dataset.dccOriginalContent = aNode.nodeValue;
                    }
                    if (!dataNode.className.includes("dccConverted")) {
                        dataNode.className += " dccConverted";
                    }
                }
            }
            else {
                console.error("dataNode.dataset is undefined or null");
            }

            let dccTitle = "";

            for (let price of prices) {
                const decimals = aDccFunctions.checkMinorUnit(price, replacedUnit);
                tempAmount = aDccFunctions.parseAmount(price.amount) * Math.pow(10, -decimals);
                tempConvertedAmount = conversionQuote * aDccFunctions.parseAmount(price.amount) * Math.pow(10, -decimals);

                if (isEnabled && showTooltip) {
                    dccTitle += "Converted value: ";
                    dccTitle += price.iso4217Currency ?
                        aDccFunctions.formatDefaultIso4217Price(tempConvertedAmount) :
                        aDccFunctions.formatOther(tempConvertedAmount, price.currency);
                    dccTitle += "\n";
                    dccTitle += "Original value: ";
                    dccTitle += price.iso4217Currency ?
                        aDccFunctions.formatIso4217Price(navigator.language, tempAmount, price.originalCurrency) :
                        aDccFunctions.formatOther(tempAmount, price.originalCurrency);
                    dccTitle += "\n";
                    dccTitle += "Conversion quote " + price.originalCurrency + "/" + price.currency + " = " +
                        aDccFunctions.formatOther(conversionQuote, "") + "\n";
                    dccTitle += "Conversion quote " + price.currency + "/" + price.originalCurrency + " = " +
                        aDccFunctions.formatOther(1/conversionQuote, "") + "\n";
                }
            }

            if (isEnabled && showTooltip) {
                const showOriginal = false;
                substituteOne(aNode, showOriginal, dccTitle);
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
            if (aMutationRecord.type === "childList") {
                for (let i = 0; i < aMutationRecord.addedNodes.length; ++i) {
                    const node = aMutationRecord.addedNodes[i];
                    traverseDomTree(node);
                }
            }
            else if (aMutationRecord.type === "characterData") {
                mutationObserver.disconnect();
                replaceCurrency(aMutationRecord.target, true);
                //mutationObserver.observe(document.body, mutationObserverInit);
            }
        };

        const mutationsHandler = (aMutations) => {
            aMutations.forEach(mutationHandler);
        };

        const mutationObserver = new MutationObserver(mutationsHandler);

        const startObserve = () => {
            // console.log("startObserve");
            if (document) {
                mutationObserver.observe(document, mutationObserverInit);
            }
        };

        const resetDomTree = (aNode) => {
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
        };

        const filter = {
            acceptNode: function (node) {
                if (!ignoredElements.includes(node.parentNode.tagName.toLowerCase())
                    // Include only trees with numbers
                    && /\d/.test(node.textContent)) {
                    return NodeFilter.FILTER_ACCEPT;
                } else {
                    return NodeFilter.FILTER_REJECT;
                }
            }
        };

        const traverseDomTree = (aNode) => {
            //console.log("DCC traverseDomTree " + document.URL);
            if (!aNode) {
                return
            }
            const treeWalker = document.createTreeWalker(
                aNode,
                NodeFilter.SHOW_TEXT,
                filter);
            while (treeWalker.nextNode()) {
                //console.log("replaceCurrency " + textNode.nodeValue);
                replaceCurrency(treeWalker.currentNode, true);
            }

        };

        const substituteOne = (aNode, isShowOriginal, aDccTitle) => {
            if (!aNode) {
                return;
            }
            if (!aNode.parentNode) {
                return;
            }
            if (aNode.nodeType !== Node.TEXT_NODE) {
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
            }
            else {
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
        };

        const substituteAll = (aNode, isShowOriginal) => {
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

        };

        const onSendEnabledStatus = (aStatus) => {
            isEnabled = aStatus.isEnabled;
            if (aStatus.isEnabled && !aStatus.hasConvertedElements) {
                startObserve();
                //console.log("DCC onSendEnabledStatus " + document.URL);
                traverseDomTree(document);
            }
            const showOriginal = !aStatus.isEnabled;
            substituteAll(document, showOriginal);
        };

        /**
         *
         * @param aSettings
         */
        const readParameters = (aSettings) => {
            conversionQuotes = aSettings.conversionQuotes;
            currencyCode = aSettings.convertToCurrency;
            roundAmounts = aSettings.roundAmounts;
            showOriginalPrices = aSettings.showOriginalPrices;
            showOriginalCurrencies = aSettings.showOriginalCurrencies;
            showTooltip = aSettings.showTooltip;
            quoteAdjustmentPercent = +aSettings.quoteAdjustmentPercent;
            convertFromCurrency = aSettings.convertFromCurrency;
            alwaysConvertFromCurrency = aSettings.alwaysConvertFromCurrency;
            showAsSymbol = aSettings.showAsSymbol;
            ignoredElements = aSettings.ignoredElements;
            regexes1 = aSettings.regexes1;
            regexes2 = aSettings.regexes2;
        };

        const begin = "(?:^|\\s|\\()";
        const value = "((?:\\d{1,3}(?:[,.\\s']\\d{3})+|(?:\\d+))(?:[.,:]\\d{1,9})?)";
        const space = "(?:\\s?)";
        const end = "(?![\\u0041-\\u005A\\u0061-\\u007A\\u00AA\\u00B5\\u00BA\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02C1\\u02C6-\\u02D1\\u02E0-\\u02E4\\u02EC\\u02EE\\u0370-\\u0374\\u0376\\u0377\\u037A-\\u037D\\u0386\\u0388-\\u038A\\u038C\\u038E-\\u03A1\\u03A3-\\u03F5\\u03F7-\\u0481\\u048A-\\u0527\\u0531-\\u0556\\u0559\\u0561-\\u0587\\u05D0-\\u05EA\\u05F0-\\u05F2\\u0620-\\u064A\\u066E\\u066F\\u0671-\\u06D3\\u06D5\\u06E5\\u06E6\\u06EE\\u06EF\\u06FA-\\u06FC\\u06FF\\u0710\\u0712-\\u072F\\u074D-\\u07A5\\u07B1\\u07CA-\\u07EA\\u07F4\\u07F5\\u07FA\\u0800-\\u0815\\u081A\\u0824\\u0828\\u0840-\\u0858\\u08A0\\u08A2-\\u08AC\\u0904-\\u0939\\u093D\\u0950\\u0958-\\u0961\\u0971-\\u0977\\u0979-\\u097F\\u0985-\\u098C\\u098F\\u0990\\u0993-\\u09A8\\u09AA-\\u09B0\\u09B2\\u09B6-\\u09B9\\u09BD\\u09CE\\u09DC\\u09DD\\u09DF-\\u09E1\\u09F0\\u09F1\\u0A05-\\u0A0A\\u0A0F\\u0A10\\u0A13-\\u0A28\\u0A2A-\\u0A30\\u0A32\\u0A33\\u0A35\\u0A36\\u0A38\\u0A39\\u0A59-\\u0A5C\\u0A5E\\u0A72-\\u0A74\\u0A85-\\u0A8D\\u0A8F-\\u0A91\\u0A93-\\u0AA8\\u0AAA-\\u0AB0\\u0AB2\\u0AB3\\u0AB5-\\u0AB9\\u0ABD\\u0AD0\\u0AE0\\u0AE1\\u0B05-\\u0B0C\\u0B0F\\u0B10\\u0B13-\\u0B28\\u0B2A-\\u0B30\\u0B32\\u0B33\\u0B35-\\u0B39\\u0B3D\\u0B5C\\u0B5D\\u0B5F-\\u0B61\\u0B71\\u0B83\\u0B85-\\u0B8A\\u0B8E-\\u0B90\\u0B92-\\u0B95\\u0B99\\u0B9A\\u0B9C\\u0B9E\\u0B9F\\u0BA3\\u0BA4\\u0BA8-\\u0BAA\\u0BAE-\\u0BB9\\u0BD0\\u0C05-\\u0C0C\\u0C0E-\\u0C10\\u0C12-\\u0C28\\u0C2A-\\u0C33\\u0C35-\\u0C39\\u0C3D\\u0C58\\u0C59\\u0C60\\u0C61\\u0C85-\\u0C8C\\u0C8E-\\u0C90\\u0C92-\\u0CA8\\u0CAA-\\u0CB3\\u0CB5-\\u0CB9\\u0CBD\\u0CDE\\u0CE0\\u0CE1\\u0CF1\\u0CF2\\u0D05-\\u0D0C\\u0D0E-\\u0D10\\u0D12-\\u0D3A\\u0D3D\\u0D4E\\u0D60\\u0D61\\u0D7A-\\u0D7F\\u0D85-\\u0D96\\u0D9A-\\u0DB1\\u0DB3-\\u0DBB\\u0DBD\\u0DC0-\\u0DC6\\u0E01-\\u0E30\\u0E32\\u0E33\\u0E40-\\u0E46\\u0E81\\u0E82\\u0E84\\u0E87\\u0E88\\u0E8A\\u0E8D\\u0E94-\\u0E97\\u0E99-\\u0E9F\\u0EA1-\\u0EA3\\u0EA5\\u0EA7\\u0EAA\\u0EAB\\u0EAD-\\u0EB0\\u0EB2\\u0EB3\\u0EBD\\u0EC0-\\u0EC4\\u0EC6\\u0EDC-\\u0EDF\\u0F00\\u0F40-\\u0F47\\u0F49-\\u0F6C\\u0F88-\\u0F8C\\u1000-\\u102A\\u103F\\u1050-\\u1055\\u105A-\\u105D\\u1061\\u1065\\u1066\\u106E-\\u1070\\u1075-\\u1081\\u108E\\u10A0-\\u10C5\\u10C7\\u10CD\\u10D0-\\u10FA\\u10FC-\\u1248\\u124A-\\u124D\\u1250-\\u1256\\u1258\\u125A-\\u125D\\u1260-\\u1288\\u128A-\\u128D\\u1290-\\u12B0\\u12B2-\\u12B5\\u12B8-\\u12BE\\u12C0\\u12C2-\\u12C5\\u12C8-\\u12D6\\u12D8-\\u1310\\u1312-\\u1315\\u1318-\\u135A\\u1380-\\u138F\\u13A0-\\u13F4\\u1401-\\u166C\\u166F-\\u167F\\u1681-\\u169A\\u16A0-\\u16EA\\u1700-\\u170C\\u170E-\\u1711\\u1720-\\u1731\\u1740-\\u1751\\u1760-\\u176C\\u176E-\\u1770\\u1780-\\u17B3\\u17D7\\u17DC\\u1820-\\u1877\\u1880-\\u18A8\\u18AA\\u18B0-\\u18F5\\u1900-\\u191C\\u1950-\\u196D\\u1970-\\u1974\\u1980-\\u19AB\\u19C1-\\u19C7\\u1A00-\\u1A16\\u1A20-\\u1A54\\u1AA7\\u1B05-\\u1B33\\u1B45-\\u1B4B\\u1B83-\\u1BA0\\u1BAE\\u1BAF\\u1BBA-\\u1BE5\\u1C00-\\u1C23\\u1C4D-\\u1C4F\\u1C5A-\\u1C7D\\u1CE9-\\u1CEC\\u1CEE-\\u1CF1\\u1CF5\\u1CF6\\u1D00-\\u1DBF\\u1E00-\\u1F15\\u1F18-\\u1F1D\\u1F20-\\u1F45\\u1F48-\\u1F4D\\u1F50-\\u1F57\\u1F59\\u1F5B\\u1F5D\\u1F5F-\\u1F7D\\u1F80-\\u1FB4\\u1FB6-\\u1FBC\\u1FBE\\u1FC2-\\u1FC4\\u1FC6-\\u1FCC\\u1FD0-\\u1FD3\\u1FD6-\\u1FDB\\u1FE0-\\u1FEC\\u1FF2-\\u1FF4\\u1FF6-\\u1FFC\\u2071\\u207F\\u2090-\\u209C\\u2102\\u2107\\u210A-\\u2113\\u2115\\u2119-\\u211D\\u2124\\u2126\\u2128\\u212A-\\u212D\\u212F-\\u2139\\u213C-\\u213F\\u2145-\\u2149\\u214E\\u2183\\u2184\\u2C00-\\u2C2E\\u2C30-\\u2C5E\\u2C60-\\u2CE4\\u2CEB-\\u2CEE\\u2CF2\\u2CF3\\u2D00-\\u2D25\\u2D27\\u2D2D\\u2D30-\\u2D67\\u2D6F\\u2D80-\\u2D96\\u2DA0-\\u2DA6\\u2DA8-\\u2DAE\\u2DB0-\\u2DB6\\u2DB8-\\u2DBE\\u2DC0-\\u2DC6\\u2DC8-\\u2DCE\\u2DD0-\\u2DD6\\u2DD8-\\u2DDE\\u2E2F\\u3005\\u3006\\u3031-\\u3035\\u303B\\u303C\\u3041-\\u3096\\u309D-\\u309F\\u30A1-\\u30FA\\u30FC-\\u30FF\\u3105-\\u312D\\u3131-\\u318E\\u31A0-\\u31BA\\u31F0-\\u31FF\\u3400-\\u4DB5\\u4E00-\\u9FCC\\uA000-\\uA48C\\uA4D0-\\uA4FD\\uA500-\\uA60C\\uA610-\\uA61F\\uA62A\\uA62B\\uA640-\\uA66E\\uA67F-\\uA697\\uA6A0-\\uA6E5\\uA717-\\uA71F\\uA722-\\uA788\\uA78B-\\uA78E\\uA790-\\uA793\\uA7A0-\\uA7AA\\uA7F8-\\uA801\\uA803-\\uA805\\uA807-\\uA80A\\uA80C-\\uA822\\uA840-\\uA873\\uA882-\\uA8B3\\uA8F2-\\uA8F7\\uA8FB\\uA90A-\\uA925\\uA930-\\uA946\\uA960-\\uA97C\\uA984-\\uA9B2\\uA9CF\\uAA00-\\uAA28\\uAA40-\\uAA42\\uAA44-\\uAA4B\\uAA60-\\uAA76\\uAA7A\\uAA80-\\uAAAF\\uAAB1\\uAAB5\\uAAB6\\uAAB9-\\uAABD\\uAAC0\\uAAC2\\uAADB-\\uAADD\\uAAE0-\\uAAEA\\uAAF2-\\uAAF4\\uAB01-\\uAB06\\uAB09-\\uAB0E\\uAB11-\\uAB16\\uAB20-\\uAB26\\uAB28-\\uAB2E\\uABC0-\\uABE2\\uAC00-\\uD7A3\\uD7B0-\\uD7C6\\uD7CB-\\uD7FB\\uF900-\\uFA6D\\uFA70-\\uFAD9\\uFB00-\\uFB06\\uFB13-\\uFB17\\uFB1D\\uFB1F-\\uFB28\\uFB2A-\\uFB36\\uFB38-\\uFB3C\\uFB3E\\uFB40\\uFB41\\uFB43\\uFB44\\uFB46-\\uFBB1\\uFBD3-\\uFD3D\\uFD50-\\uFD8F\\uFD92-\\uFDC7\\uFDF0-\\uFDFB\\uFE70-\\uFE74\\uFE76-\\uFEFC\\uFF21-\\uFF3A\\uFF41-\\uFF5A\\uFF66-\\uFFBE\\uFFC2-\\uFFC7\\uFFCA-\\uFFCF\\uFFD2-\\uFFD7\\uFFDA-\\uFFDC])";

        const readEnabledCurrencies = (aSettings) => {
            enabledCurrenciesWithRegexes.length = 0;
            let iso4217Currency = true;
            for (let currency of aSettings.convertFroms) {
                if (currency.enabled) {
                    try {
                        // GBP 1 Million
                        const regex1 = RegExp(begin + regexes1[currency.isoName].regex + space + value + space + regexes1[currency.isoName].mult + "?", "g");
                        // 1 Million GBP
                        const regex2 = RegExp(value + space + regexes2[currency.isoName].mult + "?" + space + regexes2[currency.isoName].regex + end, "g");
                        enabledCurrenciesWithRegexes.push(new CurrencyRegex(
                            iso4217Currency,
                            currency.isoName,
                            regex1,
                            regex2));
                    }
                    catch(e) {
                        console.error(currency.isoName + " " + e.message);
                    }
                }
            }
            iso4217Currency = false;
            if (aSettings.tempConvertUnits) {
                const regexObj_inch = new CurrencyRegex(iso4217Currency, "inch", regexes1["inch"], regexes2["inch"]);
                enabledCurrenciesWithRegexes.push(regexObj_inch);
                const regexObj_kcal = new CurrencyRegex(iso4217Currency, "kcal", regexes1["kcal"], regexes2["kcal"]);
                enabledCurrenciesWithRegexes.push(regexObj_kcal);
                const regexObj_nmi = new CurrencyRegex(iso4217Currency, "nmi", regexes1["nmi"], regexes2["nmi"]);
                enabledCurrenciesWithRegexes.push(regexObj_nmi);
                const regexObj_mile = new CurrencyRegex(iso4217Currency, "mile", regexes1["mile"], regexes2["mile"]);
                enabledCurrenciesWithRegexes.push(regexObj_mile);
                const regexObj_mil = new CurrencyRegex(iso4217Currency, "mil", regexes1["mil"], regexes2["mil"]);
                enabledCurrenciesWithRegexes.push(regexObj_mil);
                const regexObj_knots = new CurrencyRegex(iso4217Currency, "knots", regexes1["knots"], regexes2["knots"]);
                enabledCurrenciesWithRegexes.push(regexObj_knots);
                const regexObj_hp = new CurrencyRegex(iso4217Currency, "hp", regexes1["hp"], regexes2["hp"]);
                enabledCurrenciesWithRegexes.push(regexObj_hp);
            }
        };

        /**
         *
         * @param aSettings
         */
        const onUpdateSettings = (aSettings) => {
            // console.log("DCC onUpdateSettings " + document.URL);
            const showOriginal = true;
            substituteAll(document, showOriginal);
            resetDomTree(document);
            readParameters(aSettings);
            aDccFunctions.saveDefaultCurrencyNumberFormat(navigator.language, roundAmounts, currencyCode, showAsSymbol);
            aDccFunctions.saveNumberFormat(navigator.language, roundAmounts);

            const startConversion = () => {
                readEnabledCurrencies(aSettings);
                let process = true;
                let hasConvertedElements = false;
                if (aSettings.isEnabled && process) {
                    startObserve();
                    if (document) {
                        //console.log("DCC startConversion " + document.URL);
                        traverseDomTree(document);
                        const showOriginal = false;
                        substituteAll(document, showOriginal);
                        hasConvertedElements = true;
                    }
                }
                if (typeof ContentAdapter !== 'undefined') {
                    ContentAdapter.finish(hasConvertedElements);
                }
                isEnabled = aSettings.isEnabled;

            };

            startConversion();

        };

        document.addEventListener("DOMContentLoaded", function(event) {
            if (typeof ContentAdapter !== 'undefined') {
                ContentAdapter.loaded();
            }
        });

        return {
            onSendEnabledStatus : onSendEnabledStatus,
            onUpdateSettings : onUpdateSettings
        };
    })(this.DccFunctions);

    this.DirectCurrencyContent = DirectCurrencyContent;

}
