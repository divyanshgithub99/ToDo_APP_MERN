import axios from 'axios';

export const createTask = (content: string, description: string) => {
  return axios.post('http://localhost:5000/api/tasks/create', {
    content,
    description,
  });
};

export const deleteTask = (taskId: string) => {
  return axios.delete(`http://localhost:5000/api/tasks/delete/${taskId}`);
};

export const addComment = (taskId: string, text: string) => {
  return axios.post('http://localhost:5000/api/tasks/comment', {
    taskId,
    text,
  });
};
