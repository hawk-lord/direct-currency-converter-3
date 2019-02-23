
"use strict";

module.exports = function (config) {

    config.set({

        browsers: ["ChromeHeadless"],

        frameworks: ["mocha", "sinon-chrome", "chai"],

        /**
         * Dependency order is important.
         */
        files: [
            {pattern: "../content/dcc-functions.js", included: true},
            {pattern: "../content/dcc-content.js", included: true},
            {pattern: "karma/test-dcc-content.js", included: true},
        ],

        debug: true
    })
};
