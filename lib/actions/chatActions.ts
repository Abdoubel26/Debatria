"use server";

import { db } from "@/db";
import { messages } from "@/db/schema";
import { pusherServer } from "@/lib/pusherServer";

export async function sendMessageAction(text: string, topicId: string, senderId: string) {
  if (!text.trim()) return;

  const [newMessage] = await db.insert(messages).values([{
    text,
    topicId: topicId,
    senderId,
    createdAt: new Date(),
  }]).returning();

  // 2. Blast it to Pusher so the opponent sees it instantly
  // Channel name format: 'chat-{topicId}'
  // Event name: 'incoming-message'
  await pusherServer.trigger(`chat-${topicId}`, "incoming-message", newMessage);

  return newMessage;
}