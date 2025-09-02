class TaskViewer {
    constructor() {
        this.tasks = JSON.parse(localStorage.getItem('chemTasks')) || [];
        this.initializeEventListeners();
        this.renderTasks();
        this.updateFilters();
        this.updateStats();
    }

    initializeEventListeners() {
        const filterProject = document.getElementById('filterProject');
        const filterAssignee = document.getElementById('filterAssignee');
        const filterPriority = document.getElementById('filterPriority');
        const filterStatus = document.getElementById('filterStatus');

        filterProject.addEventListener('change', () => this.renderTasks());
        filterAssignee.addEventListener('change', () => this.renderTasks());
        filterPriority.addEventListener('change', () => this.renderTasks());
        filterStatus.addEventListener('change', () => this.renderTasks());
    }

    completeTask(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
            task.completed = !task.completed;
            task.completedAt = task.completed ? new Date().toISOString() : null;
            this.saveTasks();
            this.renderTasks();
            this.updateStats();
            
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
            this.updateStats();
            
            this.showNotification(`Task "${task.name}" deleted!`, 'error');
        }
    }

    getFilteredTasks() {
        const projectFilter = document.getElementById('filterProject').value;
        const assigneeFilter = document.getElementById('filterAssignee').value;
        const priorityFilter = document.getElementById('filterPriority').value;
        const statusFilter = document.getElementById('filterStatus').value;

        return this.tasks.filter(task => {
            const matchesProject = !projectFilter || task.project === projectFilter;
            const matchesAssignee = !assigneeFilter || task.assignee === assigneeFilter;
            const matchesPriority = !priorityFilter || task.priority === priorityFilter;
            const matchesStatus = !statusFilter || 
                (statusFilter === 'completed' && task.completed) || 
                (statusFilter === 'pending' && !task.completed);
            
            return matchesProject && matchesAssignee && matchesPriority && matchesStatus;
        });
    }

    renderTasks() {
        const container = document.getElementById('tasksContainer');
        const filteredTasks = this.getFilteredTasks();

        if (filteredTasks.length === 0) {
            const hasAnyTasks = this.tasks.length > 0;
            container.innerHTML = `
                <div class="empty-state">
                    <div class="flask-icon">⚗️</div>
                    <p>${hasAnyTasks ? 'No tasks match your current filters. Try adjusting your search criteria!' : 'No tasks yet. Start by creating your first research task!'}</p>
                    ${!hasAnyTasks ? '<a href="create-task.html" class="btn-primary">Create Task</a>' : ''}
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
        
        const priorityIcons = {
            low: '🟢',
            medium: '🟡', 
            high: '🟠',
            critical: '🔴'
        };
        
        return `
            <div class="task-card ${task.completed ? 'task-completed' : ''}" data-task-id="${task.id}" data-priority="${task.priority}">
                <div class="priority-marker priority-marker-${task.priority}"></div>
                <div class="task-header">
                    <div class="task-title-row">
                        <div class="priority-indicator">
                            <span class="priority-icon">${priorityIcons[task.priority]}</span>
                            <span class="priority-text priority-${task.priority}">${task.priority.toUpperCase()}</span>
                        </div>
                        <h3 class="task-title">${this.escapeHtml(task.name)}</h3>
                    </div>
                    <div class="task-actions">
                        <button class="btn-small btn-complete" onclick="taskViewer.completeTask(${task.id})">
                            ${task.completed ? 'Reopen' : 'Complete'}
                        </button>
                        <button class="btn-small btn-delete" onclick="taskViewer.deleteTask(${task.id})">
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

    updateStats() {
        const total = this.tasks.length;
        const completed = this.tasks.filter(t => t.completed).length;
        const pending = total - completed;
        const critical = this.tasks.filter(t => t.priority === 'critical' && !t.completed).length;

        document.getElementById('totalTasks').textContent = total;
        document.getElementById('completedTasks').textContent = completed;
        document.getElementById('pendingTasks').textContent = pending;
        document.getElementById('criticalTasks').textContent = critical;
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

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    saveTasks() {
        localStorage.setItem('chemTasks', JSON.stringify(this.tasks));
    }
}

let taskViewer;

document.addEventListener('DOMContentLoaded', () => {
    taskViewer = new TaskViewer();
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        document.getElementById('filterProject').value = '';
        document.getElementById('filterAssignee').value = '';
        document.getElementById('filterPriority').value = '';
        document.getElementById('filterStatus').value = '';
        taskViewer.renderTasks();
    }
});