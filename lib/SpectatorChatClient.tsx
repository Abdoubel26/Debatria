"use client";

import { useState, useEffect, useRef } from "react";
import PusherClient from "pusher-js";
import AgoraVideoCall from "@/components/AgoraVideoCall";
import { InferSelectModel } from "drizzle-orm";
import { messages, topics, users } from "@/db/schema";

type TopicType = InferSelectModel<typeof topics>;
type MessageType = InferSelectModel<typeof messages>;
type UserType = InferSelectModel<typeof users>;

interface Props {
  topic: TopicType;
  pastMessages: MessageType[];
  posterUser: UserType | null;
  opponentUser: UserType | null;
}

export default function SpectatorChatClient({ topic, pastMessages, posterUser, opponentUser }: Props) {
  const [chatMessages, setChatMessages] = useState<MessageType[]>(pastMessages);
  const [currentStatus, setCurrentStatus] = useState(topic.status);
  const bottomDivRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const pusher = new PusherClient(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    });

    const channel = pusher.subscribe(`chat-${topic.id}`);

    channel.bind("incoming-message", (newMessage: MessageType) => {
      setChatMessages((prev) => {
        if (prev.some((m) => m.id === newMessage.id)) return prev;
        return [...prev, newMessage];
      });
    });

    channel.bind("debate-ended", () => {
      setCurrentStatus("ended");
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [topic.id]);

  useEffect(() => {
    bottomDivRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  return (
    <div className="flex-1 flex flex-col h-full border-r border-gray-800 p-6 px-2 justify-between max-w-5xl mx-auto w-full bg-gray-900">
      <div>

        <div className="border-b border-gray-800 pb-4 mb-4 flex justify-between items-center">
          <div className="flex w-full items-center gap-3">
            <div className=" w-full flex flex-col justify-center items-center">
              <div className="flex items-center gap-2">
                <h2 className="text-base font-semibold text-white">
                  {topic.title}
                </h2>
                
              </div>
              <p className="text-xs text-violet-400 font-medium truncate max-w-xl">
                 {posterUser?.name} <span className="text-white">vs</span>  {opponentUser?.name}
              </p>
            </div>
          </div>
        </div>


        <div className="text-sm text-slate-300 overflow-y-scroll w-full h-88 scrollbar-none pt-2 pb-3 flex flex-col space-y-4">
          {chatMessages.map((msg) => {
            const isPoster = msg.senderId === topic.posterId;
            const currentSender = isPoster ? posterUser : opponentUser;

            return (
              <div 
                key={msg.id} 
                className={`border font-semibold rounded-2xl p-3.5 max-w-[80%] transition-all ${
                  isPoster 
                    ? "self-start bg-gray-800/40 border-gray-800 text-slate-300 rounded-tl-none" 
                    : "self-end ml-auto bg-indigo-600/30 border-indigo-500/50 text-white rounded-tr-none" 
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1.5 select-none opacity-60">
                  <span className="text-[10px] text-slate-400 font-medium">
                    {currentSender?.name || "Debater"}
                  </span>
                </div>
                <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
              </div> 
            );
          })}
          <div ref={bottomDivRef}></div>
        </div>
      </div>

      <div className="w-full text-center justify-center items-center flex h-full pt-3.5 text-xs border-t border-gray-300 text-slate-500 bg-gray-900/10 font-medium tracking-wide select-none">
        🔒 You are viewing this stage live. Messaging capabilities are restricted to official participants.
        <span className="bg-indigo-600/10 ml-1.5 text-indigo-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-indigo-500/20 tracking-wider uppercase select-none">
          Audience Mode
        </span>
      </div>
    </div>
  );
}