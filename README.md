# Todo API

A simple RESTful Todo API built with **Express.js**, **TypeScript**, and **MongoDB**.

## Tech Stack

- Node.js + Express.js
- TypeScript
- MongoDB + Mongoose

## Project Structure

```
src/
├── app.ts              # Express application setup
├── server.ts           # Server entry point
├── controllers/
│   └── todo.controller.ts
├── interfaces/
│   ├── route.interface.ts
│   └── todo.interface.ts
├── models/
│   └── todo.model.ts
└── routes/
    └── todo.routes.ts
```

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Create a `.env` file:

```env
MONGODB_URI=mongodb://localhost:27017/todo_db
```

### 3. Run the server

```bash
npm run dev
```

Server runs at `http://localhost:8080`

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/todo/allTodos` | Get all todos |
| GET | `/todo/:id` | Get todo by ID |
| POST | `/todo/add` | Create new todo |
| PUT | `/todo/:id` | Update todo |
| DELETE | `/todo/:id` | Delete todo |

## Request/Response Examples

### Create Todo

```bash
curl -X POST http://localhost:8080/todo/add \
  -H "Content-Type: application/json" \
  -d '{"title": "Learn TypeScript", "status": false}'
```

### Get All Todos

```bash
curl http://localhost:8080/todo/allTodos
```

### Update Todo

```bash
curl -X PUT http://localhost:8080/todo/<id> \
  -H "Content-Type: application/json" \
  -d '{"title": "Updated title", "status": true}'
```

### Delete Todo

```bash
curl -X DELETE http://localhost:8080/todo/<id>
```

## Todo Schema

```typescript
{
  title: string;   // Required
  status: boolean; // Optional, defaults to false
}
```

## Author

Created by **Suraj Kumar Rai**
