

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

interface EnrichedMessage {
  id: string;          
  text: string;
  topicId: string;    
  senderId: string;    
  isRead: boolean;
  createdAt: Date | null;
  topic: {
    id: string;                  
    posterId: string;         
    title: string;
    description: string | null;
    category: "culture" | "ethics" | "history" | "philosophy" | "politics" | "psychology" | "religion" | "science" | "society";
    status: "open" | "in debate" | "ended" | null;
    secondParticipantId: string | null; 
    createdAt: Date | null;
  };
}