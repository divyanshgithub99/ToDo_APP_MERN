import React from 'react';
import { Modal, Box, TextField, Button } from '@mui/material';

interface TaskModalProps {
  open: boolean;
  onClose: () => void;
  newTaskContent: string;
  setNewTaskContent: (value: string) => void;
  newTaskDescription: string;
  setNewTaskDescription: (value: string) => void;
  createTask: () => void;
}

const TaskModal: React.FC<TaskModalProps> = ({ open, onClose, newTaskContent, setNewTaskContent, newTaskDescription, setNewTaskDescription, createTask }) => {
  return (
    <Modal open={open} onClose={onClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
      <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', border: '2px solid #000', boxShadow: 24, p: 4 }}>
        <TextField
          label="New task content"
          value={newTaskContent}
          onChange={(e) => setNewTaskContent(e.target.value)}
          variant="outlined"
          fullWidth
          style={{ marginBottom: 16 }}
        />
        <TextField
          label="New task description"
          value={newTaskDescription}
          onChange={(e) => setNewTaskDescription(e.target.value)}
          variant="outlined"
          fullWidth
          style={{ marginBottom: 16 }}
        />
        <Button onClick={createTask} variant="contained" sx={{ backgroundColor: '#A24BFF', '&:hover': { backgroundColor: '#8e3ecc' } }}>
          Create Task
        </Button>
      </Box>
    </Modal>
  );
};

export default TaskModal;
