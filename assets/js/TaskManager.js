class TaskManager {
    constructor(document, taskContainerElement) {
        this.document = document;

        // this.timeago = new window.timeago();

        this.taskContainerElement = taskContainerElement;

        this.tempate = document.getElementById('task-template');

        this.tasks = [];

        this.initializeTasks();
    }

    initializeTasks() {
        const savedTasks = this.getStoredTasks();

        if (!savedTasks) {
            return;
        }

        savedTasks.forEach(task => {
            this.createTask(true, task.id, task.status, task.body, task.created);
        });
    }

    getStoredTasks() {
        const strTasks = localStorage.getItem(STORAGE_TASKS_KEY);

        if (strTasks === null) {
            return false;
        }

        return JSON.parse(strTasks);
    }

    /**
     * Maybe use later...
     */
    sortTasks() {
        this.tasks.sort(function(a, b) {
            return b.created - a.created;
        });

        this.tasks.sort(function(a, b) {
            return a.status - b.status;
        });
    }

    sortTaskRow() {
        tinysort('div.row.task',{selector:'p.task-created',attr:'data-unix',order:'desc'});
        tinysort('div.row.task',{selector:'input.task-status',attr:'data-status',order:'asc'});
    }

    generateId() {
        const savedTasks = this.getStoredTasks();

        if (!savedTasks) {
            return 1;
        }

        let ids = savedTasks.map(function(o) { return o.id; });
        const highestUsed = Math.max.apply(Math, ids);

        if (!isFinite(highestUsed)) {
            return 1;
        }

        return highestUsed + 1;
    }

    createTask(fromStorage = false, id, status, body, created) {
        const element = this.document.importNode(this.tempate.content, true).children[0];

        if (!fromStorage) {
            if (!id) {
                id = this.generateId();
            }

            if (!status) {
                status = 0;
            }

            if (!body) {
                body = '';
            }
        }

        const task = new Task(element, this, fromStorage, id, status, body, created);
        this.tasks.push(task);

        // Sort the row. Newest at top, completed at bottom.
        setTimeout(() => {
            this.sortTaskRow();
        }, 0);

        // If it's a new task then focus the task body
        if (!fromStorage) {
            this.writeTaskToStorage(task);
            this.focusTaskBody(task);
        }

        this.taskContainerElement.insertAdjacentElement('beforeEnd', task.element);

        return task;
    }

    focusTaskBody(task) {
        setTimeout(() => {
            task.element.querySelector('.task-body').focus();
        }, 0);
    }

    setStatus(task, status) {
        task.element.querySelector('.task-status').setAttribute('data-status', status);
        task.status = status;
        this.writeTasksToStorage();
        this.sortTaskRow();
    }

    writeTasksToStorage() {
        const toSave = this.tasks.map((t) => {
            return {'id': t.id, 'status': t.status, 'body': t.body, 'created': t.created}
        });

        localStorage.setItem(STORAGE_TASKS_KEY, JSON.stringify(toSave));
    }

    deleteTask(task) {
        this.tasks.splice(this.tasks.findIndex(t => {
            return t === task;
        }), 1);

        this.taskContainerElement.removeChild(task.element);

        const savedTasks = this.getStoredTasks();
        savedTasks.splice(savedTasks.findIndex(t => {
            return t === task.id;
        }), 1);
        
        localStorage.setItem(STORAGE_TASKS_KEY, JSON.stringify(savedTasks));
    }

    writeTaskToStorage(task) {
        const currentTasks = this.getStoredTasks();

        if (currentTasks) {
            const newTask = {'id': task.id, 'status': task.status, 'body': task.body, 'created': task.created};
            currentTasks.push(newTask);
            localStorage.setItem(STORAGE_TASKS_KEY, JSON.stringify(currentTasks));
        } else {
            const taskArray = [{'id': task.id, 'status': task.status, 'body': task.body, 'created': task.created}];
            localStorage.setItem(STORAGE_TASKS_KEY, JSON.stringify(taskArray));
        }
    }

    saveTaskBody(task, taskBody) {
        task.body = taskBody;
        this.writeTasksToStorage();
    }
}