# 💻 Command Gateway - Visual Terminal

![React](https://img.shields.io/badge/React-18-blue)
![Vite](https://img.shields.io/badge/Vite-Fast-yellow)
![Status](https://img.shields.io/badge/Status-Live-success)

A hacker-style terminal interface for the Command Gateway. It features a responsive UI that adapts based on user roles (Admin vs Member).

## 🌟 Features

- **🕵️ Role-Adaptive UI:**
  - **Members** see a Terminal and Credit Counter.
  - **Admins** get a Control Panel (Rule Manager, Audit Logs, User Management, Approvals).
- **⚡ Real-time Feedback:** Instant success/failure messages for commands.
- **📊 Visual Data:** Color-coded logs (Red for blocks, Green for success, Yellow for pending).
- **📋 Approval Dashboard:** Admins can view pending risky commands and approve them with one click.

## 🛠️ Tech Stack

- **Framework:** React (Vite)
- **Styling:** CSS Modules (Custom Hacker Theme)
- **HTTP Client:** Axios
- **Deployment:** Vercel

## ⚙️ Setup & Installation

### 1. Clone the Repo
```
git clone https://github.com/YOUR_USERNAME/command-gateway-frontend.git
cd command-gateway-frontend
```

### 2. Install Dependencies
```
npm install
```

### 3. Configure Environment
Create a file named .env in the root folder:
```
VITE_API_URL=[http://127.0.0.1:8000]
```
(Change this URL if your backend is deployed on Render)

### 4. Run Development Server
```
npm run dev
```
Open http://localhost:5173 in your browser.

## 🎮 How to Use

1.  **Authenticate:** Enter your API Key.
    * **Demo Admin:** `admin-secret-key`
    * **Demo Member:** `member-secret-key`
2.  **Run Commands:** Type `ls`, `git status`, or `rm -rf /` to test the rules.
3.  **Manage Rules (Admin):** Use the right-hand panel to add new Regex patterns.
4.  **Approve Requests:** If a command requires approval, the user receives a "Pending" status. Switch to the Admin account to find and approve the request in the "Pending Approvals" section.

## 🔗 Live Demo
   [Link to the Project](https://command-gateway-frontend.vercel.app)