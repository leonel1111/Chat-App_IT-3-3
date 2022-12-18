const socket = io()

socket.on('message', (message) => {
    console.log(message)
})

document.querySelector('#message-form').addEventListener('submit', (e) => {
    e.preventDefault()

    const message = e.target.elements.message.value

    /* Sending the message to the server. */
    socket.emit('sendMessage', message)
})


// socket.on('countUpdated', (counted) => {
//     console.log('The count has been updated', counted)
// })

// document.querySelector('#increment').addEventListener('click', () => {
//     console.log('clicked')
//     socket.emit('increment')
// }) 