"use client"
import  Image  from "next/image"
import { useState, useEffect, useRef } from "react";
import { ArrowUp, MessageSquarePlus, Menu, X } from "lucide-react"; // Added Menu and X
import PusherClient from "pusher-js";
import { sendMessageAction } from "../lib/actions/chatActions";
import { InferSelectModel, is } from "drizzle-orm";
import { users } from "@/db/schema"
import EndBtn from "../lib/client-buttons/EndBtn";
import dynamic from "next/dynamic";
import JoinBtn from "@/lib/client-buttons/JoinBtn";

const AgoraVideoCall = dynamic(() => import("@/components/AgoraVideoCall"), {
  ssr: false, 
  loading: () => (
    <div className="w-full h-64 min-h-64 bg-gray-950 border border-gray-800 rounded-2xl flex items-center justify-center text-slate-500 text-xs italic animate-pulse">
      Loading video module...
    </div>
  ),
});

type UserType = InferSelectModel<typeof users> | null

type PropTypes = {
    topics: EnrichedTopic[]
    users: UserType[],
    messages: EnrichedMessage[],
    userId: string | null,
}

const defaultpfp = "https://plus.unsplash.com/premium_photo-1677252438411-9a930d7a5168?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8ZGVmYXVsdCUyMHByb2ZpbGUlMjBwaWN0dXJlfGVufDB8fDB8fHww"

