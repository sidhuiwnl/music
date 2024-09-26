import { redirect } from "next/navigation";
import { validateRequest } from "@/lib/auth";
import Image from "next/image";
import Link from "next/link";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import Image1 from "@/public/Image1.png";
import Navbar from "@/components/Navbar";


export default async function Home() {
  const { user } = await validateRequest();
  if (!user) {
    return redirect("/login");
  }

  return (
    <>
      <Navbar/>
      <div className="relative  h-screen bg-neutral-950 flex flex-col items-center justify-center antialiased">
      
      <ContainerScroll
        titleComponent={
          <>
            <Link
              href="/musicboard"
              className="relative z-10 text-lg sm:text-7xl md:text-7xl bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-600 text-center font-sans font-bold"
            >
              Let Your Audience Choose the Song
            </Link>
            <p className="text-neutral-500 max-w-lg mx-auto my-2 text-sm text-center relative z-10 mt-2 font-bold mb-4">
              Empower your audience to curate your music stream. Connect with
              fans like never before.
            </p>
          </>
        }
      >
        <Image
          src={Image1}
          alt="hero"
          height={720}
          width={1400}
          className="mx-auto rounded-2xl object-cover h-full object-left-top"
          draggable={false}
        />
      </ContainerScroll>
     
    </div>
    <BackgroundBeams className="absolute inset-0 z-0" />
    </>
    
  );
}