import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, TextField, Button } from '@mui/material';
import axios from 'axios';
import { toast } from 'react-toastify';

interface CommentModalProps {
  open: boolean;
  handleClose: () => void;
  taskId: string | null;
}

const CommentModal: React.FC<CommentModalProps> = ({ open, handleClose, taskId }) => {
  const [commentText, setCommentText] = useState('');

  const handleAddComment = () => {
    if (taskId) {
      axios.post(`http://localhost:5000/api/tasks/${taskId}/comment`, { text: commentText })
        .then(response => {
          toast.success('Comment added successfully');
          setCommentText('');
          handleClose();
        })
        .catch(error => {
          console.error('Error adding comment', error);
          toast.error('Error adding comment');
        });
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 24, p: 4 }}>
        <Typography variant="h6" component="h2" gutterBottom>
          Add Comment
        </Typography>
        <TextField
          label="Comment"
          fullWidth
          variant="outlined"
          margin="normal"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
        />
        <Button
          color="primary"
          variant="contained"
          onClick={handleAddComment}
          sx={{ mt: 2, bgcolor: '#A24BFF', '&:hover': { bgcolor: '#8e3ecc' } }}
        >
          Add Comment
        </Button>
      </Box>
    </Modal>
  );
};

export default CommentModal;
