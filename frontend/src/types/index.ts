export interface User {
  id: number;
  name: string;
  email: string;
  cpf: string;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: number;
  name: string;
  description: string;
  user_id: number;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: number;
  name: string;
  description: string;
  user_id: number;
  category_id: number;
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: number;
  title: string;
  description: string;
  status: "pending" | "in_progress" | "done";
  user_id: number;
  project_id: number;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  token: string;
}

export interface ApiError {
  message: string;
}