import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import ChatPane from "./chatPane";
import SideBar from "./sideBar";

export default function MainPage() {
    const {currentUser, logOut} = useAuth();

    const [menuShowing, setMenuShowing] = useState(true);

    const toggleMenu = () => {
        setMenuShowing((cur) => !cur);
    }
    return(
        <div className="flex  justify-center items-center w-full h-full sm:px-10 sm:py-5 px-4 py-2">
            <div className="bg-zinc-700 w-full h-full rounded-lg flex flex-row justify-center
            items-center overflow-hidden relative">
                <SideBar menuShowing={menuShowing} toggleMenu={toggleMenu}/>
                <ChatPane toggleMenu={toggleMenu}/>
            </div>
        </div>
    );
}