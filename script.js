// Select elements
const timerDisplay = document.getElementById('timer');
const startStopButton = document.getElementById('startStopButton');
const modeButtons = document.querySelectorAll('.mode');
const taskInput = document.getElementById('taskInput');
const addTaskButton = document.getElementById('addTaskButton');
const tasksList = document.getElementById('tasks');
const completeSound = new Audio('complete-sound-dot.mp3');

// Default timer values
let time = 1500; // 25 minutes in seconds
let timer;
let isRunning = false;
let mode = 'pomodoro';
let taskToEdit = null; // Variable to keep track of the task being edited

// Update Timer Display
function updateTimerDisplay() {
  const minutes = Math.floor(time / 60).toString().padStart(2, '0');
  const seconds = (time % 60).toString().padStart(2, '0');
  timerDisplay.textContent = `${minutes}:${seconds}`;
}

// Start and Stop Timer
function toggleTimer() {
  if (isRunning) {
    clearInterval(timer);
    startStopButton.textContent = 'START';
  } else {
    timer = setInterval(() => {
      if (time > 0) {
        time--;
        updateTimerDisplay();
      } else {
        clearInterval(timer);
        // alert("Time's up!");
        completeSound.play();
        startStopButton.textContent = 'START';
      }
    }, 1000);
    startStopButton.textContent = 'PAUSE';
  }
  isRunning = !isRunning;
}

// Reset Timer based on mode
function setMode(newMode) {
  mode = newMode;
  time = mode === 'pomodoro' ? 1500 : mode === 'shortBreak' ? 300 : 900;
  updateTimerDisplay();
  startStopButton.textContent = 'START';
  isRunning = false;
  clearInterval(timer);
  modeButtons.forEach(button => button.classList.remove('active'));
  document.getElementById(newMode).classList.add('active');
}


// Function to handle button clicks
function handleButtonClick(event) {
    const selectedTimer = event.target.getAttribute('data-value');
    // Display the selected value in an alert
    time = selectedTimer*60;
    updateTimerDisplay();
    isRunning = false;
    clearInterval(timer);
    startStopButton.textContent = 'START';
    
    // Highlight the selected option
    const timerOptions = document.querySelectorAll('.timer-option');
    timerOptions.forEach(opt => opt.classList.remove('selected')); // Remove selected class from all options
    event.target.classList.add('selected'); // Add selected class to the clicked option
}


// Adding event listeners after the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.timer-option');
    buttons.forEach(button => {
        button.addEventListener('click', handleButtonClick);
    });
});





// Add or Update Task in List
function handleTaskAction() {
  const taskText = taskInput.value.trim();
  
  if (taskText) {
    if (taskToEdit) {
      // Update existing task
      taskToEdit.querySelector('.task-text').textContent = taskText;
      addTaskButton.textContent = 'Add task';
      taskToEdit = null;
    } else {
      // Add new task
      const taskItem = document.createElement('li');
      taskItem.classList.add('task-item');

      // Task Text
      const taskTextElement = document.createElement('span');
      taskTextElement.classList.add('task-text');
      taskTextElement.textContent = taskText;

      // Complete Button
      const completeButton = document.createElement('button');
      completeButton.textContent = 'Done';
      completeButton.classList.add('complete-task');
      completeButton.onclick = () => toggleCompleteTask(taskItem, completeButton);

      // Edit Button
      const editButton = document.createElement('button');
      editButton.textContent = 'Edit';
      editButton.classList.add('edit-task');
      editButton.onclick = () => editTask(taskItem, taskTextElement);

      // Delete Button
      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'Delete';
      deleteButton.classList.add('delete-task');
      deleteButton.onclick = () => taskItem.remove();

      // Task Actions
      const taskActions = document.createElement('div');
      taskActions.classList.add('task-actions');
      taskActions.appendChild(completeButton);
      taskActions.appendChild(editButton);
      taskActions.appendChild(deleteButton);

      taskItem.appendChild(taskTextElement);
      taskItem.appendChild(taskActions);
      tasksList.appendChild(taskItem);
    }
    
    // Clear input and reset button text
    taskInput.value = '';
    addTaskButton.textContent = 'Add task';
  }
}

// Edit Task: Load task text into input and change button to "Update task"
function editTask(taskItem, taskTextElement) {
  taskInput.value = taskTextElement.textContent;
  addTaskButton.textContent = 'Update task';
  taskToEdit = taskItem;
}

// Toggle Complete/Incomplete Task
function toggleCompleteTask(taskItem, completeButton) {
    const taskElement = document.getElementsByClassName("complete-task");
  taskItem.classList.toggle('completed'); // Add or remove the completed style

  // Update button text based on task completion status
  if (taskItem.classList.contains('completed')) {
    completeButton.textContent = 'Undo';
    taskItem.querySelector('.edit-task').style.display = 'none';
    taskItem.querySelector('.delete-task').style.display = 'none';
  } else {
    completeButton.textContent = 'Done';
    taskItem.querySelector('.edit-task').style.display = 'block';
    taskItem.querySelector('.delete-task').style.display = 'block';
  }
    
}

// Event Listeners
startStopButton.addEventListener('click', toggleTimer);
modeButtons.forEach(button => {
  button.addEventListener('click', () => setMode(button.id));
});

addTaskButton.addEventListener('click', handleTaskAction);
// Add task on enter key
document.getElementById('taskInput').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        handleTaskAction()
    }
});

// Initial Display
updateTimerDisplay();
