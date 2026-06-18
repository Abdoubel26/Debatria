"use server"

import { db } from "@/db";
import { topics } from "@/db/schema";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm"

type categoryType = "culture" | "ethics" | "history" | "philosophy" | "politics" | "psychology" | "religion" | "science" | "society" ;

export const addTopic = async (userId: string, formData: FormData) => {
    
    if(!userId) redirect("/");
    
    const title = formData.get("title") as string;
    const category = formData.get("category") as categoryType;
    const description = formData.get("description") as string;

    if (!title || !category || !description) return;

    await db.insert(topics).values([{
        posterId: userId,
        title: title,
        category: category,
        description: description,
        status: "open",
        secondParticipantId: null, 
    }]);

    return redirect("/")
}


export const joinDebate = async (topicId: string , data: FormData ) => {

    const userId = data.get("userId") as string

    if(!topicId || !userId) return;

    await db.update(topics).set({status: "in debate", secondParticipantId: userId}).where(eq(topics.id, topicId))

    redirect("/joineddebates")
}


export const deleteDebate = async (topicId: string) => {

    if(!topicId) return;
    await db.delete(topics).where(eq(topics.id, topicId))

    redirect("/mytopics")
}


export const endDebate = async (topicId: string, userId: string) => {

    const [topic] = await db.select().from(topics).where(eq(topics.id, topicId))

    const isParticipant = topic.posterId === userId || topic.secondParticipantId === userId

    if(!isParticipant) return;

    await db.update(topics).set({status: "ended"}).where(eq(topics.id, topicId))

    redirect("/")

}