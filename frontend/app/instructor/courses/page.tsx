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
  const [courses, setCourses] = useState<{ _id: string; title: string; description: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await fetchInstructorCourses();
        setCourses(data);
      } catch (error) {
        console.error("Error fetching instructor courses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      <SideBarComponent instructor={true} />
      <div className="flex-1 p-8 bg-gray-800 text-gray-200">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">My Courses</h1>
          <Link href="/instructor/courses/create">
            <button className="bg-[#2f3d52] text-white px-4 py-2 rounded-md">
              Create and Edit Courses
            </button>
          </Link>
        </div>

        {loading ? (
          <p>Loading courses...</p>
        ) : courses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <CourseCardComponent course={course} key={course._id} instructor={true} />
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
