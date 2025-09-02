class TaskCreator {
    constructor() {
        this.taskIdCounter = parseInt(localStorage.getItem('taskIdCounter')) || 1;
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        const taskForm = document.getElementById('taskForm');
        taskForm.addEventListener('submit', (e) => this.handleTaskSubmit(e));
        taskForm.addEventListener('reset', () => this.hideSuccessMessage());
    }

    handleTaskSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const task = {
            id: this.taskIdCounter++,
            name: formData.get('taskName').trim(),
            description: formData.get('taskDescription').trim(),
            project: formData.get('project').trim(),
            assignee: formData.get('assignee').trim(),
            priority: formData.get('priority'),
            completed: false,
            createdAt: new Date().toISOString()
        };

        if (!task.name || !task.description || !task.project || !task.assignee) {
            this.showNotification('Please fill in all required fields.', 'error');
            return;
        }

        this.saveTask(task);
        this.showSuccessMessage(task);
        this.showNotification(`Task "${task.name}" created successfully!`, 'success');
        
        e.target.reset();
    }

    saveTask(task) {
        let tasks = JSON.parse(localStorage.getItem('chemTasks')) || [];
        tasks.push(task);
        localStorage.setItem('chemTasks', JSON.stringify(tasks));
        localStorage.setItem('taskIdCounter', this.taskIdCounter.toString());
    }

    showSuccessMessage(task) {
        const successMessage = document.getElementById('successMessage');
        const taskForm = document.querySelector('.task-form-card');
        
        taskForm.style.display = 'none';
        successMessage.style.display = 'block';
        successMessage.scrollIntoView({ behavior: 'smooth' });
    }

    hideSuccessMessage() {
        const successMessage = document.getElementById('successMessage');
        const taskForm = document.querySelector('.task-form-card');
        
        successMessage.style.display = 'none';
        taskForm.style.display = 'block';
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        notification.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 1000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 300px;
            box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
        `;

        if (type === 'success') {
            notification.style.background = '#059669';
        } else if (type === 'error') {
            notification.style.background = '#dc2626';
        } else {
            notification.style.background = '#2563eb';
        }

        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new TaskCreator();
});