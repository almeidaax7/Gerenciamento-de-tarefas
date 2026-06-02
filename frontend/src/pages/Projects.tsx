import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import type { Project, Category, ApiError } from "../types";

function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState<number>(0);
  const [editId, setEditId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();

  const loadProjects = async () => {
    try {
      const res = await api.get(`/projects?page=${page}&limit=5`);
      setProjects(res.data);
    } catch {
      setError("Erro ao carregar projetos");
    }
  };

  const loadCategories = async () => {
    try {
      const res = await api.get("/categories?page=1&limit=100");
      setCategories(res.data);
    } catch {
      setError("Erro ao carregar categorias");
    }
  };

  useEffect(() => {
    loadProjects();
    loadCategories();
  }, [page]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!name) { setError("Nome é obrigatório"); return; }
    if (!categoryId) { setError("Categoria é obrigatória"); return; }
    try {
      if (editId) {
        await api.put(`/projects/${editId}`, { name, description, category_id: categoryId });
        setSuccess("Projeto atualizado!");
      } else {
        await api.post("/projects", { name, description, category_id: categoryId });
        setSuccess("Projeto criado!");
      }
      setName(""); setDescription(""); setCategoryId(0); setEditId(null); setShowForm(false);
      loadProjects();
    } catch (err: unknown) {
      const error = err as { response?: { data?: ApiError } };
      setError(error.response?.data?.message || "Erro ao salvar projeto");
    }
  };

  const handleEdit = (project: Project) => {
    setEditId(project.id);
    setName(project.name);
    setDescription(project.description);
    setCategoryId(project.category_id);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Deseja deletar este projeto?")) return;
    try {
      await api.delete(`/projects/${id}`);
      setSuccess("Projeto deletado!");
      loadProjects();
    } catch {
      setError("Erro ao deletar projeto");
    }
  };

  return (
    <div className="page-container">
      <header className="page-header">
        <h2>📋 Projetos</h2>
        <div className="header-actions">
          <button onClick={() => { setShowForm(!showForm); setEditId(null); setName(""); setDescription(""); setCategoryId(0); }}>
            {showForm ? "Cancelar" : "Novo Projeto"}
          </button>
          <button onClick={() => navigate("/dashboard")}>Voltar</button>
        </div>
      </header>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      {showForm && (
        <div className="form-card">
          <h3>{editId ? "Editar Projeto" : "Novo Projeto"}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Nome *</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Descrição</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Categoria *</label>
              <select value={categoryId} onChange={(e) => setCategoryId(Number(e.target.value))} required>
                <option value={0}>Selecione uma categoria</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <button type="submit">{editId ? "Atualizar" : "Criar"}</button>
          </form>
        </div>
      )}

      <div className="list-container">
        {projects.length === 0 ? (
          <p className="empty-message">Nenhum projeto encontrado.</p>
        ) : (
          projects.map((proj) => (
            <div key={proj.id} className="list-item">
              <div>
                <strong>{proj.name}</strong>
                <p>{proj.description}</p>
                <small>Categoria ID: {proj.category_id}</small>
              </div>
              <div className="item-actions">
                <button onClick={() => handleEdit(proj)}>Editar</button>
                <button onClick={() => handleDelete(proj.id)} className="btn-danger">Deletar</button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="pagination">
        <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>Anterior</button>
        <span>Página {page}</span>
        <button onClick={() => setPage(p => p + 1)} disabled={projects.length < 5}>Próxima</button>
      </div>
    </div>
  );
}

export default Projects;