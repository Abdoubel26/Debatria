"use client"
import {useFormStatus } from 'react-dom'

function AddBtn() {

    const { pending } = useFormStatus()
    
  return (
    <button
      disabled={pending}
      type="submit"
      className={`rounded-xl cursor-pointer px-5 py-2.5 text-sm font-semibold shadow-xs transition active:scale-[0.98] ${
        pending 
          ? "bg-zinc-200 text-zinc-400 dark:bg-slate-200 dark:text-slate-800" 
          : "bg-zinc-800 text-white hover:bg-zinc-700 dark:text-slate-950 dark:bg-slate-100 dark:hover:bg-white"
      }`}
    >
      { pending ? "Pending..." : "Publish Topic"}
    </button>
  )
}

export default AddBtn
