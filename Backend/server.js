"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const db_1 = __importDefault(require("./src/db"));
const Task_1 = __importDefault(require("./src/models/Task"));
const app = (0, express_1.default)();
const port = 5000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Create HTTP server and WebSocket server
const server = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "*",
    },
});
// Connect to MongoDB
(0, db_1.default)();
// Get all tasks
app.get('/api/tasks', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tasks = yield Task_1.default.find();
        const formattedTasks = {
            todo: tasks.filter(task => task.status === 'todo'),
            inProgress: tasks.filter(task => task.status === 'inProgress'),
            completed: tasks.filter(task => task.status === 'completed'),
        };
        res.json(formattedTasks);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching tasks' });
    }
}));
// Create a new task
app.post('/api/tasks/create', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { content, description } = req.body;
        const newTask = new Task_1.default({ content, description, status: 'todo', createdAt: new Date() });
        yield newTask.save();
        io.emit('taskCreated', newTask); // Emit event to all clients
        res.json(newTask);
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating task' });
    }
}));
// Update task status
app.post('/api/tasks/update', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { taskId, newStatus } = req.body;
        const updatedTask = yield Task_1.default.findByIdAndUpdate(taskId, { status: newStatus }, { new: true });
        if (updatedTask) {
            io.emit('taskUpdated', updatedTask); // Emit event to all clients
            res.json({ message: 'Task updated successfully' });
        }
        else {
            res.status(404).json({ message: 'Task not found' });
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating task' });
    }
}));
// Delete a task
app.delete('/api/tasks/delete/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield Task_1.default.findByIdAndDelete(id);
        io.emit('taskDeleted', id); // Emit event to all clients
        res.json({ message: 'Task deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting task' });
    }
}));
// Add a comment to a task
app.post('/api/tasks/comment', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { taskId, text } = req.body;
        const comment = { text, createdAt: new Date() };
        const updatedTask = yield Task_1.default.findByIdAndUpdate(taskId, { $push: { comments: comment } }, { new: true });
        io.emit('taskUpdated', updatedTask); // Emit event to all clients
        res.json(updatedTask);
    }
    catch (error) {
        res.status(500).json({ message: 'Error adding comment' });
    }
}));
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
