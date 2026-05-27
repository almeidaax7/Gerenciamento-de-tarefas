import { TaskRepository } from "../repositories/TaskRepository";

const taskRepository = new TaskRepository();

const validStatuses = ["pending", "in_progress", "done"];

export class TaskService {
  async getAll(user_id: number, page: number, limit: number) {
    return taskRepository.findAll(user_id, page, limit);
  }

  async getById(id: number, user_id: number) {
    const task = await taskRepository.findById(id, user_id);
    if (!task) throw new Error("Tarefa não encontrada");
    return task;
  }

  async create(
    title: string,
    description: string,
    status: string,
    user_id: number,
    project_id: number
  ) {
    if (!title) throw new Error("Título é obrigatório");
    if (!project_id) throw new Error("Projeto é obrigatório");
    if (!validStatuses.includes(status)) {
      throw new Error("Status inválido. Use: pending, in_progress ou done");
    }
    return taskRepository.create(title, description, status, user_id, project_id);
  }

  async update(
    id: number,
    title: string,
    description: string,
    status: string,
    project_id: number,
    user_id: number
  ) {
    if (!title) throw new Error("Título é obrigatório");
    if (!project_id) throw new Error("Projeto é obrigatório");
    if (!validStatuses.includes(status)) {
      throw new Error("Status inválido. Use: pending, in_progress ou done");
    }
    const exists = await taskRepository.findById(id, user_id);
    if (!exists) throw new Error("Tarefa não encontrada");
    return taskRepository.update(id, title, description, status, project_id, user_id);
  }

  async delete(id: number, user_id: number) {
    const exists = await taskRepository.findById(id, user_id);
    if (!exists) throw new Error("Tarefa não encontrada");
    await taskRepository.delete(id, user_id);
  }
}