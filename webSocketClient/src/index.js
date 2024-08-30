import ReactDOM from 'react-dom'; 
import React, {Component} from 'react';
import { w3cwebsocket as W3CWebSocket } from 'websocket';

const client = new W3CWebSocket('ws://localhost:8002');

export default class App extends Component {
    componentDidMount() {
        client.onopen = () => {
            console.log('WebSocket Client Connected');
        }
    }

    render() {
        return (
            <div>
                <h1>Hello, World!</h1>
            </div>
        )
    }
}

ReactDOM.render(<App/>, document.getElementById('root'));