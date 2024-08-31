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
        if (message.type === 'utf8') {
            LOG('Received Message: ', message.utf8Data);

            // broadcasting message to all connected clients
            for (key in clients) {
                clients[key].sendUTF(message.utf8Data);
                LOG('Sent Message to: ', clients[key]);
            }
        }
    })
})