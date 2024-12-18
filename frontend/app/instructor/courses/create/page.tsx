"use client";
import React, { useState, useEffect } from "react";
import SideBarComponent from "@/components/sidebar";
import "@/styles/globals.css";

interface Course {
  _id: string;
  title: string;
  description: string;
  category: string;
  difficulty_level: string;
  keywords: string[];
  isAvailable: boolean;
}

const CreateCourse: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]); // List of courses
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [difficulty, setDifficulty] = useState("beginner");
  const [keywords, setKeywords] = useState<string>(""); // Single string, comma-separated
  const [message, setMessage] = useState("");
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null); // Track the course being edited

  // Fetch all courses on component load
  const fetchCourses = async () => {
    try {
      const response = await fetch("http://localhost:3000/courses/search/instructor", {
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setCourses(data);
      } else {
        setMessage("Failed to fetch courses.");
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
      setMessage("Error fetching courses.");
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // Handle form submission (Create or Update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const keywordsArray = keywords.split(",").map((kw) => kw.trim());

    try {
      const url = selectedCourse
        ? `http://localhost:3000/courses/${selectedCourse._id}`
        : "http://localhost:3000/courses";
      const method = selectedCourse ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
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
        setMessage(selectedCourse ? "Course updated successfully!" : "Course created successfully!");
        // Reset form after successful submission
        setTitle("");
        setDescription("");
        setCategory("");
        setDifficulty("beginner");
        setKeywords("");
        setSelectedCourse(null);
        fetchCourses(); // Refresh course list
      } else {
        setMessage("Failed to save the course.");
      }
    } catch (error) {
      console.error("Error saving course:", error);
      setMessage("Error saving course.");
    }
  };

  // Handle course edit button click (e.g., when a course is selected to be edited)
  const handleEdit = (course: Course) => {
    setSelectedCourse(course);
    setTitle(course.title);
    setDescription(course.description);
    setCategory(course.category);
    setDifficulty(course.difficulty_level);
    setKeywords(course.keywords.join(", "));
  };

  // Handle course deletion
  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:3000/courses/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (response.ok) {
        setMessage("Course deleted successfully.");
        fetchCourses(); // Refresh course list
      } else {
        setMessage("Failed to delete the course.");
      }
    } catch (error) {
      console.error("Error deleting course:", error);
      setMessage("Error deleting course.");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      <SideBarComponent instructor={true} />
      <div className="flex-1 p-8 bg-gray-800 text-gray-200">
        <h1 className="text-3xl font-bold mb-6">
          {selectedCourse ? "Edit Course" : "Create a New Course"}
        </h1>
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
            {selectedCourse ? "Update Course" : "Create Course"}
          </button>
        </form>

        {message && <p className="mt-4 text-gray-300">{message}</p>}

        {/* Course List */}
        <h2 className="text-2xl font-bold mt-8">All Courses</h2>
        <ul className="mt-4 space-y-4">
          {courses.map((course) => (
            <li key={course._id} className="p-4 bg-gray-700 rounded-md">
              <h3 className="text-xl font-bold">{course.title}</h3>
              <p>{course.description}</p>
              <p className="text-sm">
                Status: {course.isAvailable ? "Available" : "Unavailable"}
              </p>
              <div className="mt-2 space-x-2">
                <button
                  onClick={() => handleEdit(course)}
                  className="bg-yellow-500 px-3 py-1 rounded-md text-white"
                >
                  Update
                </button>
                <button
                  onClick={() => handleDelete(course._id)}
                  className="bg-red-500 px-3 py-1 rounded-md text-white"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CreateCourse;
