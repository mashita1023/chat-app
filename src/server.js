let express = require('express')
let app = express();
let http = require('http').Server(app);
let Canvas = require('canvas');
let fs = require('fs')
let dataUriToBuffer = require('data-uri-to-buffer');
const { create } = require('domain');
const { publicDecrypt } = require('crypto');
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
    image = create_circle(nickname, socket.id);
    sendImage = String(image)
    console.log(nickname + ' join.');
    msg = nickname + 'が入室しました。'
    data = JSON.stringify({ uid:socket.id, msg:msg, image:sendImage});
    console.log(data)
    io.emit('join', data);
  })

  // messageでemitを受けた時
  socket.on('message', (msg) => {
    console.log('message:' + msg);
    io.emit('message', msg);
  });

  socket.on('move', (msg) => {
    console.log('move:' + msg);
    io.emit('move', msg);
  })

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

//画像生成
function create_circle (name, id) {
  let canvas = Canvas.createCanvas(100, 100);
  let ctx = canvas.getContext('2d');

  ctx.arc(50,50,50,0*Math.PI/180,360*Math.PI/180,false);
  ctx.fillStyle = 'rgba(0,0,255,0.5)';
  ctx.fill();
  ctx.font = '10px Impact';
  ctx.fillStyle = 'rgba(0,0,0,1.0)';
  ctx.fillText(name, (100-ctx.measureText(name).width)/2, 50);

  let canvasDataUrl = canvas.toDataURL();
  let decoded = dataUriToBuffer(canvasDataUrl);
  save = __dirname + '/public/img/' + id + '.jpg';
  fs.writeFile(save, decoded, (err)=>{
    if(err) console.log(`error!::${err}`);
  });

  return canvas.toDataURL();
}

/***
ルーム作ったら閉じたときに画像削除の処理を追加
***/