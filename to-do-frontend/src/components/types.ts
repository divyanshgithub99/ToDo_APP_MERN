export interface Task {
    _id: string;
    content: string;
    description: string;
    status: string;
    createdAt: string;
    comments: Comment[];
  }
  
  export interface Comment {
    _id: string;
    text: string;
    createdAt: string;
  }
  
  export interface Tasks {
    [key: string]: Task[];
  }
  