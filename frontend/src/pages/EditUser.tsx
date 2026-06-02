import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import api from "../services/api";
import type { ApiError } from "../types";

function EditUser() {
  const { user, loadUser } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [cpf, setCpf] = useState(user?.cpf || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const isValidCPF = (cpf: string) => {
    const cleaned = cpf.replace(/[^\d]/g, "");
    if (cleaned.length !== 11) return false;
    if (/^(\d)\1+$/.test(cleaned)) return false;
    let sum = 0;
    for (let i = 0; i < 9; i++) sum += parseInt(cleaned[i]) * (10 - i);
    let first = (sum * 10) % 11;
    if (first === 10 || first === 11) first = 0;
    if (first !== parseInt(cleaned[9])) return false;
    sum = 0;
    for (let i = 0; i < 10; i++) sum += parseInt(cleaned[i]) * (11 - i);
    let second = (sum * 10) % 11;
    if (second === 10 || second === 11) second = 0;
    return second === parseInt(cleaned[10]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!isValidCPF(cpf)) {
      setError("CPF inválido");
      return;
    }
    if (password.length < 8 || !/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
      setError("Senha deve ter no mínimo 8 caracteres, uma letra maiúscula e um número");
      return;
    }
    if (password !== confirmPassword) {
      setError("As senhas não coincidem");
      return;
    }

    try {
      setLoading(true);
      await api.put(`/users/${user?.id}`, { name, cpf, password });
      await loadUser();
      setSuccess("Perfil atualizado com sucesso!");
    } catch (err: unknown) {
      const error = err as { response?: { data?: ApiError } };
      setError(error.response?.data?.message || "Erro ao atualizar perfil");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Editar Perfil</h2>
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nome</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Email (não editável)</label>
            <input type="email" value={user?.email || ""} disabled />
          </div>
          <div className="form-group">
            <label>CPF</label>
            <input
              type="text"
              value={cpf}
              onChange={(e) => setCpf(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Nova Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Confirmar Senha</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? "Salvando..." : "Salvar"}
          </button>
          <button type="button" onClick={() => navigate("/dashboard")}>
            Voltar
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditUser;