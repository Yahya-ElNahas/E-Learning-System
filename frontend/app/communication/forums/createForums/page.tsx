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
  const deleteForum = async (id) => {
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
    <div style={{ fontFamily: "Arial, sans-serif", padding: "20px", backgroundColor: "#10121B", color: "#EDEEF3", minHeight: "100vh" }}>
      <h2 style={{ textAlign: "center", color: "#A3C7D6", marginBottom: "30px" }}>Forum Management</h2>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginBottom: "40px",
          border: "1px solid #444",
          padding: "20px",
          borderRadius: "8px",
          backgroundColor: "#1C1E2B",
          boxShadow: "0 8px 16px rgba(0, 0, 0, 0.6)",
          transition: "transform 0.3s",
        }}
      >
        <h3 style={{ color: "#A3C7D6" }}>{selectedForum ? "Edit Forum" : "Create Forum"}</h3>
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
            border: "1px solid #666",
            backgroundColor: "#2B2F3B",
            color: "#EDEEF3",
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
            border: "1px solid #666",
            backgroundColor: "#2B2F3B",
            color: "#EDEEF3",
          }}
        ></textarea>
        {selectedForum ? (
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={editForum}
              style={{
                padding: "10px 20px",
                backgroundColor: "#4CAF50",
                color: "#FFF",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.4)",
                transition: "transform 0.2s ease",
              }}
            >
              Update Forum
            </button>
            <button
              onClick={() => {
                setSelectedForum(null);
                setTitle("");
                setDescription("");
              }}
              style={{
                padding: "10px 20px",
                backgroundColor: "#E57373",
                color: "#FFF",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={createForum}
            style={{
              padding: "10px 20px",
              backgroundColor: "#64B5F6",
              color: "#FFF",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              transition: "background 0.3s ease",
            }}
          >
            Create Forum
          </button>
        )}
      </div>

      <h3 style={{ textAlign: "center", color: "#A3C7D6" }}>Forums</h3>
      <ul style={{ listStyle: "none", padding: "0" }}>
        {forums.map((forum) => (
          <li
            key={forum._id}
            style={{
              background: "#1C1E2B",
              marginBottom: "10px",
              padding: "20px",
              borderRadius: "8px",
              boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.4)",
              color: "#EDEEF3",
              transition: "transform 0.3s ease",
              animation: "fadeIn 0.5s ease-in-out",
            }}
          >
            <h4 style={{ margin: "0", color: "#A3C7D6" }}>{forum.title}</h4>
            <p style={{ margin: "5px 0 10px 0" }}>{forum.description}</p>
            <p style={{ fontSize: "0.9em", color: "#A0A0B0" }}>
              Created by: <strong>{forum.moderator?.name || "Unknown"}</strong>
            </p>
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                onClick={() => {
                  setSelectedForum(forum);
                  setTitle(forum.title);
                  setDescription(forum.description);
                }}
                style={{
                  padding: "5px 10px",
                  backgroundColor: "#64B5F6",
                  color: "#FFF",
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
                  backgroundColor: "#E57373",
                  color: "#FFF",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      {status && (
        <p
          style={{
            textAlign: "center",
            color: status.includes("success") ? "#81C784" : "#E57373",
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
