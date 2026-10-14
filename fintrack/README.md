# FinTrack - Personal Finance & Expense Tracker

A full-stack web application designed to help individuals track their income, monitor daily expenses, manage budgets, keep on top of recurring bills, and view insightful financial analytics.

Built with **Node.js**, **Express**, **MySQL**, and **React** (with Tailwind CSS).

---

## 🚀 Features

- **User Authentication**: Secure user registration and login using JSON Web Tokens (JWT) and bcrypt password hashing.
- **Income & Expense Tracking**: Categorized logging of income sources and expenditures with dates and notes.
- **Budget Planning**: Set and monitor spending budgets across custom categories.
- **Bill Reminders**: Keep track of upcoming bills and payment statuses.
- **Visual Analytics & Reports**: Interactive charts and spending breakdowns powered by Recharts.
- **Responsive Dashboard**: Modern UI styled with Tailwind CSS.

---

## 🛠️ Tech Stack

### Backend
- **Node.js** & **Express.js**
- **MySQL** database with `mysql2` driver
- **JWT (`jsonwebtoken`)** for stateless authentication
- **bcryptjs** for secure password hashing
- **dotenv** for environment configuration
- **CORS** middleware

### Frontend
- **React.js** (v18)
- **React Router** (v6) for navigation
- **Tailwind CSS** for styling
- **Recharts** for financial charts and visual data
- **Axios** for HTTP communication

---

## 📁 Project Structure

```
fintrack/
├── backend/
│   ├── config/          # Database configuration
│   ├── database/        # MySQL schema (schema.sql)
│   ├── middleware/      # Auth & JWT verification middleware
│   ├── routes/          # API endpoints (auth, income, expenses, budget, bills, reports)
│   ├── .env.example     # Backend environment template
│   ├── package.json     # Backend dependencies & scripts
│   └── server.js        # Server entrypoint
│
├── frontend/
│   ├── public/          # Static assets & HTML template
│   ├── src/             # React components, pages, context, and styles
│   ├── .env.example     # Frontend environment template
│   ├── package.json     # Frontend dependencies & scripts
│   └── tailwind.config.js
│
├── package.json         # Root runner script (concurrently)
└── LICENSE              # GPLv3 License
```

---

## ⚙️ Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v16+ recommended)
- [MySQL Server](https://dev.mysql.com/downloads/mysql/) running locally or remotely

### 1. Database Setup
Create the MySQL database and import the schema:
```sql
CREATE DATABASE fintrack;
USE fintrack;
SOURCE backend/database/schema.sql;
```

### 2. Environment Configuration

#### Backend
In `backend`, copy `.env.example` to `.env`:
```bash
cp backend/.env.example backend/.env
```
Update the `.env` file with your MySQL database credentials and a secure `JWT_SECRET`:
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=fintrack
JWT_SECRET=your_secret_key_here
JWT_EXPIRES=7d
```

#### Frontend
In `frontend`, copy `.env.example` to `.env`:
```bash
cp frontend/.env.example frontend/.env
```
```env
REACT_APP_API_URL=http://localhost:5000/api
```

---

## 📦 Installation & Running

### Run Both Concurrently (Recommended)
From this directory:
```bash
npm install
npm run dev
```
This runs both the backend server (on `http://localhost:5000`) and the React development frontend (on `http://localhost:3000`) concurrently.

### Run Separately

#### Start Backend
```bash
cd backend
npm install
npm run dev
```

#### Start Frontend
```bash
cd frontend
npm install
npm start
```

---

## 📄 License

This project is licensed under the **GNU General Public License v3 (GPL-3.0)**.  
See the [LICENSE](LICENSE) file for complete terms and conditions.

Copyright (C) 2026 Pavan ([@gpavanmudhiraj-cyber](https://github.com/gpavanmudhiraj-cyber))
