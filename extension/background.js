// Service worker for background tasks
// Currently minimal, but can be used for daily notifications or badge updates.

chrome.runtime.onInstalled.addListener(() => {
  console.log("LeetCode Spaced Repetition Extension Installed");
});

// Calculate badge text (number of due items)
function updateBadge() {
  chrome.storage.local.get(null, (items) => {
    const now = Date.now();
    let dueCount = 0;
    
    Object.keys(items).forEach(key => {
      if (key.startsWith('problem-')) {
        const problem = items[key];
        if (problem.nextRevision <= now) {
          dueCount++;
        }
      }
    });

    if (dueCount > 0) {
      chrome.action.setBadgeText({ text: dueCount.toString() });
      chrome.action.setBadgeBackgroundColor({ color: "#FF5252" });
    } else {
      chrome.action.setBadgeText({ text: "" });
    }
  });
}

// Update badge on startup and every hour
updateBadge();
setInterval(updateBadge, 60 * 60 * 1000);

// Listen for storage changes to update badge immediately
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'local') {
    updateBadge();
  }
});
