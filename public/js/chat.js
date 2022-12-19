const socket = io()

//elements
const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $sendLocationButton = document.querySelector('#send-location')
const $messages = document.querySelector('#messages')

//templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationMessageTemplate = document.querySelector('#location-message-template').innerHTML
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML

//options
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })

const autoScroll = () => {
    // new message element
    const $newMessage = $messages.lastElementChild

    //height of the new message
    const newMessageStyles = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

   //visible height
    const visibleHeight = $messages.offsetHeight

    // height of messages container
    const containerHeight = $messages.scrollHeight

    //how far have i scrolled?
    const scrollOffset = $messages.scrollTop + visibleHeight

    if (containerHeight - newMessageHeight <= scrollOffset) {
        $messages.scrollTop = $messages.scrollHeight
    }
}

socket.on('message', (message) => {
    console.log(message)
    const html = Mustache.render(messageTemplate, {
        username: message.username,
        message: message.text,
        createdAt: moment(message.createdAt).format('h:m A')
    })
    $messages.insertAdjacentHTML('beforeend', html)
    autoScroll()
})

socket.on('locationMessage', (message) => {
    console.log(message)
    const html = Mustache.render(locationMessageTemplate, {
        username: message.username,
        url: message.url,
        createdAt: moment(message.createdAt).format('h:m A')
    })
    $messages.insertAdjacentHTML('beforeend', html)
    autoScroll()
})
  
socket.on('roomData', ({ room, users }) => {
    const html = Mustache.render(sidebarTemplate, {
        room, 
        users
    })
    document.querySelector('#sidebar').innerHTML = html
})

$messageForm.addEventListener('submit', (e) => {
    e.preventDefault()
   
    // disable the message form when message is being sent
    $messageFormButton.setAttribute('disabled', 'disabled')

    const message = e.target.elements.message.value

    /* Sending the message to the server. */
    socket.emit('sendMessage', message, (error) => {
        
        // enable the message form when message is sent
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value = ' '
        $messageFormInput.focus()

        if (error) {
            return console.log(error)
        }

        console.log('Message delivered!')
    })
})


$sendLocationButton.addEventListener('click', () => {
    if (!navigator.geolocation) {
        return alert(' Geolocation is not supported by your browser')
    } 

    $sendLocationButton.setAttribute('disabled', 'disabled')
        
    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('sendLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, () => {
            $sendLocationButton.removeAttribute('disabled')
            console.log('Location Shared!')
        })
    })
})

socket.emit('join', { username, room }, (error) => {
    if (error) {
        alert(error)
        location.href = '/'
    }
})



// socket.on('countUpdated', (counted) => {
//     console.log('The count has been updated', counted)
// })

// document.querySelector('#increment').addEventListener('click', () => {
//     console.log('clicked')
//     socket.emit('increment')
// }) 