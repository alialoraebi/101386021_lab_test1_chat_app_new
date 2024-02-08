require('dotenv').config()
const secret = process.env.JWT_SECRET
const express = require('express');
const mongoose = require('mongoose');
const socketIO = require('socket.io');
const userRoutes = require('./routes/users');

const app = express();
app.use(express.json());
app.use(express.static(__dirname + '/public')); // Serve static files

const http = require('http').createServer(app);
const io = socketIO(http);

const SERVER_PORT = process.env.PORT || 3000;

// MongoDB Connection
const DB_HOST = "cluster0.z7sm5qd.mongodb.net";
const DB_USER = "aaloreabi2000";
const DB_PASSWORD = PASSWORD;
const DB_NAME = "comp3133LabTest";
const DB_CONNECTION_STRING = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}?retryWrites=true&w=majority`;

mongoose.connect(DB_CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Success Mongodb connection');
}).catch(err => {
  console.error('Error connecting to MongoDB:', err);
});

// Routes
app.use("/user", userRoutes);

// Login route
app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ status: 'fail', message: 'All fields are required' });
        }

        const existingUser = await userModel.findOne({ username });
        if (!existingUser) {
            return res.status(401).json({ status: 'fail', message: 'Invalid username or password' });
        }

        const isPasswordValid = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordValid) {
            return res.status(401).json({ status: 'fail', message: 'Invalid username or password' });
        }

        const jwt = require('jsonwebtoken');

        // User is authenticated
        const token = jwt.sign({ id: existingUser._id }, secret, { expiresIn: '1h' });

        res.redirect('/');

        return res.status(200).json({ status: 'success', message: 'Logged in successfully' });
    } catch (error) {
        return res.status(500).json({ status: 'error', message: 'An error occurred while trying to log in' });
    }
});

// Signup route
app.post('/signup', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ status: 'fail', message: 'All fields are required' });
        }

        const existingUser = await userModel.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ status: 'fail', message: 'Username already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new userModel({ username, password: hashedPassword });

        await newUser.save();

        return res.status(201).json({ status: 'success', message: 'User created successfully' });
    } catch (error) {
        return res.status(500).json({ status: 'error', message: 'An error occurred while trying to sign up' });
    }
});


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html'); 
});

// Server setup
http.listen(SERVER_PORT, () => {
    console.log(`Server started at http://localhost:${SERVER_PORT}/`);
});

// Socket setup
io.on('connection', (socket) => {
    console.log('Socket connection made', socket.id);
    
    socket.emit('message', 'Hello from server'); 
    socket.on('message', (data) => {
        console.log(`Server : ${data}`);
    })

    socket.on('chat', (data) => {
        socket.broadcast.emit('new_chat_message', data);
        console.log(data);
    })

    socket.on('join_group', (groupName) => {
        socket.join(groupName);
        console.log(`Joined group ${groupName}`);
    })

    socket.on('group_chat', (data) => {
        serverIO.to(data.group_name).emit('new_group_message', data);
        console.log(data);
    })

    socket.on('leave_group', (groupName) => {
        socket.leave(groupName);
        console.log(`Left group ${groupName}`);
    })
});
