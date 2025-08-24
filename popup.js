const startButton = document.getElementById('startStudy');
const statusText = document.getElementById('status');

// List of sites to block
const BLOCKED_SITES = [
  "youtube.com",
  "instagram.com",
  "facebook.com",
  "twitter.com",
  "x.com"
];

// Rule IDs for declarativeNetRequest
const RULE_IDS = [1, 2, 3, 4, 5];

// Update UI on load
chrome.storage.local.get(['studyEndTime'], (result) => {
  if (result.studyEndTime && Date.now() < result.studyEndTime) {
    const timeLeft = Math.ceil((result.studyEndTime - Date.now()) / 60000);
    startButton.disabled = true;
    startButton.textContent = `Studying... (${timeLeft} min left)`;
    statusText.textContent = "Study mode active!";
  } else {
    startButton.disabled = false;
    startButton.textContent = "Study Now (50 min)";
    statusText.textContent = "Ready to study?";
  }
});

// Start study session
startButton.addEventListener('click', async () => {
  const studyMinutes = 50;
  const endTime = Date.now() + studyMinutes * 60 * 1000;

  // Add redirect rules to block sites
  await chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: RULE_IDS,
    addRules: BLOCKED_SITES.map((site, index) => ({
      id: index + 1,
      priority: 1,
      action: {
        type: "redirect",
        redirect: { url: "https://www.google.com/search?q=" + encodeURIComponent(`Why are you distracted? Get back to studying!`) }
      },
      condition: {
        urlFilter: `*://*.${site}/*`,
        resourceTypes: ["main_frame"]
      }
    }))
  });

  // Save end time
  await chrome.storage.local.set({ studyEndTime: endTime });

  // Update UI
  startButton.disabled = true;
  startButton.textContent = `Studying... (50 min)`;
  statusText.textContent = "Study mode started!";

  // Update button every minute
  const interval = setInterval(() => {
    chrome.storage.local.get(['studyEndTime'], (res) => {
      if (!res.studyEndTime || Date.now() >= res.studyEndTime) {
        clearInterval(interval);
        resetExtension();
      } else {
        const timeLeft = Math.ceil((res.studyEndTime - Date.now()) / 60000);
        startButton.textContent = `Studying... (${timeLeft} min left)`;
      }
    });
  }, 1000);
});

// Reset extension when study ends
function resetExtension() {
  chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: RULE_IDS
  });
  chrome.storage.local.remove(['studyEndTime']);
  startButton.disabled = false;
  startButton.textContent = "Study Now (50 min)";
  statusText.textContent = "Ready to study?";
}

// Check if study session is still active on popup open
chrome.storage.local.get(['studyEndTime'], (result) => {
  if (result.studyEndTime && Date.now() < result.studyEndTime) {
    const timeLeft = Math.ceil((result.studyEndTime - Date.now()) / 60000);
    startButton.disabled = true;
    startButton.textContent = `Studying... (${timeLeft} min left)`;
    statusText.textContent = "Study mode active!";
  } else {
    resetExtension();
  }
});
