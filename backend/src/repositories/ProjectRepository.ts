import pool from "../database/connection";
import { Project } from "../types";

export class ProjectRepository {
  async findAll(user_id: number, page: number, limit: number): Promise<Project[]> {
    const offset = (page - 1) * limit;
    const [rows] = await pool.query(
      "SELECT * FROM projects WHERE user_id = ? ORDER BY id LIMIT ? OFFSET ?",
      [user_id, limit, offset]
    );
    return rows as Project[];
  }

  async findById(id: number, user_id: number): Promise<Project | null> {
    const [rows] = await pool.query(
      "SELECT * FROM projects WHERE id = ? AND user_id = ?",
      [id, user_id]
    );
    const projects = rows as Project[];
    return projects[0] || null;
  }

  async create(name: string, description: string, user_id: number, category_id: number): Promise<Project> {
    const [result] = await pool.query(
      "INSERT INTO projects (name, description, user_id, category_id) VALUES (?, ?, ?, ?)",
      [name, description, user_id, category_id]
    );
    const insertResult = result as { insertId: number };
    const [rows] = await pool.query(
      "SELECT * FROM projects WHERE id = ?",
      [insertResult.insertId]
    );
    const projects = rows as Project[];
    return projects[0];
  }

  async update(id: number, name: string, description: string, category_id: number, user_id: number): Promise<Project> {
    await pool.query(
      "UPDATE projects SET name = ?, description = ?, category_id = ?, updated_at = NOW() WHERE id = ? AND user_id = ?",
      [name, description, category_id, id, user_id]
    );
    const [rows] = await pool.query(
      "SELECT * FROM projects WHERE id = ?",
      [id]
    );
    const projects = rows as Project[];
    return projects[0];
  }

  async delete(id: number, user_id: number): Promise<boolean> {
    const [result] = await pool.query(
      "DELETE FROM projects WHERE id = ? AND user_id = ?",
      [id, user_id]
    );
    const deleteResult = result as { affectedRows: number };
    return deleteResult.affectedRows > 0;
  }
}