class Task {
    constructor(element, taskManager, fromStorage, id, status, body, created) {
        this.element = element;

        this.taskManager = taskManager;

        this.timeago = new window.timeago();

        // True if task is from localStorage, false otherwise
        this.fromStorage = fromStorage;

        this.id = id;
        this.status = status;
        this.body = body;
        this.created = created;

        if (!this.fromStorage) {
            this.created = window.getTime();

            this.element.querySelector('.task-created').setAttribute('datetime', this.formattedCreated());
            this.element.querySelector('.task-created').setAttribute('data-unix', this.created);
            this.element.querySelector('.task-status').setAttribute('data-status', this.status);
        } else {
            this.element.querySelector('.task-status').checked = this.status;
            this.element.querySelector('.task-body').innerText = this.body;
            this.element.querySelector('.task-created').setAttribute('datetime', this.formattedCreated());
            this.element.querySelector('.task-created').setAttribute('data-unix', this.created);
            this.element.querySelector('.task-status').setAttribute('data-status', this.status);
        }

        // Render the time in the "created" column
        this.timeago.render(this.element.querySelector('.render_date'), 'en_US');

        // Add focusout listener to task body, to save changes
        this.addSaveListeners();

        // Add click listener for deleting a task
        this.addDeleteListener();

        // Add input status change listener
        this.addStatusListener();
    }

    addSaveListeners() {
        this.element.querySelector('.task-body').addEventListener('focusout', (ev) => {
            this.taskManager.saveTaskBody(this, ev.target.innerText);
        });

        // Removes focus from body when ENTER is clicked
        this.element.querySelector('.task-body').addEventListener('keypress', (ev) => {
            if (ev.type === 'keypress' && ev.key === 'Enter') {
                window.document.activeElement.blur();
            }
        });
    }

    /**
     * Add click listener to delete button
     */
    addDeleteListener() {
        this.element.querySelector('a.delete-task').addEventListener('click', () => {
            const confirmDelete = confirm('Are you sure?');
            if (confirmDelete) {
                this.taskManager.deleteTask(this);
            }
        });
    }

    addStatusListener() {
        this.element.querySelector('input.task-status').addEventListener('change', (ev) => {
            this.taskManager.setStatus(this, +ev.target.checked);
        });
    }

    formattedCreated() {
        return moment.unix(this.created / 1000).format("MM-DD-YYYY HH:mm:ss");
    }
}