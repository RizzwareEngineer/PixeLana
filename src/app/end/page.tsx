'use client'

import NavBar from "@/components/navBar";
import { User } from "@/components/waitRoom";
import { useSocketAuth } from "@/contexts/SocketAuthContext";
import { useEffect, useState } from "react";

interface Content {
  type: "image" | "story";
  data: string;
  user: User;
}

const columnStyle="";

export function EngPage() {

  const {socket} = useSocketAuth();
  const [content, setContent] = useState<Content[] | null>(null);

  useEffect(() => {
    if (socket) {

    }

  }, [socket])

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <NavBar />
      <div className="h-[calc(100%-80px)] w-full items-center justify-center grid grid-cols-2">
        <div className="flex flex-col justify-center">
          {content && content.map((c) => (
            <div key={c.user.id} className="flex items-center justify-between">
              <div className="">
              </div>
              <div className="">

              </div>
            </div>
          ))}
        </div>
        <div className="">

        </div> 
      </div>
    </main>

  )

}