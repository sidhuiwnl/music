import { Input } from "./ui/input";

export default function Joining() {
  return (
    <div className="flex flex-col justify-center items-center mt-20 p-8 rounded-lg shadow-md max-w-lg mx-auto">
      <h1 className="font-extrabold text-4xl mb-3 tracking-tighter subpixel-antialiased text-white">
        Ready to Transform Your Streams?
      </h1>
      <p className="subpixel-antialiased font-bold text-lg max-w-lg text-center tracking-tighter relative z-10 mx-auto my-2 mb-6">
        Join MusicStreamChoice today and create unforgettable experiences.
      </p>
      <div className="flex space-x-2 w-full max-w-xl">
        <Input
          className="flex-grow"
          type="text"
          placeholder="Enter your email"
        />
        <button className="px-4 py-2 font-extrabold tracking-tighter rounded-md border border-black bg-white text-black text-sm hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition duration-200 subpixel-antialiased">
          SignIn
        </button>
      </div>
    </div>
  );
}
