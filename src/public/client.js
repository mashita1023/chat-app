$( () => {

//  let name = prompt('名前を入力してください');
  let socketio = io();
  let name = '';

  // 名前入力
  $('#join_form').submit( () => {
    name = $('#join_name').val();
    socketio.emit('join', name);

    $('#nickname').append($('<p>').text('あなたの名前：' + name));
    $('#join-screen').hide();
    $('#chat-screen').show();
    create_circle();
    return false;
  });

  // chat部分
  $('#message_form').submit( () => {
    let data = JSON.stringify({ name:name, message:$('#input_msg').val(), action:'chat' });
    socketio.emit('message', data);
    $('#input_msg').val('');
    return false;
  });

// オブジェクト生成
  const create_circle = () => {
    if (name) {
        let user_ball = document.createElement('div');
        user_ball.style.position = "absolute";

        let randLeft = 10 + Math.random()*260;
        let randTop = 10 + Math.random()*260;

        user_ball.style.left = randLeft;
        user_ball.style.top = randTop;

        user_ball.style.width = "80px";
        user_ball.style.height = "80px";
        user_ball.style.borderRadius = "50%";
        user_ball.style.background = "white";
        user_ball.style.border = "solid 3px skyblue";
        user_ball.innerHTML = name;
        user_ball.style.textAlign = "center";
        user_ball.style.lineHeight = ("80px");
        user_ball.id = 'mine';

        $('#box').append(user_ball);
    //          let
    //          socketio.emit('enterRoom')
    }

    // 動かすところ
    let flag = false;

    $('#mine').draggable();
    $('#mine').mousedown( () => {
        flag = true;
    });
    $('#mine').mouseup( () => {
        flag = false;
    });
    /*
    $('#target').draggable();
    $('#target').mousedown(function () {
        flag = true;
    });
    $('#target').mouseup(function() {
        flag=false;
    });
    */
    $('#box').mousemove( (event) => {
        let x = event.pageX - $('#box').position().left;
        let y = event.pageY - $('#box').position().top;

        if(flag) {
    /*            $('#target').css('left',x);
        $('#target').css('top', y);
    */
        $('#mine').css('left', x);
        $('#mine').css('top', y);
        let data = JSON.stringify({ name:name, x:x, y:y, action:'mousemove'})
        socketio.emit('message', data);
        }
    });
  }
// 受信
  socketio.on('message', (msg) => {
    let data = JSON.parse(msg);
    switch(data.action) {
    case 'mousemove':
      $('#box-x').text('X: ' + data.x);
      $('#box-y').text('Y: ' + data.y);
      $('#mine').css('left', data.x);
      $('#mine').css('top', data.y);
      break;
    case 'chat':
      $('#messages').append($('<p>').text( data.name + ' : ' + data.message));
      break;
    }
  });

  socketio.on('join', (msg) => {
      $('#messages').append($('<p>').text(msg));
  })

  socketio.on('absense', (data) => {
    $('#messages').append($('<p>').text(data));
  })
});
