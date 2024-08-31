import ReactDOM from 'react-dom/client'; 
import React, {Component} from 'react';
import { w3cwebsocket as W3CWebSocket } from 'websocket';
import {Card, Avatar, Input, Typography} from 'antd';
import 'antd/dist/reset.css'; // `antd/dist/antd.css` does not work, Ref: https://stackoverflow.com/a/76896997/9002449

const { Search } = Input;

const client = new W3CWebSocket('ws://localhost:8002');

const root = ReactDOM.createRoot(document.getElementById('root'));

const App = () => {
    const [isLoggedIn, setIsLoggedIn] = React.useState(false);
    const [userName, setUserName] = React.useState('');
    const [messages, setMessages] = React.useState([]);

    React.useEffect(() => {
        client.onopen = () => {
            console.log('WebSocket Client Connected');
        }
        client.onmessage = (message) => {
            //const dataFromServer = JSON.parse(message.data);
            //console.log(message.data);
            console.log('Message from server: ', message.data);
            setMessages(prev => [...prev, JSON.parse(message.data)]);
        }
    }, []);

    const handleBtnClick = (message) => {
        if (client.readyState === client.OPEN) {
            // Note:
            // client.send() will send the message to the server
            // the event data on the server will have following structure:
            // {
            //     type: "utf8",
            //     utf8Data: 'the message we sent'
            // }
            client.send(JSON.stringify({
                type:"message", 
                message: message, 
                userName: userName
            }));
        }
    }

    return (
        <div className='main'>
            {   isLoggedIn 
                ? <>
                    <button onClick={() => handleBtnClick("Hello")}>Send Message</button>
                    {
                        messages.map((msgItem, index) => 
                            <p key={index}>{msgItem.userName}: {msgItem.message}</p>
                        )
                    }
                </>
                : <>
                    <div style={{padding: "200px 40px"}}>
                        <Search
                            placeholder='Enter Username'
                            enterButton='Login'
                            size='large'
                            onSearch={value => {
                                setUserName(value);
                                setIsLoggedIn(true);
                            }}
                        />

                    </div>
                </>
            }
            
        </div>
    );
}

root.render(<App/>);
