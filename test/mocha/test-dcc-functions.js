/*
 * © Per Johansson
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

/**
 * Using Mocha with the BDD interface.
 */
"use strict";

import DccFunctions from '../../content/dcc-functions.js';
import {expect} from 'chai';

// Access CurrencyRegex and Price from the default export
const CurrencyRegex = DccFunctions.CurrencyRegex;
const Price = DccFunctions.Price;

describe("CurrencyRegex", function () {

    // Passing arrow functions (“lambdas”) to Mocha is discouraged.

    it("should create the object and set its values", function () {
        const iso4217Currency = true;
        const currency = "EUR";
        const regex1 = /(?:^|\s|\()(SEK|kr|skr)(?:\s?)((?:\d{1,3}(?:[,.\s']\d{3})+|(?:\d+))(?:[.,:]\d{1,9})?)(?:\s?)()?/g;
        const regex2 = /((?:\d{1,3}(?:[,.\s']\d{3})+|(?:\d+))(?:[.,:]\d{1,9})?)(?:\s?)(|miljon(?:er)?|miljard(?:er)?)?(?:\s?)(SEK|öre|(svenska\s)?kr(onor)?|mnkr|mdkr|mkr|s?[kK][rR]|kSEK|MSEK|GSEK|:-|,-)(?![\u0041-\u005A\u0061-\u007A])/g;
        const currencyRegex = new CurrencyRegex(iso4217Currency, currency, regex1, regex2);
        expect(currencyRegex.iso4217Currency).to.equal(iso4217Currency);
        expect(currencyRegex.currency).to.equal(currency);
        expect(currencyRegex.regex1).to.equal(regex1);
        expect(currencyRegex.regex2).to.equal(regex2);
    });

});

describe("Price", function () {
    it("should create a Price object with value before unit", function () {
        const currency = "EUR";
        const iso4217Currency = true;
        const originalCurrency = "NOK";
        const amount = "848,452.63";
        const full = amount + " NOK";
        const mult = "";
        // ["$1000", "$", "1000", undefined, index: 0, input: "$1000AR", groups: undefined]
        const match = [full, amount, mult];
        match.index = 5;
        match.input = "     " + full;
        const beforeCurrencySymbol = true;

        const price = new Price(currency, iso4217Currency, originalCurrency, match, beforeCurrencySymbol);
        expect(price.currency).to.equal(currency);
        expect(price.iso4217Currency).to.equal(iso4217Currency);
        expect(price.originalCurrency).to.equal(originalCurrency);
        expect(price.full).to.equal(full);
        expect(price.amount).to.equal(amount);
        expect(price.mult).to.equal(mult);
        expect(price.positionInString).to.equal(match.index);
    });


    it("should create a Price object with value after unit", function () {
        const currency = "EUR";
        const iso4217Currency = true;
        const originalCurrency = "ARS";
        const amount = "1000";
        const symbol = "$";
        const full = symbol + amount;
        const mult = "";
        // ["$1000", "$", "1000", undefined, index: 0, input: "$1000AR", groups: undefined]
        const match = [full, symbol, amount, mult];
        match.index = 0;
        match.input = full + "AR";
        const beforeCurrencySymbol = false;

        const price = new Price(currency, iso4217Currency, originalCurrency, match, beforeCurrencySymbol);
        expect(price.currency).to.equal(currency);
        expect(price.iso4217Currency).to.equal(iso4217Currency);
        expect(price.originalCurrency).to.equal(originalCurrency);
        expect(price.full).to.equal(full);
        expect(price.amount).to.equal(amount);
        expect(price.mult).to.equal(mult);
        expect(price.positionInString).to.equal(match.index);
    });

});


describe("DccFunctions", function () {
    beforeEach(() => {
        DccFunctions.saveDefaultCurrencyNumberFormat('en-US', false, 'EUR', false);
        DccFunctions.saveNumberFormat('en-US', false);
    });

    describe("#checkMinorUnit", function () {
        it("should not find a minor unit", function () {
            const price = {full: "100 JPY"};
            const unit = "JPY";
            const multiplicatorString = "";
            expect(DccFunctions.checkMinorUnit(price, unit, multiplicatorString)).to.equal(0);
        });

        it("should find a minor unit", function () {
            const price = {full: "99 cent"};
            const unit = "EUR";
            const multiplicatorString = "";
            expect(DccFunctions.checkMinorUnit(price, unit, multiplicatorString)).to.equal(2);
        });

        it("should not find a minor unit since there is a multiple", function () {
            const price = {full: "99 cent"};
            const unit = "EUR";
            const multiplicatorString = "million";
            expect(DccFunctions.checkMinorUnit(price, unit, multiplicatorString)).to.equal(0);
        });
    });

    describe("#getMultiplicator", function () {

        it("should be 6", function () {
            const price = {
                originalCurrency: "USD",
                mult: "million"
            };
            const expected = {
                text: "million",
                exponent: 6
            };
            expect(DccFunctions.getMultiplicator(price)).to.deep.equal(expected);
        });

        it("should be 0", function () {
            const price = {
                originalCurrency: "USD",
                mult: ""
            };
            const expected = {
                text: "",
                exponent: 0
            };
            expect(DccFunctions.getMultiplicator(price)).to.deep.equal(expected);
        });

    });

    describe("#formatDefaultIso4217Price", function () {

        it("should be unknown", function () {
            expect(DccFunctions.formatDefaultIso4217Price("string")).to.equal(" Unknown ");
        });

        it("should format the value (en-US)", function () {
            expect(DccFunctions.formatDefaultIso4217Price(0)).to.equal(" EUR\u00A00.00 ");
        });

        it("should format the value (sv-SE)", function () {
            DccFunctions.saveDefaultCurrencyNumberFormat('sv-SE', false, 'EUR', false);
            expect(DccFunctions.formatDefaultIso4217Price(0)).to.equal(" 0,00\u00A0EUR ");
        });

        it("should format the value (fr-FR)", function () {
            DccFunctions.saveDefaultCurrencyNumberFormat('fr-FR', false, 'EUR', false);
            expect(DccFunctions.formatDefaultIso4217Price(0)).to.equal(" 0,00\u00A0EUR ");
        });

        it("should format the value (de-DE)", function () {
            DccFunctions.saveDefaultCurrencyNumberFormat('de-DE', false, 'EUR', false);
            expect(DccFunctions.formatDefaultIso4217Price(0)).to.equal(" 0,00\u00A0EUR ");
        });
    });

    describe("#formatIso4217Price", function () {

        it("should be unknown", function () {
            expect(DccFunctions.formatIso4217Price("en-US", "string", "EUR")).to.equal(" Unknown ");
        });

        it("should format the value (en-US)", function () {
            expect(DccFunctions.formatIso4217Price("en-US", 1, "EUR")).to.equal(" EUR\u00A01.00 ");
        });

        it("should format the value (sv-SE)", function () {
            expect(DccFunctions.formatIso4217Price("sv-SE", 1, "EUR")).to.equal(" 1,00\u00A0EUR ");
        });

        it("should format the value (fr-FR)", function () {
            expect(DccFunctions.formatIso4217Price("fr-FR", 1, "EUR")).to.equal(" 1,00\u00A0EUR ");
        });

        it("should format the value (de-DE)", function () {
            expect(DccFunctions.formatIso4217Price("de-DE", 1, "EUR")).to.equal(" 1,00\u00A0EUR ");
        });
    });

    describe("#formatOther", function () {

        it("should be unknown", function () {
            expect(DccFunctions.formatOther("string", "xyz")).to.equal(" Unknown xyz");
        });

        it("should format the value (en-US)", function () {
            expect(DccFunctions.formatOther(1, "xyz")).to.equal(" 1 xyz");
        });

        it("should format the value (en-US)", function () {
            expect(DccFunctions.formatOther(1.23, "xyz")).to.equal(" 1.23 xyz");
        });

        it("should format the value (en-US)", function () {
            expect(DccFunctions.formatOther(1234, "xyz")).to.equal(" 1,234 xyz");
        });

        it("should format the value (sv-SE)", function () {
            DccFunctions.saveNumberFormat("sv-SE", false);
            expect(DccFunctions.formatOther(1.23, "xyz")).to.equal(" 1,23 xyz");
        });

        it("should format the value (sv-SE)", function () {
            DccFunctions.saveNumberFormat("sv-SE", false);
            expect(DccFunctions.formatOther(1234, "xyz")).to.equal(" 1\u00A0234 xyz");
        });

        it("should format the value (fr-FR)", function () {
            DccFunctions.saveNumberFormat("fr-FR", false);
            expect(DccFunctions.formatOther(1.23, "xyz")).to.equal(" 1,23 xyz");
        });

        it("should format the value (fr-FR)", function () {
            DccFunctions.saveNumberFormat("fr-FR", false);
            expect(DccFunctions.formatOther(1234, "xyz")).to.equal(" 1\u202F234 xyz");
        });

        it("should format the value (de-DE)", function () {
            DccFunctions.saveNumberFormat("de-DE", false);
            expect(DccFunctions.formatOther(1234.56, "xyz")).to.equal(" 1.234,56 xyz");
        });

        it("should format the value (de-DE, rounded)", function () {
            DccFunctions.saveNumberFormat("de-DE", true);
            expect(DccFunctions.formatOther(1234.56, "xyz")).to.equal(" 1.235 xyz");
        });
    });

    describe("#saveDefaultCurrencyNumberFormat", function () {
        describe("en-US", function () {
            it("should set the value unit and formatting (code)", function () {
                DccFunctions.saveDefaultCurrencyNumberFormat("en-US", false, "EUR", false);
                expect(DccFunctions.formatDefaultIso4217Price(1.23)).to.equal(" EUR\u00A01.23 ");
            });

            it("should set the value unit and formatting (code, large number)", function () {
                DccFunctions.saveDefaultCurrencyNumberFormat("en-US", false, "EUR", false);
                expect(DccFunctions.formatDefaultIso4217Price(1234.56)).to.equal(" EUR\u00A01,234.56 ");
            });

            it("should set the value unit and formatting (code, rounded)", function () {
                DccFunctions.saveDefaultCurrencyNumberFormat("en-US", true, "EUR", false);
                expect(DccFunctions.formatDefaultIso4217Price(1234.56)).to.equal(" EUR\u00A01,235 ");
            });

            it("should set the value unit and formatting (symbol)", function () {
                DccFunctions.saveDefaultCurrencyNumberFormat("en-US", true, "EUR", true);
                expect(DccFunctions.formatDefaultIso4217Price(1234.56)).to.equal(" €1,235 ");
            });
        });

        describe("sv-SE", function () {
            it("should set the value unit and formatting (code)", function () {
                DccFunctions.saveDefaultCurrencyNumberFormat("sv-SE", false, "EUR", false);
                expect(DccFunctions.formatDefaultIso4217Price(1.23)).to.equal(" 1,23\u00A0EUR ");
            });

            it("should set the value unit and formatting (code, large number)", function () {
                DccFunctions.saveDefaultCurrencyNumberFormat("sv-SE", false, "EUR", false);
                expect(DccFunctions.formatDefaultIso4217Price(1234.56)).to.equal(" 1\u00A0234,56\u00A0EUR ");
            });

            it("should set the value unit and formatting (code, rounded)", function () {
                DccFunctions.saveDefaultCurrencyNumberFormat("sv-SE", true, "EUR", false);
                expect(DccFunctions.formatDefaultIso4217Price(1234.56)).to.equal(" 1\u00A0235\u00A0EUR ");
            });

            it("should set the value unit and formatting (symbol)", function () {
                DccFunctions.saveDefaultCurrencyNumberFormat("sv-SE", true, "EUR", true);
                expect(DccFunctions.formatDefaultIso4217Price(1234.56)).to.equal(" 1\u00A0235\u00A0€ ");
            });
        });

        describe("fr-FR", function () {
            it("should set the value unit and formatting (code)", function () {
                DccFunctions.saveDefaultCurrencyNumberFormat("fr-FR", false, "EUR", false);
                expect(DccFunctions.formatDefaultIso4217Price(1.23)).to.equal(" 1,23\u00A0EUR ");
            });

            it("should set the value unit and formatting (code, large number)", function () {
                DccFunctions.saveDefaultCurrencyNumberFormat("fr-FR", false, "EUR", false);
                expect(DccFunctions.formatDefaultIso4217Price(1234.56)).to.equal(" 1\u202F234,56\u00A0EUR ");
            });

            it("should set the value unit and formatting (code, rounded)", function () {
                DccFunctions.saveDefaultCurrencyNumberFormat("fr-FR", true, "EUR", false);
                expect(DccFunctions.formatDefaultIso4217Price(1234.56)).to.equal(" 1\u202F235\u00A0EUR ");
            });

            it("should set the value unit and formatting (symbol)", function () {
                DccFunctions.saveDefaultCurrencyNumberFormat("fr-FR", true, "EUR", true);
                expect(DccFunctions.formatDefaultIso4217Price(1234.56)).to.equal(" 1\u202F235\u00A0€ ");
            });
        });

        describe("de-DE", function () {
            it("should set the value unit and formatting (code)", function () {
                DccFunctions.saveDefaultCurrencyNumberFormat("de-DE", false, "EUR", false);
                expect(DccFunctions.formatDefaultIso4217Price(1.23)).to.equal(" 1,23\u00A0EUR ");
            });

            it("should set the value unit and formatting (code, large number)", function () {
                DccFunctions.saveDefaultCurrencyNumberFormat("de-DE", false, "EUR", false);
                expect(DccFunctions.formatDefaultIso4217Price(1234.56)).to.equal(" 1.234,56\u00A0EUR ");
            });

            it("should set the value unit and formatting (code, rounded)", function () {
                DccFunctions.saveDefaultCurrencyNumberFormat("de-DE", true, "EUR", false);
                expect(DccFunctions.formatDefaultIso4217Price(1234.56)).to.equal(" 1.235\u00A0EUR ");
            });

            it("should set the value unit and formatting (symbol)", function () {
                DccFunctions.saveDefaultCurrencyNumberFormat("de-DE", true, "EUR", true);
                expect(DccFunctions.formatDefaultIso4217Price(1234.56)).to.equal(" 1.235\u00A0€ ");
            });
        });
    });

    describe("#saveNumberFormat", function () {
        it("should set the value unit and formatting (en-US)", function () {
            DccFunctions.saveNumberFormat("en-US", false);
            expect(DccFunctions.formatOther(1.23, "Potrzebie")).to.equal(" 1.23 Potrzebie");
        });

        it("should set the value unit and formatting (en-US, rounded)", function () {
            DccFunctions.saveNumberFormat("en-US", true);
            expect(DccFunctions.formatOther(1, "Potrzebie")).to.equal(" 1 Potrzebie");
        });

        it("should set the value unit and formatting (sv-SE)", function () {
            DccFunctions.saveNumberFormat("sv-SE", false);
            expect(DccFunctions.formatOther(1.23, "Potrzebie")).to.equal(" 1,23 Potrzebie");
        });

        it("should set the value unit and formatting (sv-SE, rounded)", function () {
            DccFunctions.saveNumberFormat("sv-SE", true);
            expect(DccFunctions.formatOther(1, "Potrzebie")).to.equal(" 1 Potrzebie");
        });

        it("should set the value unit and formatting (fr-FR)", function () {
            DccFunctions.saveNumberFormat("fr-FR", false);
            expect(DccFunctions.formatOther(1234.56, "Potrzebie")).to.equal(" 1\u202F234,56 Potrzebie");
        });

        it("should set the value unit and formatting (fr-FR, rounded)", function () {
            DccFunctions.saveNumberFormat("fr-FR", true);
            expect(DccFunctions.formatOther(1234.56, "Potrzebie")).to.equal(" 1\u202F235 Potrzebie");
        });

        it("should set the value unit and formatting (de-DE)", function () {
            DccFunctions.saveNumberFormat("de-DE", false);
            expect(DccFunctions.formatOther(1234.56, "Potrzebie")).to.equal(" 1.234,56 Potrzebie");
        });

        it("should set the value unit and formatting (de-DE, rounded)", function () {
            DccFunctions.saveNumberFormat("de-DE", true);
            expect(DccFunctions.formatOther(1234.56, "Potrzebie")).to.equal(" 1.235 Potrzebie");
        });
    });

    describe("#useUnit", function () {
        it("should replace the unit with the SI unit", function () {
            expect(DccFunctions.useUnit("inch")).to.equal("mm");
        });


    });

    describe("#parseAmount", function () {
        it("should parse the string to a number", function () {
            expect(DccFunctions.parseAmount("1.234,56")).to.equal(1234.56);
        });

        it("should parse the string to a number", function () {
            expect(DccFunctions.parseAmount("1,234.56")).to.equal(1234.56);
        });

        it("should parse the string to a number", function () {
            expect(DccFunctions.parseAmount("1,234")).to.equal(1234);
        });

        it("should parse the string to a number", function () {
            expect(DccFunctions.parseAmount("1,234,567")).to.equal(1234567);
        });

        it("should parse the string to a number", function () {
            expect(DccFunctions.parseAmount("1,23")).to.equal(1.23);
        });

        it("should parse the string to a number", function () {
            expect(DccFunctions.parseAmount("1.234")).to.equal(1234);
        });

        it("should parse the string to a number", function () {
            expect(DccFunctions.parseAmount("2'200")).to.equal(2200);
        });

        it("should parse the string to a number", function () {
            expect(DccFunctions.parseAmount("2'200.99")).to.equal(2200.99);
        });

        it("should parse the string to a number", function () {
            expect(DccFunctions.parseAmount(".99")).to.equal(0.99);
        });


    });

    describe("#convertAmount", function () {
        it("should convert the amount", function () {
            const price = {
                iso4217Currency: true,
                originalCurrency: "AED",
                currency: "EUR",
                full: "100 AED",
                amount: "100",
                mult: undefined,
                positionInString: 0
            };
            expect(DccFunctions.convertAmount(0.24001940633177857, 100, price, "AED", 0, "")).to.equal(24.001940633177856);
        });

        it("should convert the amount", function () {
            const price = {
                iso4217Currency: true,
                originalCurrency: "SEK",
                currency: "EUR",
                full: "2 miljoner kronor",
                amount: "2",
                mult: "miljoner",
                positionInString: 0
            };
            expect(DccFunctions.convertAmount(0.09433958227704578, 2, price, "SEK", 6, "miljoner")).to.equal(188679.16455409155);
        });

        it("should handle invalid currency", function () {
            const price = {
                iso4217Currency: false,
                originalCurrency: "XYZ",
                currency: "EUR",
                full: "100 XYZ",
                amount: "100",
                mult: undefined,
                positionInString: 0
            };
            expect(DccFunctions.convertAmount(1, 100, price, "XYZ", 0, "")).to.equal(100);
        });

        it("should handle negative amount", function () {
            const price = {
                iso4217Currency: true,
                originalCurrency: "USD",
                currency: "EUR",
                full: "-100 USD",
                amount: "-100",
                mult: undefined,
                positionInString: 0
            };
            expect(DccFunctions.convertAmount(0.8817, -100, price, "USD", 0, "")).to.equal(-88.17);
        });
    });

    describe("#replaceContent", function () {
        it("should convert the amount", function () {
            const convertedContent = "2 miljoner kronor till ungdomshandbollen";
            const convertedPrice = " 188 679,16 EUR ";
            const price = {
                amount: "2",
                currency: "EUR",
                full: "2 miljoner kronor",
                iso4217Currency: true,
                mult: "miljoner",
                originalCurrency: "SEK",
                positionInString: 0
            };
            expect(DccFunctions.replaceContent(convertedPrice, convertedContent, true, "SEK", false, price)).to.equal("188 679,16 EUR (2 miljoner kronor) till ungdomshandbollen");
        });

    });

    describe("#convertContent", function () {
        it("should convert the amount", function () {
            DccFunctions.saveDefaultCurrencyNumberFormat('sv-SE', false, 'EUR', false);
            const price = {
                amount: "2",
                currency: "EUR",
                full: "2 miljoner kronor",
                iso4217Currency: true,
                mult: "miljoner",
                originalCurrency: "SEK",
                positionInString: 0
            };
            const convertedContent = "2 miljoner kronor till ungdomshandbollen";
            expect(DccFunctions.convertContent(price, 0.09433958227704578, "SEK", "EUR", false, true, false, convertedContent)).to.equal("188\u00A0679,16\u00A0EUR (2 miljoner kronor) till ungdomshandbollen");
        });

        it("should convert MSEK to EUR (sv-SE)", function () {
            DccFunctions.saveDefaultCurrencyNumberFormat('sv-SE', false, 'EUR', false);
            const price = {
                amount: "100",
                currency: "EUR",
                full: "100 MSEK",
                iso4217Currency: true,
                mult: "MSEK",
                originalCurrency: "SEK",
                positionInString: 0
            };
            const convertedContent = "100 MSEK till ungdomshandbollen";
            expect(DccFunctions.convertContent(price, 0.094345427, "SEK", "EUR", false, true, false, convertedContent)).to.equal("9\u00A0434\u00A0542,70\u00A0EUR (100 MSEK) till ungdomshandbollen");
        });
    });

    describe("#findPricesInCurrency", function () {

        it("should find one price", function () {
            const currency = "EUR";
            const iso4217Currency = true;
            const originalCurrency = "SEK";
            const regex = /((?:\d{1,3}(?:[,.\s']\d{3})+|(?:\d+))(?:[.,:]\d{1,9})?)(?:\s?)(|miljon(?:er)?|miljard(?:er)?)?(?:\s?)(SEK|öre|(svenska\s)?kr(onor)?|mnkr|mdkr|mkr|s?[kK][rR]|kSEK|MSEK|GSEK|:-|,-)/g;
            const text = "2 miljoner kronor till ungdomshandbollen";
            const beforeCurrencySymbol = true;

            const match = ["2 miljoner kronor", "2", "miljoner", "kronor", undefined, "onor"];
            match.index = 0;
            match.input = text;
            match.groups = undefined;
            const price = new Price(currency, iso4217Currency, originalCurrency, match, beforeCurrencySymbol);
            const expectedContent = [price];
            const actual = DccFunctions.findPricesInCurrency(currency, iso4217Currency, originalCurrency, regex, text, beforeCurrencySymbol);
            expect(actual.length).to.equal(expectedContent.length);
            expect(actual.length).to.equal(1);
            expect(actual[0]).to.deep.equal(expectedContent[0]);
        });

    });

    describe("#findPrices", function () {

        it("should find one price", function () {
            const newCurrency = "EUR";
            const textContent = "2 miljoner kronor till ungdomshandbollen";
            const enabledCurrenciesWithRegexes = [];
            const originalCurrency = "SEK";
            const iso4217Currency = true;
            const regex1 = /(?:^|\s|\()(SEK|kr|skr)(?:\s?)((?:\d{1,3}(?:[,.\s']\d{3})+|(?:\d+))(?:[.,:]\d{1,9})?)(?:\s?)()/g;
            const regex2 = /((?:\d{1,3}(?:[,.\s']\d{3})+|(?:\d+))(?:[.,:]\d{1,9})?)(?:\s?)(|miljon(?:er)?|miljard(?:er)?)?(?:\s?)(SEK|öre|(svenska\s)?kr(onor)?|mnkr|mdkr|mkr|s?[kK][rR]|kSEK|MSEK|GSEK|:-|,-)/g;
            const currencyRegex = new CurrencyRegex(iso4217Currency, originalCurrency, regex1, regex2);
            enabledCurrenciesWithRegexes.push(currencyRegex);

            const beforeCurrencySymbol = true;
            const match = ["2 miljoner kronor", "2", "miljoner", "kronor", undefined, "onor"];
            match.index = 0;
            match.input = textContent;
            match.groups = undefined;
            const price = new Price(newCurrency, iso4217Currency, originalCurrency, match, beforeCurrencySymbol);
            const expectedContent = [price];
            const actual = DccFunctions.findPrices(enabledCurrenciesWithRegexes, newCurrency, textContent);
            expect(actual.length).to.equal(expectedContent.length);
            expect(actual.length).to.equal(1);
            expect(actual[0]).to.deep.equal(expectedContent[0]);
        });

    });

    describe("#findNumbers", function () {

        it("should find one price", function () {
            const newCurrency = "EUR";
            const textContent = "2 miljoner kronor till ungdomshandbollen";
            const originalCurrency = "SEK";
            const iso4217Currency = true;

            const beforeCurrencySymbol = true;
            const match = ["2", "2", undefined];
            match.index = 0;
            match.input = textContent;
            match.groups = undefined;
            const price = new Price(newCurrency, iso4217Currency, originalCurrency, match, beforeCurrencySymbol);
            const expectedContent = [price];
            const actual = DccFunctions.findNumbers(originalCurrency, newCurrency, textContent);
            expect(actual.length).to.equal(expectedContent.length);
            expect(actual.length).to.equal(1);
            expect(actual[0]).to.deep.equal(expectedContent[0]);
        });

    });

});