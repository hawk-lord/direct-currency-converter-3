# Direct Currency Converter - DCC

Version 3.4.0, date 2025-06-22

## Introduction

DCC finds and converts prices on any web page with currency quotes from external sources (ECB or Currencylayer).

If you hover the mouse over a converted price, the conversion quote and original value is
shown as a tooltip in the upper left corner of the window. 
The tooltip can be switched off in the settings.

## Data protection

DCC does not collect any information about you. 
The communication is directly between you, the page you are viewing, 
and the currency data providers. 
There are no ads or spyware. 

## Settings

The currencies to be converted is shown in a list in priority order.
The currencies can be reordered using drag and drop. 
For instance, if AUD is before USD and both are selected, "$100" will be converted from AUD.
Select All will select all currencies.
Select None will turn off all selections.

Convert to is the currency all other currencies will be converted to.
Any combination will work.

You can select how conversions are done and shown.

You can also force conversion of all numbers from one currency. 
It's convenient when you use a page without currency units.

ECB is the default currency source, but rather limited. 
You can use Currencylayer for free (or paid) if you sign up with them and get an API key.
DCC reloads quotes on demand only, so the query limitation of Currencylayer may not
be a problem.

You can exclude any URL from being converted. Regular Expressions are valid.

Reset settings will reset to default settings.

Reset quotes will reload the currency quotes.
 

## About

DCC was originally created in 2014 as a remake of the Firefox add-on Simple Currency Converter.
Later it was ported to work in SeaMonkey, Chrome, Opera, Safari and Edge browsers.
Since Mozilla abandoned its own API to use the Chrome API instead, the Chrome version became the master branch.
Since Microsoft decided to change Edge into a Chromium based application, DCC for Edge has been discontinued.

Originally the currency quotes were fetched from Yahoo!. They closed their API, that was never
meant to be used by outsiders, so DCC switched to the limited ECB quotes, 
and Currencylayer to cover most currencies. 

External libraries:  DOM Purify, Drag Drop Touch.

## Changelog

### 3.4.0, 2025-06-22
Fixed VES/VEF (Venezolan Bolivars) problem.

Internal changes:
Updated dependencies
Using ESM modules where possible
Fixed failing unit tests

### 3.3.0, 2024-09-07

Now conversion of prices is only done on a newly opened tab when you press the $€ icon.
It also means that there is no general On/Off state any more. Every tab has its own state.

Removed the menu from the icon.

Internal change: Using Chrome Manifest V3 which means many internal code changes.

### 3.2.1, 2020-01-25

Fix for identifiers that have already been declared. 

### 3.2.0, 2019-10-29

Added setting for HTML elements that should be ignored. 
Even if an element is ignored, its children will still be checked.

Also converts head elements, such as page title.

### 3.1.0, 2019-08-25

The options/settings screen now has all sections minimised when opened.

Internal changes:
Using HTML drag and drop instead of jQuery.
Removed external libraries jQuery, jQuery UI, jQuery UI Touch-Punch.
Updated the external library DOM Purify.


### 3.0.0

Added included domains (whitelist).

Internal rewrite to improve the functionality. No changes in the settings storage.

Bug: wrong currency was shown in the popup.

Bug: prices in the same element were converted repeatedly.

Bug: drag and drop on touchscreen did not work.

ISO 4217 amendments 166 to 169 included. Notably the latest Venezolan currency, VES, is added.

Updated the external libraries jQuery, jQuery UI, jQuery UI Touch-Punch, DOM Purify.


### Author

Per Johansson

www.joint.ax

kodehawker@gmail.com

