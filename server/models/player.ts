// models/player.ts

export type Player = {
    id: string;
    name: string;
    avatar: string;
    isHost: boolean;
    order: number;
    publicKey: string;
  };