// background.js

let time = 1500; // Default to 25 minutes
let timer;
let isRunning = false;
let mode = 'pomodoro';

// Start the timer
function startTimer() {
  if (isRunning) return;

  isRunning = true;
  chrome.storage.local.set({ isRunning, time });

  timer = setInterval(() => {
    if (time > 0) {
      time--;
      chrome.storage.local.set({ time });
    } else {
      clearInterval(timer);
      isRunning = false;
      chrome.storage.local.set({ isRunning });
      chrome.runtime.sendMessage({ type: 'timerComplete' });
    }
  }, 1000);
}

// Stop the timer
function stopTimer() {
  clearInterval(timer);
  isRunning = false;
  chrome.storage.local.set({ isRunning });
}

// Reset the timer based on the mode
function resetTimer(newMode) {
  mode = newMode;
  time = mode === 'pomodoro' ? 1500 : mode === 'shortBreak' ? 30 : 900;
  chrome.storage.local.set({ time, isRunning: false });
  clearInterval(timer);
  isRunning = false;
}

// Listen for messages from popup.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'startStop') {
    isRunning ? stopTimer() : startTimer();
  } else if (message.type === 'setMode') {
    resetTimer(message.mode);
  } else if (message.type === 'getStatus') {
    sendResponse({ time, isRunning, mode });
  }
});
