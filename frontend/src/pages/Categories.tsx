import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import type { Category, ApiError } from "../types";

function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [editId, setEditId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();

  const loadCategories = async () => {
    try {
      const res = await api.get(`/categories?page=${page}&limit=5`);
      setCategories(res.data);
    } catch {
      setError("Erro ao carregar categorias");
    }
  };

  useEffect(() => {
    loadCategories();
  }, [page]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!name) {
      setError("Nome é obrigatório");
      return;
    }
    try {
      if (editId) {
        await api.put(`/categories/${editId}`, { name, description });
        setSuccess("Categoria atualizada!");
      } else {
        await api.post("/categories", { name, description });
        setSuccess("Categoria criada!");
      }
      setName("");
      setDescription("");
      setEditId(null);
      setShowForm(false);
      loadCategories();
    } catch (err: unknown) {
      const error = err as { response?: { data?: ApiError } };
      setError(error.response?.data?.message || "Erro ao salvar categoria");
    }
  };

  const handleEdit = (category: Category) => {
    setEditId(category.id);
    setName(category.name);
    setDescription(category.description);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Deseja deletar esta categoria?")) return;
    try {
      await api.delete(`/categories/${id}`);
      setSuccess("Categoria deletada!");
      loadCategories();
    } catch {
      setError("Erro ao deletar categoria");
    }
  };

  return (
    <div className="page-container">
      <header className="page-header">
        <h2>📁 Categorias</h2>
        <div className="header-actions">
          <button onClick={() => { setShowForm(!showForm); setEditId(null); setName(""); setDescription(""); setError(""); setSuccess(""); }}>
            {showForm ? "Cancelar" : "Nova Categoria"}
          </button>
          <button onClick={() => navigate("/dashboard")}>Voltar</button>
        </div>
      </header>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      {showForm && (
        <div className="form-card">
          <h3>{editId ? "Editar Categoria" : "Nova Categoria"}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Nome *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Descrição</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <button type="submit">{editId ? "Atualizar" : "Criar"}</button>
          </form>
        </div>
      )}

      <div className="list-container">
        {categories.length === 0 ? (
          <p className="empty-message">Nenhuma categoria encontrada.</p>
        ) : (
          categories.map((cat) => (
            <div key={cat.id} className="list-item">
              <div>
                <strong>{cat.name}</strong>
                <p>{cat.description}</p>
              </div>
              <div className="item-actions">
                <button onClick={() => handleEdit(cat)}>Editar</button>
                <button onClick={() => handleDelete(cat.id)} className="btn-danger">Deletar</button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="pagination">
        <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>Anterior</button>
        <span>Página {page}</span>
        <button onClick={() => setPage(p => p + 1)} disabled={categories.length < 5}>Próxima</button>
      </div>
    </div>
  );
}

export default Categories;