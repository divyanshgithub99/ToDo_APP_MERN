import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { Card, CardContent, Typography, Box, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CommentIcon from '@mui/icons-material/Comment';
import axios from 'axios';
import { toast } from 'react-toastify';

interface TaskCardProps {
  task: any;
  index: number;
  handleOpenCommentModal: (taskId: string) => void;
  setTasks: React.Dispatch<React.SetStateAction<any>>;
  tasks: any;
  columnId: string;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, index, handleOpenCommentModal, setTasks, tasks, columnId }) => {
  const handleDeleteTask = (taskId: string) => {
    axios.delete(`http://localhost:5000/api/tasks/delete/${taskId}`)
      .then(response => {
        setTasks((prevTasks:any) => {
          const updatedTasks = { ...prevTasks };
          Object.keys(updatedTasks).forEach(status => {
            updatedTasks[status] = updatedTasks[status].filter((task: any) => task._id !== taskId);
          });
          return updatedTasks;
        });
        toast.success('Task deleted successfully');
      })
      .catch(error => {
        console.error('Error deleting task', error);
        toast.error('Error deleting task');
      });
  };

  return (
    <Draggable key={task._id} draggableId={task._id} index={index}>
      {(provided) => (
        <Card
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          sx={{ mb: 2, borderRadius: 2, boxShadow: 3, bgcolor: '#ffffff', position: 'relative' }}
        >
          <CardContent>
            <IconButton
              onClick={() => handleDeleteTask(task._id)}
              aria-label="delete"
              style={{ position: 'absolute', right: '40px', top: '10px' }}
            >
              <DeleteIcon />
            </IconButton>
            <IconButton
              onClick={() => handleOpenCommentModal(task._id)}
              aria-label="comment"
              style={{ position: 'absolute', right: '10px', top: '10px' }}
            >
              <CommentIcon />
            </IconButton>
            <Typography variant="h6" component="div">
              {task.content}
            </Typography>
            <Typography sx={{ mb: 1.5 }} color="text.secondary">
              {task.description}
            </Typography>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="body2">
                Created At: {new Date(task.createdAt).toLocaleString()}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      )}
    </Draggable>
  );
};

export default TaskCard;
