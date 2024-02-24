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

let players: Record<string, Player> = {}; // publicKey: Player
let order = 0; // Keep track of the number of players
let startingPrompts: Prompt[] = [];

// Player connects
io.on('connect', (socket) => {
    // Add player to memory when they connect to lobby
    socket.on('addPlayer', (name, avatar, isHost, publicKey) => {
        if (players[publicKey]) {
            socket.emit('addPlayerError', `Public key ${publicKey} is already in use.`);
            return;
        }
        
        let player = { id: socket.id, name, avatar, isHost, order, publicKey };
        players[publicKey] = player;
        order++;
        
        console.log(`User ${socket.id} connected. Total players: ${Object.keys(players).length}, Order: ${order}`);
        io.emit('updatePlayers', Object.values(players));
    });


    // Player disconnects
    socket.on('disconnect', () => {
        let player = Object.values(players).find(player => player.id === socket.id);
        if (!player) {
            console.log(`User ${socket.id} not found.`);
            return;
        }

        delete players[player.publicKey];
        console.log(`User ${socket.id} disconnected. Total players: ${Object.keys(players).length}`);
        io.emit('updatePlayers', Object.values(players));
    });


    // Provide current list players to the new player
    socket.on('getPlayers', () => {
        socket.emit('updatePlayers', Object.values(players));
        console.log(`User ${socket.id} requested players.`);
    });

    // Listen for host starting the game
    socket.on('startGame', () => {
        // Emit 'gameStart' event to all connected clients
        io.emit('gameStart');
    });


    // Listen for player submitting their prompt's text
    socket.on('submitPrompt', (publicKey, promptText) => {
        let player = players[publicKey];
        let prompt: Prompt = { player, text: promptText };
        startingPrompts.push(prompt);
    
        console.log(`Prompt: ${prompt}`);
    });    
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`));