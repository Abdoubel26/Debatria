"use client";
import { joinDebate } from '@/lib/actions/actions';
import { redirect } from 'next/navigation';
import { useFormStatus } from "react-dom";


type PropTypes = {
    topic: EnrichedTopic
}

function JoinBtn({topic}: PropTypes) {

    const { pending } = useFormStatus()

  return (
     <button
    disabled={pending}
    formAction={ topic.secondParticipant ? () => redirect(`/chat/${topic.id}`) : joinDebate.bind(null, topic.id)}
                className={`rounded-xl cursor-pointer px-4 py-2 text-sm font-medium transition-all ${
                  topic.status === "open"
                    ? ( pending ? "bg-slate-200 text-slate-800" : "bg-slate-100 text-slate-950 hover:bg-white shadow-sm")
                    : "bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700"
                }`}
              >
               {topic.status === "open" ?( pending ? "Joining..." : "Join Debate") : "View Debate"}
    </button>
  )
}

export default JoinBtn
