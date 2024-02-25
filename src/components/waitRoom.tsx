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
    <div className="flex flex-col items-center justify-center w-[100px] h-[100px] bg-white rounded-lg m-2 border-[3px] border-black">
      <Avatar className="">
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
      </div>
    </div>
  )

}