/*
 * StackExchangeNotifications 0.1.3
 * Copyright (c) 2016 Guilherme Nascimento (brcontainer@yahoo.com.br)
 * Released under the MIT license
 *
 * https://github.com/brcontainer/stack-exchange-notification
 */

(function() {
    var allFeeds = {};

    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
        if (request.type === "update" && request.items && request.items.length) {
            //chrome.pageAction.show(sender.tab.id);

            chrome.browserAction.setIcon({
                "tabId": sender.tab.id,
                "path": "images/active.png"
            });

            allFeeds["tab_" + sender.tab.id] = request.items;
        } else if (request.type === "get" && request.id && allFeeds["tab_" + request.id]) {
            sendResponse(allFeeds["tab_" + request.id]);
        }
    });

    function handleHeaders(details)
    {
        console.log(details.responseHeaders, details.url);
    }

    chrome.webRequest.onHeadersReceived.addListener(handleHeaders, {
        urls: ['https://*/*', 'http://*/*'],
        types: ['main_frame']
    },
    ['responseHeaders', 'blocking']);
})();
