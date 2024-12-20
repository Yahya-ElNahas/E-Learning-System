"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import "@/styles/globals.css";
import SideBarComponent from "@/components/sidebar";

const EditModule: React.FC = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [difficulty, setDifficulty] = useState("beginner"); 
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [existingFiles, setExistingFiles] = useState<{ path: string; type: string }[]>([]); 
  const router = useRouter();
  const params = useParams();

  const moduleId = typeof params?.module_id === "string" ? params.module_id : "";
  const courseId = typeof params?.id === "string" ? params.id : "";

  useEffect(() => {
    const fetchModule = async () => {
      try {
        const response = await fetch(`http://localhost:3000/modules/${moduleId}`, {
            headers: { "Content-Type": "application/json" },
            credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          setTitle(data.title);
          setContent(data.content);
          setDifficulty(data.difficulty_level);
          setExistingFiles(data.resources || []);
        } else {
          console.error("Error fetching module:", await response.text());
        }
      } catch (error) {
        console.error("Error fetching module:", error);
      }
    };

    if (moduleId) fetchModule();
  }, [moduleId]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setUploadedFiles(files);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("difficulty_level", difficulty);

    // Append new files
    uploadedFiles.forEach((file) => {
      formData.append("resources", file);
    });
    try {
      const response = await fetch(`http://localhost:3000/modules/${moduleId}`, {
        method: "PATCH", 
        // headers: { "Content-Type": "application/json" },
        body: formData,
        credentials: "include",
      });

      if (response.ok) {
        router.push(`/instructor/courses/${courseId}`);
      } else {
        console.error("Error updating module:", await response.text());
      }
    } catch (error) {
      console.error("Error updating module:", error);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      <SideBarComponent instructor={true} />
      <div className="flex-1 p-8 bg-gray-800 text-gray-200">
        <h1 className="text-3xl font-bold mb-6">Edit Module</h1>
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
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Existing Files</label>
            <ul>
              {existingFiles.map((file, index) => (
                <li key={index} className="text-sm">
                  {file.path} ({file.type})
                </li>
              ))}
            </ul>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Upload New Files</label>
            <input
              type="file"
              multiple
              onChange={handleFileUpload}
              className="text-gray-200"
            />
          </div>

          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Update Module
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditModule;
