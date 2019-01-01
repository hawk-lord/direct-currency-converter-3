/*
 * © Per Johansson
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

"use strict";

const NekudoServiceProvider = function() {
    const onComplete = function() {
        try {
            if (this.readyState === this.DONE) {
                let countryCode;
                if (this.status === 200) {
                    const response = JSON.parse(this.responseText);
                    countryCode = response.country.code;
                }
                else {
                    countryCode = "CH";
                }
                eventAggregator.publish("countryReceivedNekudo", countryCode);
            }
        }
        catch(err) {
            console.error("err " + err);
            eventAggregator.publish("countryReceivedNekudo", "CH");
        }
    };
    const findCountry = function (aUrlString, aConvertToCountry) {
        const urlString = aUrlString;
        const userCountry = aConvertToCountry;
        const request = new XMLHttpRequest();
        const method = "GET";
        request.open(method, urlString);
        request.onreadystatechange = onComplete;
        request.send();
    };
    const loadUserCountry = () => {
        const urlString = "http://geoip.nekudo.com/api";
        findCountry(urlString);
    };
    return {
        loadUserCountry: loadUserCountry
    };
};

if (typeof exports === "object") {
    exports.NekudoServiceProvider = NekudoServiceProvider;
}
