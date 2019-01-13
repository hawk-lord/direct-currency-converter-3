# Direct Currency Converter - DCC

Version 3.0.0, date 2019-01-14

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
DCC reloads quotes on demand only, so the query limitation of Currencylayer should not
be a problem.

You can exclude any URL from being converted. Regular Expressions are valid.

Reset settings will reset to default settings.

Reset quotes will reload the currency quotes.
 

## Menu

Toggle conversion: shows and hides the conversion.

Open quotes page: shows a page with all currency quotes sorted by value or name.

Open test page: shows a page with several price examples, to verify that conversion works.

Settings


## About

DCC was originally created in 2014 as a remake of the Firefox add-on Simple Currency Converter.
Later it was ported to work in SeaMonkey, Chrome, Opera, Safari and Edge browsers.
Since Mozilla abandoned its own API to use the Chrome API instead, the Chrome version became the master branch.
Originally the currency quotes were fetched from Yahoo!. They closed their API, that was never
meant to be used by outsiders, so DCC switched to the limited ECB quotes, 
and Currencylayer to cover most currencies. 

External libraries: jQuery, jQuery UI, jQuery UI Touch-Punch, DOM Purify.

Thanks to Jetbrains s.r.o for a licence to use IntelliJ IDEA Ultimate for open source development.

## Changelog

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

