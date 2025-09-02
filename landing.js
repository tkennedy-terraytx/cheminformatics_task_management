class LandingPage {
    constructor() {
        this.tasks = JSON.parse(localStorage.getItem('chemTasks')) || [];
        this.updateQuickStats();
    }

    updateQuickStats() {
        const totalTasks = this.tasks.length;
        
        if (totalTasks > 0) {
            const completedTasks = this.tasks.filter(t => t.completed).length;
            const activeProjects = [...new Set(this.tasks.map(t => t.project))].length;
            
            document.getElementById('homeTotal').textContent = totalTasks;
            document.getElementById('homeCompleted').textContent = completedTasks;
            document.getElementById('homeProjects').textContent = activeProjects;
            document.getElementById('quickStats').style.display = 'block';
            
            // Update call-to-action text if tasks exist
            const primaryBtn = document.querySelector('.btn-primary');
            if (primaryBtn) {
                primaryBtn.innerHTML = `
                    <span class="btn-icon">➕</span>
                    Create New Task
                `;
            }
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new LandingPage();
});