"use client";

import React, { useState, useEffect } from "react";

const ForumManagement = () => {
  const [forums, setForums] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("");
  const [selectedForum, setSelectedForum] = useState(null);

  // Fetch all forums
  const fetchForums = async () => {
    try {
      const response = await fetch("http://localhost:3000/forum/users", {
        method: "GET",
        credentials: "include", // Include cookies
      });
      const data = await response.json();
      if (response.ok) {
        setForums(data.forums || []);
      } else {
        console.error("Failed to fetch forums:", data.message);
      }
    } catch (error) {
      console.error("Error fetching forums:", error);
    }
  };

  useEffect(() => {
    fetchForums();
  }, []);

  // Create a forum
  const createForum = async () => {
    try {
      const response = await fetch("http://localhost:3000/forum/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ title, description }),
      });
      const data = await response.json();
      if (response.ok) {
        setStatus("Forum created successfully!");
        setTitle("");
        setDescription("");
        fetchForums(); // Refresh forum list
      } else {
        setStatus(data.message || "Failed to create forum.");
      }
    } catch (error) {
      console.error("Error creating forum:", error);
      setStatus("An error occurred.");
    }
  };

  // Delete a forum
  const deleteForum = async (id: any) => {
    try {
      const response = await fetch(`http://localhost:3000/forum/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await response.json();
      if (response.ok) {
        setStatus("Forum deleted successfully!");
        fetchForums();
      } else {
        setStatus(data.message || "Failed to delete forum.");
      }
    } catch (error) {
      console.error("Error deleting forum:", error);
      setStatus("An error occurred.");
    }
  };

  // Edit a forum
  const editForum = async () => {
    try {
      const response = await fetch(`http://localhost:3000/forum/${selectedForum._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ title, description }),
      });
      const data = await response.json();
      if (response.ok) {
        setStatus("Forum updated successfully!");
        setSelectedForum(null);
        setTitle("");
        setDescription("");
        fetchForums();
      } else {
        setStatus(data.message || "Failed to update forum.");
      }
    } catch (error) {
      console.error("Error editing forum:", error);
      setStatus("An error occurred.");
    }
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif", padding: "20px", backgroundColor: "#1e1e2f", color: "#e4e4eb", minHeight: "100vh" }}>
      <h2 style={{ textAlign: "center", color: "#d1d1e0" }}>Forum Management</h2>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "20px",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h3>{selectedForum ? "Edit Forum" : "Create Forum"}</h3>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{
            marginBottom: "10px",
            padding: "10px",
            width: "300px",
            borderRadius: "5px",
            border: "1px solid #444",
            backgroundColor: "#2c2c3c",
            color: "#e4e4eb",
          }}
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{
            marginBottom: "10px",
            padding: "10px",
            width: "300px",
            height: "100px",
            borderRadius: "5px",
            border: "1px solid #444",
            backgroundColor: "#2c2c3c",
            color: "#e4e4eb",
          }}
        ></textarea>
        {selectedForum ? (
          <button
            onClick={editForum}
            style={{
              padding: "10px 20px",
              backgroundColor: "#5a5a8a",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              marginRight: "10px",
            }}
          >
            Update Forum
          </button>
        ) : (
          <button
            onClick={createForum}
            style={{
              padding: "10px 20px",
              backgroundColor: "#4a90e2",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Create Forum
          </button>
        )}
        {selectedForum && (
          <button
            onClick={() => {
              setSelectedForum(null);
              setTitle("");
              setDescription("");
            }}
            style={{
              padding: "10px 20px",
              backgroundColor: "#d9534f",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              marginLeft: "10px",
            }}
          >
            Cancel
          </button>
        )}
      </div>

      <h3 style={{ textAlign: "center", color: "#d1d1e0" }}>Forums</h3>
      <ul style={{ listStyle: "none", padding: "0" }}>
        {forums.map((forum) => (
          <li
            key={forum._id}
            style={{
              background: "#2c2c3c",
              marginBottom: "10px",
              padding: "15px",
              borderRadius: "5px",
              boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.5)",
              color: "#e4e4eb",
            }}
          >
            <h4 style={{ margin: "0", color: "#d1d1e0" }}>{forum.title}</h4>
            <p style={{ margin: "5px 0 10px 0" }}>{forum.description}</p>
            <button
              onClick={() => {
                setSelectedForum(forum);
                setTitle(forum.title);
                setDescription(forum.description);
              }}
              style={{
                padding: "5px 10px",
                marginRight: "10px",
                backgroundColor: "#5a5a8a",
                color: "#fff",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Edit
            </button>
            <button
              onClick={() => deleteForum(forum._id)}
              style={{
                padding: "5px 10px",
                backgroundColor: "#d9534f",
                color: "#fff",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

      {status && (
        <p
          style={{
            textAlign: "center",
            color: status.includes("success") ? "#4caf50" : "#f44336",
            fontWeight: "bold",
          }}
        >
          {status}
        </p>
      )}
    </div>
  );
};

export default ForumManagement;
