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
    message.innerHTML = `<b>${data.groupName}:${data.senderId}:<b/> ${data.message}`;
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
    const groupName = document.getElementById('group_name').value; 
    const group_message = document.getElementById('group_message').value;
    const message_list = document.getElementById('message_list');
    const msg = {
        message: group_message,
        sender: 'client',
        senderId: clientSocket.id,
        groupName: groupName 
    };

    // Add the new message
    message_list.innerHTML += '<p>' + group_message + '</p>';

    // Clear the input field
    document.getElementById('group_message').value = '';

    clientSocket.emit('group_chat', msg);
}

// Handle login form submission
document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    fetch('/user/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            // After successful login
            document.getElementById('login-section').style.display = 'none';
            document.getElementById('signup-section').style.display = 'none';
            document.getElementById('chat-section').style.display = 'block';
        } else {
            // Handle login error
            console.error('Login failed');
        }
    })
    .catch((error) => {
        console.error('Error:', error);
    });
});

// Handle signup form submission
document.getElementById('signup-form').addEventListener('submit', function(event) {
    event.preventDefault();
    event.preventDefault();
    const firstname = document.getElementById('firstname').value;
    const lastname = document.getElementById('lastname').value;
    const email = document.getElementById('email').value;
    const username = document.getElementById('new_username').value;
    const password = document.getElementById('new_password').value;
    fetch('/user/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ firstname, lastname, username, email, password }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            // After successful signup
            document.getElementById('login-section').style.display = 'none';
            document.getElementById('signup-section').style.display = 'none';
            document.getElementById('chat-section').style.display = 'block';
        } else {
            // Handle signup error
            console.error('Signup failed');
        }
    })
    .catch((error) => {
        console.error('Error:', error);
    });
});


