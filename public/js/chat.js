const socket = io()

socket.on('message', (message) => {
    console.log(message)
})

// socket.on('countUpdated', (counted) => {
//     console.log('The count has been updated', counted)
// })

// document.querySelector('#increment').addEventListener('click', () => {
//     console.log('clicked')
//     socket.emit('increment')
// }) 