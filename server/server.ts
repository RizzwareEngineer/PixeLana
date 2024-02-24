import { Server as SocketIOServer } from 'socket.io';
import { createServer } from 'http';

const httpServer = createServer();
const io = new SocketIOServer(httpServer, {
  // options if needed
});

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

  // Your event handlers here
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`));
