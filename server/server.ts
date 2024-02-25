import { Server, Socket } from 'socket.io';
import { createServer } from 'http';
import { Player } from './models/player';
import mint from './mint';

const httpServer = createServer();
const io = new Server(httpServer, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

let players: Record<string, Player> = {}; // publicKey: Player
let socketIdToPublicKey: Record<string, string> = {}; // socketId: publicKey
let prompt: string; // Prompt from host/judge to be drawn
let images: Record<string, string> = {}; // Images submitted by players
let gameStarted = false;

// Player connects
io.on('connect', (socket) => {
    // Add player to memory when they connect to lobby
    socket.on('addPlayer', (name, avatar, publicKey) => {
        if (players[publicKey]) {
            socket.emit('addPlayerError', `Public key ${publicKey} is already in use.`);
            return;
        }
        const isHost = Object.keys(players).length == 0; 
        let player = { socketId: socket.id, name, avatar, isHost, publicKey };
        players[publicKey] = player;
        socketIdToPublicKey[socket.id] = publicKey;
        
        console.log(`User ${socket.id} connected. Total players: ${Object.keys(players).length}`);
        io.emit('updatePlayers', Object.values(players));
    });


    // Player disconnects
    socket.on('disconnect', () => {
        let player = players[socketIdToPublicKey[socket.id]];
        if (!player) {
            console.log(`User ${socket.id} not found.`);
            return;
        }

        delete players[player.publicKey];
        console.log(`User ${socket.id} disconnected. Total players: ${Object.keys(players).length}`);
        console.log(players);
        io.emit('updatePlayers', Object.values(players));
    });


    // Provide current list players to the new player
    socket.on('getPlayers', () => {
        socket.emit('updatePlayers', Object.values(players));
        console.log(`User ${socket.id} requested players.`);
    });

    
    // Listen for host starting the game
    socket.on('startGame', () => {
        gameStarted = true;
        const x = Object.values(players).filter(player => !player.isHost).map((player) => player.socketId);
        io.to(x).emit('hostStarted');
    });  

    socket.on('getPrompt', () => {
        socket.emit('prompt', prompt);
    })
    
    // Listen for player submitting their prompt's text
    socket.on('submitPrompt', (publicKey, promptText) => {
        prompt = promptText;

        const x = Object.values(players).filter(player => !player.isHost).map((player) => player.socketId)
        io.to(x).emit('hostFinished');
        console.log(`User ${socket.id} submitted prompt: ${promptText}`);
    });
    
    socket.on('submitDraw', (publicKey, image) => {
        images[publicKey] = image;
        console.log(`User ${publicKey} submitted image: ${image}`);
        if (Object.keys(images).length === Object.keys(players).length - 1) {
            io.emit('allImagesSubmitted');
        }
    })

    socket.on('getAllContent', () => {
        const allContent = [{type: "story", data: prompt, user: players[Object.keys(players)[0]]}, ...Object.entries(images).map(([publicKey, image]) => {
            return {type: "image", data: image, user: players[publicKey]}
        })];
        io.emit('allContent', allContent);
    })

    socket.on('like', (publicKey, playerId) => {
        const best = images[playerId];
        const data = {
            image: best,
        }
        const exploreUrl = mint(publicKey, data)
        socket.emit('bestImage', playerId, exploreUrl);
        console.log(`User ${socket.id} liked ${playerId}`);
    })
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`)); 