const wsServerPort = 8002;
const webSocketServer = require('websocket').server;
const http = require('http');

const LOG = (msg, logLevel='INFO') => {
    console.log((new Date()).toISOString() + ` -- ${logLevel.padStart(6)}: ` + msg);
}

// Spinning the http server and the websocket server.
const server = http.createServer(
    function(request, response) {
        LOG('Received request for ' + request.url);
        response.writeHead(404);
        response.end();
    }
);

server.listen(wsServerPort, () => {LOG(`Server is listening on port ${wsServerPort}`);});

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

    LOG('Received a connection from origin ' + request.origin + '.');

    // Accept the request
    const connection = request.accept(null, request.origin);

    clients[userID] = connection;

    LOG('Connected: ' + userID + ' in ' + Object.getOwnPropertyNames(clients));

    // On message receive
    connection.on('message', function(message) {
        //console.log(message);
        if (message.type === 'utf8') {
            msgData = JSON.parse(message.utf8Data);
            if (msgData.type === 'message') {
                LOG(`Received message from ${msgData.userName}: ${msgData.message}`);
                // broadcasting message to all connected clients
                for (key in clients) {
                    clients[key].send(message.utf8Data);
                    LOG(`Sent Message to: ${key}`);
                }
            }
        }
    })
})

wsServer.on('close', function(connection) {
    //LOG('Peer ' + connection.remoteAddress + ' disconnected.');
    let remoteAddress = connection.remoteAddress;
    // close user connection
    for (key in clients) {
        if (clients[key] === connection) {
            delete clients[key];
            LOG(`Disconnected: ${key}, remote address ${remoteAddress}`);
        }
    }
})