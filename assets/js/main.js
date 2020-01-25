const taskManager = new TaskManager(document, document.querySelector('div.row.task-row'));

document.addEventListener('DOMContentLoaded', function () {
    newTaskClickListener();
    exportTasksClickListener();
    importTasksClickListener();

});

/**
 * Adds a click listener to "NEW" task button
 */
function newTaskClickListener() {
    const btn = document.getElementById('add-task');

    btn.addEventListener('click', function () {
        newTaskClickHandler();
    });
}

/**
 * New task click handler
 */
function newTaskClickHandler() {
    taskManager.createTask();
}

/**
 * Adds a click listener to "EXPORT" tasks button
 */
function exportTasksClickListener() {
    const btn = document.getElementById('export-tasks');

    btn.addEventListener('click', function () {
        exportTasksClickHandler();
    });
}

/**
 * Export tasks click handler
 */
function exportTasksClickHandler() {
    const savedTasks = taskManager.getStoredTasks();

    if (!savedTasks) {
        return;
    }

    const filename = 'tasks.json';
    const jsonStr = JSON.stringify(savedTasks);

    let element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(jsonStr));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}

/**
 * Adds a click listener to "IMPORT" tasks button
 */
function importTasksClickListener() {
    const btn = document.getElementById('import-tasks');

    btn.addEventListener('click', function () {
        importTasksClickHandler();
    });
}

/**
 * Import tasks click handler
 */
function importTasksClickHandler() {
    const fileInput = document.getElementById('import-file');
    fileInput.click();

    fileInput.addEventListener('change', function (ev) {
        const reader = new FileReader();

        reader.onload = function (ev) {
            const jsonObj = JSON.parse(ev.target.result);
            if (jsonObj) {
                localStorage.setItem('tasks', JSON.stringify(jsonObj));
                taskManager.initializeTasks();
            }
        };

        reader.readAsText(event.target.files[0]);
    });
}

