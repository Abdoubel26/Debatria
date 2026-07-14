
export default function NewTopicLoading() {
  return (
    <div className="bg-zinc-100 dark:bg-gray-900 flex flex-col flex-1 lg:overflow-y-clip overflow-y-scroll pb-5 pt-35 px-4 lg:pt-0 md:pt-50 md:overflow-y-scroll items-center justify-center h-screen">
      <div className="w-full max-w-2xl bg-white/80 h-fit border border-zinc-200/80 rounded-2xl p-5 sm:p-8 shadow-sm backdrop-blur-xs dark:bg-gray-800/40 dark:border-gray-800 dark:shadow-xl animate-pulse">
        

        <div className="mb-6 space-y-2">

          <div className="h-8 w-1/2 bg-zinc-300 dark:bg-slate-700 rounded-lg" />

          <div className="h-4 w-3/4 bg-zinc-200 dark:bg-slate-800 rounded" />
        </div>

        <div className="flex flex-col gap-4">
          
          <div className="flex flex-col gap-2">
            <div className="h-4 w-32 bg-zinc-200 dark:bg-slate-800 rounded" />
            <div className="h-12 w-full rounded-xl bg-zinc-200/60 dark:bg-slate-800/60" />
          </div>

          <div className="flex flex-col gap-2">
            <div className="h-4 w-20 bg-zinc-200 dark:bg-slate-800 rounded" />
            <div className="h-12 w-full rounded-xl bg-zinc-200/60 dark:bg-slate-800/60" />
          </div>

          <div className="flex flex-col gap-2">
            <div className="h-4 w-36 bg-zinc-200 dark:bg-slate-800 rounded" />
            <div className="h-28 w-full rounded-xl bg-zinc-200/60 dark:bg-slate-800/60" />
          </div>

          <div className="mt-2 flex items-center justify-end gap-3">

            <div className="h-10 w-20 rounded-xl bg-zinc-200 dark:bg-slate-800" />

            <div className="h-10 w-28 rounded-xl bg-zinc-300 dark:bg-slate-700" />
          </div>

        </div>
      </div>
    </div>
  );
}