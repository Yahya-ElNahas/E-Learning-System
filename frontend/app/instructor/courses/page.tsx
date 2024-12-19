"use client";
import React, { useState, useEffect } from "react";
import SideBarComponent from "@/components/sidebar";
import Link from "next/link";
import "@/styles/globals.css";
import CourseCardComponent from "@/components/courseCard";

export async function fetchInstructorCourses() {
  const response = await fetch("http://localhost:3000/courses/search/instructor", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  const data = await response.json();
  return data;
}

const InstructorCourses: React.FC = () => {
  const [courses, setCourses] = useState<
    { _id: string; title: string; description: string; isAvailable?: boolean }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await fetchInstructorCourses();
        setCourses(data);
      } catch (error) {
        console.error("Error fetching instructor courses:", error);
        setMessage("Error fetching courses.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900 relative">
      <SideBarComponent instructor={true} />
      <div className="flex-1 p-8 bg-gray-800 text-gray-200">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">My Courses</h1>
          {/* Move "Create and Edit Courses" button to top-right */}
          <Link href="/instructor/courses/create">
            <button className="bg-[#2f3d52] text-white px-4 py-2 rounded-md shadow-lg">
              Create and Edit Courses
            </button>
          </Link>
        </div>

        {message && <p className="text-green-400 mb-4">{message}</p>}

        {loading ? (
          <p>Loading courses...</p>
        ) : courses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div
                key={course._id}
                className={`relative rounded-lg shadow-md p-4 ${
                  course.isAvailable ? "bg-gray-700" : "bg-gray-700 text-gray-200"
                } flex flex-col justify-between h-full`} // Added flexbox and height
              >
                {/* Course Name and Unavailable label aligned to the right */}
                <div className="flex justify-between items-center">
                  {/* Only show "Unavailable" label if course is not available */}
                  {!course.isAvailable && (
                    <div className="flex items-center gap-2 text-yellow-300">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="2"
                        stroke="currentColor"
                        className="w-6 h-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 9v2m0 4h.01M4.93 19h14.14a2 2 0 001.732-3L13.732 4a2 2 0 00-3.464 0L3.198 16a2 2 0 001.732 3z"
                        />
                      </svg>
                      <span className="text-sm font-bold">Unavailable</span>
                    </div>
                  )}
                </div>

                {/* Course content remains inside the card */}
                <CourseCardComponent course={course} instructor={true} />
              </div>
            ))}
          </div>
        ) : (
          <p>No courses found. Start by creating a course!</p>
        )}
      </div>
    </div>
  );
};

export default InstructorCourses;
