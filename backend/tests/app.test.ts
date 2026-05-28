import request from "supertest";
import app from "../src/index";

const userData = {
  name: "Teste User",
  email: "teste@email.com",
  password: "Senha123",
  cpf: "529.982.247-25",
};

let token: string;
let userId: number;
let categoryId: number;
let projectId: number;
let taskId: number;

describe("Autenticação", () => {
  it("deve cadastrar um usuário", async () => {
    const res = await request(app).post("/users/register").send(userData);
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id");
    userId = res.body.id;
  });

  it("não deve cadastrar com email inválido", async () => {
    const res = await request(app).post("/users/register").send({
      ...userData,
      email: "emailinvalido",
    });
    expect(res.status).toBe(400);
  });

  it("não deve cadastrar com CPF inválido", async () => {
    const res = await request(app).post("/users/register").send({
      ...userData,
      email: "outro@email.com",
      cpf: "111.111.111-11",
    });
    expect(res.status).toBe(400);
  });

  it("não deve cadastrar com senha fraca", async () => {
    const res = await request(app).post("/users/register").send({
      ...userData,
      email: "outro@email.com",
      password: "fraca",
    });
    expect(res.status).toBe(400);
  });

  it("deve fazer login", async () => {
    const res = await request(app).post("/users/login").send({
      email: userData.email,
      password: userData.password,
    });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
    token = res.body.token;
  });

  it("não deve logar com senha errada", async () => {
    const res = await request(app).post("/users/login").send({
      email: userData.email,
      password: "SenhaErrada123",
    });
    expect(res.status).toBe(401);
  });
});

describe("Edição de Usuário", () => {
  it("deve editar o próprio usuário", async () => {
    const res = await request(app)
      .put(`/users/${userId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Nome Atualizado", cpf: "529.982.247-25", password: "Senha123" });
    expect(res.status).toBe(200);
  });

  it("não deve editar sem token", async () => {
    const res = await request(app)
      .put(`/users/${userId}`)
      .send({ name: "Nome", cpf: "529.982.247-25", password: "Senha123" });
    expect(res.status).toBe(401);
  });
});

describe("CRUD Categorias", () => {
  it("deve criar uma categoria", async () => {
    const res = await request(app)
      .post("/categories")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Categoria Teste", description: "Descrição" });
    expect(res.status).toBe(201);
    categoryId = res.body.id;
  });

  it("deve listar categorias", async () => {
    const res = await request(app)
      .get("/categories")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("deve buscar categoria por id", async () => {
    const res = await request(app)
      .get(`/categories/${categoryId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
  });

  it("deve atualizar uma categoria", async () => {
    const res = await request(app)
      .put(`/categories/${categoryId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Categoria Atualizada", description: "Nova descrição" });
    expect(res.status).toBe(200);
  });

  it("não deve buscar categoria inexistente", async () => {
    const res = await request(app)
      .get("/categories/99999")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(404);
  });
});

describe("CRUD Projetos", () => {
  it("deve criar um projeto", async () => {
    const res = await request(app)
      .post("/projects")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Projeto Teste", description: "Descrição", category_id: categoryId });
    expect(res.status).toBe(201);
    projectId = res.body.id;
  });

  it("deve listar projetos", async () => {
    const res = await request(app)
      .get("/projects")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("deve atualizar um projeto", async () => {
    const res = await request(app)
      .put(`/projects/${projectId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Projeto Atualizado", description: "Nova descrição", category_id: categoryId });
    expect(res.status).toBe(200);
  });

  it("não deve buscar projeto inexistente", async () => {
    const res = await request(app)
      .get("/projects/99999")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(404);
  });
});

describe("CRUD Tarefas", () => {
  it("deve criar uma tarefa", async () => {
    const res = await request(app)
      .post("/tasks")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Tarefa Teste", description: "Descrição", status: "pending", project_id: projectId });
    expect(res.status).toBe(201);
    taskId = res.body.id;
  });

  it("deve listar tarefas", async () => {
    const res = await request(app)
      .get("/tasks")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("deve atualizar uma tarefa", async () => {
    const res = await request(app)
      .put(`/tasks/${taskId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Tarefa Atualizada", description: "Nova descrição", status: "done", project_id: projectId });
    expect(res.status).toBe(200);
  });

  it("não deve buscar tarefa inexistente", async () => {
    const res = await request(app)
      .get("/tasks/99999")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(404);
  });

  it("deve deletar uma tarefa", async () => {
    const res = await request(app)
      .delete(`/tasks/${taskId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(204);
  });
});

describe("Limpeza", () => {
  it("deve deletar o projeto", async () => {
    const res = await request(app)
      .delete(`/projects/${projectId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(204);
  });

  it("deve deletar a categoria", async () => {
    const res = await request(app)
      .delete(`/categories/${categoryId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(204);
  });
});