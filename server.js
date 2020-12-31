const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const PORT = process.env.PORT || 3000

http.listen(PORT, () => {
    console.log(`Ready on port ${PORT}`)
})

app.use(express.static(__dirname + '/public'))


// socket
const users = {}
const typers = {}

io.on('connection', (socket) => {
    socket.on('new user', (username) => {
        users[socket.id] = username
        socket.broadcast.emit('user connected', username)
    })

    socket.on('typing', (username) => {
        socket.broadcast.emit('typing', username)
    })

    socket.on('send-chat-message', (message) => {
        socket.broadcast.emit('chat-message', { message: message, username: users[socket.id] })
    })

    socket.on('disconnect', () => {
        socket.broadcast.emit('user-disconnected', users[socket.id])
        delete users[socket.id]
      })
})


