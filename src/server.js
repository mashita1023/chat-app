let express = require('express')
let app = express();
let http = require('http').Server(app);
const io = require('socket.io')(http);
const PORT = process.env.PORT || 7000;

//let users = {sample:'null',};
/*  特定のファイルの呼び出し
app.get('/', function(req, res){
  res.sendFile(__dirname + '/public/index.html');
});
*/
// フォルダの指定
app.use( express.static(__dirname + '/public'));

//通信処理
io.on('connection', (socket) => {
  let nickname = '';

  // 接続時
  console.log('接続: ' + socket.id)
  socket.on('join', (name_) => {
    nickname = name_;
    console.log(nickname + ' join.');
    msg = nickname + 'が入室しました。'
    data = JSON.stringify({ uid:socket.id, msg:msg});
    console.log(data)
    io.emit('join', data);
  })

  // messageでemitを受けた時
  socket.on('message', (msg) => {
    console.log('message:' + msg);
    io.emit('message', msg);
  });

  // 切断時
  socket.on('disconnect', () => {
    console.log(socket.id)
    if(nickname) {
      let msg = nickname + 'が退室しました。';
      console.log(msg)
      io.emit('absense', msg)
    }
  });
});

// サーバーの起動
http.listen(PORT, () => {
  console.log('server listening. Port:' + PORT);
});

