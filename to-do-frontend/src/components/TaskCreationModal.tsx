import React, { useState } from 'react';
import { Modal, Box, Typography, TextField, Button } from '@mui/material';
import axios from 'axios';

interface TaskCreationModalProps {
  open: boolean;
  handleClose: () => void;
  notifyPass: (response: any) => void;
  notifyFail: () => void;
}

const TaskCreationModal: React.FC<TaskCreationModalProps> = ({ open, handleClose, notifyPass, notifyFail }) => {
  const [taskContent, setTaskContent] = useState('');
  const [taskDescription, setTaskDescription] = useState('');

  const handleCreateTask = () => {
    axios.post('http://localhost:5000/api/tasks/create', {
      content: taskContent,
      description: taskDescription,
      status: 'todo',
    }).then(response => {
      notifyPass(response);
      handleClose();
      setTaskContent('');
      setTaskDescription('');
    }).catch(error => {
      console.error('Error creating task', error);
      notifyFail();
    });
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 24, p: 4 }}>
        <Typography variant="h6" component="h2" gutterBottom>
          Create Task
        </Typography>
        <TextField
          label="Task Content"
          fullWidth
          variant="outlined"
          margin="normal"
          value={taskContent}
          onChange={(e) => setTaskContent(e.target.value)}
        />
        <TextField
          label="Task Description"
          fullWidth
          variant="outlined"
          margin="normal"
          value={taskDescription}
          onChange={(e) => setTaskDescription(e.target.value)}
        />
        <Button
          color="primary"
          variant="contained"
          onClick={handleCreateTask}
          sx={{ mt: 2, bgcolor: '#A24BFF', '&:hover': { bgcolor: '#8e3ecc' } }}
        >
          Create
        </Button>
      </Box>
    </Modal>
  );
};

export default TaskCreationModal;
