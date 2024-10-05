import SignOut from "./SignOut"

export default function Navbar(){
    return(
        <div className="z-30 flex justify-between p-3 mb-5 relative">
            <h1 className="text-3xl font-extrabold tracking-tighter">Muzer</h1>
            <SignOut/>
        </div>
    )
}