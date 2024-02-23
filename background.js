chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  // Regular expression to match the DOI format
  const doiRegex = /^\d{2}\.\d{4}\/.+/;

  if (request.copiedText.startsWith("https://doi.org/")) {
    request.copiedText = request.copiedText.replace("https://doi.org/", "");
  }

  if (doiRegex.test(request.copiedText)) {
    // If the request text matches the DOI format, append it to the sci-hub URL
    const sciHubUrl = "https://sci-hub.se/" + request.copiedText;
    chrome.tabs.create({ url: sciHubUrl });
  }
});
