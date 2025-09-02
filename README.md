# ChemTask Manager 🧪

A stunning chemistry-themed task management application designed specifically for cheminformatics research teams. Features a beautiful dark interface with floating molecules and glassmorphic design elements.

## ✨ Features

### Core Functionality
- **Multi-Page Application**: Separate pages for landing, task creation, and task viewing
- **Task Management**: Create, view, complete, and delete research tasks
- **Advanced Filtering**: Filter by project, assignee, priority, and completion status
- **Priority System**: Visual priority indicators with color coding and animations
- **Statistics Dashboard**: Real-time task and project statistics

### Task Fields
- 🔬 **Task Name**: Descriptive name for your research task
- 📝 **Description**: Detailed methodology and objectives
- 🧪 **Associated Project**: Link tasks to research projects
- 👨‍🔬 **Assignee**: Team member responsible for the task
- ⚡ **Priority**: Low (🟢), Medium (🟡), High (🟠), Critical (🔴)

### Design & UX
- **Chemistry Theme**: Animated floating molecules and laboratory-inspired design
- **Dark Mode Interface**: Professional dark gradient background
- **Glassmorphic Cards**: Modern frosted glass effect with backdrop blur
- **Mobile Responsive**: Optimized for all devices
- **Smooth Animations**: Gentle floating animations and hover effects

## 🚀 Live Demo

Visit the live application: **[Your URL will be here after deployment]**

## 📱 Usage

### Navigation
- **Home**: Landing page with overview and quick stats
- **Create Task**: Dedicated form for adding new research tasks
- **View Tasks**: Dashboard with all tasks, filters, and statistics

### Getting Started
1. Visit the landing page to see the overview
2. Click "Create Your First Task" to add a research task
3. Navigate to "View Tasks" to see your task dashboard
4. Use filters to organize tasks by project, assignee, or priority
5. Mark tasks complete or delete them as needed

### Keyboard Shortcuts
- Press `Escape` on the View Tasks page to clear all filters

## 🏗️ Project Structure

```
cheminformatics_task_management/
├── index.html          # Landing page with hero section
├── create-task.html    # Dedicated task creation page
├── view-tasks.html     # Task dashboard and management
├── styles.css          # Enhanced chemistry-themed styling
├── landing.js          # Landing page functionality
├── create-task.js      # Task creation logic
├── view-tasks.js       # Task viewing and management
├── script.js           # Legacy script (maintained for compatibility)
└── README.md           # This documentation
```

## 🌐 Deployment to GitHub Pages

### Step 1: Create GitHub Repository
1. Go to [github.com](https://github.com) and sign in
2. Click "New repository" (green button)
3. Name it `cheminformatics-task-management`
4. Make it **Public** (required for free GitHub Pages)
5. **Don't** initialize with README (we already have one)
6. Click "Create repository"

### Step 2: Upload Your Code
```bash
# Navigate to your project directory
cd /home/tatiana.kennedy/cheminformatics_task_management

# Add GitHub as remote origin (replace 'yourusername' with your GitHub username)
git remote add origin https://github.com/yourusername/cheminformatics-task-management.git

# Rename main branch to 'main' (GitHub Pages standard)
git branch -M main

# Push to GitHub
git push -u origin main
```

### Step 3: Enable GitHub Pages
1. Go to your repository on GitHub
2. Click **Settings** tab
3. Scroll down to **Pages** section (left sidebar)
4. Under "Source", select **Deploy from a branch**
5. Choose **main** branch and **/ (root)** folder
6. Click **Save**

Your site will be available at: `https://yourusername.github.io/cheminformatics-task-management/`

## 💾 Local Development

### Option 1: Direct File Opening
Simply double-click `index.html` to open in your browser.

### Option 2: Local Server (Recommended)
```bash
# Using Python 3
python3 -m http.server 8000

# Using Node.js
npx serve .

# Using PHP
php -S localhost:8000
```

Then visit `http://localhost:8000`

## 🗃️ Data Storage

- Tasks are stored in browser's `localStorage`
- Data persists between sessions on the same device/browser
- No server or database required
- Each user maintains their own task list locally

## 🎨 Customization

The application uses CSS custom properties (variables) for easy theming. Key variables are defined in `:root` of `styles.css`:

```css
:root {
    --primary-color: #2563eb;
    --secondary-color: #059669;
    --accent-color: #dc2626;
    /* ... more variables */
}
```

## 🤝 Contributing

This project is designed for research teams. Feel free to:
- Add new features specific to your research needs
- Customize the chemistry theme
- Extend the task fields for your workflow
- Add export/import functionality

## 📄 License

Open source - feel free to use and modify for your research team!

---

**Built for Chemistry Research Teams** 🔬⚗️🧪