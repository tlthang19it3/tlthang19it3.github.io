const express = require('express');
const app = express();
const server = require("http").createServer(app);
const io = require('socket.io')(server, {
    cors: {
        origin: "*"
    }
})
const arrUserInfo = [];

app.use(express.static('public'));
app.use('/css', express.static(__dirname + 'public/css'));
app.set('view engine', 'ejs')

app.get('/index', (req, res) => {
    res.render('index')
});

server.listen(3001, () => {
    console.log('Server running...')
});
io.on("connection", (socket) => {
    console.log(socket.id);
    socket.on('chat1', user => {
        const isExits = arrUserInfo.some(e => e.ten == user.ten)
        socket.peerIp = user.peerIp;
        if (isExits) return socket.emit('thatbai');
        arrUserInfo.push(user);
        socket.emit('online', arrUserInfo);
        socket.broadcast.emit('moi', user);
    });
    socket.on('disconnect', () => {
        const index = arrUserInfo.findIndex(user => user.peerIp == socket.peerIp);
        arrUserInfo.splice(index, 1);
        io.emit('ngat', socket.peerIp);
    });
});