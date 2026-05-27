import { Response } from "express";
import { TaskService } from "../services/TaskService";
import { AuthRequest } from "../types";

const taskService = new TaskService();

export class TaskController {
  async getAll(req: AuthRequest, res: Response): Promise<void> {
    try {
      const user_id = req.user!.id;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const tasks = await taskService.getAll(user_id, page, limit);
      res.status(200).json(tasks);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async getById(req: AuthRequest, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const user_id = req.user!.id;
      const task = await taskService.getById(id, user_id);
      res.status(200).json(task);
    } catch (error: any) {
      res.status(404).json({ message: error.message });
    }
  }

  async create(req: AuthRequest, res: Response): Promise<void> {
    try {
      const user_id = req.user!.id;
      const { title, description, status, project_id } = req.body;
      const task = await taskService.create(
        title, description, status || "pending", user_id, project_id
      );
      res.status(201).json(task);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async update(req: AuthRequest, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const user_id = req.user!.id;
      const { title, description, status, project_id } = req.body;
      const task = await taskService.update(
        id, title, description, status, project_id, user_id
      );
      res.status(200).json(task);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async delete(req: AuthRequest, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const user_id = req.user!.id;
      await taskService.delete(id, user_id);
      res.status(204).send();
    } catch (error: any) {
      res.status(404).json({ message: error.message });
    }
  }
}