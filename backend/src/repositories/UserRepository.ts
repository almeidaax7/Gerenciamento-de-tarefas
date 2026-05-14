import pool from "../database/connection";
import { User } from "../types";

export class UserRepository {
  async findByEmail(email: string): Promise<User | null> {
    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );
    return result.rows[0] || null;
  }

  async findByCPF(cpf: string): Promise<User | null> {
    const result = await pool.query(
      "SELECT * FROM users WHERE cpf = $1",
      [cpf]
    );
    return result.rows[0] || null;
  }

  async findById(id: number): Promise<User | null> {
    const result = await pool.query(
      "SELECT * FROM users WHERE id = $1",
      [id]
    );
    return result.rows[0] || null;
  }

  async create(
    name: string,
    email: string,
    password: string,
    cpf: string
  ): Promise<User> {
    const result = await pool.query(
      `INSERT INTO users (name, email, password, cpf)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [name, email, password, cpf]
    );
    return result.rows[0];
  }

  async update(
    id: number,
    name: string,
    cpf: string,
    password: string
  ): Promise<User> {
    const result = await pool.query(
      `UPDATE users SET name = $1, cpf = $2, password = $3,
       updated_at = NOW() WHERE id = $4 RETURNING *`,
      [name, cpf, password, id]
    );
    return result.rows[0];
  }
}