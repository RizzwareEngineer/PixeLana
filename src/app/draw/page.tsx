'use client';
import { useSocketAuth } from "@/contexts/SocketAuthContext";
import { useEffect, useState } from "react";
import { unstable_noStore as noStore } from 'next/cache'
import {Timer} from "@/components/timer";
import Image from "next/image";
import NavBar from "@/components/navBar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { revalidatePath } from "next/cache";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useWallet } from "@solana/wallet-adapter-react";



function FinishDialog({open}: {open: boolean}) {
  return (
  <Dialog open={open}>
    <DialogContent className="bg-secondary">
      <DialogHeader>
        <DialogTitle className="font-sans text-white">Waiting for other users to finish</DialogTitle>
        <DialogDescription className="font-sans text-white">
          Please wait for the other users to finish their turn!
        </DialogDescription>
      </DialogHeader>
    </DialogContent>
  </Dialog>
  )
}

const buttonStyle="rounded-xl italic ring-[5px] ring-orange-600 hover:bg-[#f7d726] text-shadow-md"
const inputStyle ="flex-1 border ring-orange-600 ring-[5px] rounded-lg focus-visible:ring-emerald-600 focus-visible:ring-[5px]"

export default function Game() {

  const router = useRouter();
  const {socket} = useSocketAuth();
  const wallet = useWallet();
  // received content, either image or story
  const [receivedPrompt, setPrompt] = useState<string | null>(null);
  const [aiPrompt, setAIPrompt] = useState<string>("");
  // the AI image
  const [aiImage, setAiImage] = useState<string | null>(null);
  // is the AI generating the image
  const [generating, setGenerating] = useState(false);
  // has the user submitted their content
  const [submitted, setSubmitted] = useState(false);
  // duration of the round
  const [timeLeft, setTimeLeft] = useState(60); 

  const submitImage = (image: string) => {
    socket?.emit('submitDraw',  wallet.publicKey?.toBase58(), image);
    setSubmitted(true);
  }

  useEffect(() => {
    // Exit early when we reach 0
    if (!timeLeft) {
      submitImage(aiImage!);
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

  useEffect(() => { 
    if(socket) {
      socket.emit('getPrompt');
      socket.on('prompt', (prompt: string) => {
        setPrompt(prompt);
      });

      socket.on('allImagesSubmitted', () => {
        setSubmitted(false);
        router.push('/end');
      })
    }
  }, [socket])


  async function query(prompt: string) {
    // console.log(process.env.NEXT_SDXL_API_KEY)
    const response = await fetch(
      "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
      {
        headers: { Authorization: process.env.SDXL_API_KEY || "" },
        method: "POST",
        body: JSON.stringify({ inputs: prompt }),
      }
    );
    const result = await response.blob();
    return result;
  }

  const generate = async (e) => {
    e.preventDefault(); 
    setGenerating(true);
    const blob = await query(aiPrompt);
    const url = URL.createObjectURL(blob);
    setGenerating(false);
    setAiImage(url);
  }


  return (
<main className="flex min-h-screen flex-col items-center justify-center p-24">
  <NavBar />
   <div className="flex flex-col items-center justify-center w-full z-10 " style={{ height: 'calc(100% - 74px)' }}>
    <div className="flex flex-col items-center justify-center min-h-[80%] min-w-[80%] w-[80%] h-[80%] bg-[#370C59] rounded-lg p-5 space-y-3 border-[3px] border-gray-200">
      <h1 className="font-customs text-[50px] text-shadow-custom text-[#8dfcbc]">Make Story Come True</h1>
      <h1 className="text-shadow-md text-xl text-yellow-300">Prompt: {receivedPrompt!}</h1>
      {/* Ensure Image component fills the container or consider a wrapper */}
      <div className="border-[5px] border-black rounded-xl w-[500px] h-[500px]">
        { aiImage ? (<Image src={aiImage} alt="image" width={500} height={500} className="w-full h-full object-contain" />) :
        (<div className="text-white items-center justify-center w-full h-full flex">Input your Prompt to Generate Image</div>)}
      </div>
      <h1 className={cn("text-shadow-md text-xl text-white", timeLeft < 20 && "text-yellow-300")}>Time Remaining: {timeLeft}</h1>
    <div className="w-[80%] flex space-x-5">
      <Input className={inputStyle} value={aiPrompt} onChange={(e) => {setAIPrompt(e.currentTarget.value)}}/>
      <Button className={buttonStyle} onClick={generate} disabled={generating}>Generate</Button>
      <Button className={buttonStyle} onClick={(e) => { e.preventDefault(); submitImage(aiImage!)}}>Submit</Button>
    </div>
    </div>
  </div>
  <FinishDialog open={submitted}/>
</main>
  )
}

// 500 x 500 