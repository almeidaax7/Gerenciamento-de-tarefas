import pool from "../database/connection";
import { Category } from "../types";

export class CategoryRepository {
  async findAll(user_id: number, page: number, limit: number): Promise<Category[]> {
    const offset = (page - 1) * limit;
    const result = await pool.query(
      "SELECT * FROM categories WHERE user_id = $1 ORDER BY id LIMIT $2 OFFSET $3",
      [user_id, limit, offset]
    );
    return result.rows;
  }

  async findById(id: number, user_id: number): Promise<Category | null> {
    const result = await pool.query(
      "SELECT * FROM categories WHERE id = $1 AND user_id = $2",
      [id, user_id]
    );
    return result.rows[0] || null;
  }

  async create(name: string, description: string, user_id: number): Promise<Category> {
    const result = await pool.query(
      "INSERT INTO categories (name, description, user_id) VALUES ($1, $2, $3) RETURNING *",
      [name, description, user_id]
    );
    return result.rows[0];
  }

  async update(id: number, name: string, description: string, user_id: number): Promise<Category> {
    const result = await pool.query(
      "UPDATE categories SET name = $1, description = $2, updated_at = NOW() WHERE id = $3 AND user_id = $4 RETURNING *",
      [name, description, id, user_id]
    );
    return result.rows[0];
  }

  async delete(id: number, user_id: number): Promise<boolean> {
    const result = await pool.query(
      "DELETE FROM categories WHERE id = $1 AND user_id = $2",
      [id, user_id]
    );
    return (result.rowCount ?? 0) > 0;
  }
}