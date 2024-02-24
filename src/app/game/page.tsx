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

function FinishDialog({open}: {open: boolean}) {
  return (
  <Dialog open={open}>
    <DialogContent className="bg-secondary">
      <DialogHeader>
        <DialogTitle>Waiting for other users to finish</DialogTitle>
        <DialogDescription>
          Please wait for the other users to finish their turn!
        </DialogDescription>
      </DialogHeader>
    </DialogContent>
  </Dialog>
  )
}

const buttonStyle="rounded-xl italic border-dashed border-[5px] border-black hover:bg-[#f7d726]"

export default function Game() {

  const {socket} = useSocketAuth();
  // if image Round (for a certain user)
  const [isImage, setIsImage] = useState(false);
  // received content, either image or story
  const [receivedContent, setContent] = useState<string | null>(null);
  // user typed story to generate Ai Image
  const [story, setStory] = useState<string>("");
  // the AI image
  const [aiImage, setAiImage] = useState<string | null>(null);
  // is the AI generating the image
  const [generating, setGenerating] = useState(false);
  // has the user submitted their content
  const [submitted, setSubmitted] = useState(false);
  // duration of the round
  const [duration, setDuration] = useState(60); 

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

  const submitStory = (story: string) => {
    // socket?.emit('story', socket.id, story);
    setSubmitted(true);
  }

  const submitImage = (image: string) => {
    // socket?.emit('image', socket.id, image);
    setSubmitted(true);
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <NavBar />
      <div className="flex flex-col h-[calc(100%-80px)] w-full items-center justify-center">
        <Timer timeLeft={duration} setTimeLeft={setDuration} />
        <div className="w-[80%] h-[80%] border">
          {isImage ? <Image src={receivedContent!} alt="image" /> : <Image src={aiImage || ""} alt="aiImage" />}
        </div>
        <div className="flex flex-row w-[80%]">
          {isImage ? <Input className="flex-1" value={story} onChange={(e) => {setStory(e.currentTarget.value)}}/> : <Input className="flex-1" value={receivedContent!}/>}
          {!isImage && <Button className={buttonStyle} onClick={generate} disabled={generating}>Generate</Button>}
          {isImage ? <Button className={buttonStyle} onClick={() => submitImage(aiImage!)}>Submit</Button> : <Button className={buttonStyle} onClick={() => submitStory(story!)}>Submit</Button>}
        </div>
      </div>
      <FinishDialog open={submitted}/>
    </main>
  )

}