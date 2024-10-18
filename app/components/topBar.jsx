import { IoMenu } from "react-icons/io5";
import { useChat } from "../context/ChatContext";

export default function TopBar({toggleMenu}) {

    let {chatPartner} = useChat();

    return(
        <div className="w-full min-h-20 bg-zinc-700 flex flex-row px-2 justify-center items-center relative">
            <div className="sm:hidden flex flex-row h-full items-center mr-auto">
                <IoMenu className=" text-3xl cursor-pointer hover:scale-110 
                hover:opacity-50" onClick={toggleMenu}/>
            </div>
            {chatPartner && <div className="flex flex-row justify-center items-center max-w-80 max-sm:mx-auto max-sm:absolute ml-2">
                <img className="sm:w-14 sm:h-14 w-10 h-10 rounded-full mr-2" src={chatPartner.avatar?chatPartner.avatar:"/defaultUser.png"}/>
                <div className="flex flex-col">
                    <h2 className="max-sm:text-xs">{chatPartner.username}</h2>
                    <h3 className="text-zinc-400 text-xs">
                    {chatPartner.bio}
                    </h3>
                </div>
            </div>}
        </div>
    );
}