import { CategoryRepository } from "../repositories/CategoryRepository";

const categoryRepository = new CategoryRepository();

export class CategoryService {
  async getAll(user_id: number, page: number, limit: number) {
    return categoryRepository.findAll(user_id, page, limit);
  }

  async getById(id: number, user_id: number) {
    const category = await categoryRepository.findById(id, user_id);
    if (!category) throw new Error("Categoria não encontrada");
    return category;
  }

  async create(name: string, description: string, user_id: number) {
    if (!name) throw new Error("Nome é obrigatório");
    return categoryRepository.create(name, description, user_id);
  }

  async update(id: number, name: string, description: string, user_id: number) {
    if (!name) throw new Error("Nome é obrigatório");
    const exists = await categoryRepository.findById(id, user_id);
    if (!exists) throw new Error("Categoria não encontrada");
    return categoryRepository.update(id, name, description, user_id);
  }

  async delete(id: number, user_id: number) {
    const exists = await categoryRepository.findById(id, user_id);
    if (!exists) throw new Error("Categoria não encontrada");
    await categoryRepository.delete(id, user_id);
  }
}