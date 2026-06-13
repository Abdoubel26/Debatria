"use client"
import { deleteDebate } from '@/lib/actions/actions';
import {useFormStatus} from "react-dom"

type PropTypes = {
    topicId: string
}

function DeleteBtn({ topicId }: PropTypes) {

  const {pending} = useFormStatus()

  return (
    <button
        disabled={pending}
        formAction={deleteDebate.bind(null, topicId)}
        className={`rounded-xl cursor-pointer px-4 py-2 text-sm font-medium transition-all ${ pending ? "bg-red-900 text-gray-300" : "bg-red-700 text-white hover:bg-red-800 shadow-sm"} `}
        >
          {pending ? "Deleting..." : "Delete"}
        </button>
  )
}

export default DeleteBtn
