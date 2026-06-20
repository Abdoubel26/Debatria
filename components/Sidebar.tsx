import { auth } from "@clerk/nextjs/server"
import SidebarLinks from '@/lib/SidebarLinks';

async function Sidebar() {

  const { userId } = await auth()

  return (
    <div className=" hidden lg:flex md:flex flex-col gap-2 p-3 w-[22%] h-full border-r border-zinc-200/80 bg-zinc-50 text-zinc-800 select-none dark:border-gray-800 dark:bg-gray-900 dark:text-white">
      <SidebarLinks />
    </div>
  )
}

export default Sidebar
