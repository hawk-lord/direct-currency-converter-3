/*
 * © Per Johansson
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

"use strict";
/**
 * Due to problems with ESM and Chai, we use Common JS.
 *
 * @param config
 */
module.exports = function (config) {

    config.set({

        basePath: '..', // Root of project
        /**
         * ChromeHeadless will use en locale as default.
         */
        browsers: [
            "ChromeHeadless_Sv",
            "Chrome",
            "FirefoxHeadless"
        ],


        customLaunchers: {
            ChromeHeadless_Sv: {
                base: 'ChromeHeadless',
                flags: ['--lang=sv']
            },
            FirefoxHeadless: {
                base: 'Firefox',
                flags: ['-headless']
            }
        },
        frameworks: ["mocha"],
        plugins: [
            require('karma-mocha'),
            require('karma-chrome-launcher'),
            require('karma-firefox-launcher'),
            require('karma-webpack')
        ],

        /**
         * Dependency order is important.
         */
        files: [
            {pattern: "content/dcc-functions.js", included: false},
            {pattern: "content/dcc-content.js", included: false},
            {pattern: "test/karma/test-dcc-content.js", included: true},
            {pattern: "node_modules/sinon/pkg/sinon.js", included: true},
// SyntaxError: export declarations may only appear at top level of a module
//   at node_modules/chai/chai.js:4101:1
//            { pattern: "node_modules/chai/chai.js", included: true }
        ],
        preprocessors: {
            'test/karma/test-dcc-content.js': ['webpack'],
            'content/dcc-functions.js': ['webpack'],
            'content/dcc-content.js': ['webpack']
        },
        webpack: {
            mode: 'development',
            resolve: {
                extensions: ['.js', '.mjs'],
                mainFields: ['browser', 'main']
            },
            module: {
                rules: [
                    {
                        test: /\.js$/,
                        exclude: /node_modules/,
                        use: {
                            loader: 'babel-loader',
                            options: {
                                presets: ['@babel/preset-env']
                            }
                        }
                    }
                ]
            }
        },
        debug: true
    });
};
