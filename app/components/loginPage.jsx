"use client"
import { useState } from "react";
import { IoMdChatbubbles } from "react-icons/io";
import { Protest_Strike } from "next/font/google";
import LoginWindow from "./loginWindow";
import RegisterWindow from "./registerWindow";

const font = Protest_Strike({ weight: '400',subsets: ["latin"] });

export default function LoginPage() {

    const [showLogin, setShowLogin] = useState(true);

    const toggleLogin = () => {
        setShowLogin((cur) => !cur);
    }

    return(
        <div className="flex w-full h-full justify-center items-center relative">
            <div id="logo" className="flex flex-row text-3xl absolute left-5 top-5">
                <IoMdChatbubbles className="mt-1"/>
                <h1 className={`${font.className}`}>Messenger</h1>
            </div>
            <div id="windowContainer" className={`flex justify-center items-center`}>
                <LoginWindow showingLogin={showLogin} toggleLogin={toggleLogin}/>
                <RegisterWindow showingLogin={showLogin} toggleLogin={toggleLogin}/>
            </div>
        </div>
    );
}