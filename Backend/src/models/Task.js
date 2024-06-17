"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const commentSchema = new mongoose_1.Schema({
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});
const taskSchema = new mongoose_1.Schema({
    content: { type: String, required: true },
    status: { type: String, required: true, enum: ['todo', 'inProgress', 'completed'] },
    description: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    comments: { type: [commentSchema], default: [] },
});
const Task = (0, mongoose_1.model)('TaskNew', taskSchema);
exports.default = Task;
