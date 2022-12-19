const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const Filter = require('bad-words')
const { generateMessage, generateLocationMessage } = require('./utils/messages')
const { addUser, removeUser, getUser, getUsersInRoom } = require('./utils/users')

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

   
    
    socket.on('join', (options, callback) => {
        const { error, user } = addUser({ id: socket.id, ...options })
        
        if (error) {
            return callback(error)
        }

        socket.join(user.room)
   
        socket.emit('message', generateMessage('Admin', 'Welcome'))
        socket.broadcast.to(user.room).emit('message', generateMessage('Admin', `${user.username} has joined`))
        io.to(user.room).emit('roomData', {
            room: user.room,
            users: getUsersInRoom(user.room)
        })

        callback()
    })
/* Listening for the sendMessage event. When it receives it, it will emit the message event to all the
clients. */
    socket.on('sendMessage', (message, callback) => {
        const user = getUser(socket.id)
        const filter = new Filter()

        if (filter.isProfane(message)) {
            return callback('profanity is not allowed')
        }

        io.to(user.room).emit('message', generateMessage(user.username, message)) 
        callback()
    })

    socket.on('sendLocation', (coords, callback) => {
        const user = getUser(socket.id)
        io.to(user.room).emit('locationMessage', generateLocationMessage(user.username, `https://google.com/maps?q=${coords.latitude},${coords.longitude}`))
        callback()
    })

/* Listening for the disconnect event. When it receives it, it emits the message event to all the
clients. */
    socket.on('disconnect', () => {
      const user =  removeUser(socket.id)
        
        if (user) {
            io.to(user.room).emit('message', generateMessage('Admin', `${user.username} has left!`))
            io.to(user.room).emit('roomData', {
                room: user.room,
                users: getUsersInRoom(user.room)
            })
      }
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
