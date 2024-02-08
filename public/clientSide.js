const socket = io('http://localhost:3000');

const clientSocket = io();
clientSocket.on('connect', () => {
    console.log('connected');
    const user = document.getElementById('user');
    user.innerHTML = `User: ${clientSocket.id}`;
});
clientSocket.on('message', (data) => {
    console.log(data);
    clientSocket.send('Hello TO Server!');
});
clientSocket.on('new_chat_message', (data) => {
    console.log(data);
});

clientSocket.on('new_group_message', (data) => {
    console.log(data);
    const message_list = document.getElementById('message_list');
    const message = document.createElement('p');
    message.innerHTML = `<b>${data.group_name}:${data.senderId}:<b/> ${data.message}`;
    message_list.appendChild(message);
});
clientSocket.on('disconnect', () => {
    console.log('disconnected');
});

function sendMessage() {
    const message = document.getElementById('message').value;
    const msg = {
        message: message,
        sender: 'client',
        senderId: clientSocket.id
    }
    clientSocket.emit('chat', msg);
}

function joinGroup() {
    const group_name = document.getElementById('group_name').value;
    //const user = document.getElementById('user').value;
    clientSocket.emit('join_group', group_name);
}

function sendGroupMessage() {
    const group_name = document.getElementById('group_name').value;
    const group_message = document.getElementById('group_message').value;
    const msg = {
        message: group_message,
        sender: 'client',
        senderId: clientSocket.id,
        group_name: group_name
    }

    if (message_list.innerHTML === 'No message yeeet!!!') {
        message_list.innerHTML = '';
    }

    // Add the new message
    message_list.innerHTML += '<p>' + groupMessage + '</p>';

    // Clear the input field
    document.getElementById('group_message').value = '';

    clientSocket.emit('group_chat', msg);
}