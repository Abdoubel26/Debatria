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
