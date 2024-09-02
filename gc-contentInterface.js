/*
 * © Per Johansson
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

"use strict";


/*

State machine.

On install and activate:

Send scripts to every page visited, except blacklisted.
OR
Send scripts to every page in whitelist.

When script is loaded, ask for state.

If ON, send message to convert.

If OFF -> ON, send message to convert

If ON -> OFF, remove conversions.

If HIDE -> SHOW, show converted.

If SHOW -> HIDE, hide converted.


On new tab or navigate
Same as above.



*/

import { Settings } from './common/settings.js';
import { DccFunctions } from './common/functions.js';
import { TabState } from './common/tab-state.js';


export const GcContentInterface = function(anInformationHolder, aChromeInterface) {

	const tabIdStates = [];

	/**
		status.isEnabled = aParameters.conversionEnabled;
		status.hasConvertedElements = false;
		status.url = aParameters.url;
	*/
	const sendEnabledStatus = (tabId, status) => {

		if (!status.isEnabled) {
			//return;
		}
		const settings = new Settings(anInformationHolder);

		const onScriptExecuted = (injectionResult) => {
			console.log("sendEnabledStatus onScriptExecuted injectionResult " + injectionResult);
			console.log("sendEnabledStatus onScriptExecuted tabId " + tabId);
			try {
				if (!chrome.runtime.onMessage.hasListener(finishedTabProcessingHandler)) {
					// console.log("Add finishedTabProcessingHandler");
					chrome.runtime.onMessage.addListener(finishedTabProcessingHandler);
				}
				chrome.tabs.sendMessage(tabId, settings)
			}
			catch (err) {
				console.error(err);
			}
		};

		if (settings.includedDomains && settings.includedDomains.length > 0 && !DccFunctions.isUrlInArray(settings.includedDomains, status.url)) {
			return;
		}

		if (DccFunctions.isUrlInArray(settings.excludedDomains, status.url)) {
			return;
		}

		console.log("function sendEnabledStatus, sending to tab id: " + tabId)
		try {
			chrome.scripting.insertCSS({
				target: { tabId: tabId },
				files: ["title.css"]
			})
				.then(() => { console.log("insertCSS done") })
				.catch((err) => { console.error(err) });
			chrome.scripting.executeScript({
				target: { tabId: tabId, allFrames: true },
				files: ["content/dcc-functions.js", "content/dcc-content.js", "gc-content-adapter.js"],
			})
				.then(onScriptExecuted)
				.catch((err) => { console.error(err) });

		}
		catch (err) {
			console.error(`failed to execute script: ${err}`);
		}


	};

	const finishedTabProcessingHandler = (message, sender, sendResponse) => {
		console.log("finishedTabProcessingHandler message: " + message.command);
		if (message.command === "getEnabledState") {
			/*
			try {
				console.log("finishedTabProcessingHandler message " + message);
				console.log("finishedTabProcessingHandler sender " + sender);
				console.log("finishedTabProcessingHandler tab " + sender.tab.id);
				if (sender.tab) {
					let tabIdState = tabIdStates.find(tabIdState => tabIdState.tabId === sender.tab.id);
					console.log("finishedTabProcessingHandler tabIdState: " + tabIdState);
					if (!tabIdState) {
						tabIdState = new TabState(sender.tab.id, false);
						tabIdStates.push(tabIdState);
						console.log("finishedTabProcessingHandler Pushed tabIdState to tabIdStates");
					}
					else {
						// Switch state
						console.log("finishedTabProcessingHandler Before: " + tabIdState.state);
						tabIdState.state = !tabIdState.state;
						console.log("finishedTabProcessingHandler After: " + tabIdState.state);
					}
				}
			}
			catch (err) {
				console.error("finishedTabProcessingHandler " + err);
			}
			*/
		}
	};

	/**
	 * Called from tabs.onUpdated
	 *
	 * @param tabId
	 * @param changeInfo
	 * @param tab
	 */
	const tabOnUpdated = (tabId, changeInfo, tab) => {
		console.log("chrome.tabs.onUpdated handler: tabOnUpdated " + tabId + " status " + changeInfo.status + " url " + changeInfo.url);
		let tabIdState = tabIdStates.find(t => t.tabId === tab.tabId);
		console.log("tabOnUpdated tabIdState: " + tabIdState);
		if (!tabIdState) {
			tabIdState = new TabState(tab.tabId, false);
			tabIdStates.push(tabIdState);
			console.log("tabOnUpdated Pushed tabIdState to tabIdStates");
		}
		else {
			tabIdState.state = false;
		}
		// Set state of icon
		//tabIdState.state;
		// eventAggregator
		// send state to new GcChromeInterface(tabIdState.state);
		aChromeInterface.setButtonStatus(tabIdState.state);
	};

	/*
   const sendSettingsToPage = (tabId, changeInfo, tab) => {
	   console.log("chrome.tabs.onUpdated handler: sendSettingsToPage " + tabId + " status " + changeInfo.status + " url " + changeInfo.url);
	   if (changeInfo.status !== "complete") {
		   return;
	   }


	   const settings = new Settings(anInformationHolder);

	   const onScriptExecuted = (injectionResult) => {
		   console.log("sendSettingsToPage onScriptExecuted injectionResult " + injectionResult);
		   console.log("sendSettingsToPage onScriptExecuted tabId " + tabId);
		   try {
			   if (!chrome.runtime.onMessage.hasListener(finishedTabProcessingHandler)) {
				   // console.log("Add finishedTabProcessingHandler");
				   chrome.runtime.onMessage.addListener(finishedTabProcessingHandler);
			   }
			   chrome.tabs.sendMessage(tabId, settings)
		   }
		   catch (err) {
			   console.log(err);
		   }
	   };

	   if (settings.includedDomains && settings.includedDomains.length > 0 && !DccFunctions.isUrlInArray(settings.includedDomains, tab.url)) {
		   return;
	   }

	   if (DccFunctions.isUrlInArray(settings.excludedDomains, tab.url)) {
		   return;
	   }

	   console.log("sending to tab id: " + tabId)
	   try {
		   // Does not work with activeTab permission only.
		   chrome.scripting.insertCSS({
			   target: { tabId: tabId },
			   files: ["title.css"]
		   })
		   .then(() => {console.log("insertCSS done")})
		   .catch((err) => {console.error(err)});
		   chrome.scripting.executeScript({
			   target :  {tabId: tabId, allFrames: true },
			   files : [ "content/dcc-functions.js", "content/dcc-content.js", "gc-content-adapter.js"],
		   })
		   .then(onScriptExecuted)
		   .catch((err) => {console.error(err)});

	   }
	   catch (err) {
		   console.error(`failed to execute script: ${err}`);
		 }

   };
*/


	const tabOnActivated = (tab) => {
		// if new tab, add it
		// if old tab, read state and set icon
		// Where to update state in tabIdStates?
		console.log("chrome.tabs.onActivated handler: tabId = " + tab.tabId + ", windowId = " + tab.windowId);
		// tabIdStates.find(tabIdState => tabIdState === tab.tabId)
		let tabIdState = tabIdStates.find(t => t.tabId === tab.tabId);
		console.log("tabOnActivated tabIdState: " + tabIdState);
		if (!tabIdState) {
			tabIdState = new TabState(tab.tabId, false);
			tabIdStates.push(tabIdState);
			console.log("tabOnActivated Pushed tabIdState to tabIdStates");
		}
		// Set state of icon
		//tabIdState.state;
		// eventAggregator
		// send state to new GcChromeInterface(tabIdState.state);
		aChromeInterface.setButtonStatus(tabIdState.state);

	}

	const watchForPages = () => {
		//console.log("addListener sendSettingsToPage");
		//chrome.tabs.onUpdated.addListener(sendSettingsToPage);
		console.log("addListener tabOnUpdated");
		chrome.tabs.onUpdated.addListener(tabOnUpdated);
		console.log("addListener tabOnActivated");
		chrome.tabs.onActivated.addListener(tabOnActivated);
	};

	/**
	 * aParameters {conversionEnabled: buttonStatus, url: ""}
	 */
	const toggleConversion = (aParameters) => {
		console.log("DCC toggleConversion enabled: " + aParameters.conversionEnabled + ", URL:" + aParameters.url);
		const updateTab = (aTab) => {
			console.log("updateTab " + aTab.id + ", find in tabIdStates: " + tabIdStates[aTab.id]);
			anInformationHolder.conversionEnabled = aParameters.conversionEnabled;
			const makeEnabledStatus = (tabId) => {
				const status = {};
				status.isEnabled = aParameters.conversionEnabled;
				status.hasConvertedElements = false;
				status.url = aParameters.url;
				try {
					sendEnabledStatus(tabId, status);
				}
				catch (err) {
					console.error("ContentInterface: " + err);
				}
				let tabIdState = tabIdStates.find(t => t.tabId === tabId);
				console.log("makeEnabledStatus, tabIdState: " + tabIdState);
				if (tabIdState && tabIdState.state !== status.isEnabled) {
					console.log("makeEnabledStatus Before: " + tabIdState.state);
					tabIdState.state = status.isEnabled;
					console.log("makeEnabledStatus After: " + tabIdState.state);
				}
			};
			makeEnabledStatus(aTab.id);
		};
		const updateActiveTabs = (aTabs) => {
			console.log("updateActiveTabs:" + aTabs);
			aTabs.map(updateTab);
		};
		// Active tab and active window, should only be one tab.
		chrome.tabs.query({ active: true, currentWindow: true }, updateActiveTabs);
	};

	const showQuotesTab = () => {
		const quotesListener = (message, sender, sendResponse) => {
			sendResponse(new Settings(anInformationHolder));
		};
		const quotesCallback = (aTab) => {
			chrome.runtime.onMessage.addListener(quotesListener);
		};
		chrome.tabs.create({ url: chrome.runtime.getURL("quotes.html") }, quotesCallback);
	};

	const showTestTab = () => {
		chrome.tabs.create({ "url": "http://home.aland.net/ma37296-p1/extensions/prices.html" });
	};

	return {
		watchForPages: watchForPages,
		toggleConversion: toggleConversion,
		showQuotesTab: showQuotesTab,
		showTestTab: showTestTab
	}
};

