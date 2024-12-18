"use client";
import React, { useState, useEffect } from "react";
import SideBarComponent from "@/components/sidebar";
import "@/styles/globals.css";

interface Course {
  _id: string;
  title: string;
  description: string;
  isAvailable: boolean;
}

const CreateCourse: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]); // List of courses
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null); // Track the course to update
  const [message, setMessage] = useState("");

  // Fetch all courses on component load
  const fetchCourses = async () => {
    try {
      const response = await fetch("http://localhost:3000/courses", {
        credentials: "include",
      });
      const data = await response.json();
      setCourses(data);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // Submit a new course or update an existing one
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = selectedCourse ? "PATCH" : "POST";
      const url = selectedCourse
        ? `http://localhost:3000/courses/${selectedCourse._id}`
        : "http://localhost:3000/courses";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description }),
        credentials: "include",
      });

      if (response.ok) {
        setMessage(
          selectedCourse ? "Course updated successfully!" : "Course created successfully!"
        );
        setTitle("");
        setDescription("");
        setSelectedCourse(null);
        fetchCourses(); // Refresh course list
      } else {
        setMessage("Failed to save the course.");
      }
    } catch (error) {
      console.error("Error saving course:", error);
    }
  };

  // Handle course deletion
  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:3000/courses/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (response.ok) {
        setMessage("Course marked as unavailable.");
        fetchCourses(); // Refresh course list
      } else {
        setMessage("Failed to delete the course.");
      }
    } catch (error) {
      console.error("Error deleting course:", error);
    }
  };

  // Populate fields to update a course
  const handleEdit = (course: Course) => {
    setSelectedCourse(course);
    setTitle(course.title);
    setDescription(course.description);
  };

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      <SideBarComponent instructor={true} />
      <div className="flex-1 p-8 bg-gray-800 text-gray-200">
        <h1 className="text-3xl font-bold mb-6">
          {selectedCourse ? "Update Course" : "Create a New Course"}
        </h1>

        {/* Form */}
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
          <button
            type="submit"
            className="bg-[#2f3d52] px-4 py-2 rounded-md text-white"
          >
            {selectedCourse ? "Update Course" : "Create Course"}
          </button>
        </form>

        {/* Message */}
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
