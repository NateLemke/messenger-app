"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { useAuth } from "./AuthContext";
import { db, storage } from "../firebase";
import { collection, doc, getDoc, getDocs, onSnapshot } from "firebase/firestore";
import { getDownloadURL, uploadBytesResumable, ref } from "@firebase/storage";

const ChatContext = createContext();

export function useChat() {
    return useContext(ChatContext);
}

export function ChatProvider({children}) {
    const {currentUser} = useAuth();

    const [userInfo, setUserInfo] = useState(null);
    const [userChats, setUserChats] = useState(null);
    const [userChatIDs, setUserChatIDs] = useState(null);
    const [chatData, setChatData] = useState([]);
    const [chatPartner, setChatPartner] = useState(null);
    const [curChatID, setCurChatID] = useState(null);
    const [curChat, setCurChat] = useState(null);

    const fetchInfo = async () => {
        try {
            let snapshot = await getDoc(doc(db,"users", currentUser.uid));
            setUserInfo(snapshot.data());

        } catch(e) {
            console.error(e);
            return
        }
    }

    const fetchChats = async () => {
        try {
            let snapshot = await getDoc(doc(db,"userchats", currentUser.uid));
            const chats = snapshot.data().chats
            setUserChats(chats);

            let IDArray = [];

            for (const chat of chats) {
                IDArray.push(chat.receiverID);
            }

            setUserChatIDs(IDArray);

        } catch(e) {
            console.error(e);
            return
        }
    }

    

    const uploadImage = async (file) => {
            const date = new Date();
            const storageRef = ref(storage, `images/${date + file.name}`);

            await uploadBytesResumable(storageRef, file);
            const downloadURL = await getDownloadURL(storageRef);

            return(downloadURL);
    }

    const clearData = () => {
        setUserInfo(null);
        setUserChats(null);
        setUserChatIDs(null);
        setChatData([]);
        setChatPartner(null);
        setCurChatID(null);
        setCurChat(null);
    }

    useEffect(() => {
        if(!curChatID) return;

        const unSub = onSnapshot(doc(db,"chats",curChatID), (res) => {
            setCurChat(res.data());
        })

        return() => {
            unSub();
        }
    }, [curChatID]);

    useEffect(() => {
        if(!userInfo) {return;}
        const unSub = onSnapshot(doc(db,"userchats", userInfo.id),
        async (res) => {
            const items = res.data().chats;

            const promises = items.map(async (item) => {
                const userDocRef = doc(db, "users", item.receiverID);
                const userDocSnap = await getDoc(userDocRef);

                const user = userDocSnap.data();

                return({...item, user});
            });

            const data = await Promise.all(promises);
            data.sort((a,b) => b.updatedAt - a.updatedAt);

            setChatData(data);
        });

        return(() => {unSub()});
    },[userInfo]);


    useEffect(() => {
        if(!currentUser) return;
        clearData();
        fetchInfo();
        fetchChats();
    },[currentUser]);

    // useEffect(() => {
    //     console.log("userinfo", userInfo);
    //     console.log("chats", userChats);
    //     console.log("IDs", userChatIDs);
    // },[userInfo, userChats])

    useEffect(() => {
        if(!curChat) return;
        console.log("Cur chat: ", curChat);
        console.log("messages", curChat.messages)
    },[curChat])

    const value = {
        userInfo,
        userChats,
        userChatIDs,
        chatData,
        chatPartner,
        curChatID,
        curChat,
        setCurChatID,
        fetchInfo,
        fetchChats,
        uploadImage,
        setChatPartner
    }

    return(
        <ChatContext.Provider value={value}>
            {children}
        </ChatContext.Provider>
    );
}