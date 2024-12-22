"use client";
import { useEffect, useState } from "react";
import Pusher from "pusher-js";
import styles from "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
} from "@chatscope/chat-ui-kit-react";
import Head from "next/head";

interface MessageData {
  sender: string;
  message: string;
  date?: string;
}

interface ChatPreview {
  instructor: string;
  lastMessage: string;
}

const Chat = () => {
  const [instructorName, setInstructorName] = useState<string>("");
  const [messages, setMessages] = useState<MessageData[]>([]);
  const [message, setMessage] = useState<string>("");
  const [channelName, setChannelName] = useState<string | null>(null);
  const [selectedInstructor, setSelectedInstructor] = useState<string>("");
  const [userChats, setUserChats] = useState<ChatPreview[]>([]);

  const fetchUserChats = async () => {
    try {
      // Fetch the current username
      const usernameResponse = await fetch("http://localhost:3000/chat/username", {
        method: "GET",
        credentials: "include",
      });
      const usernameData = await usernameResponse.json();
  
      if (!usernameResponse.ok) {
        console.error("Failed to fetch username:", usernameData.message);
        return;
      }
  
      const currentUsername = usernameData.username;
  
      // Fetch all chats for the user
      const response = await fetch("http://localhost:3000/chat/getAllUserChats", {
        method: "GET",
        credentials: "include",
      });
      const chatsData = await response.json();
  
      if (response.ok) {
        // Deduplicate chats based on the recipient
        const uniqueChatsMap = new Map();
  
        chatsData.forEach((chat: any) => {
          const otherUser =
            chat.sender === currentUsername ? chat.recipient : chat.sender;
  
          if (!uniqueChatsMap.has(otherUser)) {
            const lastMessage =
              chat.message.length > 0
                ? chat.message[chat.message.length - 1]
                : null;
  
            uniqueChatsMap.set(otherUser, {
              instructor: otherUser,
              lastMessage: lastMessage
                ? `${lastMessage.sender_name}: ${lastMessage.message}`
                : "No messages yet",
            });
          }
        });
  
        // Convert map to array for rendering
        const uniqueChats = Array.from(uniqueChatsMap.values());
        setUserChats(uniqueChats);
      } else {
        console.error("Failed to fetch user chats:", chatsData.message);
      }
    } catch (error) {
      console.error("Error fetching user chats:", error);
    }
  };
  

  const fetchChatHistory = async (channelName: string) => {
    try {
      const response = await fetch(`http://localhost:3000/chats/channel/${channelName}`);
      const result = await response.json();
      if (response.ok) {
        const fetchedMessages = result.messages.map((msg: any) => ({
          sender: msg.sender_name,
          message: msg.message,
          date: msg.date,
        }));
        setMessages(fetchedMessages);
      }
    } catch (error) {
      console.error("Error fetching chat history:", error);
    }
  };

  useEffect(() => {
    fetchUserChats();
    if (!channelName) return;

    const pusher = new Pusher("56d0ad2a5a08355cfb9d", { cluster: "eu" });
    const channel = pusher.subscribe(channelName);
    fetchChatHistory(channelName);

    channel.bind("message", (data: MessageData) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    return () => {
      pusher.unsubscribe(channelName);
    };
  }, [channelName]);

  const submitMessage = async (messageText: string) => {
    if (!messageText.trim()) return;
    try {
      const response = await fetch("http://localhost:3000/chat/PrivateChat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ instructorName, message: messageText }),
      });
      const result = await response.json();
      if (response.ok) {
        if (result.channel) setChannelName(result.channel);
        setMessage("");
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleChatSelect = (instructor: string) => {
    setInstructorName(instructor);
    setChannelName(null);
    setMessages([]);
    setSelectedInstructor(instructor);
  };

  const handleInstructorSubmit = () => {
    if (!selectedInstructor.trim()) return;
    setInstructorName(selectedInstructor);
    setChannelName(null);
    setMessages([]);
  };

  return (
    <>
      <Head>
        <title>Chat App</title>
        <link rel="stylesheet" href={styles} />
      </Head>
      <div style={{ display: "flex", height: "100vh", fontFamily: "'Roboto', sans-serif" }}>
        {/* Sidebar */}
        <div
          style={{
            width: "25%",
            backgroundColor: "#2c3e50",
            color: "#ecf0f1",
            padding: "20px",
            overflowY: "auto",
          }}
        >
          <h3 style={{ borderBottom: "2px solid #ecf0f1", paddingBottom: "10px" }}>Your Chats</h3>
          {userChats.length > 0 ? (
            <ul style={{ listStyle: "none", padding: 0 }}>
              {userChats.map((chat, index) => (
                <li
                  key={index}
                  onClick={() => handleChatSelect(chat.instructor)}
                  style={{
                    padding: "10px",
                    marginBottom: "10px",
                    borderRadius: "5px",
                    backgroundColor:
                      instructorName === chat.instructor ? "#34495e" : "transparent",
                    cursor: "pointer",
                    transition: "background-color 0.3s",
                  }}
                >
                  <strong>{chat.instructor}</strong>
                  <p style={{ fontSize: "0.9rem", color: "#bdc3c7" }}>{chat.lastMessage}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No chats available</p>
          )}
        </div>

        {/* Chat Area */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", backgroundColor: "#ecf0f1" }}>
          {/* User Selection Bar */}
          <div style={{ padding: "10px", backgroundColor: "#bdc3c7", display: "flex", alignItems: "center" }}>
            <input
              type="text"
              value={selectedInstructor}
              onChange={(e) => setSelectedInstructor(e.target.value)}
              placeholder="Enter username"
              style={{
                padding: "8px",
                borderRadius: "5px",
                marginRight: "10px",
                flex: 1,
                outline: "none",
                border: "1px solid #7f8c8d",
              }}
            />
            <button
              onClick={handleInstructorSubmit}
              style={{
                padding: "8px 15px",
                backgroundColor: "#2c3e50",
                color: "#ecf0f1",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Start Chat
            </button>
          </div>

          {/* Main Chat Section */}
<div
  style={{
    flex: 1,
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#ecf0f1",
  }}
>
  {instructorName ? (
    <>
      {/* Messages Display */}
      <div
        style={{
          flex: 1,
          padding: "20px",
          overflowY: "auto",
          backgroundColor: "#ecf0f1",
        }}
      >
        {messages.length === 0 ? (
          <p style={{ textAlign: "center", color: "#7f8c8d" }}>No messages yet</p>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              style={{
                marginBottom: "15px",
                padding: "10px",
                borderRadius: "5px",
                backgroundColor: msg.sender === instructorName ? "#bdc3c7" : "#ecf0f1",
                alignSelf: msg.sender === instructorName ? "flex-start" : "flex-end",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
              }}
            >
              <strong>{msg.sender}: </strong>
              <span>{msg.message}</span>
              <div style={{ fontSize: "12px", color: "#7f8c8d" }}>{msg.date}</div>
            </div>
          ))
        )}
      </div>

      {/* Message Input */}
      <div
        style={{
          padding: "20px",
          borderTop: "2px solid #bdc3c7",
          backgroundColor: "#ecf0f1",
        }}
      >
        <div style={{ display: "flex", gap: "10px" }}>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            style={{
              flex: 1,
              padding: "10px",
              borderRadius: "5px",
              border: "1px solid #bdc3c7",
              fontSize: "16px",
            }}
          />
          <button
            onClick={() => submitMessage(message)}
            style={{
              padding: "10px 20px",
              backgroundColor: "#2980b9",
              color: "#ecf0f1",
              borderRadius: "5px",
              border: "none",
              cursor: "pointer",
            }}
          >
            Send
          </button>
        </div>
      </div>
    </>
  ) : (
    <div
      style={{
        flex: 1,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: "#7f8c8d",
        fontSize: "18px",
      }}
    >
      Select a chat to view messages
    </div>
  )}
</div>

        </div>
      </div>
    </>
  );
};

export default Chat;
