"use client"
import { endDebate } from '../actions/actions';
import { useFormStatus } from "react-dom"


type PropTypes = {
    topicId: string,
    userId: string,
}

function EndBtn({ topicId, userId}: PropTypes) {

    const {pending} = useFormStatus()

  return (
     <button
        onClick={() => {
          if(!confirm("Are you sure you want to end this debate?")) return;
          endDebate(topicId, userId)}}
        className={`rounded-xl cursor-pointer px-4 py-2 text-sm font-medium transition-all ${ pending ? "bg-red-900 text-gray-300" : "bg-red-700 text-white hover:bg-red-800 shadow-sm"} `}
        >
            { pending ? "Ending Debate..."  : "End"}
    </button>
  )
}

export default EndBtn
