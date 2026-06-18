"use client";

import { useEffect, useState, useRef } from "react";
import AgoraRTC, { IAgoraRTCClient, ICameraVideoTrack, IMicrophoneAudioTrack, IAgoraRTCRemoteUser } from "agora-rtc-sdk-ng";
import { Video, Phone, VideoOff, PhoneOff } from "lucide-react";

interface AgoraProps {
  channelName: string;
  isPublisher: boolean; 
}

export default function AgoraVideoCall({ channelName, isPublisher }: AgoraProps) {
  const [callMode, setCallMode] = useState<"idle" | "video" | "audio">("idle");
  const [remoteUsers, setRemoteUsers] = useState<IAgoraRTCRemoteUser[]>([]);
  
  const localVideoRef = useRef<HTMLDivElement>(null);
  const clientRef = useRef<IAgoraRTCClient | null>(null);
  const audioTrackRef = useRef<IMicrophoneAudioTrack | null>(null);
  const videoTrackRef = useRef<ICameraVideoTrack | null>(null);

  useEffect(() => {
    if (callMode === "idle") return;

    const initAgora = async () => {
      const agoraClient = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
      clientRef.current = agoraClient;

      agoraClient.on("user-published", async (user, mediaType) => {
        await agoraClient.subscribe(user, mediaType);
        
        setRemoteUsers((prev) => [...prev.filter(u => u.uid !== user.uid), user]);

        if (mediaType === "audio") {
          user.audioTrack?.play();
        }
      });


      agoraClient.on("user-unpublished", (user, mediaType) => {
        if (mediaType === "video") {
          setRemoteUsers((prev) => prev.filter((u) => u.uid !== user.uid));
        }
      });

      agoraClient.on("user-left", (user) => {
        setRemoteUsers((prev) => prev.filter((u) => u.uid !== user.uid));
      });

      const roleStr = isPublisher ? "publisher" : "subscriber";
      const res = await fetch(`/api/agora/token?channelName=${channelName}&role=${roleStr}`);
      const { token, appId } = await res.json();

      await agoraClient.join(appId, channelName, token, null);

      if (isPublisher) {
        if (callMode === "video") {
          const [audioTrack, videoTrack] = await AgoraRTC.createMicrophoneAndCameraTracks();
          audioTrackRef.current = audioTrack;
          videoTrackRef.current = videoTrack;
          
          if (localVideoRef.current) {
            videoTrack.play(localVideoRef.current);
          }
          await agoraClient.publish([audioTrack, videoTrack]);
        } else if (callMode === "audio") {
          const audioTrack = await AgoraRTC.createMicrophoneAudioTrack();
          audioTrackRef.current = audioTrack;
          await agoraClient.publish([audioTrack]);
        }
      }
    };

    initAgora();

    return () => {
      audioTrackRef.current?.close();
      videoTrackRef.current?.close();
      clientRef.current?.leave();
      setRemoteUsers([]);
    };
  }, [channelName, isPublisher, callMode]);

  if (callMode === "idle") {
    return (
      <>
        <div className="flex">

          <button
            onClick={() => setCallMode("video")}
            className="rounded-full p-3 hover:bg-gray-950 cursor-pointer transition-all"
          >
            <Video className="w-6 h-6" />
          </button>

          <button
            onClick={() => setCallMode("audio")}
            className="rounded-full p-3 hover:bg-gray-950 cursor-pointer transition-all"
          >
            <Phone className="w-6 h-5" />
          </button>

        </div>
      </>
    );
  }

  return (
    <div className="w-full h-64 bg-gray-950 p-3 border border-gray-800 rounded-2xl flex flex-col justify-between relative group">
      
      <button 
        onClick={() => setCallMode("idle")}
        className="absolute top-4 right-4 z-20 bg-red-600/80 hover:bg-red-600 text-white p-2 rounded-xl border border-red-500/30 cursor-pointer transition"
        title="Leave Stage"
      >
       { callMode === "video" ?  <VideoOff className="w-4 h-4" /> : <PhoneOff className="w-4 h-4" />}
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 h-full w-full">

        {isPublisher && (
          <div ref={localVideoRef} className="bg-gray-900 rounded-xl relative overflow-hidden h-full w-full border border-gray-800/80 flex items-center justify-center">
            {callMode === "audio" && (
              <div className="text-emerald-400 text-xs font-semibold animate-pulse uppercase tracking-wider">
                🎙️ Mic Streaming Live
              </div>
            )}
            <span className="absolute bottom-2 left-2 bg-black/70 px-2 py-0.5 rounded text-[10px] text-white z-10 font-bold uppercase tracking-wide">
              You (Live)
            </span>
          </div>
        )}

        {remoteUsers.map((user) => (
          <RemoteVideoPlayer key={user.uid} user={user} />
        ))}
        
        {remoteUsers.length === 0 && (
          <div className="bg-gray-950 flex items-center justify-center text-slate-500 text-xs italic font-medium h-full w-full border border-dashed border-gray-800 rounded-xl">
            Waiting for opponent to connect...
          </div>
        )}
      </div>
    </div>
  );
}

function RemoteVideoPlayer({ user }: { user: IAgoraRTCRemoteUser }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    user.videoTrack?.play(containerRef.current);
    return () => {
      user.videoTrack?.stop();
    };
  }, [user]);

  return (
    <div ref={containerRef} className="bg-gray-900 rounded-xl relative overflow-hidden h-full w-full border border-gray-800/80 flex items-center justify-center">
      {!user.videoTrack && (
        <div className="text-indigo-400 text-xs font-semibold animate-pulse uppercase tracking-wider">
          🎙️ Opponent Streaming Audio
        </div>
      )}
      <span className="absolute bottom-2 left-2 bg-indigo-600/70 px-2 py-0.5 rounded text-[10px] text-white z-10 font-bold uppercase tracking-wide">
        On Stage
      </span>
    </div>
  );
}