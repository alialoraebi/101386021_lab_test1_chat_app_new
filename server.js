import dotenv from 'dotenv';
dotenv.config();
import { createServer } from 'http';
import { Server as SocketIO } from 'socket.io';
import express from 'express';
import mongoose from 'mongoose';
import userRoutes from './routes/users.js'; // Ensure the path is correct



const app = express();
app.use(express.json());
app.use(express.static(__dirname + '/public')); // Serve static files

const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: process.env.CLIENT_URL === 'http://localhost:3000' ? 'http://localhost:3000' : 'https://comp3133-labtest.herokuapp.com',                                            
    }
});

const SERVER_PORT = process.env.PORT || 3000;


// MongoDB Connection
const DB_HOST = "cluster0.z7sm5qd.mongodb.net";
const DB_USER = "aaloreabi2000";
const DB_PASSWORD = process.env.PASSWORD;
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
        serverIO.to(data.groupName).emit('new_group_message', data);
        console.log(data);
    })

    socket.on('leave_group', (groupName) => {
        socket.leave(groupName);
        console.log(`Left group ${groupName}`);
    })
});

module.exports = app;
