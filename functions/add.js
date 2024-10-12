document.addEventListener('DOMContentLoaded', () => {
    const taskTitleInput = document.getElementById('task-title');
    const taskInput = document.getElementById('task-input');
    const taskList = document.getElementById('task-list');
    const addButtonImage = document.querySelector('.add-button-container img');

    loadTasks();

    addButtonImage.addEventListener('click', (e) => {
        e.preventDefault();
        const taskTitle = taskTitleInput.value.trim();
        const taskText = taskInput.value.trim();

        if (taskTitle !== '' && taskText !== '') {
            addTask(taskTitle, taskText);
            saveTaskToLocalStorage(taskTitle, taskText);
            taskTitleInput.value = '';
            taskInput.value = '';
        }
    });

    function addTask(taskTitle, taskText) {
        const container = document.createElement('div');
        container.classList.add('task-container');
        container.innerHTML = `
            <div class="task-main">
            <div id="task-container-text">
                <h3 class="task-title">${taskTitle}</h3>
                <p class="task-description">${taskText}</p>
            </div>
            <div class="task-action">
                <button class="delete-btn"><img src="../images/button delete.png"></button>
            </div>
        </div>
        <div class="task-dropdown-menu" style="display: none;">
            <button class="share-btn"><img src="../images/button share.png"></button>
            <button class="info-btn"><img src="../images/button info.png"></button>
            <button class="edit-btn"><img src="../images/button edit.png"></button>
        </div>
        <div class="edit-overlay" style="display: none;"></div>
        <div class="edit-container" style="display: none;">
            <input type="text" class="edit-title" value="${taskTitle}" style="height: 32px;">
            <textarea class="edit-description" value="${taskText}" style="height: 343px;"></textarea>
            <div class="edit-buttons">
                <button class="cancel-edit">Отменить</button>
                <button class="save-edit">Сохранить</button>
            </div>
        </div>
        `;

        const deleteBtn = container.querySelector('.delete-btn');
        const editBtn = container.querySelector('.edit-btn');
        const editContainer = container.querySelector('.edit-container');
        const taskTitleElement = container.querySelector('.task-title');
        const taskDescriptionElement = container.querySelector('.task-description');

        deleteBtn.addEventListener('click', (event) => {
            event.stopPropagation();
            taskList.removeChild(container);
            removeTaskFromLocalStorage(taskTitle, taskText);
        });

        container.addEventListener('click', () => {
            const dropdownMenu = container.querySelector('.task-dropdown-menu');
            dropdownMenu.style.display = dropdownMenu.style.display === 'flex' ? 'none' : 'flex';
        });

        editBtn.addEventListener('click', (event) => {
            event.stopPropagation();
            editContainer.style.display = 'block';
            taskTitleElement.parentElement.style.display = 'none';
            container.querySelector('.task-dropdown-menu').style.display = 'none';
            const editDescription = editContainer.querySelector('.edit-description');
            editDescription.value = taskDescriptionElement.textContent;
        });

        const cancelEditBtn = editContainer.querySelector('.cancel-edit');
        editBtn.addEventListener('click', (event) => {
            event.stopPropagation();
            container.querySelector('.edit-overlay').style.display = 'block';
            editContainer.style.display = 'block';
            taskTitleElement.parentElement.style.display = 'none';
            container.querySelector('.task-dropdown-menu').style.display = 'none';
        });

        cancelEditBtn.addEventListener('click', () => {
            editContainer.style.display = 'none';
            container.querySelector('.edit-overlay').style.display = 'none';
            taskTitleElement.parentElement.style.display = 'flex';
        });
        
        

        const saveEditBtn = editContainer.querySelector('.save-edit');
        saveEditBtn.addEventListener('click', () => {
            const newTitle = editContainer.querySelector('.edit-title').value.trim();
            const newText = editContainer.querySelector('.edit-description').value.trim();

            if (newTitle !== '' && newText !== '') {
                taskTitleElement.textContent = newTitle;
                taskDescriptionElement.textContent = newText;
                editContainer.style.display = 'none';
                taskTitleElement.parentElement.style.display = 'flex';
                updateTaskInLocalStorage(taskTitle, taskText, newTitle, newText);
                container.querySelector('.edit-overlay').style.display = 'none';
            }
        });

        taskList.appendChild(container);
    }

    function saveTaskToLocalStorage(title, text) {
        const tasks = getTasksFromLocalStorage();
        tasks.push({ title, text });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function removeTaskFromLocalStorage(title, text) {
        let tasks = getTasksFromLocalStorage();
        tasks = tasks.filter(task => task.title !== title || task.text !== text);
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function updateTaskInLocalStorage(oldTitle, oldText, newTitle, newText) {
        let tasks = getTasksFromLocalStorage();
        tasks = tasks.map(task => {
            if (task.title === oldTitle && task.text === oldText) {
                return { title: newTitle, text: newText };
            }
            return task;
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function getTasksFromLocalStorage() {
        const tasks = localStorage.getItem('tasks');
        return tasks ? JSON.parse(tasks) : [];
    }

    function loadTasks() {
        const tasks = getTasksFromLocalStorage();
        tasks.forEach(task => {
            addTask(task.title, task.text);
        });
    }
});
