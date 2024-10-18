"use client"
import LoginPage from "./components/loginPage";
import MainPage from "./components/mainPage";
import { useAuth } from "./context/AuthContext";


export default function Home() {

  const {currentUser} = useAuth();

  return (
    <div className="flex items-center justify-center h-screen w-screen bg-gradient-to-r 
    from-blue-900 to to-blue-500 text-white">
      <main className="flex h-full w-full">
        {!currentUser && <LoginPage/>}
        {currentUser && <MainPage/>}
      </main>
    </div>
  );
}
