import { FaSearch } from "react-icons/fa";
import SearchUserItem from "./searchUserItem";
import { collection, query, where, getDocs, doc, setDoc, serverTimestamp, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "../firebase";
import { useState } from "react";
import { useChat } from "../context/ChatContext";

export default function SearchUsers({chatFunc}) {

    const {userInfo, userChatIDs, fetchChats} = useChat();

    const [users, setUsers] = useState([]);
    const[term, setTerm] = useState("");

    const handleSearch = async() => {

        try {
            const usersRef = collection(db, "users");

            let snapShot = null;

            if(term == "") {
                snapShot = await getDocs(usersRef);
            }
            else {
                const q = query(usersRef, where("username", ">=", term), where("username", "<=", term + '~'));
                snapShot = await getDocs(q);
            }
            
            if(snapShot.empty) {
                setUsers([]);
            }
            else {
                const userObjects = [];

                snapShot.forEach((doc) => {
                    if(doc.data().username != userInfo.username && userChatIDs.indexOf(doc.data().id) === -1) {
                        userObjects.push(doc.data());
                    }
                });

                userObjects.sort((a,b) => a.username.localeCompare(b.username));

                const userElements = userObjects.map((obj, index) => {
                    return(<SearchUserItem key={index} info={obj} addFunc = {handleAdd} chatFunc = {chatFunc}/>);
                })
                
                fetchChats();
                setUsers(userElements);
            }

        }catch (error) {
            console.error(error);
            return;
        }

    }

    const handleAdd = async (uid) => {
        const chatsRef = collection(db, "chats");
        const userChatsRef = collection(db, "userchats");

        try {
            const newChatRef = doc(chatsRef);

            await setDoc(newChatRef, {
                createdAt: serverTimestamp(),
                messages: []
            });

            await updateDoc(doc(userChatsRef, uid), {
                chats: arrayUnion({
                    chatID:newChatRef.id,
                    lastMessage: "",
                    receiverID: userInfo.id,
                    updatedAt: Date.now()
                })
            });

            await updateDoc(doc(userChatsRef, userInfo.id), {
                chats: arrayUnion({
                    chatID:newChatRef.id,
                    lastMessage: "",
                    receiverID: uid,
                    updatedAt: Date.now()
                })
            });

        } catch(error) {
            console.error(error);
            return;
        }
    }

    return(
        <div className="flex flex-col w-full h-full items-center">
            <div className="flex w-full justify-center items-center border-b border-zinc-300">
                <h1>Add Users</h1>
            </div>
            <div className="flex flex-row w-full h-8 bg-zinc-400 mt-2 items-center p-1 rounded-md">
                <FaSearch className="text-xl  hover:scale-110 cursor-pointer mr-1" onClick={handleSearch}/>
                <input type="text" placeholder="Search Users" value={term} onChange={(e) => setTerm(e.target.value)}
                className="flex-auto bg-zinc-400 focus:outline-none placeholder-zinc-300"/>
            </div>
            <div className="flex flex-col flex-auto w-full no-scrollbar overflow-scroll mt-2 items-center">
                {users}
            </div>
        </div>
    );
}