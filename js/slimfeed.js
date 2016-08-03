/*
 * StackExchangeNotifications 0.1.3
 * Copyright (c) 2016 Guilherme Nascimento (brcontainer@yahoo.com.br)
 * Released under the MIT license
 *
 * https://github.com/brcontainer/stack-exchange-notification
 */

(function() {
    "use strict";

    window.SlimFeed = {
        "openOrUpdate": function(url)
        {
            var uri = chrome.extension.getURL(url);

            chrome.tabs.query({}, function(tabs) {
                var tabId;

                if (tabs && tabs.length) {
                    for (var i = tabs.length - 1; i >= 0; i--) {
                        if (tabs[i].url === uri) {
                            tabId = tabs[i].id;
                            break;
                        }
                    }
                }

                if (tabId) {
                    chrome.tabs.update(tabId, { "active": true });
                } else {
                    chrome.tabs.create({ "url": uri });
                }
            });

            return uri;
        }
    };
}());
