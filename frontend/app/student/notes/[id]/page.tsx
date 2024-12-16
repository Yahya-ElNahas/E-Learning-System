"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import "@/styles/globals.css";

const NotePage = () => {
  const params = useParams();
  const noteId = params.id;

  const [noteContent, setNoteContent] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const response = await fetch(`http://localhost:3000/notes/${noteId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch the note");
        }

        const data = await response.json();
        setNoteContent(data.content);
      } catch (error) {
        console.error("Error fetching the note:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNote();
  }, [noteId]);

  useEffect(() => {
    const saveTimeout = setTimeout(() => {
      if (noteContent) {
        autosaveNote();
      }
    }, 1000); 

    return () => clearTimeout(saveTimeout); 
  }, [noteContent]);

  const autosaveNote = async () => {
    try {
      const response = await fetch(`http://localhost:3000/notes/${noteId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          content: noteContent,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to autosave the note");
      }
    } catch (error) {
      console.error("Error during autosave:", error);
    } 
  };

  const handleFinish = () => {
    autosaveNote();
    if (typeof window !== "undefined") {
      window.close();
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="flex-1 p-8 flex items-center justify-center">
          <p className="text-gray-600 dark:text-gray-300">Loading the note...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="flex-1 p-8 bg-gray-800 text-gray-200">
        <div className="bg-white dark:bg-[#222831] p-6 rounded-lg shadow-md">
          <div className="mb-4">
          </div>
          <div className="mb-4">
            <label
              htmlFor="content"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Content
            </label>
            <textarea
              id="content"
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              className="w-full p-2 mt-1 bg-gray-100 dark:bg-[#1c1f24] text-gray-900 dark:text-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#008170]"
              rows={10}
            />
          </div>
          <button
            onClick={handleFinish}
            className="w-full bg-[#008170] text-white py-2 rounded-md hover:bg-[#005B41] transition-all duration-300"
          >
            Finish
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotePage;
