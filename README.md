# Web Socker Demo: Server & Client
## Introduction:
* A simple websocket-base chat app with backend (webSocketServer) and frontend (webSocketClient)
* Inspired by: https://www.youtube.com/watch?v=LenNpb5zqGE
* Improvements:
    * Hide scroll bar using CSS & SimpleBar
    * Chat history can be automatically scrolled to the end
    * Written using Function Components, working with Node v18 and later

Screenshot:

![](.md/img/screenshot1.png)
## Getting started
### Server app - webSocketServer
Install packages

    npm install

Start the server app

    # On Linux/MacOS
    npm start
    # On Windows
    npm run start_pc
### Client app - webSocketClient
Install packages

    npm install

Start the client app

    # On Linux/MacOS
    npm start
    # On Windows
    npm run start_pc

## Others
* Fix complaining about `React.render` & `ReactDOM` import: https://stackoverflow.com/a/71668419/9002449
* Websocket security best practices: https://ably.com/topic/websocket-security