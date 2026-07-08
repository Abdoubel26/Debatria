"use client";

import { useEffect, useState, useRef } from "react";
import AgoraRTC, { 
  IAgoraRTCClient, 
  ICameraVideoTrack, 
  IMicrophoneAudioTrack, 
  IAgoraRTCRemoteUser 
} from "agora-rtc-sdk-ng";
import { Video, Phone, VideoOff, PhoneOff } from "lucide-react";

interface AgoraProps {
  channelName: string;
  isPublisher: boolean; 
}

interface RemotePlayerProps {
  uid: string | number;
  videoTrack: any; 
}

export default function AgoraVideoCall({ channelName, isPublisher }: AgoraProps) {
  const [callMode, setCallMode] = useState<"idle" | "video" | "audio">("idle");
  const [remoteUsers, setRemoteUsers] = useState<IAgoraRTCRemoteUser[]>([]);
  
  const clientRef = useRef<IAgoraRTCClient | null>(null);
  const audioTrackRef = useRef<IMicrophoneAudioTrack | null>(null);
  
  const [localVideoTrack, setLocalVideoTrack] = useState<ICameraVideoTrack | null>(null);
  const joinInProgress = useRef(false);

  useEffect(() => {
    if (callMode === "idle" || joinInProgress.current) return;

    const initAgora = async () => {
      console.log(`🚀 [AGORA START] Initializing call on channel: "${channelName}" as ${isPublisher ? "Publisher" : "Subscriber"}`);
      joinInProgress.current = true;
      const agoraClient = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
      clientRef.current = agoraClient;

      agoraClient.on("user-published", async (user, mediaType) => {
        console.log(`📡 [EVENT: user-published] Remote user ${user.uid} published a ${mediaType} track.`);
        
        try {
          await agoraClient.subscribe(user, mediaType);
          console.log(`✅ [SUBSCRIBE SUCCESS] Subscribed to ${mediaType} track of user ${user.uid}`);
          
          if (mediaType === "audio") {
            user.audioTrack?.play();
            console.log(`🔊 [AUDIO PLAYING] Remote audio started for user ${user.uid}`);
          }

          setRemoteUsers((prev) => {
            const filtered = prev.filter(u => u.uid !== user.uid);
            return [...filtered, { ...user, videoTrack: user.videoTrack, audioTrack: user.audioTrack }];
          });

        } catch (subErr) {
          console.error(`❌ [SUBSCRIBE FAILED] Failed to subscribe to user ${user.uid}:`, subErr);
        }
      });

      agoraClient.on("user-unpublished", (user, mediaType) => {
        console.log(`⚠️ [EVENT: user-unpublished] Remote user ${user.uid} stopped sending ${mediaType}`);
        if (mediaType === "video") {
          setRemoteUsers((prev) => prev.filter((u) => u.uid !== user.uid));
        }
      });

      agoraClient.on("user-left", (user) => {
        console.log(`🚪 [EVENT: user-left] Remote user ${user.uid} completely left the channel`);
        setRemoteUsers((prev) => prev.filter((u) => u.uid !== user.uid));
      });

      try {
        const roleStr = isPublisher ? "publisher" : "subscriber";
        console.log(`🌐 [TOKEN FETCH] Fetching token for role: ${roleStr}...`);
        const res = await fetch(`/api/agora/token?channelName=${channelName}&role=${roleStr}`);
        const { token, appId } = await res.json();
        console.log(`🔑 [TOKEN RCVD] App ID: ${appId ? "Valid String" : "MISSING!"}, Token length: ${token?.length || 0}`);

        const assignedUid = await agoraClient.join(appId, channelName, token, null);
        console.log(`🎉 [JOIN SUCCESS] Successfully joined channel! My assigned Agora UID is: ${assignedUid}`);

        if (isPublisher) {
          if (callMode === "video") {
            console.log("🎥 [HARDWARE] Requesting Mic and Camera access...");
            const [audioTrack, videoTrack] = await AgoraRTC.createMicrophoneAndCameraTracks()
              .catch(err => {
                console.error("❌ [HARDWARE ERROR] Camera/Mic access denied or camera locked by another browser/app!", err);
                throw err;
              });
            
            console.log("📸 [LOCAL TRACKS] Created local media tracks successfully.");
            audioTrackRef.current = audioTrack;
            setLocalVideoTrack(videoTrack);
            
            await agoraClient.publish([audioTrack, videoTrack]);
            console.log("📤 [PUBLISH] Successfully publishing local Video & Audio to the channel");
          } else if (callMode === "audio") {
            const audioTrack = await AgoraRTC.createMicrophoneAudioTrack();
            audioTrackRef.current = audioTrack;
            await agoraClient.publish([audioTrack]);
            console.log("📤 [PUBLISH] Successfully publishing local Audio Only");
          }
        }
      } catch (err) {
        console.error("💥 [FATAL AGORA ERROR] Lifecycle aborted:", err);
      }
    };

    initAgora();

    return () => {
      console.log("🧹 [CLEANUP] Tearing down Agora connection and tracks");
      audioTrackRef.current?.close();
      localVideoTrack?.close();
      setLocalVideoTrack(null);
      clientRef.current?.leave();
      setRemoteUsers([]);
      joinInProgress.current = false;
    };
  }, [channelName, isPublisher, callMode]);

  if (callMode === "idle") {
    if (!isPublisher) return null;
    return (
      <div className="flex gap-2">
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
    );
  }

  return (
    <div className="w-full bg-gray-950 p-4 border border-gray-800 rounded-2xl flex flex-col justify-between relative group">
      
      <button 
        onClick={() => setCallMode("idle")}
        className="absolute top-6 right-6 z-20 bg-red-600/80 hover:bg-red-600 text-white p-2 rounded-xl border border-red-500/30 cursor-pointer transition"
        title="Leave Stage"
      >
        {callMode === "video" ? <VideoOff className="w-4 h-4" /> : <PhoneOff className="w-4 h-4" />}
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full auto-rows-fr">
        {isPublisher && (
          <LocalVideoPlayer videoTrack={localVideoTrack} callMode={callMode} />
        )}

        {remoteUsers.map((user) => (
          <RemoteVideoPlayer 
            key={user.uid} 
            uid={user.uid} 
            videoTrack={user.videoTrack || null} 
          />
        ))}
        
        {remoteUsers.length === 0 && (
          <div className="bg-gray-900/40 flex items-center justify-center text-slate-500 text-xs italic font-medium w-full border border-dashed border-gray-800 rounded-xl min-h-60 aspect-video">
            Waiting for opponent to connect...
          </div>
        )}
      </div>
    </div>
  );
}

