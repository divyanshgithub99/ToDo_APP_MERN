import React, { useState, useEffect } from 'react';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { Container, CssBaseline, Box, Typography, Button, Grid, Modal } from '@mui/material';
import axios from 'axios';
import { io } from 'socket.io-client';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TaskColumn from './TaskColoumn';
import TaskCreationModal from './TaskCreationModal';
import CommentModal from './CommentModal';

interface Task {
  _id: string;
  content: string;
  description: string;
  status: string;
  createdAt: string;
  comments: Comment[];
}

interface Comment {
  _id: string;
  text: string;
  createdAt: string;
}

interface Tasks {
  [key: string]: Task[];
}

const socket = io('http://localhost:5000');

const NewDnd: React.FC = () => {
  const [tasks, setTasks] = useState<Tasks>({ 'todo': [], 'inProgress': [], 'completed': [] });
  const [openCreateTaskModal, setOpenCreateTaskModal] = useState(false);
  const [openCommentModal, setOpenCommentModal] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  const handleOpenCreateTaskModal = () => setOpenCreateTaskModal(true);
  const handleCloseCreateTaskModal = () => setOpenCreateTaskModal(false);
  const handleOpenCommentModal = (taskId: string) => {
    setSelectedTaskId(taskId);
    setOpenCommentModal(true);
  };
  const handleCloseCommentModal = () => setOpenCommentModal(false);

  const notifyFail = () => toast("Something went wrong!");
  const notifyPass = (response: any) => toast(`Task with name ${response.data.content} created!`);

  const columnTitles: { [key: string]: string } = {
    'todo': 'To do',
    'inProgress': 'In progress',
    'completed': 'Completed',
  };

  useEffect(() => {
    axios.get('http://localhost:5000/api/tasks')
      .then(response => setTasks(response.data))
      .catch(error => console.error('Error fetching tasks', error));

    socket.on('taskCreated', (newTask: Task) => {
      setTasks(prevTasks => ({ ...prevTasks, 'todo': [...prevTasks['todo'], newTask] }));
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
    if (!destination || source.droppableId === destination.droppableId) return;

    const sourceColumn = source.droppableId;
    const destinationColumn = destination.droppableId;

    const sourceItems = [...tasks[sourceColumn]];
    const [movedTask] = sourceItems.splice(source.index, 1);
    const destinationItems = [...tasks[destinationColumn]];
    destinationItems.splice(destination.index, 0, movedTask);

    setTasks({
      ...tasks,
      [sourceColumn]: sourceItems,
      [destinationColumn]: destinationItems,
    });

    axios.post('http://localhost:5000/api/tasks/update', {
      taskId: movedTask._id,
      newStatus: destinationColumn,
    }).catch(error => console.error('Error updating task', error));
  };

  return (
    <Container>
      <CssBaseline />
      <ToastContainer />
      <Box my={4}>
        <Typography variant="h4" gutterBottom>
          Task Manager
        </Typography>
        <Button
          color="primary"
          variant="contained"
          onClick={handleOpenCreateTaskModal}
          sx={{ bgcolor: '#A24BFF', '&:hover': { bgcolor: '#8e3ecc' } }}
        >
          Create Task
        </Button>
        <TaskCreationModal
          open={openCreateTaskModal}
          handleClose={handleCloseCreateTaskModal}
          notifyPass={notifyPass}
          notifyFail={notifyFail}
        />
        <CommentModal
          open={openCommentModal}
          handleClose={handleCloseCommentModal}
          taskId={selectedTaskId}
        />
        <DragDropContext onDragEnd={onDragEnd}>
          <Grid container spacing={2}>
            {Object.entries(tasks).map(([columnId, columnTasks]) => (
              <Grid item xs={12} sm={4} key={columnId}>
                <TaskColumn
                  columnId={columnId}
                  columnTasks={columnTasks}
                  columnTitle={columnTitles[columnId]}
                  handleOpenCommentModal={handleOpenCommentModal}
                  setTasks={setTasks}
                  tasks={tasks}
                />
              </Grid>
            ))}
          </Grid>
        </DragDropContext>
      </Box>
    </Container>
  );
};

export default NewDnd;
