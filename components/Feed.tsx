import { db } from '@/db';
import { topics, users } from '@/db/schema';
import { eq, aliasedTable } from "drizzle-orm"
import { auth } from "@clerk/nextjs/server"
import DeleteBtn from '@/lib/client-buttons/DeleteBtn';
import JoinBtn from '@/lib/client-buttons/JoinBtn';
import EndBtn from '@/lib/client-buttons/EndBtn';

const defaultpfp = "https://plus.unsplash.com/premium_photo-1677252438411-9a930d7a5168?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8ZGVmYXVsdCUyMHByb2ZpbGUlMjBwaWN0dXJlfGVufDB8fDB8fHww"


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
  className="w-full rounded-2xl border border-gray-800 bg-gray-800/40 p-5 shadow-sm backdrop-blur-sm transition hover:bg-gray-800/70 hover:shadow-md"
>
  {/* Top Row: Meta Information & Status Badge */}
  <div className="flex items-center justify-between gap-3 border-b border-gray-800/60 pb-3 mb-4">
    <div className="flex items-center gap-2">
      <span className="rounded-full bg-slate-800 px-3 py-1 text-xs font-medium text-slate-300 border border-slate-700/50">
        {tpc.category}
      </span>
      <p className="text-xs text-slate-500">
        {new Date(tpc.createdAt as Date).toLocaleString()}
      </p>
    </div>

    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold select-none capitalize ${
        tpc.status === "open"
          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
          : tpc.status === "in_debate"
          ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
          : "bg-slate-700/30 text-slate-400 border border-slate-700/50"
      }`}
    >
      {tpc.status.replace("_", " ")}
    </span>
  </div>

  {/* Middle Row: Content & Text Fields */}
  <div className="mb-5">
    <h3 className="text-xl font-bold text-white tracking-tight">
      {tpc.title}
    </h3>
    <p className="mt-1.5 text-sm leading-6 text-slate-300">
      {tpc.description}
    </p>
  </div>

  {/* Versus Battle Arena Layout Block */}
  <div className="bg-gray-900/40 border border-gray-800/80 rounded-xl p-4 mb-4 flex flex-col sm:flex-row items-center justify-between gap-4">
    
    {/* Dynamic Matchup Frame */}
    <div className="flex items-center justify-center gap-4 w-full sm:w-auto">
      
      {/* Poster (Left) */}
      <div className="flex flex-col items-center text-center gap-1.5">
        <div className="relative">
          <img
            src={tpc.poster.image ?? defaultpfp}
            alt={tpc.poster.name}
            className="h-14 w-14 rounded-full object-cover border-2 border-indigo-500/40 shadow-inner"
          />
          <span className="absolute -bottom-1 -right-1 bg-indigo-500 text-[9px] uppercase px-1.5 font-extrabold rounded-md text-white border border-gray-950">
            Host
          </span>
        </div>
        <p className="text-xs font-semibold text-slate-200 max-w-20 truncate">
          {tpc.poster.name}
        </p>
      </div>

      {/* Center Indicator (VS or OPEN) */}
      <div className="flex flex-col items-center justify-center">
        {tpc.secondParticipant ? (
          <div className="relative flex items-center justify-center h-9 w-9 rounded-full bg-linear-to-br from-red-500 to-indigo-600 p-px shadow-lg shadow-indigo-500/10">
            <div className="flex h-full w-full items-center justify-center rounded-full bg-gray-950">
              <span className="text-xs font-black italic tracking-tighter text-transparent bg-clip-text bg-linear-to-r from-red-400 to-indigo-400">
                VS
              </span>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-8 px-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 animate-pulse">
            <span className="text-[10px] font-black tracking-widest text-emerald-400 uppercase">
              OPEN
            </span>
          </div>
        )}
      </div>

      {/* Opponent (Right) */}
      <div className="flex flex-col items-center text-center gap-1.5">
        {tpc.secondParticipant ? (
          <>
            <div className="relative">
              <img
                src={tpc.secondParticipant.image ?? defaultpfp}
                alt={tpc.secondParticipant.name}
                className="h-14 w-14 rounded-full object-cover border-2 border-red-500/40"
              />
              <span className="absolute -bottom-1 -left-1 bg-red-500 text-[9px] uppercase px-1.5 font-extrabold rounded-md text-white border border-gray-950">
                Opp
              </span>
            </div>
            <p className="text-xs font-semibold text-slate-200 max-w-20 truncate">
              {tpc.secondParticipant.name}
            </p>
          </>
        ) : (
          <>
            <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-dashed border-gray-700 bg-gray-800/20 text-slate-600 shadow-inner">
              <span className="text-xl font-light">?</span>
            </div>
            <p className="text-xs font-medium text-slate-500 italic">
              Awaiting Challenger
            </p>
          </>
        )}
      </div>

    </div>

    {/* Form Permission Actions (Aligned Right on large viewports) */}
    <div className="w-full sm:w-auto flex justify-end shrink-0">
      { 
      userId === tpc.poster.clerkId ? 
      <form className="w-full sm:w-auto">
        <input value={userId} name="userId" readOnly hidden />
        <DeleteBtn topicId={tpc.id} />
      </form> 
      :
      userId === tpc.secondParticipant?.clerkId ? 
      <form className="w-full sm:w-auto"><EndBtn topicId={tpc.id} userId={userId} /></form> 
      :
      userId && <form className="w-full sm:w-auto">
        <input value={userId} name="userId" readOnly hidden />
        <JoinBtn topic={tpc} />
      </form>
      }
    </div>

  </div>
</div>
    );
  })}
</div>
  )
}

export default Feed
