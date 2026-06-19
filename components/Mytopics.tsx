import { db } from '@/db';
import { topics, users } from '@/db/schema';
import { eq, aliasedTable } from "drizzle-orm"
import { auth } from "@clerk/nextjs/server"
import { Frown } from "lucide-react"
import Link from 'next/link';
import DeleteBtn from '@/lib/client-buttons/DeleteBtn';
import EndBtn from '@/lib/client-buttons/EndBtn';


const defaultpfp = "https://plus.unsplash.com/premium_photo-1677252438411-9a930d7a5168?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8ZGVmYXVsdCUyMHByb2ZpbGUlMjBwaWN0dXJlfGVufDB8fDB8fHww"

async function MyTopics() {

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
    .where(eq(topics.posterId, userId as string)) as unknown as EnrichedTopic[]

  return (
       <div className="flex flex-col flex-1 gap-4 overflow-y-scroll p-4 bg-zinc-100 dark:bg-gray-900">
  { 
  fetchedTopics[0] 
  ?
  fetchedTopics.map((tpc) => {
    return (
      <div
        key={tpc.id}
        className="w-full rounded-2xl border border-zinc-200/80 bg-white/70 p-5 shadow-xs backdrop-blur-xs transition hover:bg-white hover:shadow-md dark:border-gray-800 dark:bg-gray-800/40 dark:hover:bg-gray-800/70"
      >

        <div className="flex items-center justify-between gap-3 border-b border-zinc-200/60 pb-3 mb-4 dark:border-gray-800/60">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-zinc-200/60 px-3 py-1 text-xs font-medium text-zinc-600 border border-zinc-300/40 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700/50">
              {tpc.category}
            </span>
            <p className="text-xs text-zinc-400 dark:text-slate-500">
              {new Date(tpc.createdAt as Date).toLocaleString()}
            </p>
          </div>

          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold select-none capitalize ${
              tpc.status === "open"
                ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 dark:text-emerald-400"
                : tpc.status === "in debate"
                ? "bg-blue-500/10 text-blue-600 border border-blue-500/20 dark:text-blue-400"
                : "bg-zinc-200/50 text-zinc-500 border border-zinc-300/40 dark:bg-slate-700/30 dark:text-slate-400 dark:border-slate-700/50"
            }`}
          >
            {tpc.status.replace("_", " ")}
          </span>
        </div>

        <div className="mb-5">
          <h3 className="text-xl font-bold text-zinc-800 tracking-tight dark:text-white">
            {tpc.title}
          </h3>
          <p className="mt-1.5 text-sm leading-6 text-zinc-600 dark:text-slate-300">
            {tpc.description}
          </p>
        </div>

        <div className="bg-zinc-50/60 border border-zinc-200/60 rounded-xl p-4 mb-4 flex flex-col sm:flex-row items-center justify-between gap-4 dark:bg-gray-900/40 dark:border-gray-800/80">
          
          <div className="flex items-center justify-center gap-4 w-full sm:w-auto">
            
            <div className="flex flex-col items-center text-center gap-1.5">
              <div className="relative">
                <img
                  src={tpc.poster.image ?? defaultpfp}
                  alt={tpc.poster.name}
                  className="h-14 w-14 rounded-full object-cover border-2 border-indigo-500/30 shadow-xs dark:border-indigo-500/40"
                />
                <span className="absolute -bottom-1 -right-1 bg-indigo-500 text-[9px] uppercase px-1.5 font-extrabold rounded-md text-white border border-zinc-100 dark:border-gray-950">
                  Host
                </span>
              </div>
              <p className="text-xs font-semibold text-zinc-700 max-w-20 truncate dark:text-slate-200">
                {tpc.poster.name}
              </p>
            </div>

            <div className="flex flex-col items-center justify-center">
              {tpc.secondParticipant ? (
                <div className="relative flex items-center justify-center h-9 w-9 rounded-full bg-linear-to-br from-red-500 to-indigo-600 p-px shadow-sm">
                  <div className="flex h-full w-full items-center justify-center rounded-full bg-zinc-50 dark:bg-gray-950">
                    <span className="text-xs font-black italic tracking-tighter text-transparent bg-clip-text bg-linear-to-r from-red-500 to-indigo-500 dark:from-red-400 dark:to-indigo-400">
                      VS
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-8 px-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 animate-pulse">
                  <span className="text-[10px] font-black tracking-widest text-emerald-600 dark:text-emerald-400 uppercase">
                    OPEN
                  </span>
                </div>
              )}
            </div>

            <div className="flex flex-col items-center text-center gap-1.5">
              {tpc.secondParticipant ? (
                <>
                  <div className="relative">
                    <img
                      src={tpc.secondParticipant.image ?? defaultpfp}
                      alt={tpc.secondParticipant.name}
                      className="h-14 w-14 rounded-full object-cover border-2 border-red-500/30 dark:border-red-500/40"
                    />
                    <span className="absolute -bottom-1 -left-1 bg-red-500 text-[9px] uppercase px-1.5 font-extrabold rounded-md text-white border border-zinc-100 dark:border-gray-950">
                      Opp
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-zinc-700 max-w-20 truncate dark:text-slate-200">
                    {tpc.secondParticipant.name}
                  </p>
                </>
              ) : (
                <>
                  <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-dashed border-zinc-300 bg-zinc-200/30 text-zinc-400 shadow-inner dark:border-gray-700 dark:bg-gray-800/20 dark:text-slate-600">
                    <span className="text-xl font-light">?</span>
                  </div>
                  <p className="text-xs font-medium text-zinc-400 italic dark:text-slate-500">
                    Awaiting Debater
                  </p>
                </>
              )}
            </div>

          </div>

          <div className="w-full sm:w-auto flex justify-end shrink-0">
              {userId &&
            <form className="gap-4 flex flex-row">
              <input value={userId} readOnly name="userId" hidden />
            <DeleteBtn topicId={tpc.id} /> 
            { tpc.status !== "ended" && <EndBtn userId={userId} topicId={tpc.id} />}
            </form>
            }
          </div>

        </div>
      </div>
    );
  })
  :
  (
    <div className="flex flex-1 flex-col items-center justify-center text-center p-8 my-auto">
      <div className="flex h-30 w-30 items-center justify-center rounded-2xl border border-zinc-200 bg-white text-zinc-400 mb-4 shadow-inner backdrop-blur-xs dark:border-gray-800 dark:bg-gray-800/30 dark:text-slate-500">
        <Frown className="w-16 h-16 stroke-[1.5]" />
      </div>
      
      <h3 className="text-2xl p-1.5 font-semibold text-zinc-800 tracking-tight dark:text-slate-200">
        You haven't published any debates yet!
      </h3>
      <p className="p-1 text-md text-zinc-500 max-w-xs dark:text-slate-500">
        Your active discussions will show up here. Go explore some topics to join the conversation!
      </p>

      { userId && <Link href={"/new"} ><button className="bg-zinc-800 m-1.5 text-white hover:bg-zinc-700 text-lg rounded-2xl p-2 cursor-pointer font-semibold transition dark:bg-slate-300 dark:text-black dark:hover:bg-slate-200">Create New</button></Link>}
    </div>
  )
}
</div>
  )
}

export default MyTopics
