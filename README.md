# SESD Assignment: Todo API

A RESTful Todo API built with **Express.js**, **TypeScript**, and **MongoDB**.

This submission has been prepared by **Suraj Kumar Rai**.

## What is new

- Full CRUD support for todos
- New `GET /todo/stats` endpoint for summary metrics
- Filtering and search support on `GET /todo/allTodos`
- `PATCH /todo/:id/toggle` endpoint for quick status updates
- Deployment-ready scripts with `build` and `start`
- Root and health endpoints for easier cloud deployment checks

## Tech Stack

- Node.js
- Express.js
- TypeScript
- MongoDB with Mongoose

## Project Structure

```text
src/
├── app.ts
├── server.ts
├── controllers/
├── models/
├── routes/
└── utils/
```

## Local Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create a `.env` file in the project root:

```env
MONGODB_URI=mongodb://localhost:27017/todo_db
PORT=8080
```

### 3. Run in development

```bash
npm run dev
```

The API will run at `http://localhost:8080`.

## Production Run

Build the TypeScript project:

```bash
npm run build
```

Start the compiled server:

```bash
npm start
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | API info and quick links |
| GET | `/health` | Health check endpoint |
| GET | `/todo/allTodos` | Get all todos |
| GET | `/todo/allTodos?status=true` | Filter by completion status |
| GET | `/todo/allTodos?search=read` | Search todos by title |
| GET | `/todo/stats` | Get todo statistics |
| GET | `/todo/:id` | Get a single todo |
| POST | `/todo/add` | Create a todo |
| PUT | `/todo/:id` | Update a todo |
| PATCH | `/todo/:id/toggle` | Toggle completion status |
| DELETE | `/todo/:id` | Delete a todo |

## Sample Requests

### Create a todo

```bash
curl -X POST http://localhost:8080/todo/add \
  -H "Content-Type: application/json" \
  -d '{"title":"Prepare SESD submission","status":false}'
```

### Get all todos with search

```bash
curl "http://localhost:8080/todo/allTodos?search=submission&sort=desc"
```

### Toggle a todo

```bash
curl -X PATCH http://localhost:8080/todo/<id>/toggle
```

### Get statistics

```bash
curl http://localhost:8080/todo/stats
```

## Deployment Guide

### Option 1: Render

1. Push this project to your GitHub repository.
2. Create a free MongoDB database on [MongoDB Atlas](https://www.mongodb.com/atlas/database).
3. In Render, create a new `Web Service` from the GitHub repo.
4. Use these settings:

```text
Build Command: npm install && npm run build
Start Command: npm start
```

5. Add environment variables in Render:

```text
MONGODB_URI=<your-mongodb-atlas-connection-string>
PORT=10000
```

6. Deploy the service.

### Option 2: Railway

1. Open [Railway](https://railway.app/).
2. Deploy the GitHub repository.
3. Add `MONGODB_URI` as an environment variable.
4. Railway usually provides `PORT` automatically, and this project already supports that.
5. Run the deployment.

## Submission Notes

- Repository owner: `suraj721`
- Project author inside code: **Suraj Kumar Rai**
- Package author field: **Suraj Kumar Rai**
- README author credit: **Suraj Kumar Rai**

## Author

**Suraj Kumar Rai**
