import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
});

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));

// Track active rooms and their users
const activeRooms = new Map();

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join_room', ({ room, username }) => {
    // Check if room exists or create new room
    if (!activeRooms.has(room)) {
      activeRooms.set(room, new Set());
    }
    
    // Add user to room
    activeRooms.get(room).add(socket.id);
    socket.join(room);
    console.log(`User ${username} (${socket.id}) joined room ${room}`);
    
    // Notify room about new user
    io.to(room).emit('receive_message', {
      message: `${username} has joined the room`,
      author: 'System',
      time: new Date().toLocaleTimeString()
    });

    // Send room status to the client
    socket.emit('room_joined', { success: true });
  });

  socket.on('leave_room', ({ room, username }) => {
    if (activeRooms.has(room)) {
      // Remove user from room
      activeRooms.get(room).delete(socket.id);
      socket.leave(room);
      
      // Notify others in the room
      io.to(room).emit('receive_message', {
        message: `${username} has left the room`,
        author: 'System',
        time: new Date().toLocaleTimeString()
      });
      
      // If room is empty, remove it
      if (activeRooms.get(room).size === 0) {
        activeRooms.delete(room);
        console.log(`Room ${room} has been removed as it's empty`);
      }
    }
  });
  socket.on('send_message', (data) => {
    io.to(data.room).emit('receive_message', data);
  });



  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    
    // Remove user from all rooms they were in and notify others
    activeRooms.forEach((users, room) => {
      if (users.has(socket.id)) {
        users.delete(socket.id);
        
        // If room is empty, remove it
        if (users.size === 0) {
          activeRooms.delete(room);
          console.log(`Room ${room} has been removed as it's empty`);
        }
      }
    });
  });
});

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});