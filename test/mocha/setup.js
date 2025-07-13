/*
 * © Per Johansson
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import 'intl';
import 'intl/locale-data/jsonp/en.js';
import 'intl/locale-data/jsonp/sv.js';
import 'intl/locale-data/jsonp/fr.js';

// Initialize global state for dcc-functions.js
global.defaultCurrencyNumberFormat = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    currencyDisplay: 'code'
});

global.numberFormat = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
});
