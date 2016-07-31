/*
 * StackExchangeNotifications 0.1.3
 * Copyright (c) 2016 Guilherme Nascimento (brcontainer@yahoo.com.br)
 * Released under the MIT license
 *
 * https://github.com/brcontainer/stack-exchange-notification
 */

(function() {
    window.onload = function()
    {
        chrome.tabs.query({ "active": true, "currentWindow": true}, function(tabs) {
            var tabId = tabs[0] && tabs[0].id ? tabs[0].id : false;

            if (tabId) {
                chrome.runtime.sendMessage({
                    "type": "get",
                    "id": tabId
                }, function(response) {
                    console.log(response);
                });
            }
        });
    };
})();
