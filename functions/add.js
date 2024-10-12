document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('task-form');
    const taskTitleInput = document.getElementById('task-title');
    const taskInput = document.getElementById('task-input');
    const taskList = document.getElementById('task-list');
    const addButtonImage = document.querySelector('.add-button-container img');

    addButtonImage.addEventListener('click', (e) => {
        e.preventDefault();
        const taskTitle = taskTitleInput.value.trim();
        const taskText = taskInput.value.trim();

        if (taskTitle !== '' && taskText !== '') {
            addTask(taskTitle, taskText);
            taskTitleInput.value = '';
            taskInput.value = '';
        }
    });

    function addTask(taskTitle, taskText) {
        const container = document.createElement('div');
        container.id='task-container';
        container.innerHTML = `
        <div id="task-container-text">
            <h3 id="task-title">${taskTitle}</h3>
            <p id="task-description">${taskText}</p>
        </div>
        <div id="task-dropdown-menu" style="display: none;">
            Это дополнительное меню
        </div>
        `;

        container.addEventListener('click', () => {
            const dropdownMenu = container.querySelector('.task-dropdown-menu');
            if (dropdownMenu) {
                dropdownMenu.style.display = dropdownMenu.style.display === 'block' ? 'none' : 'block';
            } else {
                const newDropdownMenu = document.createElement('div');
                newDropdownMenu.classList.add('task-dropdown-menu');
                newDropdownMenu.innerHTML = 'Это дополнительное меню';
                newDropdownMenu.style.display = 'block';
                container.appendChild(newDropdownMenu);
            }
        });

        const taskActions = document.createElement('div');
        taskActions.classList.add('task-actions');

        const deleteBtn = document.createElement('button');
        const deleteIcon = document.createElement('img');
        deleteIcon.src = './images/Button delete.png';
        deleteIcon.alt = 'Удалить';
        deleteBtn.appendChild(deleteIcon);
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Останавливаем всплытие события, чтобы не закрыть меню
            taskList.removeChild(container);
        });

        taskActions.appendChild(deleteBtn);
        container.appendChild(taskActions);
        taskList.appendChild(container);
    }
});
