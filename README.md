# SQL Injection Simulator 🛡️💉

A professional Full-Stack security demonstration tool designed to illustrate the mechanics of SQL Injection (SQLi) attacks and the effectiveness of modern defense mechanisms like Parameterized Queries.

## 🚀 Live Demo
Experience the simulation here:  
**[SQL Injection Simulator - Live Site](https://sql-injection-simulator-two.vercel.app/)**

---

## 📖 Overview
This project provides a side-by-side comparison between a vulnerable authentication system and a secure one. It serves as an educational resource for developers and security enthusiasts to understand how unvalidated input can compromise a database and how to implement robust fixes.

### The Attack: SQL Injection
In the **Vulnerable System**, user input is directly concatenated into the SQL string. This allows an attacker to inject logic (e.g., `' OR 1=1 --`) that alters the query's behavior, bypassing password checks and gaining unauthorized access.

### The Defense: Parameterized Queries
In the **Secure System**, input is treated strictly as data, not as part of the executable command. By using prepared statements, the database engine ensures that malicious characters are properly escaped, rendering the injection attempt harmless.

---

## ✨ Features
- **Side-by-Side Comparison:** Visually compare vulnerable vs. secure login endpoints in real-time.
- **One-Click Exploit:** Use the "Inject Payload" button to automatically insert the classic `' OR 1=1 --` bypass string.
- **Visual Feedback:**
  - 🚩 **System Breached:** Displays leaked database records and admin credentials when an attack succeeds.
  - ✅ **Attack Blocked:** Demonstrates how secure systems handle malicious strings as literal text, preventing the exploit.
- **In-Memory Database:** Uses SQLite in-memory for fast, isolated, and safe simulations.

---

## 🛠️ Tech Stack
- **Frontend:** React, Vite, Tailwind CSS (Modern Dark UI).
- **Backend:** Node.js, Express.
- **Database:** SQLite (using `better-sqlite3` or `sqlite3`).
- **Deployment:** Vercel (Serverless Functions for Backend).

---

## 📂 Project Structure
This repository is organized as a **Monorepo**:

```text
├── backend/            # Express.js API & SQLite Integration
│   └── server.js       # Vulnerable & Secure logic implementation
├── frontend/           # React application (Vite)
│   └── src/            # Simulation UI components
├── vercel.json         # Routing & Deployment configuration
└── README.md           # Documentation
```

---

## ⚙️ Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/Yahav78/SQL-Injection-Simulator.git
cd SQL-Injection-Simulator
```

### 2. Setup Backend

```bash
cd server
npm install
node index.js
```

### 3. Setup Frontend

Open a new terminal window:

```bash
cd client
npm install
npm run dev
```

---

## ⚠️ Disclaimer
This simulator is for educational and research purposes only. It intentionally demonstrates vulnerabilities to teach secure coding practices. Never use these techniques on systems you do not own.

---

## 👤 Author
Yahav Vituri - Computer Science Student @ Ramat Gan Academic College
