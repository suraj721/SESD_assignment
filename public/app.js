const { useEffect, useState } = React;

const emptyForm = {
  title: "",
  description: "",
  priority: "medium",
  completed: false,
};

function App() {
  const [todos, setTodos] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    highPriority: 0,
    completionRate: 0,
  });
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    search: "",
    completed: "",
    priority: "",
  });

  const loadTodos = async () => {
    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams();

      if (filters.search.trim()) {
        params.set("search", filters.search.trim());
      }

      if (filters.completed) {
        params.set("completed", filters.completed);
      }

      if (filters.priority) {
        params.set("priority", filters.priority);
      }

      const [todoResponse, statsResponse] = await Promise.all([
        fetch(`/api/todos?${params.toString()}`),
        fetch("/api/todos/stats"),
      ]);

      const todoJson = await todoResponse.json();
      const statsJson = await statsResponse.json();

      if (!todoResponse.ok) {
        throw new Error(todoJson.message || "Failed to load todos");
      }

      if (!statsResponse.ok) {
        throw new Error(statsJson.message || "Failed to load stats");
      }

      setTodos(todoJson.data);
      setStats(statsJson);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTodos();
  }, [filters.search, filters.completed, filters.priority]);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const method = editingId ? "PUT" : "POST";
      const url = editingId ? `/api/todos/${editingId}` : "/api/todos";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to save todo");
      }

      resetForm();
      await loadTodos();
    } catch (err) {
      setError(err.message || "Unable to save todo");
    } finally {
      setSubmitting(false);
    }
  };

  const startEdit = (todo) => {
    setEditingId(todo._id);
    setForm({
      title: todo.title,
      description: todo.description || "",
      priority: todo.priority,
      completed: todo.completed,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleTodo = async (id) => {
    await fetch(`/api/todos/${id}/toggle`, { method: "PATCH" });
    await loadTodos();
  };

  const deleteTodo = async (id) => {
    await fetch(`/api/todos/${id}`, { method: "DELETE" });
    if (editingId === id) {
      resetForm();
    }
    await loadTodos();
  };

  return (
    <div className="app-shell">
      <section className="hero">
        <h1>SESD Todo Dashboard</h1>
        <p>
          A simple React frontend connected to the Todo API. Create tasks, mark
          them complete, and track how your work is moving.
        </p>
      </section>

      <div className="grid">
        <aside className="panel form-panel">
          <h2 className="section-title">Overview</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <span>Total</span>
              <strong>{stats.total}</strong>
            </div>
            <div className="stat-card">
              <span>Completed</span>
              <strong>{stats.completed}</strong>
            </div>
            <div className="stat-card">
              <span>Pending</span>
              <strong>{stats.pending}</strong>
            </div>
            <div className="stat-card">
              <span>High Priority</span>
              <strong>{stats.highPriority}</strong>
            </div>
          </div>

          <h2 className="section-title">
            {editingId ? "Edit Todo" : "Create Todo"}
          </h2>
          <form className="todo-form" onSubmit={handleSubmit}>
            <input
              placeholder="Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
            <textarea
              placeholder="Description"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
            <select
              value={form.priority}
              onChange={(e) => setForm({ ...form, priority: e.target.value })}
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>
            <label className="helper-text">
              <input
                type="checkbox"
                checked={form.completed}
                onChange={(e) =>
                  setForm({ ...form, completed: e.target.checked })
                }
              />{" "}
              Mark as completed
            </label>
            <div className="actions-row">
              <button className="btn-primary" type="submit" disabled={submitting}>
                {submitting
                  ? "Saving..."
                  : editingId
                  ? "Update Todo"
                  : "Add Todo"}
              </button>
              <button
                className="btn-secondary"
                type="button"
                onClick={resetForm}
              >
                Clear
              </button>
            </div>
          </form>
          {error ? <p className="error-text">{error}</p> : null}
        </aside>

        <section className="panel list-panel">
          <h2 className="section-title">Your Todos</h2>
          <div className="filters">
            <input
              placeholder="Search title or description"
              value={filters.search}
              onChange={(e) =>
                setFilters({ ...filters, search: e.target.value })
              }
            />
            <select
              value={filters.completed}
              onChange={(e) =>
                setFilters({ ...filters, completed: e.target.value })
              }
            >
              <option value="">All Status</option>
              <option value="true">Completed</option>
              <option value="false">Pending</option>
            </select>
            <select
              value={filters.priority}
              onChange={(e) =>
                setFilters({ ...filters, priority: e.target.value })
              }
            >
              <option value="">All Priorities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          {loading ? (
            <p className="helper-text">Loading todos...</p>
          ) : todos.length === 0 ? (
            <div className="empty-state">
              No todos found. Add one from the left panel to get started.
            </div>
          ) : (
            <div className="todo-list">
              {todos.map((todo) => (
                <article className="todo-item" key={todo._id}>
                  <div className="todo-head">
                    <h3>{todo.title}</h3>
                    <span className={`badge ${todo.priority}`}>
                      {todo.priority}
                    </span>
                  </div>
                  <div className="todo-meta">
                    <span className="badge">
                      {todo.completed ? "Completed" : "Pending"}
                    </span>
                    <span>
                      Updated{" "}
                      {new Date(todo.updatedAt).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <p className="todo-description">
                    {todo.description || "No description added."}
                  </p>
                  <div className="todo-actions">
                    <button className="neutral" onClick={() => startEdit(todo)}>
                      Edit
                    </button>
                    <button className="btn-primary" onClick={() => toggleTodo(todo._id)}>
                      {todo.completed ? "Mark Pending" : "Mark Done"}
                    </button>
                    <button className="danger" onClick={() => deleteTodo(todo._id)}>
                      Delete
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
