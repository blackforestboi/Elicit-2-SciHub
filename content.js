document.addEventListener(
  "click",
  function (event) {
    setTimeout(function () {
      if (
        (event.target?.classList?.contains("rounded-full") &&
          event.target?.innerText?.trim() === "DOI") ||
        event.target?.innerText?.trim() === "DOI" ||
        event.target.parentNode.firstChild.innerText === "DOI"
      ) {
        navigator.clipboard.readText().then((clipText) => {
          console.log("clipText: ", clipText);
          chrome.runtime.sendMessage({
            text: "copyDetected",
            copiedText: clipText,
          });
        });
      }
    }, 100); // Delay to ensure clipboard content is updated
  },
  true
);

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  // Check if the changeInfo has a url property, indicating the URL has changed
  console.log("changeInfo.url: ", changeInfo);

  if (changeInfo.url) {
    console.log("Page URL changed to: " + changeInfo.url);
  }
});

// Injected script to listen for History API changes
const scriptContent = `
  (function(history){
    var pushState = history.pushState;
    var replaceState = history.replaceState;

    history.pushState = function(state) {
      if (typeof history.onpushstate == "function") {
        history.onpushstate({state: state});
      }
      // Call the original function
      return pushState.apply(history, arguments);
    };

    history.replaceState = function(state) {
      if (typeof history.onreplacestate == "function") {
        history.onreplacestate({state: state});
      }
      // Call the original function
      return replaceState.apply(history, arguments);
    };

    window.addEventListener('popstate', function(event) {
      // Handle popstate event if needed
    });

    history.onpushstate = history.onreplacestate = function(e) {
      // Communicate the URL change to your extension
      window.dispatchEvent(new CustomEvent('HistoryChange', {detail: {url: location.href}}));
    };
  })(window.history);
`;

// Inject the script content into the page
const script = document.createElement("script");
script.textContent = scriptContent;
(document.head || document.documentElement).appendChild(script);
script.remove();

// Listen for the custom event from the injected script
window.addEventListener("HistoryChange", function (e) {
  console.log("History API URL changed to: ", e.detail.url);
  // Here you can send message back to your extension if needed
});
