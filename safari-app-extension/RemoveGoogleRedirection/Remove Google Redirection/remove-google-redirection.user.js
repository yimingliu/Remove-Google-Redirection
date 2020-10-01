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
     
        function fixUpSERP()
        {
         String.prototype.trunc =
           function(n){
               return this.substr(0,n-1)+(this.length>n?'...':'');
           };
          var results = document.querySelectorAll("div.g");
          var i;
          for (i=0; i < results.length; i++)
          {
              var result = results[i];
              var cite_link = result.querySelector("cite.iUh30");
              var title_link = result.querySelector("h3.LC20lb");
              var br_node = null;
              var action_node = result.querySelector("div.eFM0qc, div.yWc32e");
              var img_node = result.querySelector("img.xA33Gc");
              var cite_container_node = result.querySelector("div.NJjxre");
              if (cite_container_node)
              {
                  cite_container_node.setAttribute('style', 'position: relative !important');
              }
              var real_link = result.querySelector("a");
              if (img_node)
              {
                  img_node.setAttribute('style', 'display: None !important');
              }
              if (cite_link)
              {
                  cite_link.setAttribute('style', 'color: #006621 !important');
                  if (real_link)
                  {
                      cite_link.textContent = real_link.getAttribute("href");
                      if (cite_link.textContent)
                      {
                          cite_link.textContent = cite_link.textContent.trunc(80);
                      }
                  }
                  //cite_link.textContent = cite_link.textContent.replace(/ › /g, "/");
                  br_node = cite_link.parentNode.parentNode.querySelector("br");
                  if(action_node)
                  {

                      var action_span = action_node.querySelector("span");
                      if (action_span)
                      {
                          var arrow_span = action_span.querySelector("span.mn-dwn-arw");
                          if (arrow_span)
                            arrow_span.setAttribute('style', 'color: #006621 !important');
                          //cite_link.parentNode.appendChild(action_span);
                      }
                     var link_div = result.querySelector("div.B6fmyf");
                     link_div.parentNode.insertBefore(action_node, link_div);
                  }
              }
              if (title_link)
              {

                  if(br_node)
                  {
                      title_link.parentNode.appendChild(br_node);
                  }
                  title_link.parentNode.appendChild(cite_link.parentNode);
              }
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
     
             if (preferences.restoreOldSERP)
             {
                fixUpSERP();
             }
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
