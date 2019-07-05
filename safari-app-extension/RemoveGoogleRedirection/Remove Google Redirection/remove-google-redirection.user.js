/*
 * Name: Remove Google Redirection
 *
 * Description:
 *
 * Prohibit click-tracking, and prevent url redirection when clicks on the
 * result links in Google search page.
 */

/*
 * Let the user scripts or content scripts running in an annoymous function,
 * that is more safer.
 */
document.addEventListener("DOMContentLoaded", function(event) {
    (function(window) {
        "use strict";
     
        var preferences = {};

        /*
         * Inject the function into current document and run it
         */
        function injectFunction(func) {
            var ele = document.createElement('script');
            var s = document.getElementsByTagName('script')[0];

            ele.type = 'text/javascript';
            ele.textContent = '(' + func + ')();';

            s.parentNode.insertBefore(ele, s);
        }

        /*
         * Disable the url rewrite function
         */
        function disableURLRewrite() {
            function inject_init() {
                /* Define the url rewrite function */
                Object.defineProperty(window, 'rwt', {
                    value: function() {
                        return true;
                    },
                    writable: false, // set the property to read-only
                    configurable: false
                });
            }

            injectFunction(inject_init);
        }

        /*
         * Clean the link, no track and no url redirection
         */
        function cleanTheLink(a) {
            if (a.dataset['cleaned'] == 1) // Already cleaned
                return;

            /* Set clean flag */
            var need_clean = false;

            /* Find the original url */

            var result = "";
            if (a.pathname && (a.pathname.startsWith("/imgres") || a.pathname.startsWith("imgres"))) {
                // the bug is because the regex is picking up the last q= parameter in /imgres results.  the quickest hack around this is to separate out img vs normal query parsing
                if (!preferences.disableForImages)
                    result = /\/(?:imgres).*[&?](?:imgurl)=([^&]+)/i.exec(a.href);
                else
                    console.log("Did not rewrite; user disabled");
            } else {
                result = /\/(?:url|imgres).*[&?](?:url|q|imgurl)=([^&]+)/i.exec(a.href);

            }
            // try to url-decode an encoded component to workaround broken homepage links

            if (result && result[1].indexOf('%') != -1 && result[1].indexOf('webcache.googleusercontent.com') == -1) {
                result[1] = decodeURIComponent(result[1]);
            }
            //        console.log("result", result);

            if (result) {
                need_clean = true;
                a.href = result[1]; // Restore url to original one
            }

            /* Remove the onmousedown attribute if found */
            var val = a.getAttribute('onmousedown') || '';

            if (val.indexOf('return rwt(') != -1) {
                need_clean = true;
                a.removeAttribute('onmousedown');
            }

            /* FIXME: check the link class name */
            var cls = a.className || '';

            if (cls.indexOf('irc_') != -1) need_clean = true;

            /*
             * Remove all event listener added to this link
             */
            if (need_clean) {
                var clone = a.cloneNode(true);
                a.parentNode.replaceChild(clone, a);
                clone.dataset['cleaned'] = 1;
            }
        }

        /*
         * The main entry
         */
        function main() {
            disableURLRewrite();

            document.addEventListener('mouseover', function(event) {
                var a = event.target,
                    depth = 1;

                /* Found the target link, and try to clean it */
                while (a && a.tagName != 'A' && depth-- > 0)
                    a = a.parentNode;

                if (a && a.tagName == 'A')
                    cleanTheLink(a);
            }, true);
        }

        function handleExtensionMessage(msg_event) {
            console.log("Received message event", msg_event)
            if (window.top === window) {
                if (msg_event.name === "got-preferences") {
                    preferences = msg_event.message;
                    main();
                }
            }
        }

        safari.self.addEventListener("message", handleExtensionMessage);

        safari.extension.dispatchMessage("get-preferences",{});
    })(window);

});
