const socket = io();
const messageForm = document.querySelector('#yourmssg');
const messageInput = document.querySelector('#textarea');
const messageArea = document.querySelector('.message-area');
const feedback = document.querySelector('#feedback');


const username = prompt('select a username')
appendMessage('You joined!')
socket.emit('new user', username)

// USER CONNECTED
socket.on('user connected', username => {
    appendMessage(`${username} joined!`)
}) 

// INCOMING MESSAGES
socket.on('chat-message', (data) => {
    appendMessage(`${data.username}: ${data.message}`, 'incoming')
    scrollToBottom()
})

// USER DISCONNECTED
socket.on('user-disconnected', name => {
    appendMessage(`${name} disconnected`)
  })

// OUTGOING MESSAGES  
messageForm.addEventListener('submit', e => {
    e.preventDefault()
    let message = messageInput.value
    appendMessage(`You: ${message}`, 'outgoing')
    socket.emit('send-chat-message', message)
    messageInput.value = ''
})

// IS ANYONE TYPING?
messageInput.addEventListener('keypress', () => {
    if (handle.value.length > 0) {
        socket.emit('typing', handle.value)
    }
})

socket.on('typing', (username) => {
    feedback.innerHTML = `<p>${username} is typing...</p>`
})


// Send message to the message area
function appendMessage(message, type) {
    const aMessage = document.createElement('div')
    let className = type
    aMessage.classList.add(className, 'message')
    aMessage.innerText = message
    messageArea.append(aMessage)
}


function scrollToBottom() {
    messageArea.scrollTop = messageArea.scrollHeight
}