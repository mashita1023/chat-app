let express = require('express')
let app = express();
let http = require('http').Server(app);
const io = require('socket.io')(http);
const PORT = process.env.PORT || 7000;

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection',function(socket){
  let name = '';

  socket.on('message', function(msg){
    console.log('message:' + msg);
    io.emit('message', msg);
    name = msg.name;
  });

  // メッセージの送信者どうやって特定するん？
  // 名前とidの辞書生成すればいいかな？いいよね？
  socket.on('disconnect', function(msg) {
    console.log(msg)
    console.log(socket.id)
    if (name == '') {
      let msg = "someone disconnected.";
    } else { 
      let msg = name + ' disconnected.';
    }
    io.emit('logout', msg)
  });
});

http.listen(PORT, function(){
  console.log('server listening. Port:' + PORT);
});

