"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Group {
  GroupName: string;
  channel: string;
}

interface Message {
  sender: string;
  message: string;
  date: string;
}

const GroupChat = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [newGroupName, setNewGroupName] = useState<string>("");
  const [groupMembers, setGroupMembers] = useState<string[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [newUser, setNewUser] = useState<string>(""); // For adding users
  const router = useRouter();

  // Fetch user groups
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await fetch("http://localhost:3000/chat/getUserGroups", {
          method: "GET",
          credentials: "include",
        });
        if (!response.ok) throw new Error("Failed to fetch groups");
        const data = await response.json();
        setGroups(data);
      } catch (error) {
        console.error("Error fetching groups:", error);
        setGroups([]); // Fallback to an empty array if fetch fails
      }
    };

    fetchGroups();
  }, []);

  // Send message to the group
  const sendMessage = async (groupName: string, messageContent: string) => {
    if (!messageContent.trim()) {
      alert("Message cannot be empty!");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/chat/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          groupName,
          message: messageContent,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setMessages((prev) => [...prev, data]);
        setMessage("");
      } else {
        const error = await response.text();
        console.error("Failed to send message:", error);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  // Handle adding a new member to the group
  const handleAddMember = () => {
    if (newUser && !groupMembers.includes(newUser)) {
      setGroupMembers([...groupMembers, newUser]);
      setNewUser(""); // Clear input field after adding the user
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
    
    try {
      const response = await fetch("http://localhost:3000/chat/createGroup", {
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
        setGroups((prev) => [...prev, result]); // Add new group to the list
        setNewGroupName(""); // Reset group name field
        setGroupMembers([]); // Reset group members
        setShowModal(false); // Close the modal after group creation
      } else {
        console.error("Error creating group:", result.message);
      }
    } catch (error) {
      console.error("Error creating group:", error);
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "'Roboto', sans-serif" }}>
      {/* Sidebar */}
      <div
        style={{
          width: "25%",
          padding: "20px",
          backgroundColor: "#2c3e50",
          color: "#ecf0f1",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        <h2 style={{ borderBottom: "2px solid #ecf0f1", paddingBottom: "10px" }}>Your Groups</h2>
        <ul style={{ listStyleType: "none", padding: 0, margin: 0, overflowY: "auto", flex: 1 }}>
          {groups.length > 0 ? (
            groups.map((group, index) => (
              <li
                key={index}
                onClick={() => setSelectedGroup(group)}
                style={{
                  cursor: "pointer",
                  padding: "10px",
                  borderRadius: "5px",
                  backgroundColor: selectedGroup?.GroupName === group.GroupName ? "#34495e" : "transparent",
                  color: "#ecf0f1",
                  transition: "background-color 0.3s",
                }}
              >
                {group.GroupName}
              </li>
            ))
          ) : (
            <p>No groups available</p>
          )}
        </ul>

        {/* Create Group Button */}
        <button
          onClick={() => setShowModal(true)}
          style={{
            padding: "10px 20px",
            backgroundColor: "#2980b9",
            color: "#ecf0f1",
            borderRadius: "5px",
            border: "none",
            cursor: "pointer",
            marginTop: "20px",
          }}
        >
          Create Group
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
        {selectedGroup ? (
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
              {loading ? (
                <p>Loading messages...</p>
              ) : (
                messages.map((msg, index) => (
                  <div
                    key={index}
                    style={{
                      marginBottom: "15px",
                      padding: "10px",
                      borderRadius: "5px",
                      backgroundColor: "#bdc3c7",
                      alignSelf: "flex-start",
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
                  onClick={() => sendMessage(selectedGroup.GroupName, message)}
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
            Select a group to view messages
          </div>
        )}
      </div>

      {/* Modal for creating a group */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              backgroundColor: "#fff",
              padding: "20px",
              borderRadius: "5px",
              width: "400px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            }}
          >
            <h3>Create a Group</h3>
            <input
              type="text"
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
              placeholder="Enter group name"
              style={{
                marginBottom: "10px",
                padding: "8px",
                width: "100%",
                borderRadius: "5px",
                border: "1px solid #bdc3c7",
              }}
            />
            <div>
              <input
                type="text"
                value={newUser}
                onChange={(e) => setNewUser(e.target.value)}
                placeholder="Add user"
                style={{
                  marginBottom: "10px",
                  padding: "8px",
                  width: "100%",
                  borderRadius: "5px",
                  border: "1px solid #bdc3c7",
                }}
              />
              <button
                onClick={handleAddMember}
                style={{
                  padding: "8px 15px",
                  backgroundColor: "#2980b9",
                  color: "#ecf0f1",
                  borderRadius: "5px",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Add User
              </button>
            </div>
            <div>
              {groupMembers.map((member, index) => (
                <span
                  key={index}
                  style={{
                    display: "inline-block",
                    marginRight: "8px",
                    padding: "5px 10px",
                    backgroundColor: "#ecf0f1",
                    borderRadius: "20px",
                    marginBottom: "5px",
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
                padding: "10px 20px",
                backgroundColor: "#2980b9",
                color: "#ecf0f1",
                borderRadius: "5px",
                border: "none",
                cursor: "pointer",
                marginTop: "10px",
                width: "100%",
              }}
            >
              Create Group
            </button>
            <button
              onClick={() => setShowModal(false)}
              style={{
                padding: "10px 20px",
                backgroundColor: "#e74c3c",
                color: "#ecf0f1",
                borderRadius: "5px",
                border: "none",
                cursor: "pointer",
                marginTop: "10px",
                width: "100%",
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupChat;
