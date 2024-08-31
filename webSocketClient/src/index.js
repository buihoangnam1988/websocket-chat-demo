import ReactDOM from 'react-dom/client'; 
import React, {Component} from 'react';
import { w3cwebsocket as W3CWebSocket } from 'websocket';
import {Card, Avatar, Input, Typography} from 'antd';
import 'antd/dist/reset.css'; // `antd/dist/antd.css` does not work, Ref: https://stackoverflow.com/a/76896997/9002449
import './index.css';
import SimpleBar from 'simplebar-react';
import 'simplebar-react/dist/simplebar.min.css';
import {CompassTwoTone, SendOutlined} from '@ant-design/icons';

const { Search } = Input;
const { Text} = Typography;
const { Meta } = Card;

const client = new W3CWebSocket('ws://localhost:8002');

const root = ReactDOM.createRoot(document.getElementById('root'));

const App = () => {
    const [isLoggedIn, setIsLoggedIn] = React.useState(false);
    const [userName, setUserName] = React.useState('');
    const [messages, setMessages] = React.useState([]);
    const [msg, setMsg] = React.useState('');

    const [isScrolledToEnd, setIsScrolledToEnd] = React.useState(true);

    const [isScrollListenerAdded, setIsScrollListenerAdded] = React.useState(false);

    const chatContentRef = React.createRef();

    React.useEffect(() => {
        client.onopen = () => {
            console.log('WebSocket Client Connected');
        }
        client.onmessage = (message) => {
            //const dataFromServer = JSON.parse(message.data);
            //console.log(message.data);
            console.log('Message from server: ', message.data);
            setMessages(prev => [...prev, JSON.parse(message.data)]);
            //if (isScrolledToEnd && chatContentRef && chatContentRef.current && chatContentRef.current.scrollHeight) {
            //    console.log("Scrolling to bottom");
            //    chatContentRef.current.scrollTop = chatContentRef.current.scrollHeight;
            //}
        }
    }, []);

    // useEffect: Scroll to the end of the chat content when a new message is received
    React.useEffect(() => {
        if (isScrolledToEnd && chatContentRef && chatContentRef.current && chatContentRef.current.scrollHeight) {
            console.log("Scrolling to bottom");
            chatContentRef.current.scrollTop = chatContentRef.current.scrollHeight;
        }
    }, [messages]);

    // handleScroll: Check if the user has scrolled to the end of the chat content
    const handleScroll = (event) => {
        //console.log("Scroll Event");
        const { scrollHeight, scrollTop, clientHeight } = event.target;
        const isBottomReached = (scrollHeight - Math.round(scrollTop) === clientHeight);
        setIsScrolledToEnd(isBottomReached);
        console.log("Scroll Event: ", isBottomReached);
    };

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
            setMsg('');
            if (chatContentRef) {
                console.log("step 1");
                console.log(chatContentRef.current.scrollHeight);
                console.log("step 2");
                console.log(chatContentRef.current.minHeight);
                console.log("step 3");
                //chatContentRef.current.scrollTop = chatContentRef.current.scrollHeight;
                if (!isScrollListenerAdded) {
                    chatContentRef.current.addEventListener('scroll', handleScroll);
                    setIsScrollListenerAdded(true);
                    console.log("Scroll Listener Added");
                }
                console.log("step 4");
            }
        }
    }

    return (
        <div className='main'>
            {   isLoggedIn 
                ? <>
                    <div className='title'>
                        <Text type="secondary" style={{fontSize: "36px"}}>WebSocket Chat</Text>
                    </div>
                    <SimpleBar scrollableNodeProps={{ref:chatContentRef}} style={{maxHeight: "calc(100vh - 60px - 50px)"}}>
                        <div className='chat-content'>
                                {
                                    messages.map((msgItem, index) => 
                                        <Card key={index} style={{width: 300, margin: '16px 4px 0px 4px', alignSelf: (userName === msgItem.userName) ? 'flex-end' : 'flex-start'}}>
                                            <Meta
                                                avatar={
                                                    <Avatar style={{ color: '#f56a00', backgroundColor: '#fde3cf'}} >{msgItem.userName.toUpperCase()}</Avatar>
                                                }
                                                title={msgItem.userName}
                                                description={msgItem.message}
                                                />
                                        </Card>
                                    )
                                }
                        </div>
                    </SimpleBar>
                    <div className='bottom'>
                        <Search 
                            placeholder='Input message and send'
                            enterButton={<SendOutlined style={{fontSize: '24px'}}/>}
                            value={msg}
                            onChange={e => setMsg(e.target.value)}
                            size='large'
                            onSearch={value => {handleBtnClick(value);}}
                        />
                    </div>
                </>
                : <>
                    <div className='login-page'>
                        <div style={{padding: "40px 40px"}}>
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
                    </div>
                </>
            }
            
        </div>
    );
}

root.render(<App/>);
