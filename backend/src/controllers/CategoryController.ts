import { Response } from "express";
import { CategoryService } from "../services/CategoryService";
import { AuthRequest } from "../types";

const categoryService = new CategoryService();

export class CategoryController {
  async getAll(req: AuthRequest, res: Response): Promise<void> {
    try {
      const user_id = req.user!.id;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const categories = await categoryService.getAll(user_id, page, limit);
      res.status(200).json(categories);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async getById(req: AuthRequest, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const user_id = req.user!.id;
      const category = await categoryService.getById(id, user_id);
      res.status(200).json(category);
    } catch (error: any) {
      res.status(404).json({ message: error.message });
    }
  }

  async create(req: AuthRequest, res: Response): Promise<void> {
    try {
      const user_id = req.user!.id;
      const { name, description } = req.body;
      const category = await categoryService.create(name, description, user_id);
      res.status(201).json(category);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async update(req: AuthRequest, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const user_id = req.user!.id;
      const { name, description } = req.body;
      const category = await categoryService.update(id, name, description, user_id);
      res.status(200).json(category);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async delete(req: AuthRequest, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const user_id = req.user!.id;
      await categoryService.delete(id, user_id);
      res.status(204).send();
    } catch (error: any) {
      res.status(404).json({ message: error.message });
    }
  }
}