import { useState } from "react";
import SelfProfile from "./selfProfile";
import { HiUserAdd } from "react-icons/hi";
import { IoMdChatbubbles } from "react-icons/io";
import { FaWindowClose } from "react-icons/fa";
import ChatList from "./chatList";
import EditUser from "./editUser";
import SearchUsers from "./searchUsers";

export default function SideBar({menuShowing, toggleMenu}) {
    const [showChatList, setShowChatList] = useState(true);
    const [showSearchUsers, setShowSearchUsers] = useState(false);
    const [showEditUser, setShowEditUser] = useState(false);

    const openChatList = () => {
        setShowSearchUsers(false);
        setShowEditUser(false);
        setShowChatList(true);
    }

    const openEditUser = () => {
        setShowSearchUsers(false);
        setShowChatList(false);
        setShowEditUser(true);
    }

    const openSearchUsers = () => {
        setShowEditUser(false);
        setShowChatList(false);
        setShowSearchUsers(true);
    }

    return(
        <div className={`max-sm:absolute flex flex-col h-full sm:w-1/4 sm:min-w-72 w-full bg-zinc-700 p-2
        ${menuShowing?"translate-x-0":"-translate-x-full"} duration-300 max-sm:top-0 max-sm:left-0 z-20`}>
            <div className="flex sm:hidden flex-row justify-end text-zinc-300 text-xl">
                <FaWindowClose className="hover:scale-110 hover:opacity-50 cursor-pointer mr-1"
                onClick={toggleMenu}/>
            </div>
            <SelfProfile openEdit={openEditUser}/>
            <div id="Tabs" className="flex flex-row w-full h-8 text-2xl">
                <div className="flex justify-center items-center w-1/2 h-full bg-zinc-600 
                hover:bg-zinc-700 cursor-pointer border border-zinc-500 rounded-t-md py-2"
                onClick={openChatList}>
                    <IoMdChatbubbles/>
                </div>
                <div className="flex justify-center items-center w-1/2 h-full bg-zinc-600 
                hover:bg-zinc-700 cursor-pointer border border-zinc-500 rounded-t-md py-2"
                onClick={openSearchUsers}>
                    <HiUserAdd/>
                </div>
            </div>
            <div className="flex flex-auto bg-zinc-500 rounded-b-md overflow-hidden px-2 pb-1 
            text-zinc-200">
                {showChatList && <ChatList/>}
                {showSearchUsers && <SearchUsers chatFunc = {openChatList}/>}
                {showEditUser && <EditUser/>}
            </div>
        </div>
    );
}