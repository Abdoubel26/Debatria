import { auth } from "@clerk/nextjs/server"
import SidebarLinks from '@/lib/SidebarLinks';

async function Sidebar() {

  const { userId } = await auth()

  return (
    <div className=" flex flex-col gap-2 p-3 w-72 h-full border-r border-gray-800 bg-gray-900  text-white  select-none">

       <SidebarLinks />

    </div>
  )
}

export default Sidebar
