const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Serve static files from the React app build directory
app.use(express.static(path.join(__dirname, 'build')));

// Store active rooms and their states
const rooms = new Map();

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Join a room
  socket.on('join-room', (roomId, userInfo) => {
    socket.join(roomId);
    socket.roomId = roomId;
    socket.userInfo = userInfo;

    // Initialize room if it doesn't exist
    if (!rooms.has(roomId)) {
      rooms.set(roomId, {
        code: '// Welcome to Collaborative Code Editor\\nconsole.log(\"Hello, World!\");',
        language: 'javascript',
        users: new Map(),
        fileName: 'main.js'
      });
    }

    const room = rooms.get(roomId);
    room.users.set(socket.id, {
      id: socket.id,
      ...userInfo,
      cursor: { line: 1, column: 1 }
    });

    // Send current room state to the joining user
    socket.emit('room-state', {
      code: room.code,
      language: room.language,
      fileName: room.fileName,
      users: Array.from(room.users.values())
    });

    // Notify other users in the room
    socket.to(roomId).emit('user-joined', {
      id: socket.id,
      ...userInfo,
      cursor: { line: 1, column: 1 }
    });

    console.log(`User ${userInfo.name} joined room ${roomId}`);
  });

  // Handle code changes
  socket.on('code-change', (data) => {
    if (!socket.roomId) return;

    const room = rooms.get(socket.roomId);
    if (room) {
      room.code = data.code;
      
      // Broadcast code change to other users in the room
      socket.to(socket.roomId).emit('code-change', {
        code: data.code,
        userId: socket.id,
        timestamp: Date.now()
      });
    }
  });

  // Handle cursor position changes
  socket.on('cursor-change', (cursorData) => {
    if (!socket.roomId) return;

    const room = rooms.get(socket.roomId);
    if (room && room.users.has(socket.id)) {
      const user = room.users.get(socket.id);
      user.cursor = cursorData;
      
      // Broadcast cursor change to other users
      socket.to(socket.roomId).emit('cursor-change', {
        userId: socket.id,
        cursor: cursorData
      });
    }
  });

  // Handle language changes
  socket.on('language-change', (language) => {
    if (!socket.roomId) return;

    const room = rooms.get(socket.roomId);
    if (room) {
      room.language = language;
      
      // Broadcast language change to other users
      socket.to(socket.roomId).emit('language-change', language);
    }
  });

  // Handle file name changes
  socket.on('filename-change', (fileName) => {
    if (!socket.roomId) return;

    const room = rooms.get(socket.roomId);
    if (room) {
      room.fileName = fileName;
      
      // Broadcast filename change to other users
      socket.to(socket.roomId).emit('filename-change', fileName);
    }
  });

  // Handle user disconnect
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);

    if (socket.roomId) {
      const room = rooms.get(socket.roomId);
      if (room) {
        room.users.delete(socket.id);
        
        // Notify other users
        socket.to(socket.roomId).emit('user-left', socket.id);
        
        // Clean up empty rooms
        if (room.users.size === 0) {
          rooms.delete(socket.roomId);
          console.log(`Room ${socket.roomId} cleaned up`);
        }
      }
    }
  });
});

// Handle React routing, return all requests to React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Socket.IO server is ready for connections`);
});
