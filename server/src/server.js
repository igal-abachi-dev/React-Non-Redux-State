import express from 'express';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 3000;

// Enable CORS for the Vite dev server
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

// Parse JSON bodies
app.use(express.json());

// In-memory storage for tasks
let tasks = [
  { id: 1, title: 'Learn React', completed: false },
  { id: 2, title: 'Build a Todo App', completed: false }
];

// GET /api/tasks
app.get('/api/tasks', (req, res) => {
  res.json(tasks);
});

// POST /api/tasks
app.post('/api/tasks', (req, res) => {
  const { title } = req.body;
  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }
  
  const newTask = {
    id: Date.now(),
    title,
    completed: false
  };
  
  tasks.push(newTask);
  res.status(201).json(newTask);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
}); 