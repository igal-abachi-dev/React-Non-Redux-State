import type { VercelRequest, VercelResponse } from '@vercel/node';
import type { Task } from '../src/context/TasksContext';

// In-memory storage for demo purposes
// In a real app, you'd use a database
let tasks: Task[] = [
  { id: 1, title: "Learn React", completed: false },
  { id: 2, title: "Build a Todo App", completed: false },
  { id: 3, title: "Deploy to Vercel", completed: false }
];

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173'); // Your Vite dev server
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    switch (req.method) {
      case 'GET':
        res.status(200).json(tasks);
        break;
      case 'POST':
        const newTask: Task = {
          id: Date.now(),
          title: req.body.title,
          completed: false
        };
        tasks.push(newTask);
        res.status(201).json(newTask);
        break;
      default:
        res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
} 