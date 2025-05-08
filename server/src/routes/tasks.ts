import express, { Request, Response } from 'express';

const router = express.Router();

// Define Task interface
interface Task {
  id: number;
  title: string;
  completed: boolean;
}

// In-memory storage for tasks
let tasks: Task[] = [
  { id: 1, title: 'Learn React', completed: false },
  { id: 2, title: 'Build a Todo App', completed: false }
];

// GET /api/tasks
router.get('/', (req: Request, res: Response) => {
  res.json(tasks);
});

// POST /api/tasks
router.post('/', (req: Request, res: Response) => {
  const { title } = req.body;
  
  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }
  
  const newTask: Task = {
    id: Date.now(),
    title,
    completed: false
  };
  
  tasks.push(newTask);
  res.status(201).json(newTask);
});

export default router; 