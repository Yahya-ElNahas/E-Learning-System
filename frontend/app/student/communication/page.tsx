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
import "../../../styles/communication.css";

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
  const [instructorName, setInstructorName] = useState<string>(""); // Instructor name
  const [messages, setMessages] = useState<MessageData[]>([]);
  const [message, setMessage] = useState<string>("");
  const [channelName, setChannelName] = useState<string | null>(null);
  const [selectedInstructor, setSelectedInstructor] = useState<string>("");
  const [userChats, setUserChats] = useState<ChatPreview[]>([]); // Sidebar chats

  // Fetch all user chats for the sidebar (No Auth)
  const fetchUserChats = async () => {
    try {
      const response = await fetch(`http://localhost:3000/chat/getAllUserChats`, {
        method: "GET",
        credentials: "include"
      });
      const result = await response.json();
  
      if (response.ok) {
        const chatsWithLastMessage = result.map((chat: any) => {
          const lastMessage =
            chat.message.length > 0 ? chat.message[chat.message.length - 1] : null;
          return {
            instructor: chat.sender === "soso" ? chat.recipient : chat.sender,
            lastMessage: lastMessage ? `${lastMessage.sender_name}: ${lastMessage.message}` : "No messages yet",
          };
        });
        setUserChats(chatsWithLastMessage);
      } else {
        console.error("Failed to fetch user chats:", result.message);
      }
    } catch (error) {
      console.error("Error fetching user chats:", error);
    }
  };
  // Fetch chat history for a channel (No Auth)
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
      } else {
        console.error("Failed to fetch chat history:", result.message);
      }
    } catch (error) {
      console.error("Error fetching chat history:", error);
    }
  };

  // Pusher subscription effect
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

  // Submit message and update channelName (No Auth)
  const submitMessage = async (messageText: string) => {
    if (!messageText) {
      alert("Message is required!");
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/chat/PrivateChat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ instructorName, message: messageText }),
      });

      const result = await response.json();

      if (response.ok) {
        if (result.channel) {
          setChannelName(result.channel);
        }
        setMessage("");
      } else {
        console.error("Error sending message:", result.message);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  // Select Instructor
  const handleInstructorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedInstructor(e.target.value);
  };

  const handleInstructorSubmit = () => {
    setInstructorName(selectedInstructor);
    setChannelName(null);
    setMessages([]);
  };

  const handleChatSelect = (instructor: string) => {
    setInstructorName(instructor);
    setChannelName(null);
    setMessages([]);
    setSelectedInstructor(instructor);
  };

  return (
    <>
      <Head>
        <title>Chat App</title>
        <link rel="stylesheet" href={styles} />
      </Head>
      <div style={{ display: "flex", height: "100vh" }}>
        {/* Sidebar */}
        <div style={{ width: "20%", backgroundColor: "#f0f0f0", padding: "10px", overflowY: "auto" }}>
          <h3>Your Chats</h3>
          {userChats.length > 0 ? (
            <ul style={{ listStyleType: "none", padding: 0 }}>
              {userChats.map((chat, index) => (
                <li
                  key={index}
                  style={{
                    padding: "10px",
                    borderBottom: "1px solid #ccc",
                    cursor: "pointer",
                    backgroundColor: instructorName === chat.instructor ? "#e0e0e0" : "transparent",
                  }}
                  onClick={() => handleChatSelect(chat.instructor)}
                >
                  <strong>{chat.instructor}</strong>
                  <p style={{ margin: "5px 0", color: "#888" }}>{chat.lastMessage}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No chats available</p>
          )}
        </div>

        {/* Main Chat Area */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          {/* Instructor Selection */}
          <div className="instructor-select" style={{ padding: "10px" }}>
            <input
              type="text"
              value={selectedInstructor}
              onChange={handleInstructorChange}
              placeholder="Enter instructor name"
            />
            <button onClick={handleInstructorSubmit}>Select Instructor</button>
          </div>

          {instructorName && (
            <MainContainer>
              <ChatContainer>
                <MessageList>
                  {messages.map((msg, index) => (
                    <Message
                      key={index}
                      model={{
                        message: `${msg.sender}: ${msg.message}`,
                        direction: "incoming",
                        position: "single",
                      }}
                    />
                  ))}
                </MessageList>
                <MessageInput
                  placeholder="Type message here"
                  value={message}
                  onChange={setMessage}
                  attachButton={false}
                  sendButton={true}
                  onSend={(messageText) => {
                    if (messageText.trim()) {
                      submitMessage(messageText);
                    }
                  }}
                />
              </ChatContainer>
            </MainContainer>
          )}
        </div>
      </div>
    </>
  );
};

export default Chat;

