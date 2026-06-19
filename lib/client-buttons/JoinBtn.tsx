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
          ? ( pending 
              ? "bg-slate-300 dark:bg-slate-700 text-slate-800 dark:text-slate-300 cursor-not-allowed" 
              : "bg-slate-100 dark:bg-slate-800 text-slate-950 dark:text-white hover:bg-white dark:hover:bg-slate-700 shadow-sm")
          : "bg-slate-300 dark:bg-slate-800 text-slate-900 dark:text-slate-300 hover:bg-slate-400 dark:hover:bg-slate-700 border border-slate-400 dark:border-slate-700"
      }`}
    >
      {topic.status === "open" ? ( pending ? "Joining..." : "Join Debate") : "View Debate"}
    </button>
  )
}

export default JoinBtn;
