"use client";
import React, { useState } from "react";
import SideBarComponent from "@/components/sidebar";
import "@/styles/globals.css";

const CreateCourse: React.FC = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/instructor/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description }),
        credentials: "include",
      });
      if (response.ok) {
        setMessage("Course created successfully!");
        setTitle("");
        setDescription("");
      } else {
        setMessage("Failed to create the course.");
      }
    } catch (error) {
      console.error("Error creating course:", error);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      <SideBarComponent instructor={true} />
      <div className="flex-1 p-8 bg-gray-800 text-gray-200">
        <h1 className="text-3xl font-bold mb-6">Create a New Course</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 rounded-md bg-gray-700 text-gray-200"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 rounded-md bg-gray-700 text-gray-200"
              required
            />
          </div>
          <button type="submit" className="bg-[#2f3d52] px-4 py-2 rounded-md text-white">
            Create Course
          </button>
        </form>
        {message && <p className="mt-4 text-gray-300">{message}</p>}
      </div>
    </div>
  );
};

export default CreateCourse;
