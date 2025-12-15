import Link from "next/link";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pron 主页',
};
export default function Home() {
  return (
    <div className="h-full">
      <header className="fixed top-0 h-[60px] flex items-center w-full border-b-2 px-2 bg-white/50">
        <div className="absolute left-[50%] translate-x-[-50%] text-[#ffffff80] font-oswald">here is you're best choices</div>
        <Link href={"/login"} className="bg-blue-400 hover:scale-105 p-2 rounded text-white ml-auto">Login</Link>
      </header>
      <main className="mt-[60px] flex h-screen items-center justify-center font-inter bg-black px-4">
        <Link href={"/dashboard"} className="text-6xl font-karrik bg-blue-500 p-4 rounded-xl hover:scale-105 duration-300">Get Start</Link>
      </main>
    </div>
  );
}
