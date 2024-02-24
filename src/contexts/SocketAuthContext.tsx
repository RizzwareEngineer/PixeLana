'use client';
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  FC,
  ReactNode,
} from "react";
import io from "socket.io-client";
import { useWallet } from "@solana/wallet-adapter-react";

import { Socket } from "socket.io-client"; // Add this import statement

interface SocketAuthContextState {
  socket: Socket | null; // Update the type to 'Socket'
  socketId: string,
}

const SocketAuthContext = createContext<SocketAuthContextState>({
  socket: null,
  socketId: ""
});

export const useSocketAuth = () => useContext(SocketAuthContext);

export const SocketAuthProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [socketId, setSocketId] = useState<string>("");
  const wallet = useWallet();

  // if (!process.env.NEXT_PUBLIC_SOCKET_URL) {
  //   throw new Error("NEXT_PUBLIC_SOCKET_URL is not set");
  // }

  useEffect(() => {
    if (wallet.connected) {
      // Initialize WebSocket connection after wallet connection
      const newSocket = io(process.env.NEXT_PUBLIC_SOCKET_URL! || "http://localhost:3001" , {
        autoConnect: true, // Adjust based on your needs
      });

      newSocket.on("connect", () => {
        console.log("Connected to Socket.IO server", newSocket.id);
        setSocketId(newSocket.id!);
        // Authenticate with the server using the wallet's public address
        // newSocket.emit("authenticate", {
        //   publicKey: wallet.publicKey!.toString(),
        // });
      });

      setSocket(newSocket);

      return () => {
        newSocket.close();
      };
    }
  }, [wallet.connected, wallet.publicKey]);

  return (
    <SocketAuthContext.Provider value={{ socket, socketId }}>
      {children}
    </SocketAuthContext.Provider>
  );
};
