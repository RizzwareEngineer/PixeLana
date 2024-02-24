'use client';
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  FC,
  ReactNode,
  useCallback,
} from "react";
import io from "socket.io-client";
import { useWallet } from "@solana/wallet-adapter-react";

import { Socket } from "socket.io-client"; // Add this import statement
import { toast } from "sonner";

interface SocketAuthContextState {
  socket: Socket | null;
  connectSocket: () => Socket | void;
  socketId: string;
  disconnectSocket: () => void; // Adding a method to disconnect the socket
}

const SocketAuthContext = createContext<SocketAuthContextState>({
  socket: null,
  connectSocket: () => {},
  socketId: "",
  disconnectSocket: () => {}, // Initial disconnectSocket function
});

export const useSocketAuth = () => useContext(SocketAuthContext);

export const SocketAuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [socketId, setSocketId] = useState<string>("");
  const wallet = useWallet();

  const connectSocket = useCallback(() => {
    if (wallet.connected && wallet.publicKey) {
      const newSocket = io(process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3001", {
        autoConnect: true,
      });

      newSocket.on("connect", () => {
        console.log("Connected to Socket.IO server", newSocket.id);
        setSocketId(newSocket.id!);
        // Authenticate with the server using the wallet's public address
        // newSocket.emit("authenticate", { publicKey: wallet.publicKey.toString() });
      });

      setSocket(newSocket);
      return newSocket;
    } else {
      toast.error("Please connect your wallet first");
    }
  }, [wallet.connected, wallet.publicKey]);

  const disconnectSocket = useCallback(() => {
    if (socket) {
      socket.disconnect();
      setSocket(null);
      setSocketId("");
      console.log("Socket disconnected");
    }
  }, [socket]);

  // Automatically disconnect socket if the wallet disconnects or changes
  React.useEffect(() => {
    if (!wallet.connected || !wallet.publicKey) {
      disconnectSocket();
    }
  }, [wallet.connected, wallet.publicKey, disconnectSocket]);

  return (
    <SocketAuthContext.Provider value={{ socket, connectSocket, socketId, disconnectSocket }}>
      {children}
    </SocketAuthContext.Provider>
  );
};