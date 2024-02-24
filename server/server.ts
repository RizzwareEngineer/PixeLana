import { Server, Socket } from 'socket.io';
import { createServer } from 'http';
import { Player } from './models/player';
import { Prompt } from './models/prompt';

const httpServer = createServer();
const io = new Server(httpServer, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

let players: Record<string, Player> = {};
let startingPrompts: Prompt[] = [];

// Player connects
io.on('connect', (socket) => {
    
    // Add player to memory
    socket.on('addPlayer', (name, publicKey) => {
        let player = { id: socket.id, name, publicKey };
        players[socket.id] = player;
        
        console.log(`User ${socket.id} connected. Total players: ${Object.keys(players).length}`);
      });

    
    // Player disconnects
    socket.on('disconnect', () => {
        let player = players[socket.id];
        if (!player) {
            console.log(`User ${socket.id} not found.`);
            return;
        }

        delete players[socket.id];
        console.log(`User ${socket.id} disconnected. Total players: ${Object.keys(players).length - 1}`);
    });
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`));