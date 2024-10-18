import { useChat } from "../context/ChatContext";


export default function ChatListItem({info}) {

    const {setChatPartner, setCurChatID} = useChat();

    const handleClick = () => {
        setChatPartner(info.user);
        setCurChatID(info.chatID);
    }

    return(
        <div className="flex flex-row w-full items-center min-h-16 bg-zinc-500 px-2
        hover:bg-zinc-600 cursor-pointer border-b border-zinc-400" onClick={handleClick}>
            <img src={info.user.avatar?info.user.avatar:"/defaultUser.png"} className="w-10 h-10 rounded-full"></img>
            <div className="flex flex-col ml-3">
                <h2 className="text-md">{info.user.username}</h2>
                <h2 className="text-xs text-zinc-400">{info.lastMessage}</h2>
            </div>
        </div>
    );
}