# RomboTask Backend

Backend API for the RomboTask project management application.  
Built with Node.js, Express, and MongoDB, it provides all core functionality for managing users, projects, and tasks.

## Live API

https://rombotaskbackend-production.up.railway.app

## Features

- RESTful API for project and task management
- Nested resource routing (projects → tasks → notes)
- User authentication with **JWT**
- Password recovery system
- Role-based authorization (manager / collaborator)
- Secure access to protected endpoints
- Scalable architecture with separated layers

## Tech Stack

- **Node.js** – runtime environment
- **Express** – web framework
- **TypeScript** – static typing
- **MongoDB** – database
- **Mongoose** – ORM
- **JWT** – authentication

## Architecture Highlights

### REST API Design

- Structured endpoints following REST principles
- Nested routes for hierarchical data (projects → tasks)

### Authentication & Authorization

- JWT-based authentication
- Role-based access control:
  - Managers can edit and manage
  - Collaborators have limited permissions

### Database Layer

- MongoDB with **Mongoose**
- Models define schema and relationships

### Security

- Protected routes using middleware
- Token validation and user verification

## Project Structure
```text
src
├── config              # CORS, DB, and Nodemailer configuration
├── controllers         # Auth, Project, Task, Team, and Note controllers
├── emails              # Email templates (AuthEmail)
├── middleware          # Custom middleware
│   ├── paramMiddleware # Resource validation (Project, Task, Note)
│   ├── auth.ts         # JWT validation
│   └── validation.ts
├── models              # Mongoose schemas (User, Project, Task, Note, Token)
├── routes              # API Route definitions
├── types               # TypeScript definitions
├── utils               # Helper functions
├── server.ts           # Server entry point
└── index.ts            # App initialization
```

## Installation

Clone the repository:

```bash
git clone https://github.com/RomboTask-Fullstack/RomboTask_Backend.git
```

Install dependencies:

```bash
npm install
```

Required Variables (.env):
   - `DATABASE_URL`, `JWT_SECRET`, `FRONTEND_URL`, `BREVO_API_KEY`

Run the server:

```bash
npm run dev
```

## Author

Developed by **Jordi Romero**

