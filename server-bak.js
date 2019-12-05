const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);
users = [];
connections = [];

server.listen(process.env.PORT || 3000);
console.log('running...');

app.get('/', function(req, res){
  res.sendFile(__dirname+ '/index.html');
});

app.get('/user', function(req, res){
  res.sendFile(__dirname+ '/user.html');
});

io.sockets.on('connection', function(socket){
  connections.push(socket);
  console.log('Connected: ', connections.length);
  //console.log(connections);

  //disconnected
  socket.on('disconnect', function(data){
  //  if(!socket.username) return;
    users.splice(connections.indexOf(socket), 1);
    updateUsernames();
    connections.splice(connections.indexOf(socket), 1);
    console.log('Connected: ', connections.length);
  });

  // socket.on('send message', function(data){
  //   console.log(data);
  //   io.sockets.emit('new message', {msg: data, user: socket.username});
  // });

  socket.on('send user message', function(data){
    console.log(data);
    io.of(`${data.receiver_id}`).emit('new user message', {msg: data.msg, user: socket.username});
  });

  function updateUsernames(){
    io.sockets.emit('get users', users);
    console.log(users);
  }

  socket.on('new user', function(data, callback){
    callback(true);
    socket.username = data;
    users.push(socket.username);
    updateUsernames();
  });
})
