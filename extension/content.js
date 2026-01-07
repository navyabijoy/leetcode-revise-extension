/**
 * LeetCode Spaced Repetition - Content Script
 * 
 * Responsibilities:
 * 1. Detect when a user is on a problem page.
 * 2. Observe the DOM for a successful submission (Accepted).
 * 3. Extract problem details (Title, URL, Difficulty).
 * 4. Save the problem to chrome.storage.local with Stage 0.
 */

console.log("LeetCode Spaced Repetition: Content script loaded.");

// Selectors for LeetCode's dynamic DOM (Note: These can change, ideally we'd use more robust methods)
// As of 2025, LeetCode uses React with some dynamic classes.
// We look for specific text or data attributes.

const SELECTORS = {
  // The 'Accepted' text usually appears in a specific container after submission
  submissionResult: '[data-e2e-locator="submission-result"]', 
  successClass: 'text-green-s dark:text-dark-green-s', // Often used for "Accepted" text
  
  // Problem title is usually in the top left area
  title: '[data-cy="question-title"]', 
  
  // Difficulty is often a colored tag
  difficultyEasy: 'text-difficulty-easy',
  difficultyMedium: 'text-difficulty-medium',
  difficultyHard: 'text-difficulty-hard'
};

function getDifficulty() {
  const easy = document.querySelector(`.${SELECTORS.difficultyEasy}`);
  if (easy) return 'Easy';
  const medium = document.querySelector(`.${SELECTORS.difficultyMedium}`);
  if (medium) return 'Medium';
  const hard = document.querySelector(`.${SELECTORS.difficultyHard}`);
  if (hard) return 'Hard';
  return 'Unknown';
}

function getProblemData() {
  const titleElement = document.querySelector(SELECTORS.title); // Or document.title
  // Fallback to parsing document title "Two Sum - LeetCode"
  let title = titleElement ? titleElement.innerText : document.title.split(' - ')[0];
  
  const url = window.location.href.split('/submissions')[0]; // Clean URL
  const difficulty = getDifficulty();
  
  return {
    title,
    url,
    difficulty,
    dateSolved: Date.now(),
    stage: 0,
    nextRevision: Date.now() + (24 * 60 * 60 * 1000) // +1 day initially
  };
}

function handleSuccess() {
  const problemData = getProblemData();
  
  console.log("Problem Solved!", problemData);
  
  // Save to storage
  // Key format: "problem-[slug]" to avoid collisions
  // Extract slug from URL: leetcode.com/problems/two-sum/ -> two-sum
  const slug = problemData.url.match(/problems\/([^/]+)/)?.[1] || problemData.title;
  const key = `problem-${slug}`;
  
  chrome.storage.local.get([key], (result) => {
    if (result[key]) {
      console.log("Problem already tracked. Ignoring to preserve revision schedule.");
      // Optional: Update 'lastSolved' but keep 'stage' if we want to track history
    } else {
      chrome.storage.local.set({ [key]: problemData }, () => {
        console.log("Problem saved to spaced repetition list.");
        // Optional: Show a toast notification
        showToast("Problem added to Revision Schedule! 📅");
      });
    }
  });
}

// Observe DOM for changes to detect submission
const observer = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    if (mutation.type === 'childList') {
      // Check for "Accepted" or success indicators
      const successElement = document.body.innerText.includes("Accepted");
      // Note: Checking innerText of body is expensive. Better to check specific containers.
      // But LeetCode structure is complex. Let's try to find the specific "Accepted" header.
      
      const resultHeader = document.querySelector('[data-e2e-locator="submission-result"]');
      if (resultHeader && resultHeader.innerText.includes("Accepted")) {
        // Debounce or ensure we only run once per submission
        if (!resultHeader.dataset.processed) {
          resultHeader.dataset.processed = "true";
          handleSuccess();
        }
      }
    }
  }
});

// Start observing
observer.observe(document.body, { childList: true, subtree: true });

function showToast(message) {
  const toast = document.createElement("div");
  toast.innerText = message;
  toast.style.position = "fixed";
  toast.style.bottom = "20px";
  toast.style.right = "20px";
  toast.style.backgroundColor = "#2ecc71";
  toast.style.color = "white";
  toast.style.padding = "10px 20px";
  toast.style.borderRadius = "5px";
  toast.style.zIndex = "9999";
  toast.style.boxShadow = "0 2px 10px rgba(0,0,0,0.2)";
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}
