import { IoLogOutSharp } from "react-icons/io5";
import { FaUserEdit } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { useChat } from "../context/ChatContext";

export default function SelfProfile({openEdit}) {
    const {logOut} = useAuth();
    const {userInfo} = useChat();

    return(
        <div className="flex flex-row w-full min-h-20 border-b mb-2 border-zinc-500 items-center">
            <img className="w-14 h-14 rounded-full mr-2" src={userInfo && userInfo.avatar?userInfo.avatar:"/defaultUser.png"}/>
            <div className="flex flex-col flex-auto">
                <div className="flex flex-row items-center justify-between">
                    <h2>{userInfo?userInfo.username:""}</h2>
                    <div className=" gap-1 flex flex-row text-2xl">
                        <FaUserEdit className="hover:scale-110 hover:opacity-50 cursor-pointer"
                        onClick={openEdit}/>
                        <IoLogOutSharp className="hover:scale-110 hover:opacity-50 cursor-pointer"
                        onClick={logOut}/>
                    </div>
                </div>
                <h3 className="text-zinc-400 text-xs">
                    {userInfo?userInfo.bio:""}
                </h3>
            </div>
        </div>
    );
}