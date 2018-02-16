module.exports = function(server) {
  
  var io = require('socket.io')(server);
  
  io.on('connection', function(socket){
    //console.log('a user connected');
    socket.on('disconnect', function(){
      //console.log('user disconnected');
    });
    socket.on('message', function(msg){
      //console.log('message: ' + msg.text);
      io.emit('message', msg);
    });
    socket.on('typing', function(data) {
      //console.log('is Typing');
      io.emit('typing', 'is Typing');
    });
    
  });

};
