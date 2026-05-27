import pool from "../database/connection";
import { Task } from "../types";

export class TaskRepository {
  async findAll(user_id: number, page: number, limit: number): Promise<Task[]> {
    const offset = (page - 1) * limit;
    const result = await pool.query(
      "SELECT * FROM tasks WHERE user_id = $1 ORDER BY id LIMIT $2 OFFSET $3",
      [user_id, limit, offset]
    );
    return result.rows;
  }

  async findById(id: number, user_id: number): Promise<Task | null> {
    const result = await pool.query(
      "SELECT * FROM tasks WHERE id = $1 AND user_id = $2",
      [id, user_id]
    );
    return result.rows[0] || null;
  }

  async create(
    title: string,
    description: string,
    status: string,
    user_id: number,
    project_id: number
  ): Promise<Task> {
    const result = await pool.query(
      `INSERT INTO tasks (title, description, status, user_id, project_id)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [title, description, status, user_id, project_id]
    );
    return result.rows[0];
  }

  async update(
    id: number,
    title: string,
    description: string,
    status: string,
    project_id: number,
    user_id: number
  ): Promise<Task> {
    const result = await pool.query(
      `UPDATE tasks SET title = $1, description = $2, status = $3,
       project_id = $4, updated_at = NOW() WHERE id = $5 AND user_id = $6 RETURNING *`,
      [title, description, status, project_id, id, user_id]
    );
    return result.rows[0];
  }

  async delete(id: number, user_id: number): Promise<boolean> {
    const result = await pool.query(
      "DELETE FROM tasks WHERE id = $1 AND user_id = $2",
      [id, user_id]
    );
    return (result.rowCount ?? 0) > 0;
  }
}