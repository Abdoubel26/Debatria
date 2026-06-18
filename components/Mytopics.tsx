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
       <div className="flex flex-col flex-1 gap-4 overflow-y-scroll p-4 bg-gray-900">
  { 
  fetchedTopics[0] 
  ?

  fetchedTopics.map((tpc) => {

    return (
      <div
        key={tpc.id}
        className="w-full rounded-2xl border border-gray-800 bg-gray-800/40 p-4 shadow-sm backdrop-blur-sm transition hover:bg-gray-800/70 hover:shadow-md"
      >
        <div className="flex items-start gap-4">
          <img
            src={tpc.poster.image || defaultpfp}
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
                  {new Date(tpc.createdAt).toLocaleString()}
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
      </div>
    );
  })
  :
  (
    <div className="flex flex-1 flex-col items-center justify-center text-center p-8 my-auto">
      <div className="flex h-30 w-30 items-center justify-center rounded-2xl border border-gray-800 bg-gray-800/30 text-slate-500 mb-4 shadow-inner backdrop-blur-sm">
        <Frown className="w-16 h-16 stroke-[1.5]" />
      </div>
      
      <h3 className="text-2xl p-1.5 font-semibold text-slate-200 tracking-tight">
        You haven't published any debates yet!
      </h3>
      <p className="p-1 text-md text-slate-500 max-w-xs">
        Your active discussions will show up here. Go explore some topics to join the conversation!
      </p>

      { userId && <Link href={"/new"} ><button className="bg-slate-300 m-1.5 text-black text-lg rounded-2xl p-2 cursor-pointer font-semibold">Create New</button></Link>}
    </div>
  )

}
</div>
  )
}

export default MyTopics
