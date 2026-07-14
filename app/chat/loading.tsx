import React from 'react';

export default function ChatLoading() {
  return (
    <div className="relative flex flex-row h-screen w-full overflow-hidden bg-zinc-100 dark:bg-gray-900">
      
      <div className="flex-1 flex flex-col h-full border-r border-zinc-200 dark:border-gray-800 p-6 px-2 justify-between w-full animate-pulse">
        
        <div>
          <div className="border-b border-zinc-200 dark:border-gray-800 lg:pb-4 lg:mb-4 md:pb-4 flex justify-between items-center">
            
            <div className="flex flex-row items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-zinc-200 dark:bg-gray-800" />
              <div className="space-y-2">
                <div className="h-4 w-28 bg-zinc-300 dark:bg-gray-700 rounded" />
                <div className="h-3 w-40 bg-zinc-200 dark:bg-gray-800 rounded" />
              </div>
            </div>
              

            <div className="flex flex-row items-center gap-2">

              <div className="h-8 w-20 rounded-xl bg-zinc-200 dark:bg-gray-800" />

              <div className="h-8 w-8 rounded-lg bg-zinc-200 dark:bg-gray-800" />
            </div>
          </div>


          <div className="pt-2 pb-3 flex flex-col space-y-4 h-[60vh] overflow-hidden">

            <div className="self-start bg-zinc-200/50 dark:bg-gray-800/40 border border-zinc-200 dark:border-gray-800 rounded-2xl rounded-tl-none p-3.5 w-2/3 space-y-2">
              <div className="h-3.5 bg-zinc-300 dark:bg-gray-700 rounded w-full" />
              <div className="h-3.5 bg-zinc-300 dark:bg-gray-700 rounded w-5/6" />
            </div>


            <div className="self-end bg-indigo-600/10 dark:bg-indigo-600/20 border border-indigo-500/20 dark:border-indigo-500/35 rounded-2xl rounded-tr-none p-3.5 w-1/2 space-y-2">
              <div className="h-3.5 bg-indigo-500/20 dark:bg-indigo-500/30 rounded w-full" />
              <div className="h-3.5 bg-indigo-500/20 dark:bg-indigo-500/30 rounded w-2/3" />
            </div>


            <div className="self-start bg-zinc-200/50 dark:bg-gray-800/40 border border-zinc-200 dark:border-gray-800 rounded-2xl rounded-tl-none p-3.5 w-3/4 space-y-2">
              <div className="h-3.5 bg-zinc-300 dark:bg-gray-700 rounded w-full" />
              <div className="h-3.5 bg-zinc-300 dark:bg-gray-700 rounded w-4/5" />
              <div className="h-3.5 bg-zinc-300 dark:bg-gray-700 rounded w-1/2" />
            </div>


            <div className="self-end bg-indigo-600/10 dark:bg-indigo-600/20 border border-indigo-500/20 dark:border-indigo-500/35 rounded-2xl rounded-tr-none p-3.5 w-1/3">
              <div className="h-3.5 bg-indigo-500/20 dark:bg-indigo-500/30 rounded w-full" />
            </div>
          </div>
        </div>


        <div className="flex w-full flex-row items-center gap-2">
          <div className="bg-zinc-200/50 dark:bg-gray-800/30 border border-zinc-200 dark:border-gray-800 w-full rounded-xl p-3 h-11" />
          <div className="bg-zinc-300 dark:bg-indigo-600/30 h-11 w-11 rounded-full shrink-0" />
        </div>

      </div>


      <div className="hidden md:flex md:relative h-full w-[300px] lg:w-[25%] bg-zinc-200 dark:bg-gray-900/50 border-l border-zinc-300 dark:border-gray-800/50 flex-col p-4 gap-3 select-none animate-pulse">
        

        <div className="h-3 w-16 bg-zinc-400 dark:bg-slate-500 rounded px-2 mb-2" />


        <div className="flex-1 space-y-3">
          

          <div className="w-full flex flex-col p-3 rounded-2xl border dark:bg-gray-800 bg-zinc-300 border-zinc-400 dark:border-gray-700 gap-2">
            <div className="h-4 w-3/4 bg-zinc-400 dark:bg-gray-700 rounded" />
            <div className="flex items-center gap-2 mt-1">
              <div className="h-7 w-7 rounded-full bg-zinc-400 dark:bg-gray-700" />
              <div className="h-3 w-1/3 bg-zinc-400 dark:bg-gray-700 rounded" />
            </div>
          </div>


          <div className="w-full flex flex-col p-3 rounded-2xl border border-transparent gap-2">
            <div className="h-4 w-5/6 bg-zinc-300 dark:bg-gray-800 rounded" />
            <div className="flex items-center gap-2 mt-1">
              <div className="h-7 w-7 rounded-full bg-zinc-300 dark:bg-gray-800" />
              <div className="h-3 w-2/5 bg-zinc-300 dark:bg-gray-800 rounded" />
            </div>
          </div>

          <div className="w-full flex flex-col p-3 rounded-2xl border border-transparent gap-2">
            <div className="h-4 w-2/3 bg-zinc-300 dark:bg-gray-800 rounded" />
            <div className="flex items-center gap-2 mt-1">
              <div className="h-7 w-7 rounded-full bg-zinc-300 dark:bg-gray-800" />
              <div className="h-3 w-1/2 bg-zinc-300 dark:bg-gray-800 rounded" />
            </div>
          </div>
          
        </div>

      </div>

    </div>
  );
}