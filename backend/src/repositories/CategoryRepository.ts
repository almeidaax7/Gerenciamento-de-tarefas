import pool from "../database/connection";
import { Category } from "../types";

export class CategoryRepository {
  async findAll(user_id: number, page: number, limit: number): Promise<Category[]> {
    const offset = (page - 1) * limit;
    const [rows] = await pool.query(
      "SELECT * FROM categories WHERE user_id = ? ORDER BY id LIMIT ? OFFSET ?",
      [user_id, limit, offset]
    );
    return rows as Category[];
  }

  async findById(id: number, user_id: number): Promise<Category | null> {
    const [rows] = await pool.query(
      "SELECT * FROM categories WHERE id = ? AND user_id = ?",
      [id, user_id]
    );
    const categories = rows as Category[];
    return categories[0] || null;
  }

  async create(name: string, description: string, user_id: number): Promise<Category> {
    const [result] = await pool.query(
      "INSERT INTO categories (name, description, user_id) VALUES (?, ?, ?)",
      [name, description, user_id]
    );
    const insertResult = result as { insertId: number };
    const [rows] = await pool.query(
      "SELECT * FROM categories WHERE id = ?",
      [insertResult.insertId]
    );
    const categories = rows as Category[];
    return categories[0];
  }

  async update(id: number, name: string, description: string, user_id: number): Promise<Category> {
    await pool.query(
      "UPDATE categories SET name = ?, description = ?, updated_at = NOW() WHERE id = ? AND user_id = ?",
      [name, description, id, user_id]
    );
    const [rows] = await pool.query(
      "SELECT * FROM categories WHERE id = ?",
      [id]
    );
    const categories = rows as Category[];
    return categories[0];
  }

  async delete(id: number, user_id: number): Promise<boolean> {
    const [result] = await pool.query(
      "DELETE FROM categories WHERE id = ? AND user_id = ?",
      [id, user_id]
    );
    const deleteResult = result as { affectedRows: number };
    return deleteResult.affectedRows > 0;
  }
}