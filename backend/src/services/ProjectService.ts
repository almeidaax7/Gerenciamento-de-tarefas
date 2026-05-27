import { ProjectRepository } from "../repositories/ProjectRepository";

const projectRepository = new ProjectRepository();

export class ProjectService {
  async getAll(user_id: number, page: number, limit: number) {
    return projectRepository.findAll(user_id, page, limit);
  }

  async getById(id: number, user_id: number) {
    const project = await projectRepository.findById(id, user_id);
    if (!project) throw new Error("Projeto não encontrado");
    return project;
  }

  async create(
    name: string,
    description: string,
    user_id: number,
    category_id: number
  ) {
    if (!name) throw new Error("Nome é obrigatório");
    if (!category_id) throw new Error("Categoria é obrigatória");
    return projectRepository.create(name, description, user_id, category_id);
  }

  async update(
    id: number,
    name: string,
    description: string,
    category_id: number,
    user_id: number
  ) {
    if (!name) throw new Error("Nome é obrigatório");
    if (!category_id) throw new Error("Categoria é obrigatória");
    const exists = await projectRepository.findById(id, user_id);
    if (!exists) throw new Error("Projeto não encontrado");
    return projectRepository.update(id, name, description, category_id, user_id);
  }

  async delete(id: number, user_id: number) {
    const exists = await projectRepository.findById(id, user_id);
    if (!exists) throw new Error("Projeto não encontrado");
    await projectRepository.delete(id, user_id);
  }
}