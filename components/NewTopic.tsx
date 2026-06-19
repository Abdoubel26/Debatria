import { auth } from '@clerk/nextjs/server';
import React from 'react';
import { addTopic } from "../lib/actions/actions"
import { redirect } from 'next/navigation';
import Form from 'next/dist/client/app-dir/form';
import { FormData } from 'next/dist/compiled/@edge-runtime/primitives';
import AddBtn from '@/lib/client-buttons/AddBtn';

async function NewTopic() {

  const { userId } = await auth()

  if(!userId){
    redirect("")
  }

  const categories = [
    "philosophy",
    "politics",
    "religion",
    "ethics",
    "science",
    "society",
    "history",
    "psychology",
    "culture",
  ];

  return (
    <div className="bg-zinc-100 dark:bg-gray-900 flex flex-col flex-1 items-center justify-center p-4">
  <div className="w-full max-w-2xl bg-white/80 border border-zinc-200/80 rounded-3xl p-5 sm:p-8 shadow-sm backdrop-blur-xs dark:bg-gray-800/40 dark:border-gray-800 dark:shadow-xl">
    
    <div className="mb-6">
      <h1 className="text-2xl font-bold text-zinc-800 tracking-tight dark:text-white">
        Create a Debate Topic
      </h1>
      <p className="text-sm text-zinc-500 mt-1 dark:text-slate-400">
        Put your thesis out there and debate the community with intellectual humility.
      </p>
    </div>

    <form action={addTopic.bind(null, userId)} className="flex flex-col gap-4">
      
      <div className="flex flex-col gap-2">
        <label htmlFor="title" className="text-sm font-medium text-zinc-700 dark:text-slate-200">
          Debate Title / Thesis
        </label>
        <input
          name="title"
          type="text"
          id="title"
          placeholder="e.g., AI will replace most creative jobs"
          className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-800 placeholder-zinc-400 shadow-inner outline-none transition focus:border-violet-500 focus:ring-1 focus:ring-violet-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder-slate-500"
          required
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="category" className="text-sm font-medium text-zinc-700 dark:text-slate-200">
          Category
        </label>
        <div className="cursor-pointer relative">
          <select
            name="category"
            id="category"
            className="w-full appearance-none rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-800 shadow-inner outline-none transition focus:border-violet-500 focus:ring-1 focus:ring-violet-500 capitalize dark:border-gray-700 dark:bg-gray-900 dark:text-white"
            defaultValue=""
            required
          >
            <option value="" disabled className="text-zinc-400 dark:text-slate-500">
              Select a category...
            </option>
            {categories.map((cat) => (
              <option key={cat} value={cat} className="bg-white text-zinc-800 dark:bg-gray-800 dark:text-white capitalize">
                {cat}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-zinc-400 dark:text-slate-400">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="description" className="text-sm font-medium text-zinc-700 dark:text-slate-200">
          Context / Description
        </label>
        <textarea
          name="description"
          id="description"
          rows={4}
          placeholder="Provide context or expand on your argument framework..."
          className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-800 placeholder-zinc-400 shadow-inner outline-none transition focus:border-violet-500 focus:ring-1 focus:ring-violet-500 resize-none leading-6 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder-slate-500"
          required
        />
      </div>

      <div className="mt-2 flex items-center justify-end gap-3">
        <button
          type="button"
          className="rounded-xl cursor-pointer px-5 py-2.5 text-sm font-medium text-zinc-500 hover:text-zinc-800 transition dark:text-slate-400 dark:hover:text-white"
        >
          Cancel
        </button>
        <AddBtn />
      </div>

    </form>
  </div>
</div>
  );
}

export default NewTopic;