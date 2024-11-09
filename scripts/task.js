import { Storage } from './storage.js';
import { UI } from './ui.js';

export const Task = (() => {
    function addTask(taskTitle, taskText) {
        const container = document.createElement('div');
        container.classList.add('task-container');
        container.innerHTML = createTaskHTML(taskTitle, taskText);
        setupTaskEventListeners(container, taskTitle, taskText);
        UI.taskList.appendChild(container);
        UI.noTasksMessage.style.display = 'none';
    }

    function createTaskHTML(taskTitle, taskText) {
        return `
            <div class="task-main">
                <div id="task-container-text">
                    <h3 class="task-title">${taskTitle}</h3>
                    <p class="task-description">${taskText}</p>
                </div>
                <div class="task-action">
                    <button class="delete-btn">X</button>
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
                <button class="share-tg"><img src="../images/share/share tg.svg" alt="Share TG"></button>
                <button class="share-ws"><img src="../images/share/share ws.svg" alt="Share WS"></button>
                <button class="share-fb"><img src="../images/share/share fb.svg" alt="Share FB"></button>
            </div>
            <div class="confirm" style="display: none;">
                <h2>Вы уверены, что хотите удалить эту задачу?</h2>
                <div class="confirm-buttons">
                    <button class="confirm-delete">Удалить</button>
                    <button class="cancel-delete">Отмена</button>
                </div>
            </div>
        `;
    }

    function setupTaskEventListeners(container, taskTitle, taskText) {
        const deleteBtn = container.querySelector('.delete-btn');
        const editBtn = container.querySelector('.edit-btn');
        const editContainer = container.querySelector('.edit-container');
        const taskTitleElement = container.querySelector('.task-title');
        const taskDescriptionElement = container.querySelector('.task-description');
        const confirmDelete = container.querySelector('.confirm');
        const confirmDeleteBtn = confirmDelete.querySelector('.confirm-delete');
        const cancelDeleteBtn = confirmDelete.querySelector('.cancel-delete');
        const taskMain = container.querySelector('.task-main');
        const dropdownMenu = container.querySelector('.task-dropdown-menu');
        const infoBtn = container.querySelector('.info-btn');
        const shareBtn = container.querySelector('.share-btn');
        const shareMenu = container.querySelector('.share-menu');
        const overlay = container.querySelector('.overlay');



        shareBtn.addEventListener('click', (event) => {
            event.stopPropagation();
            shareMenu.style.display = 'block';
            overlay.style.display = 'block';
            container.querySelector('.task-dropdown-menu').style.display = 'none';
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

        deleteBtn.addEventListener('click', () => {
            overlay.style.display = 'block';
            confirmDelete.style.display = 'block';
        });

        confirmDeleteBtn.addEventListener('click', () => {
            Storage.removeTaskFromLocalStorage(taskTitle, taskText);
            container.remove();
            Storage.checkForNoTasks();
        });

        cancelDeleteBtn.addEventListener('click', () => {
            confirmDelete.style.display = 'none';
        });

        editBtn.addEventListener('click', () => {
            overlay.style.display = 'flex';
            editContainer.style.display = 'block';
            taskTitleElement.contentEditable = true;
            taskDescriptionElement.contentEditable = true;
        });

        const saveEditBtn = editContainer.querySelector('.save-edit');
        saveEditBtn.addEventListener('click', () => {
            const newTitle = editContainer.querySelector('.edit-title').value;
            const newText = editContainer.querySelector('.edit-description').value;
            Storage.updateTaskInLocalStorage(taskTitle, taskText, newTitle, newText);
            taskTitleElement.innerText = newTitle;
            taskDescriptionElement.innerText = newText;
            editContainer.style.display = 'none';
        });

        const cancelEditBtn = editContainer.querySelector('.cancel-edit');
        cancelEditBtn.addEventListener(' click', () => {
            overlay.style.display = 'none';
            editContainer.style.display = 'none';
        });

        cancelEditBtn.addEventListener('click', () => {
            editContainer.style.display = 'none';
            overlay.style.display = 'none';
            taskTitleElement.parentElement.style.display = 'flex';
        })

        overlay.addEventListener('click', () => {
            editContainer.style.display = 'none';
            shareMenu.style.display = 'none';
            confirmDelete.style.display = 'none';
            overlay.style.display = 'none';
            taskTitleElement.parentElement.style.display = 'flex';
        });

        taskMain.addEventListener('click', () => {
            dropdownMenu.style.display = dropdownMenu.style.display === 'flex' ? 'none' : 'flex';
        });
    }

    return {
        addTask
    };
})();