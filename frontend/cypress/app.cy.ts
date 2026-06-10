const BASE_URL = "http://localhost:5173";

const user = {
  name: "Cypress User",
  email: "cypress@teste.com",
  cpf: "529.982.247-25",
  password: "Senha123",
};

describe("Autenticação", () => {
  before(() => {
    cy.request("DELETE", "http://localhost:3000/users/test-cleanup").then(
      () => {}
    );
  });

  it("deve cadastrar um usuário com sucesso", () => {
    cy.visit(`${BASE_URL}/register`);
    cy.get("input[placeholder='Seu nome']").type(user.name);
    cy.get("input[placeholder='seu@email.com']").type(user.email);
    cy.get("input[placeholder='000.000.000-00']").type(user.cpf);
    cy.get("input[placeholder='Mínimo 8 caracteres']").type(user.password);
    cy.get("input[placeholder='Repita a senha']").type(user.password);
    cy.get("button[type='submit']").click();
    cy.url().should("include", "/login");
  });

  it("não deve cadastrar com email inválido", () => {
    cy.visit(`${BASE_URL}/register`);
    cy.get("input[placeholder='Seu nome']").type(user.name);
    cy.get("input[placeholder='seu@email.com']").type("emailinvalido");
    cy.get("input[placeholder='000.000.000-00']").type(user.cpf);
    cy.get("input[placeholder='Mínimo 8 caracteres']").type(user.password);
    cy.get("input[placeholder='Repita a senha']").type(user.password);
    cy.get("button[type='submit']").click();
    cy.contains("Email inválido").should("be.visible");
  });

  it("deve fazer login com sucesso", () => {
    cy.visit(`${BASE_URL}/login`);
    cy.get("input[placeholder='seu@email.com']").type(user.email);
    cy.get("input[placeholder='Sua senha']").type(user.password);
    cy.get("button[type='submit']").click();
    cy.url().should("include", "/dashboard");
  });

  it("não deve fazer login com senha errada", () => {
    cy.visit(`${BASE_URL}/login`);
    cy.get("input[placeholder='seu@email.com']").type(user.email);
    cy.get("input[placeholder='Sua senha']").type("SenhaErrada123");
    cy.get("button[type='submit']").click();
    cy.contains("Senha incorreta").should("be.visible");
  });
});

describe("CRUD Categorias", () => {
  beforeEach(() => {
    cy.visit(`${BASE_URL}/login`);
    cy.get("input[placeholder='seu@email.com']").type(user.email);
    cy.get("input[placeholder='Sua senha']").type(user.password);
    cy.get("button[type='submit']").click();
    cy.url().should("include", "/dashboard");
    cy.visit(`${BASE_URL}/categories`);
  });

  it("deve criar uma categoria com sucesso", () => {
    cy.contains("Nova Categoria").click();
    cy.get("input[type='text']").first().type("Categoria Cypress");
    cy.get("button[type='submit']").click();
    cy.contains("Categoria criada!").should("be.visible");
    cy.contains("Categoria Cypress").should("be.visible");
  });

  it("não deve criar categoria sem nome", () => {
    cy.contains("Nova Categoria").click();
    cy.get("button[type='submit']").click();
    cy.contains("Nome é obrigatório").should("be.visible");
  });

  it("deve editar uma categoria", () => {
    cy.contains("Categoria Cypress")
      .parent()
      .parent()
      .find("button")
      .first()
      .click();
    cy.get("input[type='text']").first().clear().type("Categoria Editada");
    cy.get("button[type='submit']").click();
    cy.contains("Categoria atualizada!").should("be.visible");
  });

  it("deve deletar uma categoria", () => {
    cy.contains("Categoria Editada")
      .parent()
      .parent()
      .find(".btn-danger")
      .click();
    cy.on("window:confirm", () => true);
    cy.contains("Categoria deletada!").should("be.visible");
  });
});

describe("CRUD Tarefas", () => {
  beforeEach(() => {
    cy.visit(`${BASE_URL}/login`);
    cy.get("input[placeholder='seu@email.com']").type(user.email);
    cy.get("input[placeholder='Sua senha']").type(user.password);
    cy.get("button[type='submit']").click();
    cy.url().should("include", "/dashboard");
  });

  it("deve criar uma tarefa com sucesso", () => {
    cy.visit(`${BASE_URL}/tasks`);
    cy.contains("Nova Tarefa").click();
    cy.get("input[type='text']").first().type("Tarefa Cypress");
    cy.get("select").last().select(1);
    cy.get("button[type='submit']").click();
    cy.contains("Tarefa criada!").should("be.visible");
  });

  it("não deve criar tarefa sem título", () => {
    cy.visit(`${BASE_URL}/tasks`);
    cy.contains("Nova Tarefa").click();
    cy.get("button[type='submit']").click();
    cy.contains("Título é obrigatório").should("be.visible");
  });

  it("deve editar uma tarefa", () => {
    cy.visit(`${BASE_URL}/tasks`);
    cy.contains("Tarefa Cypress")
      .parent()
      .parent()
      .find("button")
      .first()
      .click();
    cy.get("input[type='text']").first().clear().type("Tarefa Editada");
    cy.get("button[type='submit']").click();
    cy.contains("Tarefa atualizada!").should("be.visible");
  });

  it("deve deletar uma tarefa", () => {
    cy.visit(`${BASE_URL}/tasks`);
    cy.contains("Tarefa Editada")
      .parent()
      .parent()
      .find(".btn-danger")
      .click();
    cy.on("window:confirm", () => true);
    cy.contains("Tarefa deletada!").should("be.visible");
  });
});