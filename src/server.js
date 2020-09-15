let express = require('express')
let app = express();
let http = require('http').Server(app);
const io = require('socket.io')(http);
const PORT = process.env.PORT || 7000;

let users = {sample:'null',};
/*  特定のファイルの呼び出し
app.get('/', function(req, res){
  res.sendFile(__dirname + '/public/index.html');
});
*/
// フォルダの指定
app.use( express.static(__dirname + '/public'));

//常時
io.on('connection', (socket) => {

  socket.on('message', function(msg){
    console.log('message:' + msg);
    io.emit('message', msg);
    users[socket.id] = msg.name;
    console.log(users);
  });

  // メッセージの送信者どうやって特定するん？
  // 名前とidの辞書生成すればいいかな？いいよね？
  socket.on('disconnect', (msg) => {
    console.log(msg)
    console.log(socket.id)
    if (users[socket.id] == '') {
      let msg = "someone disconnected.";
    } else { 
      let msg = users[socket.id] + ' disconnected.';
    }
    io.emit('logout', msg)
  });
});

http.listen(PORT, () => {
  console.log('server listening. Port:' + PORT);
});

