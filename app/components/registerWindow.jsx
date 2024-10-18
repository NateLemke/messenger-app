import React, {useState} from "react";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase";
import { addDoc, collection, doc, getDocs, query, setDoc, where } from "firebase/firestore";

export default function RegisterWindow({showingLogin, toggleLogin}) {

    const {signUp} = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [error, setError] = useState("");

    const handleSignUp = async() => {
        if(!email || !password || !username) {
            setError("Please fill out all fields");
            return;
        }

        const usersRef = collection(db, "users");

        const q = query(usersRef, where("username", "==", username));
        const snapShot = await getDocs(q);

        if(!snapShot.empty) {
            setError("Username is not available");
            return;
        }


        try{
            const res = await signUp(email, password);

            const uid = res.user.uid;

            await setDoc(doc(db, "users", uid), {
                username,
                id:uid,
                avatar:null,
                bio: ""
            });

            await setDoc(doc(db, "userchats", uid), {
                chats:[]
            });

        }catch(e) {
            setError("Failed to Create Account");
            console.error(e)
        }
    }

    return(
        <div className={`flex flex-col justify-center items-center flex-1 sm:min-w-[50ch] w-[30ch] max-sm:mt-10
        duration-300 ${!showingLogin? "opacity-100 translate-y-0": "opacity-0 -translate-y-[50rem]"} bg-zinc-700 
        absolute rounded-md sm:p-10 p-5 text-zinc-300`}>
            <h2 className="text-2xl text-white font-bold">Sign Up!</h2>
            <div className="flex flex-col w-full justify-center items-left">
                <label htmlFor="emailInput">Email</label>
                <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)}
                className="w-full p-2 pl-3 rounded-md bg-zinc-900 mt-1 mb-2 text-white 
                focus:outline-none" name="emailInput"/>
                <label htmlFor="passwordInput">Password</label>
                <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)}
                className="w-full p-2 pl-3 rounded-md bg-zinc-900 mt-1 mb-2 text-white 
                focus:outline-none" name="passwordInput"/>
                <label htmlFor="usernameInput">Username</label>
                <input type="text" value={username} onChange={(e)=>setUsername(e.target.value)}
                className="w-full p-2 pl-3 rounded-md bg-zinc-900 mt-1 mb-2 text-white 
                focus:outline-none" name="passwordInput"/>
                <h2 className="text-red-500 mb-2">{error}</h2>
                <button className="w-full p-2 text-white bg-indigo-500 hover:bg-indigo-600
                rounded-md mb-3" onClick={handleSignUp}>
                    <h2>Create Account</h2>
                </button>
                <h3 className="text-blue-400 hover:underline mt-3 cursor-pointer" onClick={toggleLogin}>
                    I Already Have an Account
                </h3>
            </div>
        </div>
    );
}