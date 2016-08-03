/*
 * StackExchangeNotifications 0.1.3
 * Copyright (c) 2016 Guilherme Nascimento (brcontainer@yahoo.com.br)
 * Released under the MIT license
 *
 * https://github.com/brcontainer/stack-exchange-notification
 */

(function() {
    "use strict";

    var allFeeds = {};

    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
        switch (request.type) {
            case "update":
                if (request.items && request.items.length) {
                    chrome.browserAction.setIcon({
                        "tabId": sender.tab.id,
                        "path": "images/active.png"
                    });
                }

                if (request.items) {
                    allFeeds["tab_" + sender.tab.id] = request.items;
                }
            break;

            case "get":
                if (request.id && allFeeds["tab_" + request.id]) {
                    sendResponse(allFeeds["tab_" + request.id]);
                } else {
                    sendResponse([]);
                }
            break;
        }
    });

    function handleHeaders(details)
    {
        //console.log(details.responseHeaders, details.url);
    }

    chrome.webRequest.onHeadersReceived.addListener(handleHeaders, {
        "urls":  [ "https://*/*", "http://*/*" ],
        "types": [ "main_frame" ]
    }, [ "responseHeaders", "blocking" ]);
})();
