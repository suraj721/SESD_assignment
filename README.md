# SESD Assignment - Todo API

This is a simple Todo REST API built with Express, TypeScript, MongoDB, and Mongoose.

The project supports creating, updating, deleting, and listing todos, along with a small stats endpoint for summary information.

## Features

- Create, read, update, and delete todos
- Toggle todo status
- Filter todos by completion status
- Search todos by title
- View todo statistics
- Health check endpoint for deployment

## Tech Stack

- Node.js
- Express
- TypeScript
- MongoDB
- Mongoose

## Run Locally

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file using `.env.example`:

```env
MONGODB_URI=mongodb://localhost:27017/todo_db
PORT=8080
```

3. Start the development server:

```bash
npm run dev
```

The API will be available at `http://localhost:8080`.

## Build for Production

```bash
npm run build
npm start
```

## API Routes

| Method | Route | Description |
| --- | --- | --- |
| GET | `/` | Basic API info |
| GET | `/health` | Health check |
| GET | `/todo/allTodos` | List all todos |
| GET | `/todo/allTodos?status=true` | Filter completed todos |
| GET | `/todo/allTodos?search=book` | Search todos by title |
| GET | `/todo/stats` | Get todo statistics |
| GET | `/todo/:id` | Get a single todo |
| POST | `/todo/add` | Create a todo |
| PUT | `/todo/:id` | Update a todo |
| PATCH | `/todo/:id/toggle` | Toggle todo status |
| DELETE | `/todo/:id` | Delete a todo |

## Sample Requests

Create a todo:

```bash
curl -X POST http://localhost:8080/todo/add \
  -H "Content-Type: application/json" \
  -d '{"title":"Finish SESD assignment","status":false}'
```

List todos:

```bash
curl http://localhost:8080/todo/allTodos
```

Get stats:

```bash
curl http://localhost:8080/todo/stats
```

## Deployment

### Vercel

One-click deploy:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fsuraj721%2FSESD_assignment&project-name=sesd-assignment&repository-name=SESD_assignment&env=MONGODB_URI&envDescription=MongoDB%20Atlas%20connection%20string%20for%20the%20Todo%20API&envLink=https%3A%2F%2Fgithub.com%2Fsuraj721%2FSESD_assignment%23deployment)

Manual steps:

1. Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/atlas/database).
2. Copy the application connection string and replace the username, password, and database name placeholders.
3. Import this repository into [Vercel](https://vercel.com/).
4. Add `MONGODB_URI` in the project environment variables.
5. Redeploy after saving the variable.

### Render

1. Create a MongoDB Atlas cluster.
2. Create a new Web Service on [Render](https://render.com/).
3. Connect this GitHub repository.
4. Use:

```text
Build Command: npm install && npm run build
Start Command: npm start
```

5. Add:

```text
MONGODB_URI=<your-atlas-connection-string>
PORT=10000
```

### Railway

1. Create a MongoDB Atlas cluster.
2. Import the repository into [Railway](https://railway.app/).
3. Add `MONGODB_URI` as an environment variable.
4. Deploy the service.

## Author

Suraj Kumar Rai
