import { db } from '@/db';
import { topics, users } from '@/db/schema';
import { eq, aliasedTable } from "drizzle-orm"
import React from 'react'
import { auth } from "@clerk/nextjs/server"
import { deleteDebate, joinDebate } from '@/lib/actions/actions';


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

async function Feed() {

  const { userId } = await auth()

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
    .leftJoin(opponents, eq(topics.secondParticipantId, opponents.clerkId)) as unknown as EnrichedTopic[]

  return (
       <div className="flex flex-col flex-1 gap-4 overflow-y-scroll p-4 bg-gray-900">
  {fetchedTopics.map((tpc) => {
    return (
      <div
        key={tpc.id}
        className="w-full rounded-2xl border border-gray-800 bg-gray-800/40 p-4 shadow-sm backdrop-blur-sm transition hover:bg-gray-800/70 hover:shadow-md"
      >
        <div className="flex items-start gap-4">
          <img
            src={tpc.poster.image ?? ""}
            alt={tpc.poster.name}
            className="h-12 w-12 rounded-full object-cover border border-gray-700"
          />

          <div className="flex-1">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-slate-200">
                  {tpc.poster.name}
                </p>
                <p className="text-xs text-slate-500">
                  {new Date(tpc.createdAt as Date).toLocaleString()}
                </p>
              </div>

              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  tpc.status === "open"
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                    : tpc.status === "in_debate"
                    ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                    : "bg-slate-700/30 text-slate-400 border border-slate-700/50"
                }`}
              >
                {tpc.status}
              </span>
            </div>

            <div className="mt-3">
              <h3 className="text-lg font-semibold text-white tracking-tight">
                {tpc.title}
              </h3>
              <p className="mt-1 text-sm leading-6 text-slate-300">
                {tpc.description}
              </p>
            </div>

            <div className="mt-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300 border border-slate-700/50">
                  {tpc.category}
                </span>
                {tpc.secondParticipant && (
                  <span className="rounded-full bg-violet-500/10 px-3 py-1 text-xs font-medium text-violet-400 border border-violet-500/20">
                    vs {tpc.secondParticipant.name}
                  </span>
                )}
              </div>
              { userId === tpc.poster.clerkId ? 
               userId && <form>
                <input value={userId} name="userId" hidden />
              <button
                formAction={deleteDebate.bind(null, tpc.id)}
                className={`rounded-xl cursor-pointer px-4 py-2 text-sm font-medium transition-all bg-red-700 text-white hover:bg-red-800 shadow-sm`}
              >
                Delete
              </button>
              </form>
              :
              userId && <form>
              <button
                formAction={joinDebate.bind(null, tpc.id)}
                className={`rounded-xl cursor-pointer px-4 py-2 text-sm font-medium transition-all ${
                  tpc.status === "open"
                    ? "bg-slate-100 text-slate-950 hover:bg-white shadow-sm"
                    : "bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700"
                }`}
              >
                {tpc.status === "open" ? "Join Debate" : "View Debate"}
              </button>
              </form>
              }
              
            </div>
          </div>
        </div>
      </div>
    );
  })}
</div>
  )
}

export default Feed
