/*
 * StackExchangeNotifications 0.1.3
 * Copyright (c) 2016 Guilherme Nascimento (brcontainer@yahoo.com.br)
 * Released under the MIT license
 *
 * https://github.com/brcontainer/stack-exchange-notification
 */

(function() {
    "use strict";

    var
        tpl,
        mainContent,
        debugMode,
        isDone;

    if ("update_url" in chrome.runtime.getManifest()) {
        debugMode = false;
    }

    function FF() {
        if (!debugMode) {
            (evt || window.event).preventDefault();
            return false;
        }
    }

    function setLinkEvents(target) {
        var els = target.getElementsByTagName("a");

        for (var i = 0, j = els.length; i < j; i++) {
            setActionAnchor(els[i]);
        }
    }

    function setActionAnchor(el) {
        if (el.senLink) {
            return;
        }

        el.senLink = true;

        el.addEventListener("click", function(evt) {
            (evt || window.event).preventDefault();
        });

        el.addEventListener("dragstart", FF);
    }

    function populateView(data)
    {
        var d = tpl,
            view = document.createElement("div");

        view.innerHTML = d;
        view = view.firstElementChild;

        setLinkEvents(view);

        mainContent.appendChild(view);
    }

    function getData(tpl)
    {
        chrome.tabs.query({ "active": true, "currentWindow": true }, function(tabs) {
            var tabId = tabs[0] && tabs[0].id ? tabs[0].id : false;

            if (tabId) {
                chrome.runtime.sendMessage({
                    "type": "get",
                    "id": tabId
                }, function (response) {
                    var size = response.length;

                    if (size <= 0) {
                        return;
                    }

                    mainContent.innerHTML = "";

                    response = response.reverse();

                    for (var i = size - 1; i >= 0; i--) {
                        populateView(response[i]);
                        populateView(response[i]);
                    }
                });
            }
        });
    }

    function loadTemplate()
    {
        if (tpl) {
            getData();
            return;
        }

        var
            xhr = new XMLHttpRequest(),
            uri = chrome.extension.getURL("/view/item.tpl.html");

        xhr.open("GET", uri, true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                tpl = xhr.responseText;

                getData();
            }
        };

        xhr.send(null);
    }

    function headerEvents()
    {
        //var about   = document.getElementById("about");
        var options = document.getElementById("options");

        if (options) {
            options.addEventListener("click", function () {
                SlimFeed.openOrUpdate("view/options.html");
            }, false);
        }
    }

    function footerEvents()
    {
        var show = document.getElementById("show-subscriptions");

        if (show) {
            show.addEventListener("click", function () {
                SlimFeed.openOrUpdate("view/subscriptions.html");
            }, false);
        }
    }

    function mainPopup() {
        if (isDone) {
            return;
        }

        isDone = true;

        mainContent = document.querySelector(".main");

        headerEvents();

        footerEvents();

        loadTemplate();
    }

    if (/^(interactive|complete)$/.test(document.readyState)) {
        mainPopup();
    } else {
        document.addEventListener("DOMContentLoaded", mainPopup);
        window.addEventListener("onload", mainPopup);
    }
})();
