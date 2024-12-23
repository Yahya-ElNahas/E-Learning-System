"use client";
import React, { useState, useEffect } from "react";
import SideBarComponent from "@/components/sidebar";
import { motion } from "framer-motion";
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
  const [courses, setCourses] = useState<Course[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [difficulty, setDifficulty] = useState("beginner");
  const [keywords, setKeywords] = useState<string>("");
  const [message, setMessage] = useState("");
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

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
        setTitle("");
        setDescription("");
        setCategory("");
        setDifficulty("beginner");
        setKeywords("");
        setSelectedCourse(null);
        fetchCourses();
      } else {
        setMessage("Failed to save the course.");
      }
    } catch (error) {
      console.error("Error saving course:", error);
      setMessage("Error saving course.");
    }
  };

  const handleEdit = (course: Course) => {
    setSelectedCourse(course);
    setTitle(course.title);
    setDescription(course.description);
    setCategory(course.category);
    setDifficulty(course.difficulty_level);
    setKeywords(course.keywords.join(", "));
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:3000/courses/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (response.ok) {
        setMessage("Course deleted successfully.");
        fetchCourses();
      } else {
        setMessage("Failed to delete the course.");
      }
    } catch (error) {
      console.error("Error deleting course:", error);
      setMessage("Error deleting course.");
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-black via-blue-900 to-red-900">
      <SideBarComponent instructor={true} />
      <div className="flex-1 p-8">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-red-400"
        >
          {selectedCourse ? "Edit Course" : "Create a New Course"}
        </motion.h1>
        <motion.form
          onSubmit={handleSubmit}
          className="space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div>
            <label className="block text-sm font-medium text-gray-300">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 rounded-md bg-gray-800 text-white border border-blue-500 focus:border-red-500 focus:ring-2 focus:ring-red-500 transition-all duration-300"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 rounded-md bg-gray-800 text-white border border-blue-500 focus:border-red-500 focus:ring-2 focus:ring-red-500 transition-all duration-300"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">Category</label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-2 rounded-md bg-gray-800 text-white border border-blue-500 focus:border-red-500 focus:ring-2 focus:ring-red-500 transition-all duration-300"
              placeholder="e.g., Programming, Mathematics"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">Difficulty Level</label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full p-2 rounded-md bg-gray-800 text-white border border-blue-500 focus:border-red-500 focus:ring-2 focus:ring-red-500 transition-all duration-300"
              required
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">Keywords</label>
            <input
              type="text"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              className="w-full p-2 rounded-md bg-gray-800 text-white border border-blue-500 focus:border-red-500 focus:ring-2 focus:ring-red-500 transition-all duration-300"
              placeholder="e.g., React, Web Development, Node.js (comma-separated)"
            />
          </div>

          <motion.button
            type="submit"
            className="bg-gradient-to-r from-blue-600 to-red-600 px-4 py-2 rounded-md text-white hover:from-blue-700 hover:to-red-700 transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {selectedCourse ? "Update Course" : "Create Course"}
          </motion.button>
        </motion.form>

        {message && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mt-4 text-white"
          >
            {message}
          </motion.p>
        )}

        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-3xl font-bold mt-8 mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-red-400"
        >
          All Courses
        </motion.h2>
        <motion.ul
          className="mt-4 space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          {courses.map((course) => (
            <motion.li
              key={course._id}
              className="p-4 bg-gray-800 rounded-md border border-blue-500 hover:border-red-500 transition-all duration-300"
              whileHover={{ scale: 1.02 }}
            >
              <h3 className="text-xl font-bold text-white">{course.title}</h3>
              <p className="text-gray-300">{course.description}</p>
              <p className="text-sm text-gray-400">
                Status: {course.isAvailable ? "Available" : "Unavailable"}
              </p>
              <div className="mt-2 space-x-2">
                <motion.button
                  onClick={() => handleEdit(course)}
                  className="bg-blue-600 px-3 py-1 rounded-md text-white hover:bg-blue-700 transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Update
                </motion.button>
                <motion.button
                  onClick={() => handleDelete(course._id)}
                  className="bg-red-600 px-3 py-1 rounded-md text-white hover:bg-red-700 transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Delete
                </motion.button>
              </div>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </div>
  );
};

export default CreateCourse;

