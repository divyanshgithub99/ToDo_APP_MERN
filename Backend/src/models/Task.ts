import { Schema, model } from 'mongoose';

interface IComment {
  text: string;
  createdAt: Date;
}

interface ITask {
  content: string;
  status: string;
  description: string;
  createdAt: Date;
  comments: IComment[];
}

const commentSchema = new Schema<IComment>({
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const taskSchema = new Schema<ITask>({
  content: { type: String, required: true },
  status: { type: String, required: true, enum: ['todo', 'inProgress', 'completed'] },
  description: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  comments: { type: [commentSchema], default: [] },
});

const Task = model<ITask>('TaskNew', taskSchema);

export default Task;
