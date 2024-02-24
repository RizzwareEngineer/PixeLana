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
import { cn } from "@/lib/utils";

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

  const {socket} = useSocketAuth();
  // if image Round (for a certain user)
  const [isImage, setIsImage] = useState(false);
  // received content, either image or story
  const [receivedContent, setContent] = useState<string | null>(null);
  // user typed prompt to submit
  const [story, setStory] = useState<string>("");
  const [aiPrompt, setAIPrompt] = useState<string>("");
  // the AI image
  const [aiImage, setAiImage] = useState<string | null>(null);
  // is the AI generating the image
  const [generating, setGenerating] = useState(false);
  // has the user submitted their content
  const [submitted, setSubmitted] = useState(false);
  // duration of the round
  const [timeLeft, setTimeLeft] = useState(60); 

  const submitStory = (story: string) => {
    // socket?.emit('story', socket.id, story);
    setSubmitted(true);
  }

  const submitImage = (image: string) => {
    // socket?.emit('image', socket.id, image);
    setSubmitted(true);
  }

  useEffect(() => {
    // Exit early when we reach 0
    if (!timeLeft) {
      if (isImage) {
        submitStory(story);
      } else {
        submitImage(aiImage!);
      }
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
      // socket.on('image', (data) => {
      //   setSubmitted(false);
      //   setIsImage(true);
      //   setContent(data);
      //   setDuration(60);
      // })
      // socket.on('story', (data) => {
      //   setSubmitted(false);
      //   setIsImage(false);
      //   setContent(data);
      //   setDuration(60);
      // })
    }
  }, [socket])

  const generate = async () => {
    setGenerating(true);
    const aiImage = await fetch('https://api.deepai.org/api/text2img', {})
    .then(response => response.json())
    setGenerating(false);
    setAiImage(aiImage);
  }


  return (
<main className="flex min-h-screen flex-col items-center justify-center p-24">
  <NavBar />
  <div className="flex flex-col items-center justify-center w-full z-10 " style={{ height: 'calc(100% - 74px)' }}>
    <div className="flex flex-col items-center justify-center min-h-[80%] min-w-[80%] w-[80%] h-[80%] bg-[#370C59] rounded-lg p-5 space-y-3 border-[3px] border-gray-200">
      <h1 className="font-customs text-[50px] text-shadow-custom text-[#8dfcbc]">Cook Your Story</h1>
      {!isImage && <h1 className="text-shadow-md text-xl text-yellow-300">Prompt: {receivedContent!}</h1>}
      {/* Ensure Image component fills the container or consider a wrapper */}
      <div className="border-[5px] border-black rounded-xl w-[500px] h-[500px]">
        {isImage ? 
        ( receivedContent ? <Image src={receivedContent!} alt="image" className="w-full h-full object-contain" /> : (<></>)) : 
        (aiImage ? (<Image src={aiImage} alt="image" className="w-full h-full object-contain" />) :
        (<div className="text-white items-center justify-center w-full h-full flex">Input your Prompt to Generate Image</div>)) }
      </div>
      <h1 className={cn("text-shadow-md text-xl text-white", timeLeft < 20 && "text-yellow-300")}>Time Remaining: {timeLeft}</h1>
    <div className="w-[80%] flex space-x-5">
      {isImage ? <Input className={inputStyle} value={story} onChange={(e) => {setStory(e.currentTarget.value)}}/> : <Input className={inputStyle} value={aiPrompt} onChange={(e) => {setAIPrompt(e.currentTarget.value)}}/>}
      {!isImage && <Button className={buttonStyle} onClick={generate} disabled={generating}>Generate</Button>}
      {isImage ? <Button className={buttonStyle} onClick={() => submitImage(aiImage!)}>Submit</Button> : <Button className={buttonStyle} onClick={() => submitStory(story)}>Submit</Button>}
    </div>
    </div>
  </div>
  <FinishDialog open={submitted}/>
</main>
  )
}