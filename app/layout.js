import "./globals.css";
import { AuthProvider } from "./context/AuthContext";
import { Open_Sans } from "next/font/google";
import { ChatProvider } from "./context/ChatContext";


const font = Open_Sans({ weight: '400',subsets: ["latin"] });

export const metadata = {
  title: "Messenger",
  description: "A messaging app.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${font.className} antialiased`}
      >
        <AuthProvider>
          <ChatProvider>
            {children}
          </ChatProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
