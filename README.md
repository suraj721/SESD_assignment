# SESD Assignment - Todo API

This repository contains a clean Todo application with a simple React frontend and an Express, TypeScript, MongoDB backend.

The API is designed around a simple use case: managing tasks with title, description, priority, and completion status. It also includes a stats endpoint and deployment support for Vercel, Render, and Railway.

## Features

- Create, list, update, and delete todos
- Add optional description and priority
- Toggle completion status
- Filter by completion status and priority
- Search todos by title or description
- Get summary statistics
- Health check route for deployment
- Simple React frontend served from the same project

## Tech Stack

- Node.js
- Express
- TypeScript
- MongoDB
- Mongoose

## Project Structure

```text
public/
├── app.js
├── index.html
└── styles.css

src/
├── config/
├── controllers/
├── models/
├── routes/
├── services/
├── application.ts
└── server.ts
```

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file:

```env
MONGODB_URI=mongodb://localhost:27017/todo_db
PORT=8080
```

You can copy the values from `.env.example`.

3. Run the app:

```bash
npm run dev
```

The server will start at `http://localhost:8080`.

Open that URL in the browser to use the React frontend.

## API Endpoints

| Method | Route | Description |
| --- | --- | --- |
| GET | `/` | React frontend |
| GET | `/health` | Health check |
| GET | `/api/todos` | Get all todos |
| GET | `/api/todos?completed=true` | Filter by completion status |
| GET | `/api/todos?priority=high` | Filter by priority |
| GET | `/api/todos?search=assignment` | Search todos |
| GET | `/api/todos/stats` | Get stats |
| GET | `/api/todos/:id` | Get one todo |
| POST | `/api/todos` | Create a todo |
| PUT | `/api/todos/:id` | Update a todo |
| PATCH | `/api/todos/:id/toggle` | Toggle completion |
| DELETE | `/api/todos/:id` | Delete a todo |

## Example Request

```bash
curl -X POST http://localhost:8080/api/todos \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Finish SESD assignment",
    "description": "Clean up the API project and deploy it",
    "priority": "high",
    "completed": false
  }'
```

## Frontend

The frontend is a lightweight React interface served by Express. It supports:

- creating todos
- editing existing todos
- filtering by status and priority
- searching by title or description
- toggling completion
- deleting todos
- viewing summary stats

## Deployment

### Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fsuraj721%2FSESD_assignment&project-name=sesd-assignment&repository-name=sesd-assignment&env=MONGODB_URI&envDescription=MongoDB%20connection%20string%20for%20the%20Todo%20API)

Set this environment variable before deploying:

```env
MONGODB_URI=<your-mongodb-atlas-connection-string>
```

### Render

- Build command: `npm install && npm run build`
- Start command: `npm start`
- Environment variables:

```env
MONGODB_URI=<your-mongodb-atlas-connection-string>
PORT=10000
```

### Railway

- Import the repository
- Add `MONGODB_URI`
- Deploy

## Author

Suraj Kumar Rai
