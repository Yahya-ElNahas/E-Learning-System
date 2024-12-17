"use client";
import React, { useState } from "react";
import SideBarComponent from "@/components/sidebar";
import "@/styles/globals.css";

const CreateCourse: React.FC = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [difficulty, setDifficulty] = useState("beginner");
  const [keywords, setKeywords] = useState<string>(""); // Single string, comma-separated
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const keywordsArray = keywords.split(",").map((kw) => kw.trim());
      const response = await fetch("http://localhost:3000/instructor/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          category,
          difficulty_level: difficulty,
          keywords: keywordsArray,
        }),
        credentials: "include",
      });

      if (response.ok) {
        setMessage("Course created successfully!");
        setTitle("");
        setDescription("");
        setCategory("");
        setDifficulty("beginner");
        setKeywords("");
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
          {/* Title Field */}
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

          {/* Description Field */}
          <div>
            <label className="block text-sm font-medium">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 rounded-md bg-gray-700 text-gray-200"
              required
            />
          </div>

          {/* Category Field */}
          <div>
            <label className="block text-sm font-medium">Category</label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-2 rounded-md bg-gray-700 text-gray-200"
              placeholder="e.g., Programming, Mathematics"
              required
            />
          </div>

          {/* Difficulty Field */}
          <div>
            <label className="block text-sm font-medium">Difficulty Level</label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full p-2 rounded-md bg-gray-700 text-gray-200"
              required
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>

          {/* Keywords Field */}
          <div>
            <label className="block text-sm font-medium">Keywords</label>
            <input
              type="text"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              className="w-full p-2 rounded-md bg-gray-700 text-gray-200"
              placeholder="e.g., React, Web Development, Node.js (comma-separated)"
            />
          </div>

          {/* Submit Button */}
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
