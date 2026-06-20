import { Show, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import { auth } from "@clerk/nextjs/server"
import { Plus, Sun, Moon } from "lucide-react"
import ThemeToggle from './ThemeToggle';

async function Navbar() {

 const { userId } = await auth();

  return (
    <div className="sticky select-none hidden lg:flex md:flex top-0 z-40 border-b border-slate-100 bg-zinc-200 backdrop-blur-md dark:border-gray-800 dark:bg-gray-900">
  <div className="max-w-7xl mx-auto w-full px-4 py-3 sm:px-6 ">
    <div className="flex items-center justify-between">

      <Link href="/" className="flex items-center gap-3 group">
        <span className="hidden text-xl font-semibold text-slate-700 dark:text-white sm:inline tracking-tight">Debatria</span>
      </Link>

      <div className="flex items-center gap-3 sm:gap-4">
         {userId ? 
         <>
        <Link href="/new" className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-1.5 bg-slate-100/80 hover:bg-slate-200 text-slate-700 dark:bg-slate-800/60 dark:hover:bg-slate-800/80 transition text-sm font-medium dark:text-slate-100">
            <Plus className="text-slate-600 dark:text-white" size={20} />
        </Link>
      
         </>
           : null}
        <ThemeToggle />
        <Show when="signed-out">
          <SignInButton>
            <button className="rounded-full border border-slate-200 bg-transparent cursor-pointer px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 dark:border-white/10 dark:text-slate-200 dark:hover:border-white/20 dark:hover:bg-white/5 sm:px-4">
              Sign In
            </button>
          </SignInButton>
          <SignUpButton>
            <button className="rounded-full bg-slate-800 cursor-pointer px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-700 dark:bg-slate-400 dark:text-slate-950 dark:hover:bg-slate-500 sm:px-4">
              Sign Up
            </button>
          </SignUpButton>
        </Show>
        <Show when="signed-in">
          <UserButton appearance={{ elements: { avatarBox: { width: '36px', height: '36px' } } }} />
        </Show>
      </div>

    </div>
  </div>
</div>
  )
}

export default Navbar
