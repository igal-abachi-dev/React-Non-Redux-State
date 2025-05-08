import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import logger from 'morgan';//pino   pino http
import cors from 'cors';

import indexRouter from './routes/index.js';
import usersRouter from './routes/users.js';
import tasksRouter from './routes/tasks.js';

const app = express();

// Enable CORS for the Vite dev server
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// API routes
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api/tasks', tasksRouter);

// Error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(500).json({ error: err.message });
});

export default app; 