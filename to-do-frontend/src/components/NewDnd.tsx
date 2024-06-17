import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import axios from 'axios';
import { io } from 'socket.io-client';
import { IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CommentIcon from '@mui/icons-material/Comment';
import {
  Box,
  Button,
  Container,
  Grid,
  Paper,
  TextField,
  Typography,
  Modal,
  styled,
  CssBaseline,
} from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Task, Tasks } from './types';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { columnTitles } from './constants';
import { createTask, deleteTask, addComment } from './api';


const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const CustomTypography = styled(Typography)(({ theme }) => ({
  fontFamily: 'Poppins, sans-serif',
  fontWeight: 600,
  fontSize: '20px',
  marginLeft: '370px',
  padding: '8px 39px',
  [theme.breakpoints.down('sm')]: {
    padding: 0,
    marginLeft: '64px',
  },
}));

const socket = io('https://prac-vercel-backedn-3n61.vercel.app');

const NewDnd: React.FC = () => {
  const [tasks, setTasks] = useState<Tasks>({ 'todo': [], 'inProgress': [], 'completed': [] });
  const [newTaskContent, setNewTaskContent] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [openCreateTaskModal, setOpenCreateTaskModal] = React.useState(false);
  const [openCommentModal, setOpenCommentModal] = React.useState(false);
  const [newComment, setNewComment] = useState('');
  const [selectedTaskId, setSelectedTaskId] = useState('');

  const handleOpenCreateTaskModal = () => setOpenCreateTaskModal(true);
  const handleCloseCreateTaskModal = () => setOpenCreateTaskModal(false);
  const handleOpenCommentModal = (taskId: string) => {
    setSelectedTaskId(taskId);
    setOpenCommentModal(true);
  };
  const handleCloseCommentModal = () => setOpenCommentModal(false);

  const notifyFail = () => toast("Something went wrong!");
  const notifyPass = (response: any) => toast(`Task with name ${response.data.content} created! `);

  const columnTitles: { [key: string]: string } = {
    'todo': 'To do',
    'inProgress': 'In progress',
    'completed': 'Completed',
  };

  useEffect(() => {
    // Fetch tasks from the backend
    axios.get('https://prac-vercel-backedn-3n61.vercel.app/api/tasks')
      .then(response => {
        setTasks(response.data);
      })
      .catch(error => {
        console.error('Error fetching tasks', error);
      });

    // Listen for real-time updates
    socket.on('taskCreated', (newTask: Task) => {
      setTasks(prevTasks => ({
        ...prevTasks,
        'todo': [...prevTasks['todo'], newTask],
      }));
    });

    socket.on('taskUpdated', (updatedTask: Task) => {
      setTasks(prevTasks => {
        const updatedTasks = { ...prevTasks };
        Object.keys(updatedTasks).forEach(status => {
          updatedTasks[status] = updatedTasks[status].filter(task => task._id !== updatedTask._id);
        });
        updatedTasks[updatedTask.status].push(updatedTask);
        return updatedTasks;
      });
    });

    return () => {
      socket.off('taskCreated');
      socket.off('taskUpdated');
    };
  }, []);

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;

    if (!destination) {
      return;
    }

    const sourceColumn = source.droppableId;
    const destinationColumn = destination.droppableId;

    if (sourceColumn === destinationColumn) {
      return;
    }

    const sourceItems = [...tasks[sourceColumn]];
    const [movedTask] = sourceItems.splice(source.index, 1);
    const destinationItems = [...tasks[destinationColumn]];
    destinationItems.splice(destination.index, 0, movedTask);

    setTasks({
      ...tasks,
      [sourceColumn]: sourceItems,
      [destinationColumn]: destinationItems,
    });

    // API call to update task status
    axios.post('https://prac-vercel-backedn-3n61.vercel.app/api/tasks/update', {
      taskId: movedTask._id,
      newStatus: destinationColumn,
    }).then(response => {
      console.log('Task updated successfully');
    }).catch(error => {
      console.error('Error updating task', error);
    });
  };

  const createTask = () => {
    if (!newTaskContent || !newTaskDescription) return;

    axios.post('https://prac-vercel-backedn-3n61.vercel.app/api/tasks/create', {
      content: newTaskContent,
      description: newTaskDescription,
    }).then(response => {
      setNewTaskContent('');
      setNewTaskDescription('');
      notifyPass(response)
      setOpenCreateTaskModal(false);
    }).catch(error => {
      console.error('Error creating task', error);
      notifyFail();
    });
  };

  const handleDeleteTask = (taskId: string) => {
    axios.delete(`https://prac-vercel-backedn-3n61.vercel.app/api/tasks/delete/${taskId}`)
      .then(response => {
        setTasks(prevTasks => {
          const updatedTasks = { ...prevTasks };
          Object.keys(updatedTasks).forEach(status => {
            updatedTasks[status] = updatedTasks[status].filter(task => task._id !== taskId);
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

  const handleAddComment = () => {
    if (!newComment || !selectedTaskId) return;

    axios.post('https://prac-vercel-backedn-3n61.vercel.app/api/tasks/comment', {
      taskId: selectedTaskId,
      text: newComment,
    }).then(response => {
      setNewComment('');
      toast.success('Comment added successfully');
      setOpenCommentModal(false);
    }).catch(error => {
      console.error('Error adding comment', error);
      toast.error('Error adding comment');
    });
  };

  return (
    <Container>
      <CssBaseline />
      <ToastContainer />
      <Box my={4}>
        <Typography variant="h4" gutterBottom>
          Task Manager
        </Typography>
        <Button color='primary' variant="contained" onClick={handleOpenCreateTaskModal} sx={{ bgcolor: '#A24BFF', '&:hover': { bgcolor: '#8e3ecc' } }}>Create Task</Button>
        <Modal
          open={openCreateTaskModal}
          onClose={handleCloseCreateTaskModal}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <TextField
              label="New task content"
              value={newTaskContent}
              onChange={(e) => setNewTaskContent(e.target.value)}
              variant="outlined"
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label="New task description"
              value={newTaskDescription}
              onChange={(e) => setNewTaskDescription(e.target.value)}
              variant="outlined"
              fullWidth
              sx={{ mb: 2 }}
            />
            <Button onClick={createTask} variant="contained" sx={{ bgcolor: '#A24BFF', '&:hover': { bgcolor: '#8e3ecc' } }}>
              Create Task
            </Button>
          </Box>
        </Modal>
        <DragDropContext onDragEnd={onDragEnd}>
          <Grid container spacing={2}>
            {Object.entries(tasks).map(([columnId, columnTasks]) => (
              <Grid item xs={12} sm={4} key={columnId}>
                <Droppable droppableId={columnId}>
                  {(provided) => (
                    <Paper ref={provided.innerRef} {...provided.droppableProps} sx={{ p: 2, minHeight: "50vh", bgcolor: "#f3e5ff", borderRadius: 2 }}>
                      <Typography variant="h6" gutterBottom>
                        {columnTitles[columnId]}
                      </Typography>
                      {columnTasks.map((task, index) => (
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
                                  style={{ position: 'absolute', top: 0, right: 0 }}
                                >
                                  <DeleteIcon />
                                </IconButton>
                                <IconButton
                                  onClick={() => handleOpenCommentModal(task._id)}
                                  aria-label="comment"
                                  style={{ position: 'absolute', bottom: 0, right: 0 }}
                                >
                                  <CommentIcon />
                                </IconButton>
                                <Typography gutterBottom variant="h5" sx={{ fontFamily: 'Poppins, sans-serif', color: '#A24BFF' }}>
                                  {task.content}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ fontFamily: 'Roboto, sans-serif' }}>
                                  {task.description}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ fontFamily: 'Roboto, sans-serif' }}>
                                  Created: {new Date(task.createdAt).toLocaleString()}
                                </Typography>
                                <Box mt={2}>
                                  <Typography variant="subtitle1">Comments:</Typography>
                                  {task.comments.map(comment => (
                                    <Typography key={comment._id} variant="body2" color="text.secondary">
                                      {comment.text}
                                    </Typography>
                                  ))}
                                </Box>
                              </CardContent>
                            </Card>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </Paper>
                  )}
                </Droppable>
              </Grid>
            ))}
          </Grid>
        </DragDropContext>
        <Modal
          open={openCommentModal}
          onClose={handleCloseCommentModal}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <TextField
              label="Add a comment"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              variant="outlined"
              fullWidth
              sx={{ mb: 2 }}
            />
            <Button onClick={handleAddComment} variant="contained" sx={{ bgcolor: '#A24BFF', '&:hover': { bgcolor: '#8e3ecc' } }}>
              Add Comment
            </Button>
          </Box>
        </Modal>
      </Box>
    </Container>
  );
};

export default NewDnd;
