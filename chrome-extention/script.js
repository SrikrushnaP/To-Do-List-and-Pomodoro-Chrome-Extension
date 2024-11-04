// Select elements
const timerDisplay = document.getElementById('timer');
const startStopButton = document.getElementById('startStopButton');
const modeButtons = document.querySelectorAll('.mode');
const completeSound = new Audio('complete-sound-dot.mp3');

// Update Timer Display
function updateTimerDisplay(minutes, seconds) {
  timerDisplay.textContent = `${minutes}:${seconds}`;
}

// Format the time
function formatTime(timeInSeconds) {
  const minutes = Math.floor(timeInSeconds / 60).toString().padStart(2, '0');
  const seconds = (timeInSeconds % 60).toString().padStart(2, '0');
  return { minutes, seconds };
}

// Toggle timer start/stop
function toggleTimer() {
  chrome.runtime.sendMessage({ type: 'startStop' });
}

// Set mode (Pomodoro, Short Break, Long Break)
function setMode(newMode) {
  chrome.runtime.sendMessage({ type: 'setMode', mode: newMode });
  modeButtons.forEach(button => button.classList.remove('active'));
  document.getElementById(newMode).classList.add('active');
}

// Request status from background on load
chrome.runtime.sendMessage({ type: 'getStatus' }, (response) => {
  if (response) {
    const { minutes, seconds } = formatTime(response.time);
    updateTimerDisplay(minutes, seconds);
    startStopButton.textContent = response.isRunning ? 'PAUSE' : 'START';
    modeButtons.forEach(button => {
      if (button.id === response.mode) button.classList.add('active');
    });
  }
});

// Update UI when timer completes
chrome.runtime.onMessage.addListener((message) => {
  if (message.type === 'timerComplete') {
    startStopButton.textContent = 'START';
    // alert("Time's up!"); // Play sound or show notification as needed
    completeSound.play();
  }
});

// Event listeners
startStopButton.addEventListener('click', toggleTimer);
modeButtons.forEach(button => {
  button.addEventListener('click', () => setMode(button.id));
});

// Periodically update UI to show the current timer value
setInterval(() => {
  chrome.storage.local.get(['time', 'isRunning'], (result) => {
    if (result.time !== undefined) {
      const { minutes, seconds } = formatTime(result.time);
      updateTimerDisplay(minutes, seconds);
      startStopButton.textContent = result.isRunning ? 'PAUSE' : 'START';
    }
  });
}, 1000);
