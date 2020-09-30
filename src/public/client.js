
let socketio = io();
let name = '';
let uid = '';
let id_value = '';
let before_id = '';

// 名前入力
$('#joinForm').submit( () => {
    name = $('#joinName').val();
    socketio.emit('join', name);

    $('#nickname').append($('<p>').text('あなたの名前：' + name));
    $('#joinScreen').hide();
    $('#chatScreen').show();
    return false;
});

// chat部分
$('#messageForm').submit( () => {
    let data = JSON.stringify({ name:name, message:$('#inputMsg').val() });
    socketio.emit('message', data);
    $('#inputMsg').val('');
    return false;
});

// 受信
socketio.on('message', (msg) => {
    let data = JSON.parse(msg);
    $('#messages').append($('<p>').text( data.name + ' : ' + data.message));
});

socketio.on('join', (some) => {
    let data = JSON.parse(some);
    $('#messages').append($('<p>').text(data.msg));
    uid = data.uid;
})

socketio.on('absense', (msg) => {
    $('#messages').append($('<p>').text(msg));
})

socketio.on('move', (msg) => {
    let data = JSON.parse(msg);

    if (data.before_id) {
        let beforeBackgroundImageUrl = document.getElementById(data.before_id).style.backgroundImage;

        if(beforeBackgroundImageUrl === ('url("img/'+data.uid+'.jpg")')) {
            document.getElementById(data.before_id).style.backgroundImage = "url(img/none.jpg)";
        }
        document.getElementById(data.id_value).style.backgroundImage = "url(img/" + data.uid + ".jpg)";
    } else {
        document.getElementById(data.id_value).style.backgroundImage = "url(img/" + data.uid + ".jpg)";
    }
    //$(data.id_value).style.backgroundImage = "url(img/" + data.uid + ".jpg)";
})

function getId(element) {
    console.log(element.style.backgroundImage)
    if (element.style.backgroundImage === '' || element.style.backgroundImage === 'url("img/none.jpg")') {
        before_id = id_value;
        id_value = element.id;
    
        let data = JSON.stringify({ name:name, id_value:id_value, before_id:before_id, uid:uid });
        socketio.emit('move', data);
    }

}