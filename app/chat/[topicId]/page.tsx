import React from 'react'
import SpectatorChatClient from "../../../lib/SpectatorChatClient"
import { db } from '@/db';
import { messages, topics, users } from '@/db/schema';
import { eq } from 'drizzle-orm';


type PropTypes = {
    params: Promise<{topicId: string}>
}

async function SpectatorPage({params}: PropTypes) {

    const {topicId} = await params

    const [fetchedTopic] = await db.select().from(topics).where(eq(topics.id, topicId))

    const fetchedMessages = await db.select().from(messages).where(eq(messages.topicId, topicId))

    const [fetchedPoster] = await db.select().from(users).where(eq(users.clerkId, fetchedTopic.posterId))

    const [fetchedOpponent] = await db.select().from(users).where(eq(users.clerkId, fetchedTopic.secondParticipantId as string))

  return (
    <SpectatorChatClient  topic={fetchedTopic} pastMessages={fetchedMessages} posterUser={fetchedPoster} opponentUser={fetchedOpponent}/>
  )
}

export default SpectatorPage
