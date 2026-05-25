import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserRepository } from "../repositories/UserRepository";
import { isValidEmail, isValidCPF, isValidPassword } from "../utils/validators";

const userRepository = new UserRepository();

export class UserService {
  async register(
    name: string,
    email: string,
    password: string,
    cpf: string
  ) {
    if (!name || !email || !password || !cpf) {
      throw new Error("Todos os campos são obrigatórios");
    }
    if (!isValidEmail(email)) throw new Error("Email inválido");
    if (!isValidCPF(cpf)) throw new Error("CPF inválido");
    if (!isValidPassword(password)) {
      throw new Error("Senha deve ter no mínimo 8 caracteres, uma letra maiúscula e um número");
    }

    const emailExists = await userRepository.findByEmail(email);
    if (emailExists) throw new Error("Email já cadastrado");

    const cpfExists = await userRepository.findByCPF(cpf);
    if (cpfExists) throw new Error("CPF já cadastrado");

    const hashed = await bcrypt.hash(password, 10);
    const user = await userRepository.create(name, email, hashed, cpf);

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async login(email: string, password: string) {
    if (!email || !password) {
      throw new Error("Todos os campos são obrigatórios");
    }
    if (!isValidEmail(email)) throw new Error("Email inválido");

    const user = await userRepository.findByEmail(email);
    if (!user) throw new Error("Usuário não encontrado");

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new Error("Senha incorreta");

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET as string,
      { expiresIn: "8h" }
    );
    return { token };
  }

  async updateUser(
    id: number,
    requesterId: number,
    name: string,
    cpf: string,
    password: string
  ) {
    if (id !== requesterId) {
      throw new Error("Você não pode editar outro usuário");
    }
    if (!name || !cpf || !password) {
      throw new Error("Todos os campos são obrigatórios");
    }
    if (!isValidCPF(cpf)) throw new Error("CPF inválido");
    if (!isValidPassword(password)) {
      throw new Error("Senha deve ter no mínimo 8 caracteres, uma letra maiúscula e um número");
    }

    const user = await userRepository.findById(id);
    if (!user) throw new Error("Usuário não encontrado");

    const cpfExists = await userRepository.findByCPF(cpf);
    if (cpfExists && cpfExists.id !== id) {
      throw new Error("CPF já cadastrado");
    }

    const hashed = await bcrypt.hash(password, 10);
    const updated = await userRepository.update(id, name, cpf, hashed);

    const { password: _, ...userWithoutPassword } = updated;
    return userWithoutPassword;
  }
}