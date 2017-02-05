var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
users = [];
connections = [];

server.listen(process.env.PORT || 3000);
console.log("server running...");

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

io.sockets.on('connection', function (socket) {
    connections.push(socket);
    //console.log("No of connection connected.." + connections.length);

    socket.on('disconnect', function (data) {
        connections.splice(connections.indexOf(socket.username), 1);

        updateUsernames();
        connections.splice(connections.indexOf(socket), 1);
        //console.log("No of connections disconnected", connections.length);
    });

    socket.on('new user', function (data, callback) {
        //console.log(data);
        callback(true);
        socket.username = data;
        users.push(socket.username);
        updateUsernames();
    });

    function updateUsernames() {
        io.sockets.emit('get users', users);
    }

    socket.on('send message', function (data) {
        //console.log(data);
        io.sockets.emit('new message', { message: data, username: socket.username });
    });
});