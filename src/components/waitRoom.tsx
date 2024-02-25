import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { Button } from "./ui/button";


export interface User {
  socketId: string;
  name: string;
  avatar: string;
  isHost: boolean;
  publicKey: string;
}

interface RoomProps {
  users: User[];
}

export function UserCard({ user }: { user: User }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg m-2">
      <Avatar className="w-[100px] h-[100px] border-[5px] border-black p-2 rounded-lg bg-yellow-300">
        <AvatarImage src={user.avatar} />
      </Avatar>
      <h3>{user.name}</h3>
    </div>
  )
} 


export function Room({ users }: RoomProps) {
  
  return (
    <div className="flex flex-col items-center justify-center w-full">
      <h1 className="font-customs text-[50px] text-shadow-custom text-[#8DFCBC]">Room</h1>
      <h2 className="text-shadow sm:text-shadow-sm md:text-shadow-md lg:text-shadow-lg xl:text-shadow-xl">PLAYERS: {users.length}/7 </h2>
      <div className="flex flex-row border-[5px] w-full border-black rounded-lg overflow-x-auto">
        {users.map((user) => (
          <UserCard user={user} key={user.socketId}/>
        ))}
        {[...Array(7 - users.length)].map((_, i) => (

        <div key={i} className="flex flex-col items-center justify-center rounded-lg mx-2">
          <div className="flex rounded-lg border-[5px] border-black border-dashed bg-yellow-300 w-[100px] h-[100px] overflow-hidden items-center justify-center opacity-50">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width={100} height={100}><g transform="translate(0,0)" ><path d="M250.882 22.802c-23.366 3.035-44.553 30.444-44.553 65.935 0 19.558 6.771 36.856 16.695 48.815l11.84 14.263-18.217 3.424c-12.9 2.425-22.358 9.24-30.443 20.336-8.085 11.097-14.266 26.558-18.598 44.375-7.843 32.28-9.568 71.693-9.842 106.436h42.868l11.771 157.836c29.894 6.748 61.811 6.51 90.602.025l10.414-157.86h40.816c-.027-35.169-.477-75.126-7.584-107.65-3.918-17.934-9.858-33.372-18.04-44.343-8.185-10.97-18.08-17.745-32.563-19.989l-18.592-2.88 11.736-14.704c9.495-11.897 15.932-28.997 15.932-48.082 0-37.838-23.655-65.844-49.399-65.844z" fill="#000000" fill-opacity="1"/></g></svg>
          </div>
            <h3>User X</h3>
      </div>
      ))}
    </div>
    </div>
  )

}