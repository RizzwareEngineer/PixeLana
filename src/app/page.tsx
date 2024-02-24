<<<<<<< HEAD
'use client'

=======
import NavBar from "@/components/navBar";
>>>>>>> 76cfaa8 (feat(ui): wallet works)
import Image from "next/image";
import { useEffect } from "react";
import io from "socket.io-client";


const SOCKET_IO_URL = "http://localhost:3001";
let socket: ReturnType<typeof io>;

export default function Home() {
  useEffect(() => {
    // Initialize socket connection
    socket = io(SOCKET_IO_URL, { transports: ['websocket'] });

    // Listening for connection
    socket.on("connect", () => {
      console.log("Connected to Socket.IO server", socket.id);
    });

    // Cleanup on component unmount
    return () => {
      socket.disconnect();
    };
  }, []);

  
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <NavBar />
    </main>
  );
}
