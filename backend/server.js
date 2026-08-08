import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import http from 'http';
import { Server } from 'socket.io';
import connectDB from './src/config/db.js';
import authRoutes from './src/routes/authRoutes.js';
import ideaRoutes from './src/routes/ideaRoutes.js';
import applicationRoutes from './src/routes/applicationRoutes.js';
import workspaceRoutes from './src/routes/workspaceRoutes.js';
import messageRoutes from './src/routes/messageRoutes.js';
import notificationRoutes from './src/routes/notificationRoutes.js';
import path from 'path';
dotenv.config();

// Connect to Database
connectDB();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

app.use(cors());
app.use(express.json({ limit: '5mb' }));
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/idea', ideaRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/workspaces', workspaceRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/notifications', notificationRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'FounderLink API is healthy' });
});

// Socket.io real-time connection
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  socket.on('joinWorkspace', (workspaceId) => {
    socket.join(workspaceId);
    console.log(`Socket ${socket.id} joined workspace ${workspaceId}`);
  });

  socket.on('taskUpdated', ({ workspaceId, task }) => {
    socket.to(workspaceId).emit('taskUpdatedFromServer', task);
  });

  socket.on('sendMessage', (message) => {
    socket.broadcast.emit('messageReceived', message);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
