import ReactDOM from 'react-dom/client'; 
import React, {Component} from 'react';
import { w3cwebsocket as W3CWebSocket } from 'websocket';
import './index.css';

const client = new W3CWebSocket('ws://localhost:8002');

const root = ReactDOM.createRoot(document.getElementById('root'));

const App = () => {
    React.useEffect(() => {
        client.onopen = () => {
            console.log('WebSocket Client Connected');
        }
    }, []);
    return (
        <div>
            <h1>Hello, World!</h1>
        </div>
    );
}

root.render(<App/>);
