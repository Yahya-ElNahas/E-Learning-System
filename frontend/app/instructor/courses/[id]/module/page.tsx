"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import "@/styles/globals.css";

const CreateModule: React.FC = () => {
  const [courseId, setCourseId] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isOutdated, setIsOutdated] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const router = useRouter();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setUploadedFiles(files);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("course_id", courseId);
    formData.append("title", title);
    formData.append("content", content);
    formData.append("isOutdated", JSON.stringify(isOutdated));

    uploadedFiles.forEach((file) => {
      formData.append("resources", file);
    });

    try {
      const response = await fetch(`http://localhost:3000/modules`, {
        method: "POST",
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
      <div className="flex-1 p-8 bg-gray-800 text-gray-200">
        <h1 className="text-3xl font-bold mb-6">Create New Module</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Course ID</label>
            <input
              type="text"
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)}
              required
              placeholder="Enter course ID"
              className="w-full px-3 py-2 bg-gray-700 text-white rounded focus:outline-none"
            />
          </div>

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
            <label className="block text-sm font-medium mb-2">Upload Files</label>
            <input
              type="file"
              multiple
              onChange={handleFileUpload}
              className="text-gray-200"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              checked={isOutdated}
              onChange={(e) => setIsOutdated(e.target.checked)}
              className="h-4 w-4 text-blue-600"
            />
            <label className="ml-2 text-sm font-medium">Mark as Outdated</label>
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

