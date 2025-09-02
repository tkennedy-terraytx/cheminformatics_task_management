class TaskManager {
    constructor() {
        this.tasks = JSON.parse(localStorage.getItem('chemTasks')) || [];
        this.taskIdCounter = parseInt(localStorage.getItem('taskIdCounter')) || 1;
        
        this.initializeEventListeners();
        this.renderTasks();
        this.updateFilters();
    }

    initializeEventListeners() {
        const taskForm = document.getElementById('taskForm');
        const filterProject = document.getElementById('filterProject');
        const filterAssignee = document.getElementById('filterAssignee');
        const filterPriority = document.getElementById('filterPriority');

        taskForm.addEventListener('submit', (e) => this.handleTaskSubmit(e));
        filterProject.addEventListener('change', () => this.renderTasks());
        filterAssignee.addEventListener('change', () => this.renderTasks());
        filterPriority.addEventListener('change', () => this.renderTasks());
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
            alert('Please fill in all required fields.');
            return;
        }

        this.tasks.push(task);
        this.saveTasks();
        this.renderTasks();
        this.updateFilters();
        
        e.target.reset();
        
        this.showNotification(`Task "${task.name}" added successfully!`, 'success');
    }

    completeTask(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
            task.completed = !task.completed;
            task.completedAt = task.completed ? new Date().toISOString() : null;
            this.saveTasks();
            this.renderTasks();
            
            const action = task.completed ? 'completed' : 'reopened';
            this.showNotification(`Task "${task.name}" ${action}!`, 'success');
        }
    }

    deleteTask(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task && confirm(`Are you sure you want to delete "${task.name}"?`)) {
            this.tasks = this.tasks.filter(t => t.id !== taskId);
            this.saveTasks();
            this.renderTasks();
            this.updateFilters();
            
            this.showNotification(`Task "${task.name}" deleted!`, 'error');
        }
    }

    getFilteredTasks() {
        const projectFilter = document.getElementById('filterProject').value;
        const assigneeFilter = document.getElementById('filterAssignee').value;
        const priorityFilter = document.getElementById('filterPriority').value;

        return this.tasks.filter(task => {
            const matchesProject = !projectFilter || task.project === projectFilter;
            const matchesAssignee = !assigneeFilter || task.assignee === assigneeFilter;
            const matchesPriority = !priorityFilter || task.priority === priorityFilter;
            
            return matchesProject && matchesAssignee && matchesPriority;
        });
    }

    renderTasks() {
        const container = document.getElementById('tasksContainer');
        const filteredTasks = this.getFilteredTasks();

        if (filteredTasks.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="flask-icon">⚗️</div>
                    <p>No tasks match your current filters. Try adjusting your search criteria!</p>
                </div>
            `;
            return;
        }

        const sortedTasks = filteredTasks.sort((a, b) => {
            const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
            const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
            
            if (priorityDiff !== 0) return priorityDiff;
            
            if (a.completed !== b.completed) {
                return a.completed ? 1 : -1;
            }
            
            return new Date(b.createdAt) - new Date(a.createdAt);
        });

        container.innerHTML = sortedTasks.map(task => this.createTaskCard(task)).join('');
    }

    createTaskCard(task) {
        const createdDate = new Date(task.createdAt).toLocaleDateString();
        const completedDate = task.completedAt ? new Date(task.completedAt).toLocaleDateString() : null;
        
        return `
            <div class="task-card ${task.completed ? 'task-completed' : ''}" data-task-id="${task.id}">
                <div class="task-header">
                    <h3 class="task-title">${this.escapeHtml(task.name)}</h3>
                    <div class="task-actions">
                        <button class="btn-small btn-complete" onclick="taskManager.completeTask(${task.id})">
                            ${task.completed ? 'Reopen' : 'Complete'}
                        </button>
                        <button class="btn-small btn-delete" onclick="taskManager.deleteTask(${task.id})">
                            Delete
                        </button>
                    </div>
                </div>
                
                <p class="task-description">${this.escapeHtml(task.description)}</p>
                
                <div class="task-meta">
                    <div class="meta-item">
                        <span class="meta-label">Project</span>
                        <span class="meta-value">${this.escapeHtml(task.project)}</span>
                    </div>
                    
                    <div class="meta-item">
                        <span class="meta-label">Assignee</span>
                        <span class="meta-value">${this.escapeHtml(task.assignee)}</span>
                    </div>
                    
                    <div class="meta-item">
                        <span class="meta-label">Priority</span>
                        <span class="meta-value">
                            <span class="priority-badge priority-${task.priority}">${task.priority}</span>
                        </span>
                    </div>
                    
                    <div class="meta-item">
                        <span class="meta-label">Created</span>
                        <span class="meta-value">${createdDate}</span>
                    </div>
                    
                    ${completedDate ? `
                        <div class="meta-item">
                            <span class="meta-label">Completed</span>
                            <span class="meta-value">${completedDate}</span>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }

    updateFilters() {
        const projects = [...new Set(this.tasks.map(t => t.project))].sort();
        const assignees = [...new Set(this.tasks.map(t => t.assignee))].sort();

        this.updateFilterSelect('filterProject', projects);
        this.updateFilterSelect('filterAssignee', assignees);
    }

    updateFilterSelect(selectId, options) {
        const select = document.getElementById(selectId);
        const currentValue = select.value;
        const placeholder = select.querySelector('option[value=""]').textContent;
        
        select.innerHTML = `<option value="">${placeholder}</option>`;
        
        options.forEach(option => {
            const optionElement = document.createElement('option');
            optionElement.value = option;
            optionElement.textContent = option;
            if (option === currentValue) {
                optionElement.selected = true;
            }
            select.appendChild(optionElement);
        });
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
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
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    saveTasks() {
        localStorage.setItem('chemTasks', JSON.stringify(this.tasks));
        localStorage.setItem('taskIdCounter', this.taskIdCounter.toString());
    }

    exportTasks() {
        const dataStr = JSON.stringify(this.tasks, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `chemtasks-export-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        
        URL.revokeObjectURL(url);
    }

    getTaskStats() {
        const total = this.tasks.length;
        const completed = this.tasks.filter(t => t.completed).length;
        const byPriority = this.tasks.reduce((acc, task) => {
            acc[task.priority] = (acc[task.priority] || 0) + 1;
            return acc;
        }, {});

        return {
            total,
            completed,
            pending: total - completed,
            byPriority
        };
    }
}

let taskManager;

document.addEventListener('DOMContentLoaded', () => {
    taskManager = new TaskManager();
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        document.getElementById('filterProject').value = '';
        document.getElementById('filterAssignee').value = '';
        document.getElementById('filterPriority').value = '';
        taskManager.renderTasks();
    }
});