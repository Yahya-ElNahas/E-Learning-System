"use client";
import React, { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import "@/styles/globals.css";
import SideBarComponent from "@/components/sidebar";

const CreateModule: React.FC = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [difficulty, setDifficulty] = useState("Beginner"); // Default value
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const router = useRouter();
  const params = useParams();

  const courseId = typeof params?.id === "string" ? params.id : "";

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setUploadedFiles(files);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("course_id", courseId); // Add course ID
    formData.append("title", title); // Add title
    formData.append("content", content); // Add content
    formData.append("difficulty", difficulty); // Add difficulty level

    // Append each file to FormData
    uploadedFiles.forEach((file) => {
      formData.append("resources", file); // 'resources' is the key name
    });

    try {
      const response = await fetch(`http://localhost:3000/modules`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: formData,
        credentials: "include",
      });

      if (response.ok) {
        router.push(`/instructor/courses/${courseId}`);
      } else {
        console.error("Error creating module:", await response.text());
      }
    } catch (error) {
      console.error("Error creating module:", error);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      <SideBarComponent instructor={true} />
      <div className="flex-1 p-8 bg-gray-800 text-gray-200">
        <h1 className="text-3xl font-bold mb-6">Create New Module</h1>
        <form onSubmit={handleSubmit} className="space-y-6">

          <div>
            <label className="block text-sm font-medium mb-2">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="Enter module title"
              className="w-full px-3 py-2 bg-gray-700 text-white rounded focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              placeholder="Enter module content"
              className="w-full px-3 py-2 bg-gray-700 text-white rounded focus:outline-none"
              rows={4}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Difficulty Level</label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              required
              className="w-full px-3 py-2 bg-gray-700 text-white rounded focus:outline-none"
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Upload Files</label>
            <input
              type="file"
              multiple
              onChange={handleFileUpload}
              className="text-gray-200"
            />
          </div>

          <button
            type="submit"
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Create Module
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateModule;
