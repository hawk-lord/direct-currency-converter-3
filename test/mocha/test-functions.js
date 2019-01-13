
"use strict";

const functions = require("../../common/functions");
const expect = require("chai").expect;


describe("DccFunctions", () => {

    // Passing arrow functions (“lambdas”) to Mocha is discouraged.

    it("should exclude URL with docs.google.com", function() {
        const excludedLines = [];
        excludedLines.push("docs.google.com");
        const url = "https://docs.google.com/document/d/1CjJuv-Fl9cfFD69BOJGRHXT8DYxK4ETPAley8e_BBFc/edit";
        const isExcludedDomain = functions.DccFunctions.isUrlInArray(excludedLines, url);

        expect(isExcludedDomain).to.be.true;
    });

    it("should exclude URL with .dk", function() {
        const excludedLines = [];
        excludedLines.push(".dk");
        const url = "https://www.bornholmslinjen.dk/fartplan/";
        const isExcludedDomain = functions.DccFunctions.isUrlInArray(excludedLines, url);

        expect(isExcludedDomain).to.be.true;
    });

    it("should not exclude URL with \\.km", function() {
        const excludedLines = [];
        excludedLines.push("\\.km");
        const url = "https://www.bornholmslinjen.dk/fartplan/";
        const isExcludedDomain = functions.DccFunctions.isUrlInArray(excludedLines, url);

        expect(isExcludedDomain).to.be.false;
    });


});
