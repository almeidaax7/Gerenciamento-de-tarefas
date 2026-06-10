import pool from "../database/connection";
import { User } from "../types";

export class UserRepository {
  async findByEmail(email: string): Promise<User | null> {
    const [rows] = await pool.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );
    const users = rows as User[];
    return users[0] || null;
  }

  async findByCPF(cpf: string): Promise<User | null> {
    const [rows] = await pool.query(
      "SELECT * FROM users WHERE cpf = ?",
      [cpf]
    );
    const users = rows as User[];
    return users[0] || null;
  }

  async findById(id: number): Promise<User | null> {
    const [rows] = await pool.query(
      "SELECT * FROM users WHERE id = ?",
      [id]
    );
    const users = rows as User[];
    return users[0] || null;
  }

  async create(
    name: string,
    email: string,
    password: string,
    cpf: string
  ): Promise<User> {
    const [result] = await pool.query(
      "INSERT INTO users (name, email, password, cpf) VALUES (?, ?, ?, ?)",
      [name, email, password, cpf]
    );
    const insertResult = result as { insertId: number };
    const user = await this.findById(insertResult.insertId);
    return user!;
  }

  async update(
    id: number,
    name: string,
    cpf: string,
    password: string
  ): Promise<User> {
    await pool.query(
      "UPDATE users SET name = ?, cpf = ?, password = ?, updated_at = NOW() WHERE id = ?",
      [name, cpf, password, id]
    );
    const user = await this.findById(id);
    return user!;
  }
}