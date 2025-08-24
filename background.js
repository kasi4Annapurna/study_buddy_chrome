chrome.storage.local.get(["focusModeEnabled"], (data) => {
  const isEnabled = data.focusModeEnabled || false;
  console.log("Focus Mode Status:", isEnabled); // Debugging line

  if (isEnabled) {
    const blockedSites = [
      "facebook.com",
      "instagram.com",
      "youtube.com",
      "reddit.com",
      "twitter.com"
    ];

    chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
      if (changeInfo.url) {
        const url = new URL(changeInfo.url);
        console.log("Navigating to:", url.hostname); // Debugging line
        if (blockedSites.includes(url.hostname)) {
          chrome.tabs.update(tabId, { url: "blocked.html" });
        }
      }
    });
  }
});