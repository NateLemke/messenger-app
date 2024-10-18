import ChatWindow from "./chatWindow";
import MessageInput from "./messageInput";
import TopBar from "./topBar";

export default function ChatPane({toggleMenu}) {
    return(
        <div className="flex flex-col h-full sm:w-3/4 w-full">
                <TopBar toggleMenu={toggleMenu}/>
                <ChatWindow/>
                <MessageInput/>
        </div>
    );
}