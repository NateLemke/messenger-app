
export default function SearchUserItem({info, addFunc, chatFunc}) {
    const handleAdd = (uid) => {
        addFunc(uid);
        chatFunc();
    }

    return(
        <div className="flex flex-row w-full min-h-16 items-center justify-start border-b p-2
             border-zinc-300">
            <img src={info && info.avatar?info.avatar:"/defaultUser.png"} className="w-10 h-10 rounded-full mr-2"></img>
            <div className="flex flex-row flex-auto justify-between items-center mr-2">
                <h2>{info && info.username?info.username:""}</h2>
                <button className="border-none text-white rounded-md focus:outline-none
                bg-indigo-500 hover:bg-indigo-600" onClick={() => handleAdd(info.id)}>
                    <p className="text-xl text-white px-2">+</p>
                </button>
            </div>
        </div>
    );
}