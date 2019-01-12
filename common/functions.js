/*
 * © Per Johansson
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

"use strict";


const DccFunctions = (function() {

    /**
     *
     * @param anExcludedDomains parts of a URL
     * @param aUrl
     * @returns {boolean}
     */
    const isExcludedDomain = (anExcludedDomains, aUrl) => {
        for (let excludedDomain of anExcludedDomains) {
            const matcher = new RegExp(excludedDomain, "g");
            if (matcher.test(aUrl)){
                return true;
            }
        }
        return false;
    };

    return {
        isExcludedDomain: isExcludedDomain
    }
})();

if (typeof exports === "object") {
    exports.DccFunctions = DccFunctions;
}
