# ChemTask Manager

A chemistry-themed task management application designed specifically for cheminformatics research teams.

## Features

- **Task Management**: Create, view, complete, and delete tasks
- **Task Fields**: 
  - Task Name
  - Description  
  - Associated Project
  - Assignee
  - Priority (Low, Medium, High, Critical)
- **Filtering**: Filter tasks by project, assignee, or priority
- **Chemistry Theme**: Molecular icons and chemistry-inspired design
- **Local Storage**: Tasks persist between browser sessions
- **Responsive Design**: Works on desktop and mobile devices

## Usage

1. Open `index.html` in a web browser
2. Fill out the form to add new tasks
3. Use the filter dropdowns to narrow down tasks
4. Click "Complete" to mark tasks as done
5. Click "Delete" to remove tasks permanently
6. Press Escape to clear all filters

## Project Structure

```
cheminformatics_task_management/
├── index.html          # Main HTML structure
├── styles.css          # Chemistry-themed CSS styling  
├── script.js           # JavaScript functionality
└── README.md           # This file
```

## Local Development

Simply open `index.html` in any modern web browser. No server setup required.

## Data Storage

Tasks are stored in the browser's localStorage and will persist between sessions on the same device and browser.