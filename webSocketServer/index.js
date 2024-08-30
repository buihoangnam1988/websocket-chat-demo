const webSocketServerPort = 8000;
const webSocketServer = require('websocket').server;
const http = require('http');

// Spinning the http server and the websocket server.
const server = http.createServer();
server.listen(webSocketServerPort);
console.log('listening on port 8002');

const wsServer = new webSocketServer({
    httpServer: server
});

const clients = {};

// Utility funciton to crate a unique userid for every user
const GetUniqueID = () => {
    const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    return s4() + s4() + '-' + s4();
}

wsServer.on('request', function (request) {
    var userID = GetUniqueID();

    console.log((new Date()) + ' Received a connection from origin ' + request.origin + '.');

    // Accept the request
    const connection = request.accept(null, request.origin);

    clients[userID] = connection;

    console.log('connected: ' + userID + ' in ' + Object.getOwnPropertyNames(clients));

    // On message receive
    connection.on('message', function(message) {
        if (message.type === 'utf8') {
            console.log('Received Message: ', message.utf8Data);

            // broadcasting message to all connected clients
            for (key in clients) {
                clients[key].sendUTF(message.utf8Data);
                console.log('sent Message to: ', clients[key]);
            }
        }
    })
})