function ChatClient({ topics, users, messages, userId }: PropTypes) {
  const [selectedUser, setSelectedUser] = useState<UserType>(null)
  const [activeTopic, setActiveTopic] = useState<EnrichedTopic | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false); // Mobile sidebar state

  const [chatMessages, setChatMessages] = useState<EnrichedMessage[]>(messages);
  const [inputText, setInputText] = useState("");
  const bottomDivRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!activeTopic) return;

    const pusher = new PusherClient(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    });

    const channel = pusher.subscribe(`chat-${activeTopic.id}`);

    channel.bind("incoming-message", (newMessage: EnrichedMessage) => {
      setChatMessages((prev) => {
        if (prev.some((m) => m.id === newMessage.id)) return prev;
        return [...prev, newMessage];
      });
    })

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [activeTopic]);

  useEffect(() => {
    bottomDivRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [chatMessages, activeTopic]);

  const handleSend = async () => {
    if (!inputText.trim() || !activeTopic || !userId) return;
    
    const textToSend = inputText;
    setInputText(""); 

    await sendMessageAction(textToSend, activeTopic.id, userId);
  };

  const currentTopicMessages = chatMessages.filter(msg => msg.topicId === activeTopic?.id);
  const isParticipant = userId === activeTopic?.poster.clerkId || userId === activeTopic?.secondParticipant?.clerkId

  return (
    <div className="relative flex flex-row h-full w-full overflow-hidden">
      

      <div className="flex-1 flex flex-col h-full border-r md:overflow-y-scroll border-gray-800 p-6 px-2 justify-between w-full">
        { selectedUser ? (
          <>
            <div>
              <div className="border-b border-gray-800 lg:pb-4 lg:mb-4 md:pb-4 flex justify-between items-center ">
                <div className="flex flex-row items-center justify-center gap-3">
                  <div className="relative h-10 w-10">
                    <Image
                      src={selectedUser?.imageUrl || defaultpfp }
                      alt={selectedUser?.name || "user"}
                      fill
                      className="rounded-full object-cover"
                    />
                  </div>
                  <div>
                    <h2 className="text-base font-semibold dark:text-white text-black">{selectedUser?.name}</h2>
                    <p className="text-xs text-violet-400 font-medium whitespace-nowrap">
                      {topics.find((tpc) => tpc.poster.clerkId === selectedUser?.clerkId || tpc.secondParticipant?.clerkId === userId)?.title}
                    </p>
                  </div>
                </div>
                  
                <div className="flex flex-row justify-center items-center gap-2">
                  {activeTopic?.status === "in debate" && (
                    <div className=" px-2">
                      <AgoraVideoCall 
                        channelName={`debate-${activeTopic.id}`}
                        isPublisher={isParticipant} 
                      />
                    </div>
                  )}
                  { userId && activeTopic && activeTopic.status !== "ended" && <form> <EndBtn userId={userId} topicId={activeTopic?.id} /> </form>}
                  
                  <button 
                    onClick={() => setSidebarOpen(true)}
                    className="md:hidden p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                  >
                    <Menu className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="text-sm text-slate-300 overflow-y-scroll w-full h-88 scrollbar-none pt-2 pb-3 flex flex-col space-y-4">
                {currentTopicMessages.map((msg) => {
                  const isMe = msg.senderId === userId;
                  return (
                    <div 
                      key={msg.id} 
                      className={`border font-semibold dark:text-slate-300 text-black rounded-2xl p-3.5 max-w-[80%] transition-all ${
                        isMe 
                          ? "self-end bg-indigo-600/30 border-indigo-500/50  rounded-tr-none" 
                          : "self-start bg-gray-800/40 border-gray-800 rounded-tl-none" 
                      }`}
                    >
                      {msg.text}
                    </div> 
                  );
                })}
                <div ref={bottomDivRef} className="w-0 h-0"></div>
              </div>
            </div>

            { activeTopic?.status !== "ended" ? (
              <div className="flex w-full flex-row">
                <input 
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder={`Type a response ${selectedUser?.name ? "to " + selectedUser.name  : ""}...`} 
                  className="bg-gray-800/30 border border-gray-800 w-full disabled:cursor-not-allowed rounded-xl p-3 text-sm text-white placeholder:text-slate-500 focus:outline-0"
                /> 
                <button 
                  onClick={handleSend}
                  className="bg-blue-700 p-2.5 disabled:cursor-not-allowed cursor-pointer rounded-full ml-2 "
                >
                  <ArrowUp />
                </button>
              </div>
            ) : (
              <div className="p-4 text-center border border-dashed border-gray-800 rounded-xl text-slate-500 italic">
                This Debate Has Ended.
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center bg-zinc-100 dark:bg-gray-900 p-8 text-center h-full border border-zinc-200 dark:border-gray-800/40 rounded-2xl backdrop-blur-sm m-4 relative">

            <button 
              onClick={() => setSidebarOpen(true)}
              className="absolute top-4 right-4 md:hidden p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
            >
              <Menu className="w-6 h-6" />
            </button>

            <div className="flex h-20 w-20 items-center justify-center rounded-3xl border border-zinc-300 dark:border-gray-800 bg-zinc-200/30 dark:bg-gray-800/20 text-indigo-500 dark:text-indigo-400 mb-6 shadow-xl relative group">
              <div className="absolute inset-0 bg-indigo-500/10 rounded-3xl blur-xl group-hover:opacity-100 transition-opacity" />
              <MessageSquarePlus className="w-10 h-10 relative z-10" />
            </div>

            <h2 className="text-xl font-bold text-zinc-800 dark:text-white tracking-tight">
              Your Debating Will Happen Here
            </h2>

            <p className="mt-2 text-sm text-zinc-500 dark:text-slate-400 max-w-sm leading-relaxed">
              Select an active discussion from your list to open the argument panel, or head over to the dashboard to join a brand new topic.
            </p>
          </div>
        )}
      </div>


      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className={`
        fixed md:relative top-0 right-0 h-full w-[80%] sm:w-75 lg:w-[25%] 
        z-50 md:z-auto bg-slate-200 dark:bg-gray-900/50 border-l md:border-l-0 border-gray-800/50 
        transition-transform duration-300 ease-in-out flex flex-col p-4 gap-3 select-none
        ${sidebarOpen ? "translate-x-0" : "translate-x-full md:translate-x-0"}
      `}>

        <div className="flex justify-between items-center md:hidden mb-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Debates
          </h3>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="p-1.5 text-gray-500 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-800 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <h3 className="hidden md:block text-xs font-bold uppercase tracking-wider text-slate-500 px-2 mb-1">
          Debates
        </h3>

        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {topics[0] ? topics.map((topic: EnrichedTopic) => {
            const foundUser = users.find(usr => usr?.clerkId === topic.poster.clerkId);
            if (!foundUser) return null;

            const isSelected = activeTopic?.id === topic.id;
            const isMyTopic = topic.poster.clerkId === userId
            const hasOpponent = !!topic.secondParticipant; 
            const myEmptyTopic = isMyTopic && hasOpponent

            let src = defaultpfp;
            if (!isMyTopic) {
              src = topic.poster.image || defaultpfp;
            } else if (hasOpponent) {
              src = topic.secondParticipant?.image || defaultpfp;
            } else {
              src = defaultpfp;
            }

            const secondParticipant = users.find((usr) => usr?.clerkId === topic.secondParticipant?.clerkId)

            return (
              <button
                onClick={() => { 
                  setSelectedUser(foundUser.clerkId === userId ? (secondParticipant ?? null) : foundUser )
                  setActiveTopic(topic)
                  setSidebarOpen(false); // Close on selection on mobile
                }}
                key={topic.id}
                className={`w-full flex flex-row cursor-pointer items-center gap-3 p-3 rounded-2xl transition-all text-left outline-none border ${
                  isSelected
                    ? "dark:bg-gray-800 bg-gray-400 border-gray-700 text-white shadow-md"
                    : "bg-transparent border-transparent text-slate-400 hover:bg-gray-800/40 hover:text-slate-200"
                }`}
              >
                <div className="flex-1 flex-col min-w-0">
                  <div className="flex items-center m-1.5 justify-between gap-1">
                    <p className="text-sm text-gray-700 dark:text-gray-200/40 font-semibold truncate">{topic.title}</p>
                  </div>

                  <div className="flex flex-row items-center gap-1.5">
                    <div className="relative h-7 w-7 shrink-0">
                      <Image
                        src={src}
                        alt={myEmptyTopic ? "no second debater yet" : topic.secondParticipant?.name!}
                        fill
                        className="rounded-full object-cover border border-gray-700"
                      />
                    </div>
                    <p className="text-xs dark:text-violet-400/90 text-violet-600 truncate font-medium mt-0.5">
                      {isMyTopic ? (topic.secondParticipant?.name ?? "No debater joined yet.") : topic.poster.name}
                    </p>
                  </div>
                </div>
              </button>
            );
          }) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-slate-500 mb-2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.25 3 4.875V18a2.25 2.25 0 0 0 2.25 2.25h13.5M6 7.5h3v3H6v-3Z" />
              </svg>
              <h4 className="text-sm font-semibold dark:text-slate-300 text-black">No debates</h4>
            </div>
          )}
        </div>
      </div>

    </div>
  )
}

export default ChatClient;