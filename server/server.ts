import { Server as SocketIOServer } from 'socket.io';
import { createServer } from 'http';

const httpServer = createServer();
const io = new SocketIOServer(httpServer, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

let numberPlayers: number = 0; 

// Player connects
io.on('connection', (socket) => {
    numberPlayers++;
    console.log(`a user connected. Total players: ${numberPlayers}`);
    
    // Player disconnects
    socket.on('disconnect', () => {
        numberPlayers--;
        console.log('user disconnected. Total players: ' + numberPlayers);
    });
});
const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`));
