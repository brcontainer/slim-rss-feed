/*
 * StackExchangeNotifications 0.1.3
 * Copyright (c) 2016 Guilherme Nascimento (brcontainer@yahoo.com.br)
 * Released under the MIT license
 *
 * https://github.com/brcontainer/stack-exchange-notification
 */

(function() {
    "use strict";

    var isAlternate = /(^|\s)alternate($|\s)/i;
    var isHttp      = /^http(|s)\:\/\/[a-z0-9]/i;
    var isRss       = /^application\/(atom|rss)\+xml$/i;
    var feeds       = [];
    var timer;

    function updateList()
    {
        if (feeds.length > 0 && chrome.runtime && chrome.runtime.sendMessage) {
            chrome.runtime.sendMessage({
                "type": "update",
                "items": feeds
            }, function(response) {});
        }
    }

    function addIfValid(link)
    {
        if (
            isHttp.test(link.href) &&
            isRss.test(link.type) &&
            isAlternate.test(link.rel) &&
            feeds.indexOf(link.href) === -1
        ) {
            feeds.push(String(link.href));
        }
    }

    function findFeeds()
    {
        var links = Array.prototype.slice.call(document.querySelectorAll("link"));

        links = links.reverse();

        for (var i = links.length - 1; i >= 0; i--) {
            addIfValid(links[i]);
        }

        updateList();
    }

    function trigger()
    {
        if (timer) {
            clearTimeout(timer);
        }

        timer = setTimeout(findFeeds, 100);
    }

    function init()
    {
        setTimeout(trigger, 1);

        var observer = new MutationObserver(function(mutations) {
            mutations.forEach(function (mutation) {
                var el = mutation.target;

                if (el && el.tagName === "LINK") {
                    setTimeout(trigger, 100);
                }
            });
        });

        observer.observe(document, {
            "attributes": true,
            "childList": true,
            "subtree": true
        });
    }

    if (/interactive|complete/i.test(document.readyState)) {
        init();
    } else {
        document.addEventListener("DOMContentLoaded", init);
        window.addEventListener("onload", init);
    }
})();
