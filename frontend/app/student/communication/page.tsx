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
  const [newGroupName, setNewGroupName] = useState<string>(""); // New group name
  const [groupMembers, setGroupMembers] = useState<string[]>([]); // Group members
  const [groups, setGroups] = useState<any[]>([]);

  // Fetch all user chats for the sidebar (No Auth)
  const fetchUserChats = async () => {
    try {
      const usernameResponse = await fetch(`http://localhost:3000/chat/username`, {
        method: "GET",
        credentials: "include",
      });
      const usernameData = await usernameResponse.json();

      if (!usernameResponse.ok) {
        console.error("Failed to fetch username:", usernameData.message);
        return;
      }

      const username = usernameData.username;

      const response = await fetch(`http://localhost:3000/chat/getAllUserChats`, {
        method: "GET",
        credentials: "include",
      });
      const result = await response.json();

      if (response.ok) {
        const uniqueChats = result.filter(
          (item: { _id: any }, index: any, self: any[]) =>
            index === self.findIndex((obj) => obj._id === item._id)
        );

        const chatsWithLastMessage = uniqueChats.map(
          (chat: { message: string | any[]; recipient: string; sender: any }) => {
            const lastMessage =
              chat.message.length > 0 ? chat.message[chat.message.length - 1] : null;

            const recipien = chat.recipient;
            return {
              recipient: username,
              instructor: recipien,
              lastMessage: lastMessage
                ? `${lastMessage.sender_name}: ${lastMessage.message}`
                : "No messages yet",
            };
          }
        );

        setUserChats(chatsWithLastMessage);
      } else {
        console.error("Failed to fetch user chats:", result.message);
      }
    } catch (error) {
      console.error("Error fetching user chats:", error);
    }
  };
  
  useEffect(() => {
    const fetchGroup = async () => {
      try {
        const response = await fetch(`http://localhost:3000/chat/getUserGroups`, {
          method: "GET",
          credentials: "include",
        });
        const data = await response.json();
        setGroups(data); // Store the fetched groups in state
      } catch (error) {
        console.error("Error fetching groups:", error);
      }
    };

    fetchGroup(); // Call the fetchGroup function
  }, []);

  const handleGroupClick = async (group: { channel: any; }) => {
    // Group's channel name is the groupName
    const groupName = group.channel;  // Channel name corresponds to groupName
    const message = "Hello, this is a test message!";  // Replace with your dynamic message
  
    try {
      // Send the message to the group using the groupName (channel)
      const response = await fetch('/api/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`, // Include token if necessary
        },
        body: JSON.stringify({
          groupName,  // Use the channel as the groupName
          message,    // The message you want to send
        }),
      });
  
      // Check if the request was successful
      if (response.ok) {
        const data = await response.json();
        console.log("Message sent successfully:", data);
        // Optionally, show a success notification or update the UI
      } else {
        // Handle errors if the request was not successful
        const errorData = await response.json();
        console.error("Error sending message:", errorData);
        // Optionally, display an error message to the user
      }
    } catch (error) {
      console.error("Error making request:", error);
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

  // Handle group members input
  const handleAddMember = (member: string) => {
    if (member && !groupMembers.includes(member)) {
      setGroupMembers([...groupMembers, member]);
    }
  };

  // Remove a member from the list
  const handleRemoveMember = (member: string) => {
    setGroupMembers(groupMembers.filter((m) => m !== member));
  };

  // Create a new group
  const handleGroupSubmit = async () => {
    if (!newGroupName || groupMembers.length === 0) {
      alert("Group name and members are required!");
      return;
    }
    console.log(groupMembers)
    try {
      const response = await fetch(`http://localhost:3000/chat/createGroup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          groupName: newGroupName,
          usernames: groupMembers, 
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setChannelName(result.channel);
        setNewGroupName(""); // Reset group name field
        setGroupMembers([]); // Reset group members
        fetchUserChats(); // Fetch updated chats after group creation
      } else {
        console.error("Error creating group:", result.message);
      }
    } catch (error) {
      console.error("Error creating group:", error);
    }
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
          padding: "15px",
          marginBottom: "10px",
          borderRadius: "8px",
          backgroundColor: instructorName === chat.instructor ? "#e0e0e0" : "#fff",
          cursor: "pointer",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
          transition: "background-color 0.3s ease, transform 0.3s ease",
        }}
        onClick={() => handleChatSelect(chat.instructor)}
        onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.03)"}
        onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
      >
        <strong style={{ fontSize: "1.1rem", color: "#007bff" }}>{chat.instructor}</strong>
        <p style={{ margin: "5px 0", color: "#666", fontSize: "0.95rem" }}>
          {chat.lastMessage}
        </p>
      </li>
    ))}
  </ul>
) : (
  <p style={{ color: "#888", fontStyle: "italic" }}>No chats available</p>
)}

<div style={{ padding: "20px", backgroundColor: "#f9f9f9", borderRadius: "8px" }}>
  <h3 style={{ fontSize: "1.5rem", marginBottom: "15px", color: "#333" }}>User Groups</h3>
  {groups.length > 0 ? (
    groups.map((group, index) => (
      <div
        key={index}
        style={{
          padding: "15px",
          marginBottom: "10px",
          borderRadius: "8px",
          backgroundColor: "#fff",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
          transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease",
          cursor: "pointer" // Add a cursor pointer to indicate it's clickable
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
        onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
        onClick={() => handleGroupClick(group)} // This handles the click event
      >
        <h4 style={{ fontSize: "1.2rem", color: "#007bff", marginBottom: "8px" }}>
          <strong>GroupName:</strong> {group.GroupName}
        </h4>
        <p style={{ fontSize: "1rem", color: "#555", marginBottom: "0" }}>
          <strong>Channel:</strong> {group.channel}
        </p>
      </div>
    ))
  ) : (
    <p style={{ color: "#888", fontStyle: "italic" }}>No groups available</p>
  )}
</div>



          
<div className="create-group" style={{ padding: "20px", backgroundColor: "#f9f9f9", borderRadius: "8px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}>
  <h4 style={{ fontSize: "1.2rem", marginBottom: "15px", color: "#333" }}>Create a Group</h4>
  
  <input
    type="text"
    value={newGroupName}
    onChange={(e) => setNewGroupName(e.target.value)}
    placeholder="Enter group name"
    style={{
      marginBottom: "15px",
      padding: "10px",
      width: "100%",
      borderRadius: "5px",
      border: "1px solid #ccc",
      fontSize: "1rem",
      color: "#333",
      outline: "none",
      transition: "border-color 0.3s ease",
    }}
    onFocus={(e) => e.target.style.borderColor = "#007bff"}
    onBlur={(e) => e.target.style.borderColor = "#ccc"}
  />

  <button
    onClick={() => {
      const memberName = prompt("Enter member name:");
      if (memberName) {
        handleAddMember(memberName);
      }
    }}
    style={{
      marginBottom: "15px",
      padding: "10px 15px",
      backgroundColor: "#007bff",
      color: "#fff",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
      fontSize: "1rem",
    }}
  >
    Add Members
  </button>

  <div style={{ marginBottom: "15px" }}>
    {groupMembers.map((member, index) => (
      <span
        key={index}
        style={{
          display: "inline-block",
          marginRight: "8px",
          marginBottom: "8px",
          padding: "8px 12px",
          backgroundColor: "#e0e0e0",
          borderRadius: "15px",
          fontSize: "0.9rem",
          color: "#333",
        }}
      >
        {member}{" "}
        <button
          onClick={() => handleRemoveMember(member)}
          style={{
            background: "transparent",
            border: "none",
            color: "#ff0000",
            cursor: "pointer",
            marginLeft: "5px",
            fontSize: "1rem",
          }}
        >
          x
        </button>
      </span>
    ))}
  </div>

  <button
    onClick={handleGroupSubmit}
    style={{
      padding: "10px 15px",
      backgroundColor: "#28a745",
      color: "#fff",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
      fontSize: "1rem",
    }}
  >
    Create Group
  </button>
</div>

          
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

