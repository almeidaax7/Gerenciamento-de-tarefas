import pool from "../database/connection";
import { Project } from "../types";

export class ProjectRepository {
  async findAll(user_id: number, page: number, limit: number): Promise<Project[]> {
    const offset = (page - 1) * limit;
    const result = await pool.query(
      "SELECT * FROM projects WHERE user_id = $1 ORDER BY id LIMIT $2 OFFSET $3",
      [user_id, limit, offset]
    );
    return result.rows;
  }

  async findById(id: number, user_id: number): Promise<Project | null> {
    const result = await pool.query(
      "SELECT * FROM projects WHERE id = $1 AND user_id = $2",
      [id, user_id]
    );
    return result.rows[0] || null;
  }

  async create(
    name: string,
    description: string,
    user_id: number,
    category_id: number
  ): Promise<Project> {
    const result = await pool.query(
      `INSERT INTO projects (name, description, user_id, category_id)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [name, description, user_id, category_id]
    );
    return result.rows[0];
  }

  async update(
    id: number,
    name: string,
    description: string,
    category_id: number,
    user_id: number
  ): Promise<Project> {
    const result = await pool.query(
      `UPDATE projects SET name = $1, description = $2, category_id = $3,
       updated_at = NOW() WHERE id = $4 AND user_id = $5 RETURNING *`,
      [name, description, category_id, id, user_id]
    );
    return result.rows[0];
  }

  async delete(id: number, user_id: number): Promise<boolean> {
    const result = await pool.query(
      "DELETE FROM projects WHERE id = $1 AND user_id = $2",
      [id, user_id]
    );
    return (result.rowCount ?? 0) > 0;
  }
}