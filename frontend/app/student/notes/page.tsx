"use client";

import { useEffect, useState } from "react";
import { NextPage } from "next";
import { useRouter } from "next/navigation";
import SideBarComponent from "@/components/sidebar";
import "@/styles/globals.css";

interface Note {
  _id: string;
  title: string;
  content: string;
  note_num?: number;
}

const QuickNotes: NextPage = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  // Fetch notes
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await fetch("http://localhost:3000/notes/student/all-notes", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch notes");
        }

        const data = await response.json();

        for(let i = 0;i < data.length;i++) data[i].note_num = i+1;

        setNotes(data);
      } catch (error) {
        console.error("Error fetching notes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, []);

  // Create a new note
  const handleCreateNote = async () => {
    try {
      const response = await fetch("http://localhost:3000/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to create note");
      }

      const createdNote = await response.json();

      window.open(`/student/notes/${createdNote._id}`, '_blank');
    } catch (error) {
      console.error("Error creating note:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
        <SideBarComponent courses={true} student={true} title="Quick Notes" />
        <div className="flex-1 p-8 flex items-center justify-center">
          <p className="text-gray-600 dark:text-gray-300">Loading your notes...</p>
        </div>  
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      <SideBarComponent courses={true} student={true} title="Quick Notes" />

      <div className="flex-1 p-8 bg-gray-800 text-gray-200 relative">
        <button
          onClick={handleCreateNote}
          className="absolute top-8 right-8 bg-[#008170] text-white px-4 py-2 rounded-md hover:bg-[#005B41] transition-all duration-300"
        >
            Create New Note
        </button>

        <div className="flex-1 p-16">
        <div className="space-y-6">
          {notes.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-300">
              No notes available. Start adding some quick notes!
            </p>
          ) : (
            notes.map((note) => (
              <div
                key={note._id}
                className="bg-white dark:bg-[#222831] p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <h2 className="text-xl font-bold text-gray-700 dark:text-gray-200 mb-2">
                  {`Note: ${note.note_num}`}
                </h2>
                <button className="w-full bg-[#1b6074] text-white py-2 rounded-md hover:bg-[#2d4e5a] transition-all duration-300"
                onClick={() => window.open(`/student/notes/${note._id}`, '_blank')}
                >
                  Open Note
                </button>
              </div>
            ))
          )}
        </div>
      </div>
      </div>
    </div>
  );
};

export default QuickNotes;