function LocalVideoPlayer({ videoTrack, callMode }: { videoTrack: ICameraVideoTrack | null; callMode: string }) {
  const localRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!localRef.current || !videoTrack) return;
    
    console.log("📺 [PLAY LOCAL] Executing videoTrack.play() inside local DOM element.");
    videoTrack.play(localRef.current);
    
    return () => {
      videoTrack.stop();
    };
  }, [videoTrack]);

  return (
    <div 
      ref={localRef} 
      className="bg-gray-900 rounded-xl relative overflow-hidden w-full min-h-60 aspect-video border border-gray-800/80 flex items-center justify-center"
    >
      {callMode === "audio" && (
        <div className="text-emerald-400 text-xs font-semibold animate-pulse z-10">
          *🎙️ Mic Live (Audio Stage)*
        </div>
      )}
      <span className="absolute bottom-3 left-3 bg-black/70 px-2 py-0.5 rounded text-[10px] text-white z-10 font-bold tracking-wide">
        You (Live)
      </span>
    </div>
  );
}

function RemoteVideoPlayer({ uid, videoTrack }: RemotePlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !videoTrack) return;
    
    console.log(`📺 [PLAY REMOTE] Executing videoTrack.play() for remote user ${uid}`);
    videoTrack.play(containerRef.current);
    
    return () => {
      videoTrack.stop();
    };
  }, [uid, videoTrack]);

  return (
    <div 
      ref={containerRef} 
      className="bg-gray-900 rounded-xl relative overflow-hidden w-full min-h-60 aspect-video border border-gray-800/80 flex items-center justify-center"
    >
      {!videoTrack && (
        <div className="text-indigo-400 text-xs font-semibold animate-pulse uppercase tracking-wider z-10">
          🎙️ Opponent Streaming Audio Only
        </div>
      )}
      <span className="absolute bottom-3 left-3 bg-indigo-600/70 px-2 py-0.5 rounded text-[10px] text-white z-10 font-bold uppercase tracking-wide">
        On Stage ({uid})
      </span>
    </div>
  );
}