const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')

const app = express()
/* Creating a server. */
const server = http.createServer(app)
/* Creating a socket.io server. */
const io = socketio(server)

const port = process.env.PORT || 12345
const publicDirectoryPath =  path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))



io.on('connection', (socket) => {
    console.log('New Websocket Connection')

   
/
    socket.emit('message', 'Welcome!')
    socket.broadcast.emit('message', 'a new user has joined')

/* Listening for the sendMessage event. When it receives it, it will emit the message event to all the
clients. */
    socket.on('sendMessage', (message) => {
        io.emit('message', message) 
    })

    socket.on('sendLocation', (coords) => {
        io.emit('message', `https://google.com/maps?q=${coords.latitude},${coords.longitude}`)
    })

/* Listening for the disconnect event. When it receives it, it emits the message event to all the
clients. */
    socket.on('disconnect', () => {
        io.emit('message', 'A user has left')
    })
})

server.listen(port, () => {
    console.log(`this server is up on ${port}` )
})
    















//     socket.emit('countUpdated', count)

// /* Listening for the increment event. When it receives it, it increments the count and emits the
// countUpdated event to all the clients. */
//     socket.on('increment', () => {
//         count++
//        // socket.emit('countUpdated', count)
//         io.emit('countUpdated', count)
//     })
