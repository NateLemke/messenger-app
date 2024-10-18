import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function LoginWindow({showingLogin, toggleLogin}) {

    const {signIn} = useAuth()

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSignIn = async () => {
        if(!email || !password) {
            setError("You must enter an email and password");
            return;
        }
        try {
            await signIn(email,password);
        } catch(e) {
            setError("Failed to Login");
            console.error(e);
        }
    }

    const handleGuest = async () => {
        try {
            await signIn("guest@user.com", "password");
        } catch(e) {
            setError("Failed to Login");
            console.error(e);
        }
    }

    return(
        <div className={`flex flex-col justify-center items-center flex-1 sm:min-w-[50ch] w-[30ch]  max-sm:mt-10
        duration-300 ${showingLogin? "opacity-100 translate-y-0": "opacity-0 -translate-y-[50rem]"} bg-zinc-700 
        absolute rounded-md sm:p-10 p-5 text-zinc-400`}>
            <h2 className="text-2xl text-white font-bold">Welcome!</h2>
            <div className="flex flex-col w-full justify-center items-left">
                <label htmlFor="emailInput">Email</label>
                <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)}
                className="w-full p-2 pl-3 rounded-md bg-zinc-900 mt-1 mb-2 text-white 
                focus:outline-none" name="emailInput"/>
                <label htmlFor="passwordInput">Password</label>
                <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)}
                className="w-full p-2 pl-3 rounded-md bg-zinc-900 mt-1 mb-2 text-white 
                focus:outline-none" name="passwordInput"/>
                <h2 className="text-red-500 mb-2">{error}</h2>
                <button className="w-full p-2 text-white bg-indigo-500 hover:bg-indigo-600
                rounded-md mb-3" onClick={handleSignIn}>
                    <h2>Sign In</h2>
                </button>
                <button className="w-full p-2 text-white bg-indigo-500 hover:bg-indigo-600
                rounded-md" onClick={handleGuest}>
                    <h2>Guest Sign In</h2>
                </button>
                <h3 className="text-blue-400 hover:underline mt-3 cursor-pointer" onClick={toggleLogin}>
                    Create an Account
                </h3>
            </div>
        </div>
    );
}