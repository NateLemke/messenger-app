import { useChat } from "../context/ChatContext";
import ChatListItem from "./chatListItem";


export default function ChatList() {

    let {chatData} = useChat();

    return(
        <div className="flex flex-col w-full h-full items-center">
            <div className="flex w-full justify-center items-center border-b border-zinc-300">
                <h1>Chat List</h1>
            </div>
            <div className="flex flex-auto w-full flex-col overflow-scroll no-scrollbar">
                {chatData.map((data) => <ChatListItem info = {data} key={data.createdAt}/>)}
            </div>
        </div>
    );
}