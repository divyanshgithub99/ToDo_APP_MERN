import React from 'react';
import { Card, CardContent, IconButton, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Task } from './types';

interface TaskCardProps {
  task: Task;
  onDeleteTask: (taskId: string) => void;
  onOpenCommentModal: (taskId: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onDeleteTask, onOpenCommentModal }) => {
  return (
    <Card>
      <CardContent>
        <IconButton onClick={() => onDeleteTask(task._id)} aria-label="delete">
          <DeleteIcon />
        </IconButton>
        <Typography variant="h5">
          {task.content}
        </Typography>
        <Typography variant="body2">
          {task.description}
        </Typography>
        <Typography variant="body2">
          Created: {new Date(task.createdAt).toLocaleString()}
        </Typography>
        <div>
          <Typography variant="subtitle1">Comments:</Typography>
          {task.comments.map((comment: any) => (
            <Typography key={comment._id} variant="body2" color="text.secondary">
              {comment.text}
            </Typography>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskCard;
