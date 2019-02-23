
"use strict";

module.exports = function (config) {

    config.set({

        /**
         * ChromeHeadless will use en locale as default.
         */
        browsers: ["ChromeHeadless_Sv", "Chrome"],

        customLaunchers: {
            ChromeHeadless_Sv: {
                base: 'ChromeHeadless',
                flags: ['--lang=sv']
            }
        },

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
