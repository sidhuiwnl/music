import Link from "next/link";
import { GitHubLogoIcon } from "@radix-ui/react-icons";

export default async function Page() {
	return (
		<div className="w-screen h-screen flex flex-col justify-center items-center">
			<h1 className="font-extrabold text-7xl mb-5 tracking-tighter subpixel-antialiased text-white ">Sign In.</h1>
			
				<Link  href="/login/github">
					<GitHubLogoIcon
						className="w-10 h-10"
					/>
				</Link>
			
			
		</div>
	);
}
