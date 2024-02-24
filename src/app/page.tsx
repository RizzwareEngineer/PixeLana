'use client'

import NavBar from "@/components/navBar";
import { useSocketAuth } from "@/contexts/SocketAuthContext";
import Image from "next/image";
import { useEffect } from "react";
import io from "socket.io-client";

export default function Home() {

  const {socket} = useSocketAuth()

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <NavBar />
    </main>
  );
}
