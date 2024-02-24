import NavBar from "@/components/navBar";
import { Room, type User } from "@/components/waitRoom";
import { useSocketAuth } from "@/contexts/SocketAuthContext";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";


export default function WaitRoom() {

  const [users, setUsers] = useState<User[]>([]);
  const {socket} = useSocketAuth();
  useEffect(() => {
    if (socket) {
      // TODO: probably 3 events: 1. new-user-join 2. user-leave 3. emit all existing users to new user
    // socket.emit('join-room', {roomId: "1", userId: "1", name: "test", avatar: "test", isHost: true})
    }
  }, [socket])


  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <NavBar />
      <div className="flex flex-col h-[calc(100%-80px)] w-full items-center justify-center">
        <Room users={users}/> 
      </div>
    </main>
  )
}