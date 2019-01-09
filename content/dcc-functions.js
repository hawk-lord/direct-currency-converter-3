/*
 * © Per Johansson
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Module pattern is used.
 */

"use strict";

if (!this.DccFunctions) {

    /**
     * Functionality not dependent on the browser.
     *
     * @type {{formatIso4217Price, checkMinorUnit, convertAmount, findPrices, useUnit, findNumbers, isExcludedDomain, saveNumberFormat, getMultiplicator, saveDefaultCurrencyNumberFormat, formatDefaultIso4217Price, formatOther, convertContent, parseAmount, findPricesInCurrency, replaceContent}}
     */
    const DccFunctions = (function(){

        const MinorUnit = function(code, decimals, names) {
            this.code = code;
            this.decimals = decimals;
            this.names = names;
        };

        const minorUnits = [];
        minorUnits.push(new MinorUnit("AED", 2, ["fils", "fulus"]));
        minorUnits.push(new MinorUnit("AFN", 2, ["pul"]));
        minorUnits.push(new MinorUnit("ALL", 2, ["qindarkë", "qindarka"]));
        minorUnits.push(new MinorUnit("AMD", 2, ["luma"]));
        minorUnits.push(new MinorUnit("ANG", 2, ["cent"]));
        minorUnits.push(new MinorUnit("AOA", 2, ["cêntimo", "centimo"]));
        minorUnits.push(new MinorUnit("ARS", 2, ["centavo"]));
        minorUnits.push(new MinorUnit("AUD", 2, ["cent"]));
        minorUnits.push(new MinorUnit("AWG", 2, ["cent"]));
        minorUnits.push(new MinorUnit("AZN", 2, ["qapik"]));
        minorUnits.push(new MinorUnit("BAM", 2, ["pf"]));
        minorUnits.push(new MinorUnit("BBD", 2, ["cent"]));
        minorUnits.push(new MinorUnit("BDT", 2, ["poisha"]));
        minorUnits.push(new MinorUnit("BGN", 2, ["stotinka", "stotinki"]));
        minorUnits.push(new MinorUnit("BHD", 3, ["fils"]));
        minorUnits.push(new MinorUnit("BIF", 0, []));
        minorUnits.push(new MinorUnit("BMD", 2, ["cent"]));
        minorUnits.push(new MinorUnit("BND", 2, ["cent"]));
        minorUnits.push(new MinorUnit("BOB", 2, ["centavo"]));
        minorUnits.push(new MinorUnit("BOV", 2, ["centavo"]));
        minorUnits.push(new MinorUnit("BRL", 2, ["centavo"]));
        minorUnits.push(new MinorUnit("BSD", 2, ["cent"]));
        minorUnits.push(new MinorUnit("BTN", 2, ["chhertum"]));
        minorUnits.push(new MinorUnit("BWP", 2, ["thebe"]));
        minorUnits.push(new MinorUnit("BYN", 2, ["kopek", "капейка", "капейкі"]));
        minorUnits.push(new MinorUnit("BZD", 2, ["cent"]));
        minorUnits.push(new MinorUnit("CAD", 2, ["cent"]));
        minorUnits.push(new MinorUnit("CDF", 2, ["centime"]));
        minorUnits.push(new MinorUnit("CHE", 2, ["rappen", "centime", "centesimo", "centesimi", "rap"]));
        minorUnits.push(new MinorUnit("CHF", 2, ["rappen", "centime", "centesimo", "centesimi", "rap"]));
        minorUnits.push(new MinorUnit("CHW", 2, ["rappen", "centime", "centesimo", "centesimi", "rap"]));
        minorUnits.push(new MinorUnit("CLF", 4, []));
        minorUnits.push(new MinorUnit("CLP", 0, []));
        minorUnits.push(new MinorUnit("CNY", 2, ["fen", "fēn"]));
        minorUnits.push(new MinorUnit("COP", 2, ["centavo"]));
        minorUnits.push(new MinorUnit("COU", 2, ["centavo"]));
        minorUnits.push(new MinorUnit("CRC", 2, ["centimo", "céntimo"]));
        minorUnits.push(new MinorUnit("CUC", 2, ["centavo"]));
        minorUnits.push(new MinorUnit("CUP", 2, ["centavo"]));
        minorUnits.push(new MinorUnit("CVE", 0, []));
        minorUnits.push(new MinorUnit("CZK", 2, ["haléř", "haléře", "haléřů"]));
        minorUnits.push(new MinorUnit("DJF", 0, []));
        minorUnits.push(new MinorUnit("DKK", 2, ["øre"]));
        minorUnits.push(new MinorUnit("DOP", 2, ["centavo"]));
        minorUnits.push(new MinorUnit("DZD", 2, ["centime"]));
        minorUnits.push(new MinorUnit("EGP", 2, ["piastre"]));
        minorUnits.push(new MinorUnit("ERN", 2, ["cent"]));
        minorUnits.push(new MinorUnit("ETB", 2, ["santim"]));
        minorUnits.push(new MinorUnit("EUR", 2, ["cent"]));
        minorUnits.push(new MinorUnit("FJD", 2, ["cent"]));
        minorUnits.push(new MinorUnit("FKP", 2, ["penny", "pence"]));
        minorUnits.push(new MinorUnit("GBP", 2, ["penny", "pence"]));
        minorUnits.push(new MinorUnit("GEL", 2, ["tetri"]));
        minorUnits.push(new MinorUnit("GHS", 2, ["pesewa"]));
        minorUnits.push(new MinorUnit("GIP", 2, ["penny", "pence"]));
        minorUnits.push(new MinorUnit("GMD", 2, ["butut"]));
        minorUnits.push(new MinorUnit("GNF", 0, []));
        minorUnits.push(new MinorUnit("GTQ", 2, ["centavo"]));
        minorUnits.push(new MinorUnit("GYD", 2, ["cent"]));
        minorUnits.push(new MinorUnit("HKD", 2, ["cent"]));
        minorUnits.push(new MinorUnit("HNL", 2, ["centavo"]));
        minorUnits.push(new MinorUnit("HRK", 2, ["lipa"]));
        minorUnits.push(new MinorUnit("HTG", 2, ["centime"]));
        minorUnits.push(new MinorUnit("HUF", 2, ["fillér"]));
        minorUnits.push(new MinorUnit("IDR", 2, ["sen"]));
        minorUnits.push(new MinorUnit("ILS", 2, ["agora"]));
        minorUnits.push(new MinorUnit("INR", 2, ["paisa"]));
        minorUnits.push(new MinorUnit("IQD", 3, ["fils"]));
        minorUnits.push(new MinorUnit("IRR", 2, []));
        minorUnits.push(new MinorUnit("ISK", 0, []));
        minorUnits.push(new MinorUnit("JMD", 2, ["cent"]));
        minorUnits.push(new MinorUnit("JOD", 3, ["fils"]));
        minorUnits.push(new MinorUnit("JPY", 0, []));
        minorUnits.push(new MinorUnit("KES", 2, ["cent"]));
        minorUnits.push(new MinorUnit("KGS", 2, ["tyiyn"]));
        minorUnits.push(new MinorUnit("KHR", 2, ["sen"]));
        minorUnits.push(new MinorUnit("KMF", 0, []));
        minorUnits.push(new MinorUnit("KPW", 2, ["chon"]));
        minorUnits.push(new MinorUnit("KRW", 0, []));
        minorUnits.push(new MinorUnit("KWD", 3, ["fils"]));
        minorUnits.push(new MinorUnit("KYD", 2, ["cent"]));
        minorUnits.push(new MinorUnit("KZT", 2, ["tïın"]));
        minorUnits.push(new MinorUnit("LAK", 2, ["att", "ອັດ"]));
        minorUnits.push(new MinorUnit("LBP", 2, ["piastre"]));
        minorUnits.push(new MinorUnit("LKR", 2, ["cent"]));
        minorUnits.push(new MinorUnit("LRD", 2, ["cent"]));
        minorUnits.push(new MinorUnit("LSL", 2, ["sente", "lisente"]));
        minorUnits.push(new MinorUnit("LYD", 3, ["dirham"]));
        minorUnits.push(new MinorUnit("MAD", 2, ["santim"]));
        minorUnits.push(new MinorUnit("MDL", 2, ["ban"]));
        minorUnits.push(new MinorUnit("MGA", 2, []));
        minorUnits.push(new MinorUnit("MKD", 2, ["deni", "дени"]));
        minorUnits.push(new MinorUnit("MMK", 2, ["pya"]));
        minorUnits.push(new MinorUnit("MNT", 2, ["möngö", "мөнгө"]));
        minorUnits.push(new MinorUnit("MOP", 2, ["sin", "仙"]));
        minorUnits.push(new MinorUnit("MRU", 2, []));
        minorUnits.push(new MinorUnit("MUR", 2, ["cent"]));
        minorUnits.push(new MinorUnit("MVR", 2, ["laari"]));
        minorUnits.push(new MinorUnit("MWK", 2, ["tambala"]));
        minorUnits.push(new MinorUnit("MXN", 2, ["centavo"]));
        minorUnits.push(new MinorUnit("MXV", 2, []));
        minorUnits.push(new MinorUnit("MYR", 2, ["sen"]));
        minorUnits.push(new MinorUnit("MZN", 2, ["centavo"]));
        minorUnits.push(new MinorUnit("NAD", 2, ["cent"]));
        minorUnits.push(new MinorUnit("NGN", 2, ["kobo"]));
        minorUnits.push(new MinorUnit("NIO", 2, ["centavo"]));
        minorUnits.push(new MinorUnit("NOK", 2, ["øre"]));
        minorUnits.push(new MinorUnit("NPR", 2, ["paisa"]));
        minorUnits.push(new MinorUnit("NZD", 2, ["cent"]));
        minorUnits.push(new MinorUnit("OMR", 3, ["baisa"]));
        minorUnits.push(new MinorUnit("PAB", 2, ["centésimo", "centesimo"]));
        minorUnits.push(new MinorUnit("PEN", 2, ["céntimo", "centimo"]));
        minorUnits.push(new MinorUnit("PGK", 2, ["toea"]));
        minorUnits.push(new MinorUnit("PHP", 2, ["sentimo", "centavo"]));
        minorUnits.push(new MinorUnit("PKR", 2, ["paisa"]));
        minorUnits.push(new MinorUnit("PLN", 2, ["grosz"]));
        minorUnits.push(new MinorUnit("PYG", 0, []));
        minorUnits.push(new MinorUnit("QAR", 2, ["dirham"]));
        minorUnits.push(new MinorUnit("RON", 2, ["ban", "bani"]));
        minorUnits.push(new MinorUnit("RSD", 2, ["para"]));
        minorUnits.push(new MinorUnit("RUB", 2, ["kopek", "коп"]));
        minorUnits.push(new MinorUnit("RWF", 0, []));
        minorUnits.push(new MinorUnit("SAR", 2, ["halalah", "هللة"]));
        minorUnits.push(new MinorUnit("SBD", 2, ["cent"]));
        minorUnits.push(new MinorUnit("SCR", 2, ["cent"]));
        minorUnits.push(new MinorUnit("SDG", 2, ["qirsh", "piastre"]));
        minorUnits.push(new MinorUnit("SEK", 2, ["öre"]));
        minorUnits.push(new MinorUnit("SGD", 2, ["cent"]));
        minorUnits.push(new MinorUnit("SHP", 2, ["penny", "pence"]));
        minorUnits.push(new MinorUnit("SLL", 2, ["cent"]));
        minorUnits.push(new MinorUnit("SOS", 2, ["senti"]));
        minorUnits.push(new MinorUnit("SRD", 2, ["cent"]));
        minorUnits.push(new MinorUnit("SSP", 2, ["piaster"]));
        minorUnits.push(new MinorUnit("STN", 2, ["cêntimo", "centimo"]));
        minorUnits.push(new MinorUnit("SVC", 2, ["centavo"]));
        minorUnits.push(new MinorUnit("SYP", 2, ["piastre"]));
        minorUnits.push(new MinorUnit("SZL", 2, ["cent"]));
        minorUnits.push(new MinorUnit("THB", 2, ["satang"]));
        minorUnits.push(new MinorUnit("TJS", 2, ["diram"]));
        minorUnits.push(new MinorUnit("TMT", 2, ["tenge", "teňňe"]));
        minorUnits.push(new MinorUnit("TND", 3, ["milim", "millime"]));
        minorUnits.push(new MinorUnit("TOP", 2, ["seniti"]));
        minorUnits.push(new MinorUnit("TRY", 2, ["kuruş"]));
        minorUnits.push(new MinorUnit("TTD", 2, ["cent"]));
        minorUnits.push(new MinorUnit("TWD", 2, ["cent",  "分", "fēn"]));
        minorUnits.push(new MinorUnit("TZS", 2, ["senti", "cent"]));
        minorUnits.push(new MinorUnit("UAH", 2, ["kopiyka", "копійка"]));
        minorUnits.push(new MinorUnit("UGX", 0, []));
        minorUnits.push(new MinorUnit("USD", 2, ["cent", "¢", "￠"]));
        minorUnits.push(new MinorUnit("USN", 2, []));
        minorUnits.push(new MinorUnit("UYI", 0, []));
        minorUnits.push(new MinorUnit("UYU", 2, ["centésimo"]));
        minorUnits.push(new MinorUnit("UYW", 4, []));
        minorUnits.push(new MinorUnit("UZS", 2, ["tiyin"]));
        minorUnits.push(new MinorUnit("VES", 2, ["céntimo"]));
        minorUnits.push(new MinorUnit("VND", 0, []));
        minorUnits.push(new MinorUnit("VUV", 0, []));
        minorUnits.push(new MinorUnit("WST", 2, ["sene"]));
        minorUnits.push(new MinorUnit("XAF", 0, []));
        minorUnits.push(new MinorUnit("XAG", 0, []));
        minorUnits.push(new MinorUnit("XAU", 0, []));
        minorUnits.push(new MinorUnit("XBA", 0, []));
        minorUnits.push(new MinorUnit("XBB", 0, []));
        minorUnits.push(new MinorUnit("XBC", 0, []));
        minorUnits.push(new MinorUnit("XBD", 0, []));
        minorUnits.push(new MinorUnit("XCD", 2, ["cent"]));
        minorUnits.push(new MinorUnit("XDR", 0, []));
        minorUnits.push(new MinorUnit("XOF", 0, []));
        minorUnits.push(new MinorUnit("XPD", 0, []));
        minorUnits.push(new MinorUnit("XPF", 0, []));
        minorUnits.push(new MinorUnit("XPT", 0, []));
        minorUnits.push(new MinorUnit("XSU", 0, []));
        minorUnits.push(new MinorUnit("XTS", 0, []));
        minorUnits.push(new MinorUnit("XUA", 0, []));
        minorUnits.push(new MinorUnit("XXX", 0, []));
        minorUnits.push(new MinorUnit("YER", 2, ["fils"]));
        minorUnits.push(new MinorUnit("ZAR", 2, ["cent"]));
        minorUnits.push(new MinorUnit("ZMW", 2, ["ngwee"]));
        minorUnits.push(new MinorUnit("ZWL", 2, ["cent"]));

        const checkMinorUnit = (aPrice, aUnit, aMultiplicatorString) => {
            if (aMultiplicatorString && aMultiplicatorString !== "") {
                return 0;
            }
            for (let minorUnit of minorUnits) {
                if (minorUnit.code === aUnit) {
                    for (let name of minorUnit.names) {
                        if (aPrice.full.toLowerCase().includes(name)) {
                            return minorUnit.decimals;
                        }
                    }
                    return 0;
                }
            }
            return 0;
        };


        const sekMultiples = [
            ["miljoner", 6],
            ["miljon", 6],
            ["miljarder", 9],
            ["miljard", 9],
            ["mnkr", 9],
            ["mdkr", 9],
            ["mkr", 6],
            ["ksek", 3],
            ["msek", 6],
            ["gsek", 9]
        ];
        const dkkMultiples = [
            ["millión", 6],
            ["miljón", 6],
            ["milliard", 9],
            ["mia.", 9],
            ["mio.", 6],
            ["million", 6]
        ];
        const gbpMultiples = [
            ["billion", 9],
            ["million", 6]
        ];
        const iskMultiples = [
            ["milljón", 6],
            ["milljarð", 9]
        ];
        const nokMultiples = [
            ["milliard", 9],
            ["million", 6]
        ];
        const mgaMultiples = [
            ["milliard", 9],
            ["million", 6]
        ];
        const usdMultiples = [
            ["billion", 9],
            ["milliard", 9],
            ["million", 6]
        ];
        const vndMultiples = [
            ["ngàn", 3],
            ["triệu", 6],
            ["tỷ", 9]
        ];

        /**
         * Multiples of money: million, etc.
         *
         * @param aMultiples
         * @constructor
         */
        const Multiples = function(aMultiples) {
            this.multiplesMap = new Map(aMultiples);
            /**
             *
             * @param aMultiples
             * @returns {*}
             */
            this.findMultiple = (aMultiples) => {
                this.multipleIterator = this.multiplesMap.keys();
                let entry = this.multipleIterator.next();
                while (!entry.done) {
                    if (aMultiples.includes(entry.value)) {
                        return {text: entry.value, exponent: this.multiplesMap.get(entry.value)};
                    }
                    entry = this.multipleIterator.next();
                }
                return {text: "", exponent: 0};
            }
        };

        const multiples = {};
        multiples["SEK"] = new Multiples(sekMultiples);
        multiples["DKK"] = new Multiples(dkkMultiples);
        multiples["GBP"] = new Multiples(gbpMultiples);
        multiples["ISK"] = new Multiples(iskMultiples);
        multiples["NOK"] = new Multiples(nokMultiples);
        multiples["MGA"] = new Multiples(mgaMultiples);
        multiples["USD"] = new Multiples(usdMultiples);
        multiples["VND"] = new Multiples(vndMultiples);

        /**
         * If Multiple is defined for the current currency, find if there is a multiple in the price.
         * If so return the multiple, possibly corrected (mnkr becomes mn).
         *
         * @param aPrice
         * @returns {*} a string with the
         */
        const getMultiplicator = (aPrice) => {
            if (multiples[aPrice.originalCurrency] && aPrice.mult) {
                return multiples[aPrice.originalCurrency].findMultiple(aPrice.mult.toLowerCase());
            }
            return {exponent: 0, text: ""};
        };

        let defaultCurrencyNumberFormat = new Intl.NumberFormat();

        let numberFormat = new Intl.NumberFormat();

        let roundAmounts = false;

        let showAsSymbol = false;

        /**
         * Like saveDefaultCurrencyNumberFormat but returns a new formatter for the unit.
         * saveDefaultCurrencyNumberFormat should be done before.
         *
         * @param aUnit
         * @returns {Intl.NumberFormat}
         */
        const getCurrencyNumberFormat = (aUnit) => {
            const locales = navigator.language;
            let options = {
                style: "currency",
                currency: aUnit,
                currencyDisplay: showAsSymbol ? "symbol" : "code"
            };
            try {
                new Intl.NumberFormat(locales, options);
            }
            catch(e) {
                options = {};
                console.error(e);
            }

            if (roundAmounts) {
                options.minimumFractionDigits = 0;
                options.maximumFractionDigits = 0;
            }

            return new Intl.NumberFormat(locales, options);

        };

        /**
         * No idempotence here.
         *
         * @param aRoundAmounts
         * @param aUnit
         * @param aShowAsSymbol
         */
        const saveDefaultCurrencyNumberFormat = (aRoundAmounts, aUnit, aShowAsSymbol) => {
            roundAmounts = aRoundAmounts;
            showAsSymbol = aShowAsSymbol;
            const locales = navigator.language;
            let options = {
                style: "currency",
                currency: aUnit,
                currencyDisplay: aShowAsSymbol ? "symbol" : "code"
            };
            try {
                new Intl.NumberFormat(locales, options);
            }
            catch(e) {
                options = {};
                console.error(e);
            }

            if (aRoundAmounts) {
                options.minimumFractionDigits = 0;
                options.maximumFractionDigits = 0;
            }

            defaultCurrencyNumberFormat = new Intl.NumberFormat(locales, options);

        };

        const saveNumberFormat = (aRoundAmounts) => {
            const locales = navigator.language;
            let options = {};
            if (aRoundAmounts) {
                options.minimumFractionDigits = 0;
                options.maximumFractionDigits = 0;
            }
            numberFormat = new Intl.NumberFormat(locales, options);

        };

        /**
         *
         * @param anAmount
         * @param aUnit
         * @returns {string}
         */
        const formatIso4217Price = (anAmount, aUnit) => {
            const amountLocalised = isNaN(anAmount) ? "Unknown" : getCurrencyNumberFormat(aUnit).format(anAmount);
            return " " + amountLocalised + " ";
        };

        /**
         *
         * @param anAmount
         * @returns {string}
         */
        const formatDefaultIso4217Price = (anAmount) => {
            const amountLocalised = isNaN(anAmount) ? "Unknown" : defaultCurrencyNumberFormat.format(anAmount);
            return " " + amountLocalised + " ";
        };

        /**
         *
         * @param anAmount
         * @param aUnit
         * @returns {string}
         */
        const formatOther = (anAmount, aUnit) => {
            const amountLocalised = isNaN(anAmount) ? "Unknown" : numberFormat.format(anAmount);
            return " " + amountLocalised + " " + aUnit;
        };

        /**
         *
         * @param aReplacedUnit
         * @returns {*}
         */
        const useUnit = (aReplacedUnit) => {
            const otherUnits = {
                "inch": "mm",
                "kcal": "kJ",
                "nmi": "km",
                "mile": "km",
                "mil": "km",
                "knots": "km/h",
                "hp": "kW"
            };
            return otherUnits[aReplacedUnit] ? otherUnits[aReplacedUnit] : aReplacedUnit;
        };

        /**
         *
         * @param anAmount
         * @returns {Number}
         */
        const parseAmount = (anAmount) => {
            let amount = anAmount;
            const comma = amount.includes(",");
            const point = amount.includes(".");
            const apo = amount.includes("'");
            const colon = amount.includes(":");
            const space = amount.includes(" ") || amount.includes("\u00A0");
            if (space) {
                amount = amount.replace(/,/g,".");
                amount = amount.replace(/\s/g,"");
            }
            else {
                if (comma && point) {
                    if (amount.indexOf(",") < amount.indexOf(".")) {
                        amount = amount.replace(/,/g,"");
                    }
                    else {
                        amount = amount.replace(/\./g,"");
                        amount = amount.replace(/,/g,".");
                    }
                }
                else if (apo && point) {
                    if (amount.indexOf("'") < amount.indexOf(".")) {
                        amount = amount.replace(/'/g,"");
                    }
                    else {
                        amount = amount.replace(/\./g,"");
                        amount = amount.replace(/'/g,".");
                    }
                }
                else if (apo && comma) {
                    if (amount.indexOf("'") < amount.indexOf(",")) {
                        amount = amount.replace(/'/g,"");
                        amount = amount.replace(/,/g,".");
                    }
                    else {
                        amount = amount.replace(/,/g,"");
                        amount = amount.replace(/'/g,".");
                    }
                }
                else if (apo) {
                    const apoCount = amount.split("'").length - 1;
                    const checkValidity = (amount.length - amount.indexOf("'") - apoCount) % 3;
                    if (amount.charAt(0) === "0" || checkValidity !== 0) {
                    }
                    else {
                        amount = amount.replace(/'/g,"");
                    }
                }
                else if (point) {
                    const pointCount = amount.split(".").length - 1;
                    const checkValidity = (amount.length - amount.indexOf(".") - pointCount) % 3;
                    if (amount.charAt(0) === "0" || checkValidity !== 0) {
                    }
                    else {
                        amount = amount.replace(/\./g,"");
                    }
                }
                else if (comma) {
                    const commaCount = amount.split(",").length - 1;
                    const checkValidity = (amount.length - amount.indexOf(",") - commaCount) % 3;
                    if (amount.charAt(0) === "0" || checkValidity !== 0) {
                        amount = amount.replace(/,/g,".");
                    }
                    else {
                        amount = amount.replace(/,/g,"");
                    }
                }
                else if (colon) {
                    const colonCount = amount.split(":").length - 1;
                    const checkValidity = (amount.length - amount.indexOf(":") - colonCount) % 3;
                    if (amount.charAt(0) === "0" || checkValidity !== 0) {
                        amount = amount.replace(/:/g,".");
                    }
                    else {
                        amount = amount.replace(/:/g,"");
                    }
                }
            }
            return parseFloat(amount);
        };

        /**
         *
         * @param aConversionQuote
         * @param aParsedAmount
         * @param aPrice
         * @param aReplacedUnit
         * @param aMultiplicator
         * @param aMultiplicatorString
         * @returns {number}
         */
        const convertAmount = (aConversionQuote, aParsedAmount, aPrice, aReplacedUnit, aMultiplicator, aMultiplicatorString) => {
            const decimals = checkMinorUnit(aPrice, aReplacedUnit, aMultiplicatorString);
            return aConversionQuote * aParsedAmount * Math.pow(10, aMultiplicator) * Math.pow(10, -decimals);
        };

        /**
         *
         * @param aConvertedPrice
         * @param aConvertedContent
         * @param aShowOriginalPrices
         * @param aReplacedUnit
         * @param aShowOriginalCurrencies
         * @param aPrice
         * @returns {*}
         */
        const replaceContent = (aConvertedPrice, aConvertedContent, aShowOriginalPrices, aReplacedUnit,
                                aShowOriginalCurrencies, aPrice) => {
            let convertedPrice = aConvertedPrice;
            let convertedContent = aConvertedContent;
            if (aShowOriginalPrices) {
                if (!convertedContent.includes(aReplacedUnit) && aShowOriginalCurrencies) {
                    convertedPrice = convertedPrice + " (##__## [¤¤¤])";
                }
                else {
                    convertedPrice = convertedPrice + " (##__##)";
                }
            }
            convertedContent = convertedContent.split(aPrice.full).join(convertedPrice);
            if (aShowOriginalPrices) {
                convertedContent = convertedContent.replace("##__##", aPrice.full);
                convertedContent = convertedContent.replace("¤¤¤", aReplacedUnit);
            }
            return convertedContent;
        };

        /**
         *
         * @param aPrice
         * @param aConversionQuote
         * @param aReplacedUnit
         * @param aCurrencyCode
         * @param aRoundAmounts
         * @param aShowOriginalPrices
         * @param aShowOriginalCurrencies
         * @param aConvertedContent
         * @returns {*}
         */
        const convertContent = (aPrice, aConversionQuote, aReplacedUnit, aCurrencyCode, aRoundAmounts,
                                aShowOriginalPrices, aShowOriginalCurrencies, aConvertedContent) => {
            const parsedAmount = parseAmount(aPrice.amount);
            const multiplicator = getMultiplicator(aPrice);
            const convertedAmount = convertAmount(aConversionQuote, parsedAmount, aPrice, aReplacedUnit,
                multiplicator.exponent, multiplicator.text);
            const usedUnit = useUnit(aReplacedUnit);
            // "93,49 €"
            const convertedPrice = aPrice.iso4217Currency ? formatDefaultIso4217Price(convertedAmount) : formatOther(convertedAmount, usedUnit);
            // " 93,49 € (100 USD)"
            const convertedContent = replaceContent(convertedPrice, aConvertedContent, aShowOriginalPrices,
                aReplacedUnit, aShowOriginalCurrencies, aPrice);
            return convertedContent;
        };

        /**
         * Stores prices that will be replaced with converted prices
         *
         * @param anIso4217Currency
         * @param anOriginalCurrency
         * @param aCurrency
         * @param aRegex
         * @param aText
         * @param aBeforeCurrencySymbol
         * @returns {Array}
         */
        const findPricesInCurrency = (aCurrency, anIso4217Currency, anOriginalCurrency, aRegex, aText, aBeforeCurrencySymbol) => {
            const prices = [];
            if (!aRegex) {
                return prices;
            }
            const newUnit = anIso4217Currency ? aCurrency : useUnit(anOriginalCurrency);
            let match;
            while (match = aRegex.exec(aText)) {
                console.log(match);
                prices.push(new Price(newUnit, anIso4217Currency, anOriginalCurrency, match, aBeforeCurrencySymbol));
            }
            return prices;
        };

        /**
         *
         * @param anEnabledCurrenciesWithRegexes
         * @param aCurrencyCode
         * @param aTextContent
         * @returns {Array}
         */
        const findPrices = (anEnabledCurrenciesWithRegexes, aCurrencyCode, aTextContent) => {
            let prices = [];
            for (let currencyRegex of anEnabledCurrenciesWithRegexes) {
                if (currencyRegex.currency === aCurrencyCode) {
                    continue;
                }
                prices = findPricesInCurrency(aCurrencyCode, currencyRegex.iso4217Currency, currencyRegex.currency, currencyRegex.regex1, aTextContent, false);
                if (prices.length === 0) {
                    prices = findPricesInCurrency(aCurrencyCode, currencyRegex.iso4217Currency, currencyRegex.currency, currencyRegex.regex2, aTextContent, true);
                }
                if (prices.length === 0) {
                    continue;
                }
                break;
            }
            return prices;
        };

        const findNumbers = (anOriginalCurrency, aCurrency, aText) => {
            const prices = [];
            const regex = new RegExp("((?:\\d{1,3}(?:[,.\\s']\\d{3})+|(?:\\d+))((?:[.,:])\\d{1,9})?)", "g")
            let match;
            while (match = regex.exec(aText)) {
                prices.push(new Price(aCurrency, true, anOriginalCurrency, match, true));
            }
            return prices;
        };

        /**
         *
         * @param anExcludedDomains
         * @param anUrl
         * @returns {boolean}
         */
        const isExcludedDomain = (anExcludedDomains, anUrl) => {
            for (let excludedDomain of anExcludedDomains) {
                const matcher = new RegExp(excludedDomain, "g");
                if (matcher.test(anUrl)){
                    return true;
                }
            }
            return false;
        };

        return {
            checkMinorUnit: checkMinorUnit,
            getMultiplicator: getMultiplicator,
            formatDefaultIso4217Price: formatDefaultIso4217Price,
            formatIso4217Price: formatIso4217Price,
            formatOther: formatOther,
            saveDefaultCurrencyNumberFormat: saveDefaultCurrencyNumberFormat,
            saveNumberFormat: saveNumberFormat,
            useUnit: useUnit,
            parseAmount: parseAmount,
            convertAmount: convertAmount,
            replaceContent: replaceContent,
            convertContent: convertContent,
            findPricesInCurrency: findPricesInCurrency,
            findPrices: findPrices,
            findNumbers: findNumbers,
            isExcludedDomain: isExcludedDomain
        }
    })();
    this.DccFunctions = DccFunctions;
}

if (!this.Price) {
    const Price = function(aCurrency, anIso4217Currency, anOriginalCurrency, aMatch, aBeforeCurrencySymbol) {
        this.iso4217Currency = anIso4217Currency;
        this.originalCurrency = anOriginalCurrency;
        this.currency = aCurrency;
        // 848,452.63 NOK
        this.full = aMatch[0];
        if (aBeforeCurrencySymbol) {
            // 848,452.63
            this.amount = aMatch[1].trim();
            this.mult = aMatch[2];
        }
        else {
            this.amount = aMatch[2].trim();
            this.mult = aMatch[3];
        }
        //console.log(this.mult);
        // 1 (position in the string where the price was found)
        this.positionInString = aMatch.index;
    };
    this.Price = Price;
}

if (!this.CurrencyRegex) {
    const CurrencyRegex = function (anIso4217Currency, aCurrency, aRegex1, aRegex2) {
        this.iso4217Currency = anIso4217Currency;
        this.currency = aCurrency;
        this.regex1 = aRegex1;
        this.regex2 = aRegex2;
    };
    this.CurrencyRegex = CurrencyRegex;
}



