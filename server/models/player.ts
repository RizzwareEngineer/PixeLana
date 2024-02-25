// models/player.ts

export type Player = {
    socketId: string;
    name: string;
    avatar: string;
    isHost: boolean;
    publicKey: string;
  };