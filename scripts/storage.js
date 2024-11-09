import { UI } from './ui.js';

export const Storage = (() => {
    const LOCAL_STORAGE_KEY = 'tasks';

    function checkForNoTasks() {
        if (UI.taskList.children.length === 0) {
            UI.noTasksMessage.style.display = 'flex';
        } else {
            UI.noTasksMessage.style.display = 'none';
        }
    }

    function saveTaskToLocalStorage(title, text) {
        const tasks = getTasksFromLocalStorage();
        tasks.push({ title, text });
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tasks));
    }

    function removeTaskFromLocalStorage(title, text) {
        let tasks = getTasksFromLocalStorage();
        tasks = tasks.filter(task => task.title !== title || task.text !== text);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tasks));
    }

    function updateTaskInLocalStorage(oldTitle, oldText, newTitle, newText) {
        let tasks = getTasksFromLocalStorage();
        tasks = tasks.map(task => {
            if (task.title === oldTitle && task.text === oldText) {
                return { title: newTitle, text: newText };
            }
            return task;
        });
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tasks));
    }

    function getTasksFromLocalStorage() {
        const tasks = localStorage.getItem(LOCAL_STORAGE_KEY);
        return tasks ? JSON.parse(tasks) : [];
    }

    return {
        saveTaskToLocalStorage,
        removeTaskFromLocalStorage,
        updateTaskInLocalStorage,
        getTasksFromLocalStorage,
        checkForNoTasks
    };
})();