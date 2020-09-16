class GameEvent {
    constructor(data) {
        this.data = data;
    }
}

class User {
    constructor(x, y){
        this.x = x;
        this.y = y;
        this.listeners = {};
    }
// 追加するイベント
    addEventListener(type, listener) {
        if (!this.listeners[type]) {
            this.listeners[type] = [];
        }
        this.listeners[type].push(listener);
    }
// 消すイベント
    dispatchEvent(type, event) {
        const listeners = this.listeners[type] || [];
        listeners.forEach(listener => listener(event));
    }
// destroy条件
    destroyIfContains(x, y) {
        if (x > this.x && x < this.x + 32 && y > this.y && y < this.y + 32) {
            this.dispatchEvent("destroy", newGameEvent(this));
            console.log("destroy")
        }
    }

    update(input) {}

    render(context) {
        context.fillStyle = "rgb(255, 127, 127)";
        context.fillRect(this.x, this.y, 32, 32);
    }
}

let socketio = io();
let name = '';
let canvas = document.getElementById("canvas");
let context = canvas.getContext('2d');
let users = [];



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
$('#message_form').submit( () => {
    let data = JSON.stringify({ name:name, message:$('#input_msg').val(), action:'chat' });
    socketio.emit('message', data);
    $('#input_msg').val('');
    return false;
});

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

socketio.on('join', (some) => {
    let data = JSON.parse(some);
    $('#messages').append($('<p>').text(data.msg));
    document.getElementById('mine').innerHTML = name;
    //create_circle(data.uid);
//    create_circle();
})

socketio.on('absense', (data) => {
    $('#messages').append($('<p>').text(data));
})

canvas.addEventListener("click", e => {
    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left - 1;
    const y = e.clientY - rect.top - 1;
    users.forEach(user => user.destroyIFContains(x, y));
})

const FPS = 60;
const frameTime = 1 / FPS;
let prevTimestamp = 0;
let tick = 0;

const update = timestamp => {
    const elapsed = (timestamp - prevTimestamp) / 1000;
    if (elapsed <= timestamp) {
        requestAnimationFrame(update);
        return;
    }

    prevTimestamp = timestamp;
    tick++;
// 1秒に1回増やす
    if (tick % FPS === 0) {
        const x = Math.floor(Math.random() * (320 - 32));
        const y = Math.floor(Math.random() * (320 - 32));
        const user = new User(x, y);

        user.addEventListener("destroy", e => {
            users = users.filter(user => user !== e.data);
        });
        users.push(user);
    }
    users.forEach(user => user.update());

    context.clearRect(0, 0, 320, 320);
    users.forEach(user => user.render(context));

    requestAnimationFrame(update);
};

update();

/*********
 * https://qiita.com/negi/items/6ec0d3cedba499eac81a
動的に追加した要素はイベントが聞かない
最初から一つ目は用意しておく

上よりもWebGL使ったほうがよさそう

PixiJSかthree.jsどっちか
2DだからPixiJSでよさそう！！

*********/