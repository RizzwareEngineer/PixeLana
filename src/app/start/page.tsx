'use client';
import { useSocketAuth } from "@/contexts/SocketAuthContext";
import { useEffect, useState } from "react";
import {Timer} from "@/components/timer";
import Image from "next/image";
import NavBar from "@/components/navBar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { revalidatePath } from "next/cache";
import { useWallet } from "@solana/wallet-adapter-react";
import { useRouter } from "next/navigation";
import { time } from "console";
import { cn } from "@/lib/utils";

function FinishDialog({open, hasTime}: {open: boolean, hasTime: boolean}) {
  return (
  <Dialog open={open}>
    <DialogContent className="bg-secondary">
      <DialogHeader>
        <DialogTitle className="font-sans text-white">{hasTime ? "Waiting for other users to finish" : "Time limit!"}</DialogTitle>
        <DialogDescription className="font-sans text-white">
          {hasTime ? "Please wait for the other users to finish their turn!" : "Time is up! Story Submitted!"}
        </DialogDescription>
      </DialogHeader>
    </DialogContent>
  </Dialog>
  )
}

const buttonStyle="rounded-xl italic ring-[5px] ring-orange-600 hover:bg-[#f7d726] text-shadow-md"

export default function Game() {

  const {socket} = useSocketAuth();
  const [timeLeft, setTimeLeft] = useState(60); 
  const router = useRouter();

  const submitStory = (prompt: string) => {
    socket?.emit('submitPrompt', wallet.publicKey?.toBase58(), prompt);
    setSubmitted(true);
  }

  useEffect(() => {
    if (socket) {
      // Redirect users to the next page when 
      // all players have submitted their prompts or when the time has run out
      socket.on('gameDraw', () => {
        router.push('/game');
      })
    }
  })


  useEffect(() => {
    // Exit early when we reach 0
    if (!timeLeft) {
      submitStory(story);
    };

    // Save intervalId to clear the interval when the component re-renders
    const intervalId = setInterval(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    // Clear interval on re-render to avoid memory leaks
    return () => clearInterval(intervalId);
    // Add timeLeft as a dependency to re-run the effect
    // when we update it
  }, [timeLeft]);

  const wallet = useWallet();
  // user typed story to generate Ai Image
  const [story, setStory] = useState<string>("");
  // has the user submitted their content
  const [submitted, setSubmitted] = useState(false);
  // duration of the round


  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <NavBar />

      <div className="w-[856px] h-[559px] absolute border-4 border-gray-300 shadow-inner rounded-lg left-[50%] top-[50%] -translate-x-1/2 -translate-y-1/2 lg:scale-95 md:scale-90 sm:scale-[0.6]">
    <div className="flex flex-col items-center justify-center h-full space-y-10">
      <h1 className="font-customs text-[50px] text-shadow-custom text-[#8DFCBC]">Cook Your Story</h1>
      <div className="flex flex-col items-center justify-center rounded-xl gap-5">
        <h1 className={cn("text-shadow-md text-xl", timeLeft < 50 && "text-yellow-300")}>Time Remaining: {timeLeft}</h1>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width={80} height={80}><defs><linearGradient x1="0" x2="0" y1="0" y2="1" id="delapouite-inspiration-gradient-1"><stop offset="0%" stop-color="#69e897" stop-opacity="1"/><stop offset="100%" stop-color="#6f87df" stop-opacity="1"/></linearGradient></defs><g transform="translate(0,0)" ><path d="M51.34 23.63l-6.68 16.72 80.04 32.01 6.6-16.72-79.96-32.01zm409.36.01l-80 32 6.6 16.72 80-32-6.6-16.72zM256 25c-29 0-50 14.08-64.7 34.29C176.6 79.51 169 106 169 128c0 13 7 27.8 14.5 39s14.9 18.6 14.9 18.6l1.5 1.5 9.3 27.9H228L194.7 98.07 256 118.5l61.3-20.43L284 215h18.8l9.3-27.9 1.5-1.5s7.4-7.4 14.9-18.6c7.5-11.2 14.5-26 14.5-39 0-22-7.6-48.49-22.3-68.71C306 39.08 285 25 256 25zm128 94v18h96v-18h-96zm-352 .1v18h96v-18H32zm189.3 6.8l25.5 89.1h18.4l25.5-89.1-34.7 11.6-34.7-11.6zm166 57.7l-6.6 16.8 80 32 6.6-16.8-80-32zm-262.6.1l-80.04 32 6.68 16.8 79.96-32-6.6-16.8zM217 233v14h78v-14h-78zm0 32v14h78v-14h-78zm-46.9 2.6c-27.1.5-52.6 5-66.9 11.1L29.8 484.1c71.1-14.1 143.9-26 217.2-.9V297h-48v-28.3c-7.9-.7-16-1.1-23.9-1.1h-5zm166.8 0c-7.9 0-16 .4-23.9 1.1V297h-48v186.2c73.3-25.1 146.1-13.2 217.2.9l-73.4-205.4c-14.3-6.1-39.8-10.6-66.9-11.1h-5z" fill="url(#delapouite-inspiration-gradient-1)" stroke="#b265fa" stroke-opacity="1" stroke-width="15"/></g></svg>
      </div>
      <div className="w-[60%] flex space-x-5">
        <Input type="text" className="flex-1 border ring-orange-600 ring-[5px] rounded-lg focus-visible:ring-emerald-600 focus-visible:ring-[5px]" value={story} onChange={(e) => {setStory(e.currentTarget.value)}}/>
        <Button className={buttonStyle} onClick={() => submitStory(story)}>Submit</Button>
      </div>
      </div>
      <FinishDialog open={submitted} hasTime={timeLeft > 0}/>
      </div>
    </main>
  )

}