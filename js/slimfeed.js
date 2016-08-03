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

            chrome.tabs.query({ "url": uri }, function(tabs) {
                if (tabs.length) {
                    chrome.tabs.update(tabs[0].id, {active: true});
                } else {
                    chrome.tabs.create({ "url": uri });
                }
            });

            return uri;
        }
    };
}());
