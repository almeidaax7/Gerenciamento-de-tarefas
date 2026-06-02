import { useAuth } from "../contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";

function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Gerenciador de Tarefas</h1>
        <div className="header-actions">
          <span>Olá, {user?.name || "Usuário"}!</span>
          <Link to="/edit-user">Editar Perfil</Link>
          <button onClick={handleLogout}>Sair</button>
        </div>
      </header>
      <main className="dashboard-main">
        <h2>Menu Principal</h2>
        <div className="menu-grid">
          <Link to="/categories" className="menu-card">
            <h3>📁 Categorias</h3>
            <p>Gerencie suas categorias</p>
          </Link>
          <Link to="/projects" className="menu-card">
            <h3>📋 Projetos</h3>
            <p>Gerencie seus projetos</p>
          </Link>
          <Link to="/tasks" className="menu-card">
            <h3>✅ Tarefas</h3>
            <p>Gerencie suas tarefas</p>
          </Link>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;