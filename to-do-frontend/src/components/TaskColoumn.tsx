import React from 'react';
import { Droppable } from 'react-beautiful-dnd';
import { Paper, Typography } from '@mui/material';
import TaskCard from './TaskCard';

interface TaskColumnProps {
  columnId: string;
  columnTasks: any[];
  columnTitle: string;
  handleOpenCommentModal: (taskId: string) => void;
  setTasks: React.Dispatch<React.SetStateAction<any>>;
  tasks: any;
}

const TaskColumn: React.FC<TaskColumnProps> = ({ columnId, columnTasks, columnTitle, handleOpenCommentModal, setTasks, tasks }) => {
  return (
    <Droppable droppableId={columnId}>
      {(provided) => (
        <Paper ref={provided.innerRef} {...provided.droppableProps} sx={{ p: 2, minHeight: "50vh", bgcolor: "#f3e5ff", borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom>
            {columnTitle}
          </Typography>
          {columnTasks.map((task, index) => (
            <TaskCard
              key={task._id}
              task={task}
              index={index}
              handleOpenCommentModal={handleOpenCommentModal}
              setTasks={setTasks}
              tasks={tasks}
              columnId={columnId}
            />
          ))}
          {provided.placeholder}
        </Paper>
      )}
    </Droppable>
  );
};

export default TaskColumn;
