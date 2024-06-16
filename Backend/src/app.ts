import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import taskRoutes from './routes/taskRoutes';
import { connectDB } from './services/taskService';

const app = express();
const server = createServer(app);
const io = new Server(server);

app.use(cors({}));
app.use(express.json());

app.use('/api/tasks', taskRoutes);

connectDB();

io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });

    socket.on('taskUpdated', (task) => {
        socket.broadcast.emit('taskUpdated', task);
    });
});

export { server, io };
