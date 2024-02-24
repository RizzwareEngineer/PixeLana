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
}

const SocketAuthContext = createContext<SocketAuthContextState>({
  socket: null,
});

export const useSocketAuth = () => useContext(SocketAuthContext);

export const SocketAuthProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const wallet = useWallet();

  if (!process.env.NEXT_PUBLIC_SOCKET_URL) {
    throw new Error("NEXT_PUBLIC_SOCKET_URL is not set");
  }

  useEffect(() => {
    if (wallet.connected) {
      // Initialize WebSocket connection after wallet connection
      const newSocket = io(process.env.NEXT_PUBLIC_SOCKET_URL!, {
        autoConnect: true, // Adjust based on your needs
      });

      newSocket.on("connect", () => {
        // Authenticate with the server using the wallet's public address
        newSocket.emit("authenticate", {
          publicKey: wallet.publicKey!.toString(),
        });
      });

      setSocket(newSocket);

      return () => {
        newSocket.close();
      };
    }
  }, [wallet.connected, wallet.publicKey]);

  return (
    <SocketAuthContext.Provider value={{ socket }}>
      {children}
    </SocketAuthContext.Provider>
  );
};
