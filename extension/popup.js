/**
 * LeetCode Spaced Repetition - Popup Logic
 * 
 * Handles listing due problems and processing revisions.
 */

// Spaced Repetition Schedule (in days)
const SCHEDULE = [1, 3, 7, 21, 45, 90];

document.addEventListener('DOMContentLoaded', () => {
  loadProblems();
});

function loadProblems() {
  chrome.storage.local.get(null, (items) => {
    const listElement = document.getElementById('problem-list');
    const countElement = document.getElementById('due-count');
    listElement.innerHTML = '';
    
    const now = Date.now();
    let dueProblems = [];
    let randomProblems = [];
    
    // 1. Filter problems
    Object.keys(items).forEach(key => {
      if (key.startsWith('problem-')) {
        const problem = items[key];
        if (problem.nextRevision <= now) {
          dueProblems.push({ key, ...problem });
        } else {
          // Collect for random sampling
          randomProblems.push({ key, ...problem });
        }
      }
    });
    
    // 2. Add Logic to include random past problems (Pattern recognition)
    // Try to include 1 random review if we have < 3 due items
    if (dueProblems.length < 3 && randomProblems.length > 0) {
      const randomIndex = Math.floor(Math.random() * randomProblems.length);
      const randomProb = randomProblems[randomIndex];
      randomProb.isRandomReview = true; // Flag for UI
      dueProblems.push(randomProb);
    }

    // 3. Sort by difficulty (Easy first) or Date
    dueProblems.sort((a, b) => a.nextRevision - b.nextRevision);

    // 4. Update UI
    countElement.innerText = dueProblems.length;

    if (dueProblems.length === 0) {
      listElement.innerHTML = '<div class="empty-state">No revisions due! 🎉<br>Go solve some new problems.</div>';
      return;
    }

    dueProblems.forEach(problem => {
      const card = createProblemCard(problem);
      listElement.appendChild(card);
    });
  });
}

function createProblemCard(problem) {
  const div = document.createElement('div');
  div.className = 'problem-card';
  
  const nextStage = Math.min(problem.stage + 1, SCHEDULE.length - 1);
  const nextInterval = SCHEDULE[nextStage];
  
  div.innerHTML = `
    <div class="problem-header">
      <span class="difficulty ${problem.difficulty}">${problem.difficulty}</span>
      ${problem.isRandomReview ? '<span style="font-size:10px;color:#9b59b6">Random Review</span>' : ''}
    </div>
    <a href="${problem.url}" target="_blank" class="problem-title">${problem.title}</a>
    <div class="meta-info">
      Stage ${problem.stage} &rarr; ${nextStage} (Next: ${nextInterval}d)
    </div>
    <div class="actions">
      <button class="btn-revise">Mark Revised</button>
    </div>
  `;

  div.querySelector('.btn-revise').addEventListener('click', () => {
    handleRevise(problem);
  });

  return div;
}

function handleRevise(problem) {
  const newStage = problem.stage + 1;
  const daysToAdd = SCHEDULE[Math.min(newStage, SCHEDULE.length - 1)] || 90;
  
  const updates = {
    stage: newStage,
    dateSolved: Date.now(), // Update last solved/revised date
    nextRevision: Date.now() + (daysToAdd * 24 * 60 * 60 * 1000),
    // If it was a random review, we essentially treat it as a successful revision step
  };

  chrome.storage.local.get([problem.key], (result) => {
    if (result[problem.key]) {
      const updatedProblem = { ...result[problem.key], ...updates };
      chrome.storage.local.set({ [problem.key]: updatedProblem }, () => {
        // Refresh UI
        loadProblems();
        
        // Notify Background to update badge
        chrome.runtime.sendMessage({ type: 'UPDATE_BADGE' });
      });
    }
  });
}
