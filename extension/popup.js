/**
 * LeetCode Spaced Repetition - Popup Logic
 * 
 * Handles listing due problems and processing revisions.
 */

// Spaced Repetition Schedule (in days)
const SCHEDULE = [1, 3, 7, 21, 45, 90];

// State
let allProblems = [];
let dueList = [];
let upcomingList = [];
let currentTab = 'due'; // 'due' | 'upcoming'

document.addEventListener('DOMContentLoaded', () => {
    setupTabs();
    loadProblems();
});

function setupTabs() {
    const tabDue = document.getElementById('tab-due');
    const tabUpcoming = document.getElementById('tab-upcoming');

    tabDue.addEventListener('click', () => switchTab('due'));
    tabUpcoming.addEventListener('click', () => switchTab('upcoming'));
}

function switchTab(tab) {
    if (currentTab === tab) return;
    currentTab = tab;

    // Update Tab UI
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.getElementById(`tab-${tab}`).classList.add('active');

    render();
}

function loadProblems() {
    chrome.storage.local.get(null, (items) => {
        const now = Date.now();
        let rawDue = [];
        let rawUpcoming = [];

        // 1. Filter and separate problems
        Object.keys(items).forEach(key => {
            if (key.startsWith('problem-')) {
                const problem = items[key];
                // Ensure legacy problems have valid data
                if (!problem.nextRevision) problem.nextRevision = now;

                if (problem.nextRevision <= now) {
                    rawDue.push({ key, ...problem });
                } else {
                    rawUpcoming.push({ key, ...problem });
                }
            }
        });

        // 2. Sort Upcoming by date (soonest first)
        rawUpcoming.sort((a, b) => a.nextRevision - b.nextRevision);
        // Sort Due by date (oldest due first) or priority? Let's do oldest due first.
        rawDue.sort((a, b) => a.nextRevision - b.nextRevision);

        // 3. Ensure "Time to Revise" has at least 5 items if available
        const MIN_ITEMS = 5;
        dueList = [...rawDue];
        upcomingList = [...rawUpcoming];

        if (dueList.length < MIN_ITEMS && upcomingList.length > 0) {
            const needed = MIN_ITEMS - dueList.length;
            const borrowed = upcomingList.slice(0, needed);
            
            // Mark borrowed items visually so user knows they are "early" reviews
            borrowed.forEach(p => p.isEarlyReview = true);
            
            dueList = [...dueList, ...borrowed];
            upcomingList = upcomingList.slice(needed);
        }
        
        // 4. Random Review Logic (Pattern recognition) - Optional/legacy feature
        // If we still have very few items, maybe add a random one? 
        // For now, let's stick to the "fill to 5" logic as it mostly covers the "I want to see more" use case.
        
        render();
    });
}

function render() {
    const listElement = document.getElementById('problem-list');
    const countElement = document.getElementById('due-count');
    listElement.innerHTML = '';

    const listToShow = currentTab === 'due' ? dueList : upcomingList;

    // Update Badge Count (Show count of Due tab always? Or current tab? usually "notifications" implies due)
    // Let's keep the badge showing the "Actionable" count (dueList length).
    countElement.innerText = dueList.length;

    if (listToShow.length === 0) {
        const message = currentTab === 'due' 
            ? 'No revisions due! 🎉<br>Go solve some new problems.' 
            : 'No upcoming problems scheduled.';
        
        listElement.innerHTML = `<div class="empty-state">${message}</div>`;
        return;
    }

    listToShow.forEach(problem => {
        const card = createProblemCard(problem);
        listElement.appendChild(card);
    });
}

function createProblemCard(problem) {
    const div = document.createElement('div');
    div.className = 'problem-card';

    const nextStage = Math.min(problem.stage + 1, SCHEDULE.length - 1);
    const nextInterval = SCHEDULE[nextStage];
    
    // Formatting relative time
    const now = Date.now();
    const diffHours = (problem.nextRevision - now) / (1000 * 60 * 60);
    const diffDays = Math.ceil(diffHours / 24);
    
    let timeText = '';
    if (problem.nextRevision <= now) {
        timeText = 'Due Now';
    } else if (diffDays <= 0) {
        timeText = 'Today';
    } else {
        timeText = `in ${diffDays}d`;
    }

    let extraTag = '';
    if (problem.isEarlyReview) {
        extraTag = '<span style="font-size:10px;color:#f59e0b;background:#fffbeb;padding:2px 4px;border-radius:4px;">Early Review</span>';
    } else if (problem.isRandomReview) {
        extraTag = '<span style="font-size:10px;color:#9b59b6">Random Review</span>';
    }

    div.innerHTML = `
    <div class="problem-header">
      <div style="display:flex;gap:4px;align-items:center;">
          <span class="difficulty ${problem.difficulty}">${problem.difficulty}</span>
          ${extraTag}
      </div>
      <span style="font-size:10px;color:#888;">${timeText}</span>
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
        // Early reviews just push the schedule forward as if done normally
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
