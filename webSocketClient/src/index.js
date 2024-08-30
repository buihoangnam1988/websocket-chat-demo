import ReactDOM from 'react-dom'; 
import React, {Component} from 'react';
import { w3cwebsocket as w3cwebsocket } from 'websocket';

export default class App extends Component {
    render() {
        return (
            <div>
                <h1>Hello, World!</h1>
            </div>
        )
    }
}

ReactDOM.render(<App/>, document.getElementById('root'));