import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";

interface ChatPreview {
  instructor: string;
  lastMessage: string;
}

const ChatSidebar = ({ userChats, onSelectChat, selectedChat }: {
  userChats: ChatPreview[];
  onSelectChat: (instructor: string) => void;
  selectedChat: string;
}) => {
  return (
    <motion.div
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-64 bg-gradient-to-b from-gray-900 via-blue-900 to-red-900 text-white p-6 flex flex-col h-screen"
    >
      <motion.h2
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="text-2xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-red-400"
      >
        Your Chats
      </motion.h2>

      <ul className="flex-grow space-y-2 overflow-y-auto">
        {userChats.length > 0 ? (
          userChats.map((chat, index) => (
            <motion.li
              key={index}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 * (index + 1), duration: 0.5 }}
            >
              <div
                onClick={() => onSelectChat(chat.instructor)}
                className={`block py-2 px-4 rounded-lg cursor-pointer transition-all duration-300 ${
                  selectedChat === chat.instructor
                    ? "bg-gradient-to-r from-blue-600 to-red-600"
                    : "hover:bg-gradient-to-r hover:from-blue-600 hover:to-red-600"
                }`}
              >
                <strong>{chat.instructor}</strong>
                <p className="text-sm text-gray-300">{chat.lastMessage}</p>
              </div>
            </motion.li>
          ))
        ) : (
          <p className="text-gray-400">No chats available</p>
        )}
      </ul>

      <Link href="/account">
        <motion.p
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="block py-2 px-4 rounded-lg cursor-pointer text-gray-200 hover:bg-gradient-to-r hover:from-blue-600 hover:to-red-600 transition-all duration-300 mt-auto"
        >
          Account
        </motion.p>
      </Link>
    </motion.div>
  );
};

export default ChatSidebar;
