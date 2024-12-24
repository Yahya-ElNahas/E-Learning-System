"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import SideBarComponent from "@/components/sidebar";
import '@/styles/globals.css'
const ForumsPage = () => {
  const [forums, setForums] = useState([]);
  const [selectedForum, setSelectedForum] = useState(null);
  const [commentText, setCommentText] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchForums = async () => {
      try {
        const res = await fetch("http://localhost:3000/forum");
        const data = await res.json();
        setForums(data);
      } catch (error) {
        console.error("Error fetching forums:", error);
      }
    };

    fetchForums();
  }, []);

  useEffect(() => {
    document.body.style.backgroundColor = "#1e1e2f";
    document.body.style.color = "#e0e0e0";
    return () => {
      document.body.style.backgroundColor = "";
      document.body.style.color = "";
    };
  }, []);

  const handleCreateForum = () => {
    router.push("/communication/forums/createForums/");
  };

  const handleAddComment = async (forumId) => {
    if (!commentText.trim()) {
      alert("Comment cannot be empty.");
      return;
    }
    try {
      const res = await fetch("http://localhost:3000/forum/addComment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ forumId, text: commentText }),
      });

      if (res.ok) {
        const updatedForum = await res.json();
        setSelectedForum(updatedForum);
        setCommentText("");
        alert("Comment added successfully!");
      } else {
        const error = await res.json();
        alert("Failed to add comment: " + error.message);
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <SideBarComponent courses={false} instructor={true} />

      <div style={{ flex: 1, padding: "30px", fontFamily: "Arial, sans-serif" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
    <h3
  style={{
    textAlign: "center",
    background: "linear-gradient(270deg, #4a90e2, #d9534f, #5a5a8a)",
    backgroundSize: "400% 400%",
    WebkitBackgroundClip: "text",
    color: "transparent",
    fontWeight: "bold",
    fontSize: "27px",
    animation: "gradientAnimation 5s ease infinite",
  }}
>
  Forums
</h3>


          <button
            onClick={handleCreateForum}
            style={{
              backgroundColor: "#4caf50",
              padding: "10px 15px",
              border: "none",
              borderRadius: "8px",
              color: "#ffffff",
              fontSize: "1rem",
              cursor: "pointer",
              transition: "transform 0.3s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            Create Forum
          </button>
        </div>

        {selectedForum ? (
          <div
            style={{
              padding: "20px",
              backgroundColor: "#2b2b3d",
              borderRadius: "10px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.5)",
              maxWidth: "800px",
              margin: "0 auto",
            }}
          >
            <h2 style={{ color: "#ffffff" }}>{selectedForum.title}</h2>
            <p style={{ color: "#d0d0d0", marginBottom: "15px" }}>Description : {selectedForum.description}</p>
            <div>
              <h3 style={{ color: "#ffffff" }}>Comments</h3>
              {selectedForum.comments.length > 0 ? (
                selectedForum.comments.map((comment, index) => (
                  <div key={index} style={{ marginBottom: "15px" }}>
                    <p style={{ color: "#e0e0e0" }}>
                      <strong>{comment.user.name}:</strong> {comment.text}
                    </p>
                  </div>
                ))
              ) : (
                <p style={{ color: "#b0b0b0" }}>No comments yet.</p>
              )}
            </div>
            <textarea
            
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Add a comment..."
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "8px",
                marginBottom: "10px",
                border: "1px solid #4caf50",
                backgroundColor: "#1e1e2f",
                color: "#e0e0e0",
              }}
            />
            <button
              onClick={() => handleAddComment(selectedForum._id)}
              style={{
                backgroundColor: "#4caf50",
                color: "white",
                padding: "10px 15px",
                border: "none",
                borderRadius: "8px",
                marginRight: "10px",
              }}
            >
              Add Comment
            </button>
            <button
              onClick={() => setSelectedForum(null)}
              style={{
                backgroundColor: "#f44336",
                color: "white",
                padding: "10px 15px",
                border: "none",
                borderRadius: "8px",
              }}
            >
              Back
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
            {forums.map((forum) => (
              <div
                key={forum._id}
                style={{
                  width: "300px",
                  padding: "20px",
                  backgroundColor: "#34354b",
                  borderRadius: "10px",
                  cursor: "pointer",
                  transition: "transform 0.3s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                onClick={() => setSelectedForum(forum)}
              >
                <h2 style={{ color: "#ffffff" }}>{forum.title}</h2>
                <p style={{ color: "#b0b0b0" }}>Created by: {forum.moderator.name}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ForumsPage;
