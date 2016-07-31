/*
 * StackExchangeNotifications 0.1.3
 * Copyright (c) 2016 Guilherme Nascimento (brcontainer@yahoo.com.br)
 * Released under the MIT license
 *
 * https://github.com/brcontainer/stack-exchange-notification
 */

(function() {
    var
        tpl, mainContent;

    function populateView(data)
    {
        var d = tpl,
            view = document.createElement("div");

        view.innerHTML = d;
        view = view.firstElementChild;

        mainContent.appendChild(view);
    }

    function getData(tpl)
    {
        chrome.tabs.query({ "active": true, "currentWindow": true}, function(tabs) {
            var tabId = tabs[0] && tabs[0].id ? tabs[0].id : false;

            if (tabId) {
                chrome.runtime.sendMessage({
                    "type": "get",
                    "id": tabId
                }, function (response) {
                    response = response.reverse();

                    for (var i = response.length - 1; i >= 0; i--) {
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

    window.onload = function() {
        mainContent = document.querySelector(".main");
        loadTemplate();
    };
})();
