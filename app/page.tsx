import { redirect } from "next/navigation";
import { validateRequest } from "@/lib/auth";
import SignOut from "@/components/SignOut";
import Link from "next/link";
import { BackgroundBeams } from "@/components/ui/background-beams";


export default async function Home() {
  const { user } = await validateRequest();
  if (!user) {
    return redirect("/login");
  }
  return (
    <div className="relative w-screen h-screen  rounded-md bg-neutral-950 flex flex-col items-center justify-center antialiased">
     
      <div className="relative z-20  mx-auto p-4 ">
        <h1 className="font-bold text-4xl mb-4">Hi, {user.username}!</h1>
        <Link className="relative z-10 text-lg md:text-7xl  bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-600  text-center font-sans font-bold" href={"/musicboard"}>
        Let Your Audience Choose the Song
        </Link>
        <p className="text-neutral-500 max-w-lg mx-auto my-2 text-sm text-center relative z-10 mt-2 font-bold">Empower your audience to curate your music stream. Connect with fans like never before.</p>
        <div className="flex space-x-3">
          <SignOut />
          <Link href={"/musicboard"} className="px-4 py-2 font-bold rounded-md border border-black bg-white text-black text-sm ">Get Started</Link>
        </div>
        
      </div>

     
      <BackgroundBeams className="absolute inset-0 z-10" />
    </div>
  );
}


