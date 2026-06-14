"use client"
import  Image  from "next/image"
import  Link  from "next/link"
import { usePathname } from "next/navigation";
import { ArrowUp, MessageSquarePlus } from "lucide-react"
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
        { selectedUser ? <><div>

          <div className="border-b border-gray-800 pb-4 mb-4 flex items-center gap-3">
            <div className="relative h-10 w-10">
              <Image
                src={selectedUser?.imageUrl || defaultpfp }
                alt={selectedUser?.name || "user"}
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
            {messages.map((msg) => {
              return (
              <div className="bg-gray-800/40 border border-gray-800 rounded-2xl p-4 max-w-[80%]">
                {msg.text}
                </div> 
            )})}
              
           
          </div>
        </div>

        <div className="flex w-full flex-row">
            <input placeholder={`Type a response to counter ${selectedUser?.name}...`} className="bg-gray-800/30 border border-gray-800 w-full rounded-xl p-3 text-sm text-white placeholder:text-slate-500 focus:outline-0"> 
            </input>
            <button className="bg-blue-700 p-2.5 cursor-pointer rounded-full ml-2 ">
                <ArrowUp />
            </button>
        </div>
        </>
        :
        <div className="flex flex-1 flex-col items-center justify-center bg-gray-900 p-8 text-center h-full border border-gray-800/40 rounded-2xl backdrop-blur-sm m-4">

          <div className="flex h-20 w-20 items-center justify-center rounded-3xl border border-gray-800 bg-gray-800/20 text-indigo-400 mb-6 shadow-xl relative group">

            <div className="absolute inset-0 bg-indigo-500/10 rounded-3xl blur-xl opacity-50 group-hover:opacity-100 transition-opacity" />
            <MessageSquarePlus className="w-10 h-10 stroke-[1.5] relative z-10 animate-pulse" />
          </div>

          <h2 className="text-xl font-bold text-white tracking-tight">
            Your Debating Will Happen Here
          </h2>

          <p className="mt-2 text-sm text-slate-400 max-w-sm leading-relaxed">
            Select an active discussion from your list to open the argument panel, or head over to the dashboard to join a brand new topic.
          </p>

          <Link href={"/"}><button className="mt-6 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg hover:bg-indigo-500 active:scale-95 transition-all cursor-pointer">
            Explore Open Debates
          </button></Link>
        </div>
        }

      </div>

    <div className="w-80 bg-gray-900/50 flex flex-col overflow-y-auto p-4 gap-3 select-none">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 px-2 mb-1">
          Active Debates
        </h3>
    {topics[0] ?  topics.map((topic: EnrichedTopic) => {
          const foundUser = users.find(usr => usr?.clerkId === topic.poster.clerkId);

          if (!foundUser) return null;

        const isSelected = selectedUser?.clerkId === foundUser.clerkId;

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
        })
        : 
      <div className="flex flex-1 flex-col items-center justify-center text-center p-8 animate-fade-in my-auto">
      <div className="flex h-30 w-30 items-center justify-center rounded-2xl border border-gray-800 bg-gray-800/30 text-gray-500 mb-4 shadow-inner backdrop-blur-sm">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 text-slate-500">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.25 3 4.875V18a2.25 2.25 0 0 0 2.25 2.25h13.5M6 7.5h3v3H6v-3Z" />
        </svg>
      </div>
      
      <h3 className=" p-1.5 text-2xl font-semibold text-slate-200 tracking-tight">
        No debates joined yet
      </h3>
      <p className="mt-1 text-md p-1 text-slate-500 max-w-xs">
        You haven't joined any topics yet. Explore open discussions to get started.
      </p>
    </div>
      }
        </div>
    </>
  )
}

export default ChatClient

