"use client"
import  Image  from "next/image"
import  Link  from "next/link"
import { usePathname } from "next/navigation";
import { ArrowUp } from "lucide-react"
import { useState } from "react";
import { InferSelectModel } from "drizzle-orm";
import { messages, users } from "@/db/schema"

interface EnrichedTopic {
  id: string;
  title: string;
  description: string | null;
  category: "culture" | "ethics" | "history" | "philosophy" | "politics" | "psychology" | "religion" | "science" | "society";
  status: "open" | "in_debate" | "ended";
  createdAt: Date | string;
  poster: {
    name: string;
    image: string | null;
    clerkId: string;
  };
  secondParticipant: {
    name: string;
    image: string | null;
    clerkId: string;
  } | null; 
}

type UserType = InferSelectModel<typeof users> | null
type MessageType = InferSelectModel<typeof messages>

type PropTypes = {
    topics: EnrichedTopic[]
    users: UserType[],
    messages: MessageType[],
    userId: string | null
}

const defaultpfp = "https://plus.unsplash.com/premium_photo-1677252438411-9a930d7a5168?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8ZGVmYXVsdCUyMHByb2ZpbGUlMjBwaWN0dXJlfGVufDB8fDB8fHww"


function ChatClient({ topics, users, messages, userId }: PropTypes) {

  const [selectedUser, setSelectedUser] = useState<UserType>(null)

   
  
    const pathname = usePathname()

  return (
    <>
    <div className="flex-1 flex flex-col h-full border-r border-gray-800 p-6 justify-between">
        <div>

          <div className="border-b border-gray-800 pb-4 mb-4 flex items-center gap-3">
            <div className="relative h-10 w-10">
              <Image
                src={selectedUser?.imageUrl!}
                alt={selectedUser?.name!}
                fill
                className="rounded-full object-cover"
              />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">{selectedUser?.name}</h2>
              <p className="text-xs text-violet-400 font-medium">Topic: {topics.find((tpc) => tpc.poster.clerkId === selectedUser?.clerkId && tpc.secondParticipant?.clerkId === userId)?.title}</p>
            </div>
          </div>

          <div className="text-sm text-slate-300 space-y-4">
            <p className="italic text-slate-500">
              Viewing conversation history with {selectedUser?.name}...
            </p>
            <div className="bg-gray-800/40 border border-gray-800 rounded-2xl p-4 max-w-[80%]">
              <p className="text-xs font-semibold text-violet-400 mb-1">{selectedUser?.name}</p>
              "LASTMESSAGE"
            </div>
          </div>
        </div>

        <div className="flex w-full flex-row">
            <input placeholder={`Type a response to counter ${selectedUser?.name}...`} className="bg-gray-800/30 border border-gray-800 w-full rounded-xl p-3 text-sm text-white placeholder:text-slate-500 focus:outline-0"> 
            </input>
            <button className="bg-blue-700 p-2.5 cursor-pointer rounded-full ml-2 ">
                <ArrowUp />
            </button>
        </div>

      </div>

    <div className="w-80 bg-gray-900/50 flex flex-col overflow-y-auto p-4 gap-3 select-none">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 px-2 mb-1">
          Active Debates
        </h3>
    {topics.map((topic: EnrichedTopic) => {
          const isSelected = selectedUser?.clerkId === topic.poster.clerkId


          const foundUser = users.find(usr => usr?.clerkId === topic.poster.clerkId);

          if (foundUser) {
            setSelectedUser(foundUser);
          } else {
            return
          }

          return (
            <button
            onClick={() => setSelectedUser(foundUser)}
              key={topic.id}
              className={`w-full flex flex-row items-center gap-3 p-3 rounded-2xl transition-all text-left outline-none border ${
                isSelected
                  ? "bg-gray-800 border-gray-700 text-white shadow-md"
                  : "bg-transparent border-transparent text-slate-400 hover:bg-gray-800/40 hover:text-slate-200"
              }`}
            >
              <div className="relative h-11 w-11 shrink-0">
                <Image
                  src={topic.poster.image || defaultpfp}
                  alt={topic.poster.name}
                  fill
                  className="rounded-full object-cover border border-gray-700"
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <p className="text-sm font-semibold truncate">{topic.poster.name}</p>
                </div>
                <p className="text-xs text-violet-400/90 truncate font-medium mt-0.5">
                  {topic.title}
                </p>
                <p className="text-[11px] text-slate-500 truncate mt-0.5">
                 {messages.find((msg) => users.map(user => user?.clerkId).includes(msg.senderId))?.text}
                </p>
              </div>
            </button>
          );
        })}
        </div>
    </>
  )
}

export default ChatClient

/*  */