

export default function FeedLoading() {
  const skeletonCards = Array.from({ length: 3 });

  return (
    <div className="flex flex-col flex-1 gap-4 overflow-y-hidden p-4 bg-zinc-100 dark:bg-gray-900 h-screen">
      {skeletonCards.map((_, index) => (
        <div
          key={index}
          className="w-full rounded-2xl border border-zinc-200/80 bg-white/70 p-5 shadow-xs dark:border-gray-800 dark:bg-gray-800/40 animate-pulse"
        >

          <div className="flex items-center justify-between gap-3 border-b border-zinc-200/60 pb-3 mb-4 dark:border-gray-800/60">
            <div className="flex items-center gap-2">

              <div className="h-6 w-20 rounded-full bg-zinc-200/80 dark:bg-slate-800" />

              <div className="h-3 w-28 rounded bg-zinc-200/60 dark:bg-slate-800" />
            </div>

            <div className="h-6 w-16 rounded-full bg-zinc-200/80 dark:bg-slate-800" />
          </div>


          <div className="mb-5 space-y-2.5">

            <div className="h-7 w-3/4 bg-zinc-300/80 rounded-lg dark:bg-slate-700/80" />

            <div className="space-y-2">
              <div className="h-4 w-full bg-zinc-200 dark:bg-slate-800 rounded" />
              <div className="h-4 w-5/6 bg-zinc-200 dark:bg-slate-800 rounded" />
            </div>
          </div>

          <div className="bg-zinc-50/60 border border-zinc-200/60 rounded-xl p-4 mb-4 flex flex-col sm:flex-row items-center justify-between gap-4 dark:bg-gray-900/40 dark:border-gray-800/80">
            
            <div className="flex items-center justify-center gap-4 w-full sm:w-auto">
              
              <div className="flex flex-col items-center text-center gap-1.5">
                <div className="relative h-14 w-14 rounded-full bg-zinc-300 dark:bg-slate-700" />
                <div className="h-3 w-14 bg-zinc-200 dark:bg-slate-800 rounded" />
              </div>

              <div className="flex flex-col items-center justify-center">
                <div className="h-8 w-12 rounded-lg bg-zinc-200 dark:bg-slate-800" />
              </div>

              <div className="flex flex-col items-center text-center gap-1.5">
                <div className="relative h-14 w-14 rounded-full bg-zinc-300 dark:bg-slate-700" />
                <div className="h-3 w-14 bg-zinc-200 dark:bg-slate-800 rounded" />
              </div>

            </div>

            <div className="w-full sm:w-auto flex justify-center lg:justify-end shrink-0">
              <div className="h-10 w-24 rounded-xl bg-zinc-300 dark:bg-slate-700" />
            </div>

          </div>

        </div>
      ))}
    </div>
  );
}