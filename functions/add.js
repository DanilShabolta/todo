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
            <div class="overlay" style="display: none;"></div>
            <div class="edit-container" style="display: none;">
                <input type="text" class="edit-title" value="${taskTitle}" style="height: 32px;">
                <textarea class="edit-description" style="height: 343px;">${taskText}</textarea>
                <div class="edit-buttons">
                    <button class="cancel-edit">Отменить</button>
                    <button class="save-edit">Сохранить</button>
                </div>
            </div>
            <div class="share-menu" style="display: none;">
                <button class="share-copy"><img src="../images/share/share copy.png" alt="Share Copy"></button>
                <button class="share-vk"><img src="../images/share/share vk.png" alt="Share VK"></button>
                <button class="share-tg"><img src="../images/share/share tg.png" alt="Share TG"></button>
                <button class="share-ws"><img src="../images/share/share ws.png" alt="Share WS"></button>
                <button class="share-fb"><img src="../images/share/share fb.png" alt="Share FB"></button>
            </div>
            <div class="confirm" style="display: none;">
                <h2>Вы уверены, что хотите удалить эту задачу?</h2>
                <div class="confirm-buttons">
                    <button class="confirm-delete">Удалить</button>
                    <button class="cancel-delete">Отмена</button>
                </div>
            </div>
            <div id="no-tasks-message" style="display: none;">
                No tasks
            </div>

        `;

        const deleteBtn = container.querySelector('.delete-btn');
        const editBtn = container.querySelector('.edit-btn');
        const editContainer = container.querySelector('.edit-container');
        const taskTitleElement = container.querySelector('.task-title');
        const taskDescriptionElement = container.querySelector('.task-description');
        const infoBtn = container.querySelector('.info-btn');
        const shareBtn = container.querySelector('.share-btn');
        const shareMenu = container.querySelector('.share-menu');
        const overlay = container.querySelector('.overlay');
        const confirmContainer = container.querySelector('.confirm');
        const noTasksMessage = container.querySelector('#no-tasks-message')

        deleteBtn.addEventListener('click', (event) => {
            event.stopPropagation();
            overlay.style.display = 'block';
            confirmContainer.style.display = 'block';

            confirmContainer.querySelector('.confirm-delete').addEventListener('click', () => {
                taskList.removeChild(container);
                removeTaskFromLocalStorage(taskTitle, taskText);
                overlay.style.display = 'none';
                confirmContainer.style.display = 'none';
            });

            confirmContainer.querySelector('.cancel-delete').addEventListener('click', () => {
                overlay.style.display = 'none';
                confirmContainer.style.display = 'none';
            });
        });

        container.addEventListener('click', () => {
            const dropdownMenu = container.querySelector('.task-dropdown-menu');
            dropdownMenu.style.display = dropdownMenu.style.display === 'flex' ? 'none' : 'flex';
        });

        infoBtn.addEventListener('click', (event) => {
            event.stopPropagation();
            const infoOverlay = document.createElement('div');
            infoOverlay.classList.add('info-overlay');
            infoOverlay.innerHTML = `
                <div class="info-content">
                    <h3>${taskTitle}</h3>
                    <p>${taskText}</p>
                    <button class="close-info">Закрыть</button>
                </div>
            `;
            document.body.appendChild(infoOverlay);
            infoOverlay.style.display = 'flex';

            const closeInfoBtn = infoOverlay.querySelector('.close-info');
            closeInfoBtn.addEventListener('click', () => {
                infoOverlay.remove();
            });
        });

        shareBtn.addEventListener('click', (event) => {
            event.stopPropagation();
            shareMenu.style.display = 'block';
            overlay.style.display = 'block';
            container.querySelector('.task-dropdown-menu').style.display = 'none';
        });

        editBtn.addEventListener('click', (event) => {
            event.stopPropagation();
            editContainer.style.display = 'block';
            overlay.style.display = 'block';
            taskTitleElement.parentElement.style.display = 'none';
            container.querySelector('.task-dropdown-menu').style.display = 'none';
            const editDescription = editContainer.querySelector('.edit-description');
            editDescription.value = taskDescriptionElement.textContent;
        });

        const cancelEditBtn = editContainer.querySelector('.cancel-edit');

        cancelEditBtn.addEventListener('click', () => {
            editContainer.style.display = 'none';
            overlay.style.display = 'none';
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
                overlay.style.display = 'none';
            }
        });

        overlay.addEventListener('click', () => {
            editContainer.style.display = 'none';
            shareMenu.style.display = 'none';
            confirmContainer.style.display = 'none';
            overlay.style.display = 'none';
            taskTitleElement.parentElement.style.display = 'flex';
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
        if (tasks == null) {
            noTasksMessage.style.display = 'flex';
        }else{
            noTasksMessage.style.display = 'none';
        }
    }
});
