import StreamView from "@/components/StreamView";
import { validateRequest } from "@/lib/auth";



export default async function MusicBoard() {
  const { user } = await validateRequest();
  if (user) {
    return (
      <div className="h-screen w-screen">
        
        <StreamView userId={user?.id} />
        
      </div>
    );
  }
}
