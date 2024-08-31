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
        client.onmessage = (message) => {
            //const dataFromServer = JSON.parse(message.data);
            //console.log(message.data);
            console.log('Message from server: ', message.data);
        }
    }, []);

    const handleBtnClick = (message) => {
        if (client.readyState === client.OPEN) {
            client.send(message);
        }
    }

    return (
        <div>
            <h1>Hello, World!</h1>
            <button onClick={() => handleBtnClick("Hello")}>Send Message</button>
        </div>
    );
}

root.render(<App/>);
