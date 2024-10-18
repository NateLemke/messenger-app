import { useRef, useState } from "react";
import { useChat } from "../context/ChatContext";
import { db } from "../firebase";
import { collection, getDocs, where, query, setDoc, doc } from "firebase/firestore";


export default function EditUser() {

    const {userInfo, fetchInfo, uploadImage} = useChat();
    const fileInput = useRef(null);

    const [image, setImage] = useState(userInfo && userInfo.avatar? userInfo.avatar : "/defaultUser.png");
    const [username, setUsername] = useState(userInfo && userInfo.username? userInfo.username: "");
    const [bio, setBio] = useState(userInfo && userInfo.bio? userInfo.bio: "");
    const [error, setError] = useState("");

    const handleEdit = async () => {
        let newInfo = JSON.parse(JSON.stringify(userInfo));

        if(username == userInfo.username && bio == userInfo.bio && !fileInput.current.files) {
            return;
        }

        if(!username) {
            setError("You must enter a username");
            return;
        }

        try {
            if(username != userInfo.username) {
                const usersRef = collection(db, "users");
    
                const q = query(usersRef, where("username", "==", username));
                const snapShot = await getDocs(q);
    
                if(!snapShot.empty) {
                    setError("Username is not available");
                    return;
                }
    
                newInfo.username = username;
            }
    
            if(fileInput.current.files && fileInput.current.files[0]) {
                const imageURL = await uploadImage(fileInput.current.files[0]);
    
                newInfo.avatar = imageURL;
            }

            if(bio != userInfo.bio) {
                newInfo.bio = bio;
            }

            const userRef = doc(db, "users", userInfo.id);

            await setDoc(userRef, newInfo, {merge:true});
            setError("");
            fetchInfo();

        } catch(error) {
            setError("Failed to update user");
            console.error(error);
            return;
        }

    }

    const reset = () => {
        setImage(userInfo && userInfo.avatar? userInfo.avatar : "/defaultUser.png");
        setUsername(userInfo && userInfo.username? userInfo.username: "");
        setBio(userInfo && userInfo.bio? userInfo.bio: "");
        fileInput.current.value = null;
        setError("");
    }

    const photoChange = (e) => {
        if(e.target.files && e.target.files[0]) {
            setImage(URL.createObjectURL(e.target.files[0]));
        }
    }

    return(
        <div className="flex flex-col w-full h-full items-center">
            <div className="flex w-full justify-center items-center border-b border-zinc-300 mb-3">
                <h1>Edit Profile</h1>
            </div>
            <div className="flex flex-col w-full justify-center items-center overflow-scroll no-scrollbar">
                <div className="flex flex-col justify-center items-center border-b border-zinc-200 pb-2 mb-2 max-sm:pt-5">
                    <img className="w-14 h-14 rounded-full mb-1" src={image}/>
                    <label htmlFor="photoInput" className="place-self-start mb-1 max-sm: text-sm">Upload Photo:</label>
                    <input type="file" name="photoInput" className="w-full" accept="image/png, image/jpg"
                    onChange={photoChange} ref={fileInput}/>
                </div>
                <div className="flex flex-col w-full justify-center items-center border-b border-zinc-200 pb-2 mb-2">
                    <div className="flex w-full sm:flex-col flex-row items-center">
                        <label htmlFor="nameInput" className="place-self-start whitespace-nowrap max-sm:text-sm">
                            Edit Username:
                        </label>
                        <input type="text" className="w-full bg-zinc-400 text-white focus:outline-none
                        rounded-md pl-2" value = {username} onChange={(e) => setUsername(e.target.value)}/>
                    </div>
                    <label htmlFor="bioInput" className="place-self-start max-sm:text-sm">Edit Bio:</label>
                    <textarea className="w-full bg-zinc-400 text-white focus:outline-none
                    rounded-md pl-2" value = {bio} onChange={(e) => setBio(e.target.value)} maxLength={50}/>
                    <p className="text-sm text-red-600">{error}</p>
                </div>
                <div className="flex flex-row w-full justify-end items-center pr-2 gap-3">
                <button className="border-none text-white rounded-md focus:outline-none
                    bg-red-500 hover:bg-red-600" onClick={reset}>
                        <h3 className="p-2">Cancel</h3>
                    </button>
                    <button className="border-none text-white rounded-md focus:outline-none
                    bg-indigo-500 hover:bg-indigo-600" onClick={handleEdit}>
                        <h3 className="p-2">Apply</h3>
                    </button>
                </div>
            </div>
        </div>
    );
}