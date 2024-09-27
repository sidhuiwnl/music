import { Button } from "./ui/button";
import { Input } from "./ui/input";

export default function Joining() {
  return (
    <div className="flex flex-col justify-center items-center mt-20 p-8 rounded-lg shadow-md max-w-xl mx-auto">
      <h1 className="text-4xl font-bold text-center mb-4">Ready to Transform Your Streams?</h1>
      <p className="text-neutral-500 max-w-lg mx-auto my-2 text-base text-center relative z-10 font-medium mb-6">
        Join MusicStreamChoice today and create unforgettable experiences.
      </p>
      <div className="flex space-x-2 w-full max-w-md">
        <Input
          className="flex-grow"
          type="text"
          placeholder="Enter your email"
        />
        <Button className="px-6">Signup</Button>
      </div>
    </div>
  );
}
