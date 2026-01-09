# How to Run NeuroBloom

## Prerequisites
- Node.js installed on your machine.

## Steps
1.  **Open Terminal**: Open your command prompt or terminal (PowerShell, CMD, or VS Code Terminal).
2.  **Navigate to Project**: Make sure you are in the `neurobloom` folder.
    ```bash
    cd c:/Users/Admin/Downloads/NeuroBloom/NeuroBloom-main/neurobloom
    ```
3.  **Install Dependencies** (if you haven't already):
    ```bash
    npm install
    ```
4.  **Start Development Server**:
    ```bash
    npm run dev
    ```
5.  **View in Browser**:
    - Open your web browser (Chrome, Edge, etc.).
    - Go to [http://localhost:3000](http://localhost:3000).

## Project Flow
1.  **Landing Page**: `/`
2.  **Login/Signup**: `/login`, `/signup`
3.  **Dashboard**: `/dashboard` (Click "Get Started" or login to go here)
    - **Note**: Use the **"Use Demo Account"** button on the login page to bypass the database check.
    - Or use Email: `demo@neurobloom.com`, Password: `demo`
4.  **Assessments**: Click "Start Assessment" on the dashboard to begin the 6-module flow.
