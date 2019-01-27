var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;


const msgHistory = [];

const users = [];
let userToReplace = 1;

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});


io.on('connection', function(socket){
  socket.emit('history', msgHistory);
  socket.on('chat message', function(msg){
    msgHistory.push(msg);
    io.emit('chat message', msg);
  });

  socket.emit('setUserNumber', userToReplace);
  userToReplace = userToReplace === 1 ? 2 : 1;

  users.push(socket);
  if (users.length > 2) {
    users[0].disconnect();
    users.shift();
  }
});

http.listen(port, function(){
  console.log('listening on *:' + port);
});
