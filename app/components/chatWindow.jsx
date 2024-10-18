import { useEffect, useRef, useState } from "react";
import { useChat } from "../context/ChatContext";
import ChatMessage from "./chatMessage";
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'
import { useAuth } from "../context/AuthContext";
import { Smooch } from "next/font/google";


export default function ChatWindow() {
    const {curChat} = useChat();
    const {currentUser} = useAuth();

    const endRef = useRef(null);

    const [messages, setMessages] = useState([]);
    const [timeAgo, setTimeAgo] = useState(null);

    useEffect(() => {
        if(!curChat) return;
        setMessages(curChat.messages);
    },[curChat]);

    useEffect(() => {
        TimeAgo.addLocale(en);
        const timeAgo = new TimeAgo('en-US');
        setTimeAgo(timeAgo);
    },[])

    useEffect(() => {
        endRef.current.scrollIntoView({behaviour:"smooth"});
    },[messages])

    useEffect(() => {
        setMessages([]);
    },[currentUser]);

    return(
        <div className="flex flex-col flex-auto bg-zinc-600 overflow-scroll no-scrollbar">
            {messages.map((message) => {
                return(<ChatMessage data={message} timeAgo={timeAgo}/>)
            })}
            <div ref={endRef}></div>
        </div>
    );
}