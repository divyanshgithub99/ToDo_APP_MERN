import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import connectDB from './src/db';
import Task from './src/models/Task';

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

// Create HTTP server and WebSocket server
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// Connect to MongoDB
connectDB();

// Get all tasks
app.get('/api/tasks', async (req, res) => {
  try {
    const tasks = await Task.find();
    const formattedTasks = {
      todo: tasks.filter(task => task.status === 'todo'),
      inProgress: tasks.filter(task => task.status === 'inProgress'),
      completed: tasks.filter(task => task.status === 'completed'),
    };
    res.json(formattedTasks);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tasks' });
  }
});

// Create a new task
app.post('/api/tasks/create', async (req, res) => {
  try {
    const { content, description } = req.body;
    const newTask = new Task({ content, description, status: 'todo', createdAt: new Date() });
    await newTask.save();
    io.emit('taskCreated', newTask); // Emit event to all clients
    res.json(newTask);
  } catch (error) {
    res.status(500).json({ message: 'Error creating task' });
  }
});

// Update task status
app.post('/api/tasks/update', async (req, res) => {
  try {
    const { taskId, newStatus } = req.body;
    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      { status: newStatus },
      { new: true }
    );
    if (updatedTask) {
      io.emit('taskUpdated', updatedTask); // Emit event to all clients
      res.json({ message: 'Task updated successfully' });
    } else {
      res.status(404).json({ message: 'Task not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error updating task' });
  }
});

// Delete a task
app.delete('/api/tasks/delete/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Task.findByIdAndDelete(id);
    io.emit('taskDeleted', id); // Emit event to all clients
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting task' });
  }
});

// Add a comment to a task
app.post('/api/tasks/comment', async (req, res) => {
  try {
    const { taskId, text } = req.body;
    const comment = { text, createdAt: new Date() };
    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      { $push: { comments: comment } },
      { new: true }
    );
    io.emit('taskUpdated', updatedTask); // Emit event to all clients
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: 'Error adding comment' });
  }
});

// Handle WebSocket connections
io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
