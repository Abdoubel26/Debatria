import Image from "next/image";
import { ArrowUp } from "lucide-react";
import { db } from '@/db';
import { messages, topics, users } from '@/db/schema';
import { eq, aliasedTable, or, and , inArray } from "drizzle-orm"
import { auth } from "@clerk/nextjs/server"
import ChatClient from "@/lib/ChatClient";


async function ChatPage() {

  const {userId} = await auth()

  const posters = aliasedTable(users, "posters");
  const opponents = aliasedTable(users, "opponents");

  const fetchedTopics = await db
    .select({
      id: topics.id,
      title: topics.title,
      description: topics.description,
      category: topics.category,
      status: topics.status,
      createdAt: topics.createdAt,
      poster: {
        name: posters.name,
        image: posters.imageUrl,
        clerkId: posters.clerkId,
      },
      secondParticipant: {
        name: opponents.name,
        image: opponents.imageUrl,
        clerkId: opponents.clerkId,
      },
    })
    .from(topics)
    .innerJoin(posters, eq(topics.posterId, posters.clerkId))
    .leftJoin(opponents, eq(topics.secondParticipantId, opponents.clerkId))
    .where(or(
    eq(topics.posterId, userId as string),
    eq(topics.secondParticipantId, userId as string)
  )) as unknown as EnrichedTopic[]

    const fetchedUsers = await db.select().from(users)

    const fetchedMessages = await db.select().from(messages).where(and(eq(messages.senderId, userId as string), inArray(messages.topicId, fetchedTopics.map(tpc => tpc.id))))

  return (
    <div className="flex flex-1 h-[calc(100vh-65px)] bg-gray-900 text-white overflow-hidden">
      
    
    <ChatClient topics={fetchedTopics} userId={userId} messages={fetchedMessages} users={fetchedUsers}/>
      

    </div>
  );
}

export default ChatPage;