export const UI = (() => {
    const taskTitleInput = document.getElementById('task-title');
    const taskInput = document.getElementById('task-input');
    const taskList = document.getElementById('task-list');
    const addButtonImage = document.querySelector('.add-button-container');
    const noTasksMessage = createNoTasksMessage();

    function createNoTasksMessage() {
        const message = document.createElement('div');
        message.id = 'no-tasks-message';
        message.style.display = 'none';
        message.innerText = 'Нет задач';
        taskList.parentElement.insertBefore(message, taskList);
        return message;
    }

    return {
        taskTitleInput,
        taskInput,
        taskList,
        addButtonImage,
        noTasksMessage,
        createNoTasksMessage
    };
})();