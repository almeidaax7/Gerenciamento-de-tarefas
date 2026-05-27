import { Response } from "express";
import { ProjectService } from "../services/ProjectService";
import { AuthRequest } from "../types";

const projectService = new ProjectService();

export class ProjectController {
  async getAll(req: AuthRequest, res: Response): Promise<void> {
    try {
      const user_id = req.user!.id;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const projects = await projectService.getAll(user_id, page, limit);
      res.status(200).json(projects);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async getById(req: AuthRequest, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const user_id = req.user!.id;
      const project = await projectService.getById(id, user_id);
      res.status(200).json(project);
    } catch (error: any) {
      res.status(404).json({ message: error.message });
    }
  }

  async create(req: AuthRequest, res: Response): Promise<void> {
    try {
      const user_id = req.user!.id;
      const { name, description, category_id } = req.body;
      const project = await projectService.create(name, description, user_id, category_id);
      res.status(201).json(project);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async update(req: AuthRequest, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const user_id = req.user!.id;
      const { name, description, category_id } = req.body;
      const project = await projectService.update(id, name, description, category_id, user_id);
      res.status(200).json(project);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async delete(req: AuthRequest, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const user_id = req.user!.id;
      await projectService.delete(id, user_id);
      res.status(204).send();
    } catch (error: any) {
      res.status(404).json({ message: error.message });
    }
  }
}