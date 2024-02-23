document.addEventListener(
  "click",
  function (event) {
    setTimeout(function () {
      if (
        (event.target.classList.contains("rounded-full") &&
          event.target.innerText.trim() === "DOI") ||
        event.target.innerText.trim() === "DOI"
      ) {
        navigator.clipboard.readText().then((clipText) => {
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
