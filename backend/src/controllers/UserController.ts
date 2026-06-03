import { Request, Response } from "express";
import { UserService } from "../services/UserService";
import { AuthRequest } from "../types";
import { UserRepository } from "../repositories/UserRepository";

const userService = new UserService();

export class UserController {
  async register(req: Request, res: Response): Promise<void> {
    try {
      const { name, email, password, cpf } = req.body;
      const user = await userService.register(name, email, password, cpf);
      res.status(201).json(user);
    } catch (error: any) {
      console.log("ERRO REGISTRO:", error);
      res.status(400).json({ message: error.message || error.toString() });
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      const result = await userService.login(email, password);
      res.status(200).json(result);
    } catch (error: any) {
      res.status(401).json({ message: error.message });
    }
  }

  async update(req: AuthRequest, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const requesterId = req.user!.id;
      const { name, cpf, password } = req.body;
      const user = await userService.updateUser(id, requesterId, name, cpf, password);
      res.status(200).json(user);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async me(req: AuthRequest, res: Response): Promise<void> {
    try {
      const id = req.user!.id;
      const userRepository = new UserRepository();
      const user = await userRepository.findById(id);
      if (!user) {
        res.status(404).json({ message: "Usuário não encontrado" });
        return;
      }
      const { password: _, ...userWithoutPassword } = user;
      res.status(200).json(userWithoutPassword);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
}