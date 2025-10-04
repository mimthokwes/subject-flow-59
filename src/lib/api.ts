const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export interface Subject {
  subject_id: number;
  name: string;
  created_at?: string;
}

export interface Task {
  task_id: number;
  subject_id: number;
  title: string;
  description?: string;
  due_date?: string;
  status: 'pending' | 'in_progress' | 'done';
  created_at?: string;
}

// Subject endpoints
export const subjectApi = {
  getAll: async (): Promise<Subject[]> => {
    const response = await fetch(`${API_BASE_URL}/subjects`);
    if (!response.ok) throw new Error('Failed to fetch subjects');
    return response.json();
  },

  create: async (name: string): Promise<Subject> => {
    const response = await fetch(`${API_BASE_URL}/subjects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });
    if (!response.ok) throw new Error('Failed to create subject');
    return response.json();
  },

  delete: async (subjectId: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/subjects/${subjectId}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete subject');
  },
};

// Task endpoints
export const taskApi = {
  getBySubject: async (subjectId: number): Promise<Task[]> => {
    const response = await fetch(`${API_BASE_URL}/subjects/${subjectId}/tasks`);
    if (!response.ok) throw new Error('Failed to fetch tasks');
    return response.json();
  },

  create: async (subjectId: number, task: Omit<Task, 'task_id' | 'subject_id' | 'created_at'>): Promise<Task> => {
    const response = await fetch(`${API_BASE_URL}/subjects/${subjectId}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task),
    });
    if (!response.ok) throw new Error('Failed to create task');
    return response.json();
  },

  update: async (subjectId: number, taskId: number, task: Partial<Omit<Task, 'task_id' | 'subject_id' | 'created_at'>>): Promise<Task> => {
    const response = await fetch(`${API_BASE_URL}/subjects/${subjectId}/tasks/${taskId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task),
    });
    if (!response.ok) throw new Error('Failed to update task');
    return response.json();
  },

  delete: async (subjectId: number, taskId: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/subjects/${subjectId}/tasks/${taskId}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete task');
  },
};
