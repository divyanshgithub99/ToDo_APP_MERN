import React from 'react';
import NewDnd from './components/NewDnd';
import './App.css'
// import { WebSocketProvider } from './context/WebSocketContext';

const App: React.FC = () => {
    return (
            <div className="App">
                <NewDnd/>
            </div>
        
    );
};

export default App;
