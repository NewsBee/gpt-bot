"use client";

import React, { useEffect, useState } from "react";
import { Dialog, DialogHeader, DialogTitle, DialogContent, DialogDescription, DialogFooter } from "./ui/dialog";
import { useProModal } from "@/hooks/use-pro-modal";
import { Badge } from "./ui/badge";
import { Check, Code, ImageIcon, MessageSquare, Music, VideoIcon, Zap } from "lucide-react";
import { Card } from "./ui/card";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { useUser } from "@clerk/nextjs";
import axios from "axios";

const tools = [
    {
      label: "Percakapan",
      icon: MessageSquare,
      color: "text-violet-500",
      bgColor: "bg-violet-500/10",
    },
    {
      label: "Buat Musik",
      icon: Music,
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
    },
    {
      label: "Buat Gambar",
      icon: ImageIcon,
      color: "text-pink-700",
      bgColor: "bg-pink-700/10",
    },
    {
      label: "Buat Video",
      icon: VideoIcon,
      color: "text-orange-700",
      bgColor: "bg-orange-700/10",
    },
    // {
    //   label: "Code Generation",
    //   icon: Code,
    //   color: "text-green-700",
    //   bgColor: "bg-green-700/10",
    // },
  ];

export default function ProModal() {
  const proModal = useProModal();
  const { user } = useUser();
  const [token, setToken] = useState<string>("")
  const onClick = async ()=>{
    const data = {
      first_name : user?.firstName,
      email : user?.emailAddresses[0]?.emailAddress,
      total : 10000
    }
    console.log(user?.emailAddresses)
    const config = {
      headers:{
        "Content-Type" : "application/json"
      }
    }
    proModal.onClose()
    const response = await axios.post("/api/midtrans",data, config)
    setToken(response.data.token)
  }
  useEffect(()=>{
    if(token){
      /* eslint-disable */
      (window as any).snap.pay(token,{ 
        onSuccess: (result:any) =>{
          localStorage.setItem("Pembayaran", JSON.stringify(result))
          setToken("")
        },
        onPending: (result:any) =>{
          localStorage.setItem("Pembayaran", JSON.stringify(result))
          setToken("")
        },
        onError: (result:any) =>{
          console.log(result)
          setToken("")
        },
        onClose: (result:any) =>{
          console.log("Anda belum menyelesaikan pembayaran")
          setToken("")
        }
      })
    }
  }, [token])
  useEffect(()=>{
    const midtransUrl = "https://app.sandbox.midtrans.com/snap/snap.js"

    let scriptTag = document.createElement("script")
    scriptTag.src = midtransUrl

    const midtransClientKey = process.env.MIDTRANS_CLIENT_KEY
    scriptTag.setAttribute("data-client_key",midtransClientKey||"dz")
    document.body.appendChild(scriptTag)
    return()=>{
      document.body.removeChild(scriptTag)
    }
  })
  return (
    <Dialog open={proModal.isOpen} onOpenChange={proModal.onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex justify-center items-center flex-col gap-y-4 pb-2">
            <div className="flex items-center gap-x-2 font-bold text-xl">
              Upgrade GPT+
              <Badge variant="premium" className="uppercase text-sm py-1">
                pro
              </Badge>
            </div>
          </DialogTitle>
          <DialogDescription className="text-center pt-2 space-y-2 text-zinc-900 font-medium">
            {tools.map((tool) => (
              <Card key={tool.label} className="p-3 border-black/5 flex items-center justify-between">
                <div className="flex items-center gap-x-4">
                  <div className={cn("p-2 w-fit rounded-md", tool.bgColor)}>
                    <tool.icon className={cn("w-6 h-6", tool.color)} />
                  </div>
                  <div className="font-semibold text-sm">
                    {tool.label}
                  </div>
                </div>
                <Check className="text-primary w-5 h-5" />
              </Card>
            ))}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button  onClick={onClick} size="lg" variant="premium" className="w-full">
            Upgrade
            <Zap className="w-4 h-4 ml-2 fill-white" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
