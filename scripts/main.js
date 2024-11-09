import { UI } from './ui.js';
import { Task } from './task.js';
import { Storage } from './storage.js';

function loadTasks() {
    const tasks = Storage.getTasksFromLocalStorage();
    tasks.forEach(task => {
        Task.addTask(task.title, task.text);
    });
    Storage.checkForNoTasks();
}

function setupEventListeners() {
    UI.addButtonImage.addEventListener('click', () => {
        const taskTitle = UI.taskTitleInput.value;
        const taskText = UI.taskInput.value;
        if (taskTitle && taskText) {
            Task.addTask(taskTitle, taskText);
            Storage.saveTaskToLocalStorage(taskTitle, taskText);
            UI.taskTitleInput.value = '';
            UI.taskInput.value = '';
        }
        UI.noTasksMessage.style.display = 'none';
    });
}

function init() {
    loadTasks();
    setupEventListeners();
}

init();