import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import type { Task, Project, ApiError } from "../types";

function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<"pending" | "in_progress" | "done">("pending");
  const [projectId, setProjectId] = useState<number>(0);
  const [editId, setEditId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();

  const loadTasks = async () => {
    try {
      const res = await api.get(`/tasks?page=${page}&limit=5`);
      setTasks(res.data);
    } catch {
      setError("Erro ao carregar tarefas");
    }
  };

  const loadProjects = async () => {
    try {
      const res = await api.get("/projects?page=1&limit=100");
      setProjects(res.data);
    } catch {
      setError("Erro ao carregar projetos");
    }
  };

  useEffect(() => {
    loadTasks();
    loadProjects();
  }, [page]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!title) { setError("Título é obrigatório"); return; }
    if (!projectId) { setError("Projeto é obrigatório"); return; }
    try {
      if (editId) {
        await api.put(`/tasks/${editId}`, { title, description, status, project_id: projectId });
        setSuccess("Tarefa atualizada!");
      } else {
        await api.post("/tasks", { title, description, status, project_id: projectId });
        setSuccess("Tarefa criada!");
      }
      setTitle(""); setDescription(""); setStatus("pending"); setProjectId(0); setEditId(null); setShowForm(false);
      loadTasks();
    } catch (err: unknown) {
      const error = err as { response?: { data?: ApiError } };
      setError(error.response?.data?.message || "Erro ao salvar tarefa");
    }
  };

  const handleEdit = (task: Task) => {
    setEditId(task.id);
    setTitle(task.title);
    setDescription(task.description);
    setStatus(task.status);
    setProjectId(task.project_id);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Deseja deletar esta tarefa?")) return;
    try {
      await api.delete(`/tasks/${id}`);
      setSuccess("Tarefa deletada!");
      loadTasks();
    } catch {
      setError("Erro ao deletar tarefa");
    }
  };

  const statusLabel = (s: string) => {
    if (s === "pending") return "⏳ Pendente";
    if (s === "in_progress") return "🔄 Em andamento";
    return "✅ Concluída";
  };

  return (
    <div className="page-container">
      <header className="page-header">
        <h2>✅ Tarefas</h2>
        <div className="header-actions">
          <button onClick={() => { setShowForm(!showForm); setEditId(null); setTitle(""); setDescription(""); setStatus("pending"); setProjectId(0); setError(""); setSuccess(""); }}>
            {showForm ? "Cancelar" : "Nova Tarefa"}
          </button>
          <button onClick={() => navigate("/dashboard")}>Voltar</button>
        </div>
      </header>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      {showForm && (
        <div className="form-card">
          <h3>{editId ? "Editar Tarefa" : "Nova Tarefa"}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Título *</label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Descrição</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value as "pending" | "in_progress" | "done")}>
                <option value="pending">Pendente</option>
                <option value="in_progress">Em andamento</option>
                <option value="done">Concluída</option>
              </select>
            </div>
            <div className="form-group">
              <label>Projeto *</label>
              <select value={projectId} onChange={(e) => setProjectId(Number(e.target.value))}>
                <option value={0}>Selecione um projeto</option>
                {projects.map((proj) => (
                  <option key={proj.id} value={proj.id}>{proj.name}</option>
                ))}
              </select>
            </div>
            <button type="submit">{editId ? "Atualizar" : "Criar"}</button>
          </form>
        </div>
      )}

      <div className="list-container">
        {tasks.length === 0 ? (
          <p className="empty-message">Nenhuma tarefa encontrada.</p>
        ) : (
          tasks.map((task) => (
            <div key={task.id} className="list-item">
              <div>
                <strong>{task.title}</strong>
                <p>{task.description}</p>
                <small>{statusLabel(task.status)}</small>
              </div>
              <div className="item-actions">
                <button onClick={() => handleEdit(task)}>Editar</button>
                <button onClick={() => handleDelete(task.id)} className="btn-danger">Deletar</button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="pagination">
        <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>Anterior</button>
        <span>Página {page}</span>
        <button onClick={() => setPage(p => p + 1)} disabled={tasks.length < 5}>Próxima</button>
      </div>
    </div>
  );
}

export default Tasks;