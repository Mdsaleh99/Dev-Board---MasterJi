# Creating a markdown version of the Dev-Board documentation in the style of the Campus Hub doc


# 📋 Dev-Board – Backend API

A production-ready RESTful backend for a **task management system** where users can manage **Projects** and **Tasks** using secure APIs. Built with **Express.js**, **JWT Authentication**, **API Key Protection**, and **modular architecture**.

---

## 🚀 Features

- 🔐 JWT-based Authentication
- 🔑 API Key generation & validation
- 📁 Project Management (CRUD)
- ✅ Task Management (CRUD + nested under projects)
- 🔄 Modular route structure with middleware
- 🔌 Postman Collection to simulate all flows

---

## 👤 User Roles

This version supports **authenticated users**. (RBAC can be optionally added in future.)

| Role     | Capabilities                                |
|----------|---------------------------------------------|
| User     | Full control over their projects & tasks     |

---

## 📊 Database Tables

- `users` – name, email, password
- `api_keys` – userId, apiKey
- `projects` – userId, title, description, timestamps
- `tasks` – projectId, title, description, status

---

## 🧾 API Routes

### 🔐 Auth Routes

| Method | Route             | Description                | Access      |
|--------|-------------------|----------------------------|-------------|
| POST   | `/auth/register`  | Register new user          | Public      |
| POST   | `/auth/login`     | Login user, return JWT     | Public      |
| POST   | `/auth/signout`   | Logout user (client-side)  | Authenticated |
| POST   | `/auth/api-key`   | Generate API Key           | Authenticated |
| GET    | `/auth/me`        | Get current user profile   | Authenticated |

---

### 📁 Project Routes

| Method | Route                 | Description              | Access         |
|--------|-----------------------|--------------------------|----------------|
| POST   | `/projects`           | Create new project       | Auth + API Key |
| GET    | `/projects`           | Get all user projects    | Auth + API Key |
| GET    | `/projects/:id`       | Get project by ID        | Auth + API Key |
| PUT    | `/projects/:id`       | Update a project         | Auth + API Key |
| DELETE | `/projects/:id`       | Delete a project         | Auth + API Key |

---

### ✅ Task Routes

| Method | Route                                 | Description                  | Access         |
|--------|----------------------------------------|------------------------------|----------------|
| POST   | `/projects/:projectId/tasks`           | Create a task in a project   | Auth + API Key |
| GET    | `/projects/:projectId/tasks`           | Get all tasks for project    | Auth + API Key |
| GET    | `/tasks/:id`                           | Get task by ID               | Auth + API Key |
| PUT    | `/tasks/:id`                           | Update task                  | Auth + API Key |
| DELETE | `/tasks/:id`                           | Delete task                  | Auth + API Key |

---

## 🛡️ Middleware Flow

All protected routes use:

- `jwtMiddleware` – Verifies JWT for authentication
- `apiKeyMiddleware` – Verifies `x-api-key` in headers

---

## 🧪 Postman Collection

[Dev-Board Collection](https://www.postman.com/mdsaleh24/mohammed-saleh-masterji-assignment/collection/31971271-3e79f9aa-558d-4aff-96f5-ff05a2ea0f60?action=share&creator=31971271)

---

## 📦 Technologies Used

- **Node.js + Express**
- **JWT Auth**
- **API Key Security**
- **Prisma ORM**
- **Postman Collection**
- **Clean Modular Structure**