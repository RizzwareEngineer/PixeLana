'use client'

import { AvatarPicker } from "@/components/customAvatar";
import NavBar from "@/components/navBar";
import { Button } from "@/components/ui/button";
import { useSocketAuth } from "@/contexts/SocketAuthContext";
import Image from "next/image";
import { useEffect } from "react";
import io from "socket.io-client";

export default function Home() {

  const {socket} = useSocketAuth()

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <NavBar />
      <div className="w-[1082px] h-[698px] absolute border-4 border-gray-300 shadow-inner rounded-lg left-[50%] top-[50%] -translate-x-1/2 -translate-y-1/2 lg:scale-95 md:scale-90 sm:scale-[0.6]">
        {/* <h1 className="text-5xl font-bold text-center">Welcome to the Solana Wallet</h1> */}
        <AvatarPicker />
      </div>
    </main>
  );
}
