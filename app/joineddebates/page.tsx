import { db } from '@/db';
import { topics, users } from '@/db/schema';
import { eq, aliasedTable } from "drizzle-orm"
import { auth } from "@clerk/nextjs/server"


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

const defaultpfp = "https://plus.unsplash.com/premium_photo-1677252438411-9a930d7a5168?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8ZGVmYXVsdCUyMHByb2ZpbGUlMjBwaWN0dXJlfGVufDB8fDB8fHww"


async function JoinedDebatesPage() {


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
    .where(eq(topics.secondParticipantId, userId as string)) as unknown as EnrichedTopic[]

  return (
    <div className="flex flex-col flex-1 gap-4 overflow-y-scroll p-4 bg-gray-900">
  {fetchedTopics[0] ? fetchedTopics.map((tpc) => {

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
                    vs user
                  </span>
                )}
              </div>

              <button
                className={`rounded-xl px-4 py-2 text-sm font-medium transition-all bg-red-800 cursor-pointer text-white `}
              >
                Leave
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }) 

  :
   (
    <div className="flex flex-1 flex-col items-center justify-center text-center p-8 animate-fade-in my-auto">
      <div className="flex h-30 w-30 items-center justify-center rounded-2xl border border-gray-800 bg-gray-800/30 text-gray-500 mb-4 shadow-inner backdrop-blur-sm">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 text-slate-500">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.25 3 4.875V18a2.25 2.25 0 0 0 2.25 2.25h13.5M6 7.5h3v3H6v-3Z" />
        </svg>
      </div>
      
      <h3 className=" p-1.5 text-2xl font-semibold text-slate-200 tracking-tight">
        No debates joined yet
      </h3>
      <p className="mt-1 text-md p-1 text-slate-500 max-w-xs">
        You haven't joined any topics yet. Explore open discussions to get started.
      </p>
    </div>
  )}
</div>
  )
}



export default JoinedDebatesPage


export const dummyTopics = [
  {
    id: "top_2",
    poster: {
      name: "Jane Doe",
      image: "https://i.pravatar.cc/150?img=12",
    },
    title: "Social media does more harm than good",
    description:
      "Platforms are engineered to maximize attention, not well-being.",
    category: "society",
    status: "open",
    secondParticipant: null,
    createdAt: "2026-06-12T06:52:00.000Z",
  },
  {
    id: "top_3",
    poster: {
      name: "Alice Brown",
      image: "https://i.pravatar.cc/150?img=47",
    },
    title: "Education should be fully free at university level",
    description:
      "Higher education should be publicly funded and accessible to everyone.",
    category: "politics",
    status: "open",
    secondParticipant: null,
    createdAt: "2026-06-11T08:52:00.000Z",
  },
  {
    id: "top_5",
    poster: {
      name: "Omar Ali",
      image: "https://i.pravatar.cc/150?img=28",
    },
    title: "Capitalism is the best economic system",
    description:
      "Free markets and competition create more opportunity than alternatives.",
    category: "philosophy",
    status: "open",
    secondParticipant: {
      name: "Victoria",
      image: ""
    },
    createdAt: "2026-06-09T07:52:00.000Z",
  },
];