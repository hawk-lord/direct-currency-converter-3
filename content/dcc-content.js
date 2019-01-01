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
        minorUnits.push(new MinorUnit("UZS", 2, ["tiyin"]));
        minorUnits.push(new MinorUnit("VEF", 2, ["céntimo"]));
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
            const regex = new RegExp("((?:\\d{1,3}(?:(?:,|\\.|\\s|')\\d{3})+|(?:\\d+))(?:(?:[.,:])\\d{1,9})?)", "g")
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



if (!this.DirectCurrencyContent) {
    const DirectCurrencyContent = (function(aDccFunctions) {
        if (!String.prototype.includes) {
            String.prototype.includes = () => {
                return String.prototype.indexOf.apply(this, arguments) !== -1;
            };
        }
        let conversionQuotes = [];
        let currencyCode = "";
        let excludedDomains = [];
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
        const skippedElements = ["audio", "colgroup", "embed", "head", "html", "img", "object",  "ol", "script", "select", "style", "table", "tbody", "textarea", "thead", "tr", "ul", "video"];

        /*
         * Wait for PriceRegexes to be created before running makePriceRegexes.
         * Should be executed once only.
         */
        /*
        const makePriceRegexes = () => {
            new Promise(
                (resolve, reject) => PriceRegexes ? resolve(PriceRegexes) : reject(Error("makePriceRegexes rejected"))
            ).then(
                (aPriceRegexes) => aPriceRegexes.makePriceRegexes(regexes1, regexes2),
                (err) => console.error("makePriceRegexes then error " + err)
            ).catch(
                (err) => console.error("makePriceRegexes catch error " + err)
            );
        };

        makePriceRegexes();
        */

        //PriceRegexes.makePriceRegexes();

        const replaceCurrency = (aNode, aCheckDataNode) => {
            if (!aNode.parentNode) {
                return;
            }
            const isSibling = aNode.previousSibling;
            const dataNode = isSibling ? aNode.previousSibling : aNode.parentNode;
            // Can be [object SVGAnimatedString]
            // Extra check of "string" for Chrome
            if (aCheckDataNode && dataNode
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
                        aDccFunctions.formatIso4217Price(tempAmount, price.originalCurrency) :
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
        const mutationHandler = (aMutationRecord) => {
            if (aMutationRecord.type === "childList") {
                for (let i = 0; i < aMutationRecord.addedNodes.length; ++i) {
                    const node = aMutationRecord.addedNodes[i];
                    traverseDomTree(node);
                }
            }
            else if (aMutationRecord.type === "characterData") {
                mutationObserver.disconnect();
                replaceCurrency(aMutationRecord.target, false);
                //mutationObserver.observe(document.body, mutationObserverInit);
            }
        };

        const mutationsHandler = (aMutations) => {
            aMutations.forEach(mutationHandler);
        };

        const mutationObserver = new MutationObserver(mutationsHandler);

        const startObserve = () => {
            console.log("startObserve");
            if (document.body) {
                mutationObserver.observe(document.body, mutationObserverInit);
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

        const traverseDomTree = (aNode) => {
            //console.log("DCC traverseDomTree " + document.URL);
            if (!aNode) {
                return
            }
            let textNode;
            const treeWalker = document.createTreeWalker(
                aNode,
                NodeFilter.SHOW_TEXT,
                {
                    acceptNode: function(node) {
                        if (skippedElements.indexOf(node.parentNode.tagName.toLowerCase()) === -1
                                // Avoid node trees without numbers
                            && /\d/.test(node.textContent)) {
                            return NodeFilter.FILTER_ACCEPT;
                        }
                        else {
                            return NodeFilter.FILTER_REJECT;
                        }
                    }
                },
                false);
            while (textNode = treeWalker.nextNode()) {
                //console.log("replaceCurrency " + textNode.nodeValue);
                replaceCurrency(textNode, true);
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
            if (aDccFunctions.isExcludedDomain(excludedDomains, document.URL)) {
                return;
            }
            if (aStatus.isEnabled && !aStatus.hasConvertedElements) {
                startObserve();
                //console.log("DCC onSendEnabledStatus " + document.URL);
                traverseDomTree(document.body);
            }
            const showOriginal = !aStatus.isEnabled;
            substituteAll(document.body, showOriginal);
        };

        /**
         *
         * @param aSettings
         */
        const readParameters = (aSettings) => {
            conversionQuotes = aSettings.conversionQuotes;
            excludedDomains = aSettings.excludedDomains;
            currencyCode = aSettings.convertToCurrency;
            roundAmounts = aSettings.roundAmounts;
            showOriginalPrices = aSettings.showOriginalPrices;
            showOriginalCurrencies = aSettings.showOriginalCurrencies;
            showTooltip = aSettings.showTooltip;
            quoteAdjustmentPercent = +aSettings.quoteAdjustmentPercent;
            convertFromCurrency = aSettings.convertFromCurrency;
            alwaysConvertFromCurrency = aSettings.alwaysConvertFromCurrency;
            showAsSymbol = aSettings.showAsSymbol;
            regexes1 = aSettings.regexes1;
            regexes2 = aSettings.regexes2;
        };

        const begin = "(?:^|\\s|\\()";
        const value = "((?:\\d{1,3}(?:(?:,|\\.|\\s|')\\d{3})+|(?:\\d+))(?:(?:\\.|,|\\:)\\d{1,9})?)";
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
            console.log("DCC onUpdateSettings " + document.URL);
            const showOriginal = true;
            substituteAll(document.body, showOriginal);
            resetDomTree(document.body);
            readParameters(aSettings);
            aDccFunctions.saveDefaultCurrencyNumberFormat(roundAmounts, currencyCode, showAsSymbol);
            aDccFunctions.saveNumberFormat(roundAmounts);

            const startConversion = () => {
                readEnabledCurrencies(aSettings);
                let process = true;
                for (let excludedDomain of aSettings.excludedDomains) {
                    const matcher = new RegExp(excludedDomain, "g");
                    const found = matcher.test(document.URL);
                    if (found) {
                        process = false;
                        break;
                    }
                }
                let hasConvertedElements = false;
                if (aSettings.isEnabled && process) {
                    startObserve();
                    if (document) {
                        //console.log("DCC startConversion " + document.URL);
                        traverseDomTree(document.body);
                        const showOriginal = false;
                        substituteAll(document.body, showOriginal);
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
