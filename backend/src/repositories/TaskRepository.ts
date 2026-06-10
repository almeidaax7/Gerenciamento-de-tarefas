import pool from "../database/connection";
import { Task } from "../types";

export class TaskRepository {
  async findAll(user_id: number, page: number, limit: number): Promise<Task[]> {
    const offset = (page - 1) * limit;
    const [rows] = await pool.query(
      "SELECT * FROM tasks WHERE user_id = ? ORDER BY id LIMIT ? OFFSET ?",
      [user_id, limit, offset]
    );
    return rows as Task[];
  }

  async findById(id: number, user_id: number): Promise<Task | null> {
    const [rows] = await pool.query(
      "SELECT * FROM tasks WHERE id = ? AND user_id = ?",
      [id, user_id]
    );
    const tasks = rows as Task[];
    return tasks[0] || null;
  }

  async create(title: string, description: string, status: string, user_id: number, project_id: number): Promise<Task> {
    const [result] = await pool.query(
      "INSERT INTO tasks (title, description, status, user_id, project_id) VALUES (?, ?, ?, ?, ?)",
      [title, description, status, user_id, project_id]
    );
    const insertResult = result as { insertId: number };
    const [rows] = await pool.query(
      "SELECT * FROM tasks WHERE id = ?",
      [insertResult.insertId]
    );
    const tasks = rows as Task[];
    return tasks[0];
  }

  async update(id: number, title: string, description: string, status: string, project_id: number, user_id: number): Promise<Task> {
    await pool.query(
      "UPDATE tasks SET title = ?, description = ?, status = ?, project_id = ?, updated_at = NOW() WHERE id = ? AND user_id = ?",
      [title, description, status, project_id, id, user_id]
    );
    const [rows] = await pool.query(
      "SELECT * FROM tasks WHERE id = ?",
      [id]
    );
    const tasks = rows as Task[];
    return tasks[0];
  }

  async delete(id: number, user_id: number): Promise<boolean> {
    const [result] = await pool.query(
      "DELETE FROM tasks WHERE id = ? AND user_id = ?",
      [id, user_id]
    );
    const deleteResult = result as { affectedRows: number };
    return deleteResult.affectedRows > 0;
  }
}