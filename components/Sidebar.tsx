import { auth } from "@clerk/nextjs/server";
import SidebarLinks from '@/lib/SidebarLinks';
import SidebarWrapper from '@/components/SidebarWrapper';

async function Sidebar() {
  const { userId } = await auth();

  return (
    <SidebarWrapper>
      <SidebarLinks mode="sidebar" />
    </SidebarWrapper>
  );
}

export default Sidebar;