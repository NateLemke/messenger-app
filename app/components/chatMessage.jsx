import { useChat } from "../context/ChatContext";


export default function ChatMessage({data, timeAgo}) {
    const {userInfo} = useChat();

    return(
        <div className={`flex flex-col justify-center items-center p-2 max-w-[70%] m-2 rounded-md 
            ${userInfo && data.senderID === userInfo.id?"bg-zinc-500 self-end": "bg-blue-500 self-start"}`}>
            {data.image && <img src={data.image} className="w-64 h-44 rounded-md object-contain"/>}
            {data.text && <p className="sm:text-lg text-sm">{data.text}</p>}
            <span className={`text-xs text-zinc-200 ${userInfo && data.senderID === userInfo.id?"self-end": "self-start"}`}>
                {timeAgo.format(data.createdAt.toDate())}
            </span>
        </div>
    );
}