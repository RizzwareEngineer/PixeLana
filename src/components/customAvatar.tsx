'use client';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import { avatars } from "@/lib/avatars"
import {SvgIcon} from "@/components/customSvg"
import { Button } from "./ui/button";
import { useState } from "react";
import { useSocketAuth } from "@/contexts/SocketAuthContext";
import { useWallet } from "@solana/wallet-adapter-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const avatars = ['chalk-outline-murder.png', 'gibbet.png', 'life-in-the-balance.png', 'pierced-heart.png', 'haunting.png', 'skeletal-hand.png', 'sarcophagus.png', 'spectre.png', 'slipknot.png', 'shambling-zombie.png', 'oni.png', 'death-zone.png', 'telefrag.png', 'half-dead.png', 'morgue-feet.png', 'decapitation.png', 'dead-head.png', 'anubis.png', 'ghost.png', 'scythe.png', 'graveyard.png', 'reaper-scythe.png', 'drowning.png', 'internal-injury.png', 'prayer.png', 'dead-eye.png', 'resting-vampire.png', 'guillotine.png', 'tombstone.png', 'dead-wood.png', 'pirate-grave.png', 'imprisoned.png', 'suicide.png', 'coffin.png', 'carrion.png', 'egyptian-urns.png', 'grave-flowers.png', 'grim-reaper.png', 'executioner-hood.png', 'maggot.png']

const genRandomName = () => { let randomName = ''; const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'; for (let i = 0; i < 6; i++) { const randomIndex = Math.floor(Math.random() * characters.length); randomName += characters[randomIndex]; } return randomName; }


export function AvatarPicker() {
  const router = useRouter();
  const {connectSocket} = useSocketAuth();
  const wallet = useWallet()
  const leftPath = "M168 48v160a8 8 0 0 1-13.66 5.66l-80-80a8 8 0 0 1 0-11.32l80-80A8 8 0 0 1 168 48"
  // const avatarArray = Object.values(avatars);
  const rightPath = "m181.66 133.66l-80 80A8 8 0 0 1 88 208V48a8 8 0 0 1 13.66-5.66l80 80a8 8 0 0 1 0 11.32"
  const [name, setName] = useState(genRandomName())
  const size = "48";
  const [chosenIndex, setChosen] = useState(0)
  const prev = () => {
    if (chosenIndex === 0) {
      setChosen(avatars.length - 1)
    } else {
      return setChosen(chosenIndex - 1)
    }
  }
  const next = () => {
    if (chosenIndex === avatars.length - 1) {
      setChosen(0)
    } else {
      setChosen(chosenIndex + 1)
    }
  }

  // Player connects to server/socket and waits for other players to join
  const onStart = () => {
    const socket = connectSocket();
    if (socket) {
      socket.emit('addPlayer', name, `/avatars/${avatars[chosenIndex]}`, true, wallet.publicKey?.toBase58());
      router.push('/waiting');
    }
  }

  return (
    <div className="flex flex-col items-center justify-center h-full space-y-10">
    <h1 className="font-customs text-[50px] text-shadow-custom text-[#8DFCBC]">Diffuser Phone</h1>
    <div className="flex items-center justify-center w-full ">
      <Button className="bg-transparent border-none ring-none transition ease-in-out hover:-translate-y-1 hover:scale-110" onClick={prev}>
      {/* <SvgIcon pathData={leftPath} width={size} height={size} viewBox = {`0 0 ${size} ${size}`}/> */}
      <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 256 256"><path stroke={"black"} stroke-width="6" fill="#F9E05A" d="M168 48v160a8 8 0 0 1-13.66 5.66l-80-80a8 8 0 0 1 0-11.32l80-80A8 8 0 0 1 168 48"></path></svg>
      </Button>
      <Avatar className="border-[5px] border-black w-[175px] h-[175px] rounded-full bg-primary">
        <AvatarImage src={`/avatars/${avatars[chosenIndex]}`} alt="avatar" />
      </Avatar>
      {/* <SvgIcon pathData={avatarArray[chosenIndex]} width={"100"} height={"100"} /> */}
      <Button onClick={prev} className="bg-transparent border-none ring-none transition ease-in-out hover:-translate-y-1 hover:scale-110">
        <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 256 256"><path stroke={"black"} stroke-width="6" fill="#F9E05A" d="m181.66 133.66l-80 80A8 8 0 0 1 88 208V48a8 8 0 0 1 13.66-5.66l80 80a8 8 0 0 1 0 11.32"></path></svg>
    </Button>
    </div>

    <div className="flex h-[50px] w-[250px] bg-primary rounded-lg border-black border-[4px] px-3 py-2 text-sm ring-offset-background relative items-center" >
      <div className="flex w-full text-lg">
        <span className="font-sans ">{name}</span>
      </div>
      <div className="absolute right-1" onClick={() => setName(genRandomName())}>
        <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.25em" viewBox="0 0 640 512"><path fill="currentColor" d="M274.9 34.3c-28.1-28.1-73.7-28.1-101.8 0L34.3 173.1c-28.1 28.1-28.1 73.7 0 101.8l138.8 138.8c28.1 28.1 73.7 28.1 101.8 0l138.8-138.8c28.1-28.1 28.1-73.7 0-101.8zM200 224a24 24 0 1 1 48 0a24 24 0 1 1-48 0M96 200a24 24 0 1 1 0 48a24 24 0 1 1 0-48m128 176a24 24 0 1 1 0-48a24 24 0 1 1 0 48m128-176a24 24 0 1 1 0 48a24 24 0 1 1 0-48m-128-80a24 24 0 1 1 0-48a24 24 0 1 1 0 48m96 328c0 35.3 28.7 64 64 64h192c35.3 0 64-28.7 64-64V256c0-35.3-28.7-64-64-64H461.7c11.6 36 3.1 77-25.4 105.5L320 413.8zm160-120a24 24 0 1 1 0 48a24 24 0 1 1 0-48"></path></svg>
      </div>
    </div>
    <Button className="w-[500px] h-[100px] rounded-xl italic ring-8 ring-orange-600 ring-offset-3 ring-offset-black hover:bg-[#f7d726] text-[64px] flex items-center justify-center transition ease-in-out hover:-translate-y-1 hover:scale-110" onClick={onStart} >
      <div className="rounded-full overflow-hidden mr-1">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" height="50" width="50"><path d="M0 0h512v512H0z" fill="#F9E05A" fill-opacity="1"/><g className="" transform="translate(0,0)" ><path d="M123.193 29.635L121 406.18l84.31-82.836 65.87 159.02 67.5-27.96-65.87-159.02L391 294.342z" fill="#000000" fill-opacity="1"/></g></svg>
      </div>
      Start!
    </Button>
    </div>
  )
}