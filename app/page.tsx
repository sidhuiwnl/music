import { redirect } from "next/navigation";
import { validateRequest } from "@/lib/auth";
import SignOut from "@/components/SignOut";



export default async function Home() {
  const { user } = await validateRequest();
  if (!user) {
		return redirect("/login");
	}
	return (
    <div>
       <h1>Hi, {user.username}!</h1>
       <SignOut/>
    </div>
   
  );
}
