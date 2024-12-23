"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Updated import

const ForumsPage = () => {
  const [forums, setForums] = useState([]);
  const [selectedForum, setSelectedForum] = useState(null);
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

  // Apply the full-screen background color
  useEffect(() => {
    document.body.style.backgroundColor = "#1e1e2f";
    document.body.style.color = "#e0e0e0";
    document.body.style.margin = "0"; // Removes default browser margin
    document.body.style.padding = "0"; // Removes default browser padding
    return () => {
      // Reset styles when the component unmounts
      document.body.style.backgroundColor = "";
      document.body.style.color = "";
    };
  }, []);

  const handleCreateForum = () => {
    router.push("forums/createForums/");
  };

  return (
    <div style={{ padding: "30px", fontFamily: "Arial, sans-serif", minHeight: "100vh" }}>
      {/* Header Section */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h1 style={{ textAlign: "center", fontSize: "2rem", color: "#ffffff" }}>Forums</h1>
        <button
          onClick={handleCreateForum}
          style={{
            backgroundColor: "#4caf50",
            color: "white",
            padding: "10px 15px",
            border: "none",
            borderRadius: "5px",
            fontSize: "1rem",
            cursor: "pointer",
            transition: "background-color 0.3s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#45a049")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#4caf50")}
        >
          Create Forum
        </button>
      </div>

      {/* Main Content */}
      {selectedForum ? (
        <div
          style={{
            padding: "20px",
            backgroundColor: "#2a2a3d",
            borderRadius: "8px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
            maxWidth: "800px",
            margin: "0 auto",
          }}
        >
          <h2 style={{ fontSize: "1.8rem", color: "#ffffff", marginBottom: "10px" }}>
            {selectedForum.title}
          </h2>
          <p style={{ color: "#d0d0d0", fontSize: "1rem", marginBottom: "15px" }}>
            {selectedForum.description}
          </p>
          <button
            onClick={() => setSelectedForum(null)}
            style={{
              backgroundColor: "#ff4d4d",
              color: "white",
              padding: "10px 15px",
              border: "none",
              borderRadius: "5px",
              fontSize: "1rem",
              cursor: "pointer",
              transition: "background-color 0.3s ease",
            }}
          >
            Back to Forums
          </button>
        </div>
      ) : (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", justifyContent: "center" }}>
          {forums.map((forum) => (
            <div
              key={forum._id}
              style={{
                width: "300px",
                padding: "20px",
                backgroundColor: "#2a2a3d",
                borderRadius: "8px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                cursor: "pointer",
              }}
              onClick={() => setSelectedForum(forum)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.05)";
                e.currentTarget.style.boxShadow = "0 8px 16px rgba(0, 0, 0, 0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.3)";
              }}
            >
              <h2 style={{ fontSize: "1.5rem", color: "#ffffff", marginBottom: "10px" }}>
                {forum.title}
              </h2>
              <p style={{ color: "#b0b0b0", fontSize: "1rem", marginBottom: "15px" }}>
                Created by: {forum.moderator.name}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ForumsPage;
