import React from 'react';
import { Grid, Paper, Typography } from '@mui/material';
import { Droppable } from 'react-beautiful-dnd';
import TaskCard from './TaskCard';
import { Task } from './types';

interface TaskListProps {
  columnId: string;
  columnTitle: string;
  tasks: Task[];
  onDeleteTask: (taskId: string) => void;
  onOpenCommentModal: (taskId: string) => void;
}

const TaskList: React.FC<TaskListProps> = ({ columnId, columnTitle, tasks, onDeleteTask, onOpenCommentModal }) => {
  return (
    <Grid item xs={12} sm={4}>
      <Droppable droppableId={columnId}>
        {(provided) => (
          <Paper ref={provided.innerRef} {...provided.droppableProps} sx={{ minHeight: "50vh", bgcolor: "#f3e5ff", borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>
              {columnTitle}
            </Typography>
            {tasks.map((task, index) => (
              <TaskCard key={task._id} task={task} onDeleteTask={onDeleteTask} onOpenCommentModal={onOpenCommentModal} />
            ))}
            {provided.placeholder}
          </Paper>
        )}
      </Droppable>
    </Grid>
  );
};

export default TaskList;
