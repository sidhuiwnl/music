import SignOut from "./SignOut"

export default function Navbar(){
    return(
        <div className="z-30 flex justify-between p-3 mb-5 relative">
            <h1 className="text-2xl font-semibold">Muzer</h1>
            <SignOut/>
        </div>
    )
}