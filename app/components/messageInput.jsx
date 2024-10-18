import { useRef, useState } from "react";
import { MdInsertPhoto } from "react-icons/md";
import { MdEmojiEmotions } from "react-icons/md";
import { useChat } from "../context/ChatContext";
import { arrayUnion, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import EmojiPicker from "emoji-picker-react";

export default function MessageInput() {
    const {curChatID, chatPartner, userInfo, uploadImage} = useChat();

    const photoRef = useRef(null);

    const [text, setText] = useState("");
    const [showEmojis, setShowEmojis] = useState(false);

    const toggleEmojis = () => {
        setShowEmojis((cur) => !cur);
    }

    const handleEmoji = (e) => {
        setText((cur) => cur + e.emoji);
        setShowEmojis(false);
    }

    const handlePhoto = async () => {
        if(!photoRef.current.files || !curChatID) return;

        const imageURL = await uploadImage(photoRef.current.files[0]);

        try {
            const chatRef = doc(db, "chats", curChatID);
            await updateDoc(chatRef, {
                messages: arrayUnion({
                    senderID: userInfo.id,
                    text: null,
                    createdAt: new Date(),
                    image: imageURL
                })
            });

            const ids = [userInfo.id, chatPartner.id];

            ids.forEach(async (id) => {
                const userChatsRef = doc(db, "userchats", id);
                const snapShot = await getDoc(userChatsRef);

                if(snapShot.exists) {
                    const data = snapShot.data();

                    const chatIndex = data.chats.findIndex(
                        (c) => c.chatID == curChatID
                    );

                    data.chats[chatIndex].lastMessage = "image";
                    data.chats[chatIndex].updatedAt = Date.now();

                    await updateDoc(userChatsRef, {
                        chats:data.chats
                    });
                }
            });
            
        } catch (error) {
            console.error(error);
            return;
        }

        photoRef.current.value = null;
    } 

    const sendTextMessage = async () => {
        if(text === "" || !curChatID) return;

        try {
            const chatRef = doc(db, "chats", curChatID);
            await updateDoc(chatRef, {
                messages: arrayUnion({
                    senderID: userInfo.id,
                    text: text,
                    createdAt: new Date(),
                    image: null
                })
            });

            const ids = [userInfo.id, chatPartner.id];

            ids.forEach(async (id) => {
                const userChatsRef = doc(db, "userchats", id);
                const snapShot = await getDoc(userChatsRef);

                if(snapShot.exists) {
                    const data = snapShot.data();

                    const chatIndex = data.chats.findIndex(
                        (c) => c.chatID == curChatID
                    );

                    data.chats[chatIndex].lastMessage = text;
                    data.chats[chatIndex].updatedAt = Date.now();

                    await updateDoc(userChatsRef, {
                        chats:data.chats
                    });
                }
            });
            
        } catch (error) {
            console.error(error);
            return;
        }

        setText("");
    }

    const handleEnter = (e) => {
        if(!(e.key === "Enter")) return;
        sendTextMessage();
    }

    return(
        <div className="w-full h-12 bg-zinc-600 flex justify-center items-center p-3">
            <div className="flex w-full h-8 flex-row-reverse bg-zinc-500 rounded-md items-center">
                <button className="border-none text-white focus:outline-none h-full
                bg-indigo-500 hover:bg-indigo-600 rounded-r-md" onClick={sendTextMessage}>
                    <p className="text-lg text-white px-2">Send</p>
                </button>
                <div className="border-l flex flex-row items-center text-xl border-zinc-300">
                    <label htmlFor="photoInput">
                        <MdInsertPhoto className="cursor-pointer hover:scale-110 hover:opacity-50 mx-1"/>
                    </label>
                    <input type="file" id="photoInput" name="photoInput" className="hidden" accept="image/png, image/jpg"
                    ref={photoRef} onChange={handlePhoto}/>
                    <div className="relative">
                        <MdEmojiEmotions className="cursor-pointer hover:scale-110 hover:opacity-50 mr-1"
                        onClick={toggleEmojis}/>
                        <div className="absolute sm:right-0 -right-12 bottom-7  z-50">
                            <EmojiPicker open={showEmojis} onEmojiClick={handleEmoji}
                            height={350} width={250} emojiStyle="native"/>
                        </div>
                    </div>
                </div>
                <input type="text" className="flex-auto bg-zinc-500 focus:outline-none ml-2 max-sm:text-xs"
                placeholder="Type your message" value={text} onChange={(e) => setText(e.target.value)}
                onKeyDown={handleEnter}/>
            </div>
        </div>
    );
}