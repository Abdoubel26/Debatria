export default function LoadingSpectatorChat() {
  return (
    <div className="flex-1 flex flex-col h-full border-r border-gray-800 p-6 px-2 justify-between max-w-5xl mx-auto w-full bg-gray-900 animate-pulse">
      <div>
        {/* Header Skeleton Panel */}
        <div className="border-b border-gray-800 pb-4 mb-4 flex justify-between items-center">
          <div className="flex w-full items-center gap-3">
            <div className="w-full flex flex-col justify-center items-center gap-2">
              {/* Topic Title Placeholder */}
              <div className="h-5 w-48 bg-gray-800 rounded-lg" />
              {/* Matchup Description Placeholder */}
              <div className="h-3 w-32 bg-gray-800/60 rounded-md" />
            </div>
          </div>
        </div>

        {/* Video Call Mock Block Container */}
        <div className="mb-4 h-64 w-full bg-gray-950 border border-gray-800 rounded-2xl flex items-center justify-center">
          <div className="h-3 w-40 bg-gray-900 rounded" />
        </div>

        {/* Messaging Container Layout Skeleton */}
        <div className="w-full h-88 pt-2 pb-3 flex flex-col space-y-4 overflow-hidden">

          <div className="self-start w-2/3 space-y-1.5">
            <div className="h-2 w-12 bg-gray-800/50 rounded" />
            <div className="h-14 w-full bg-gray-800/40 border border-gray-800 rounded-2xl rounded-tl-none" />
          </div>

          <div className="self-end ml-auto w-2/3 space-y-1.5 flex flex-col items-end">
            <div className="h-2 w-16 bg-gray-800/50 rounded" />
            <div className="h-11 w-full bg-indigo-950/20 border border-indigo-900/30 rounded-2xl rounded-tr-none" />
          </div>

          <div className="self-start w-1/2 space-y-1.5">
            <div className="h-2 w-10 bg-gray-800/50 rounded" />
            <div className="h-11 w-full bg-gray-800/40 border border-gray-800 rounded-2xl rounded-tl-none" />
          </div>
        </div>
      </div>

      <div className="w-full h-11 flex items-center justify-center border-t border-gray-800 pt-3.5 bg-gray-800/10 rounded-b-xl">
        <div className="h-3 w-3/4 bg-gray-800 rounded mx-auto" />
      </div>
    </div>
  );
}