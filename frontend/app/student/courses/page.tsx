"use client";
import SideBarComponent from "@/components/sidebar";
import { NextPage } from "next";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import '@/styles/globals.css';
import CourseCardComponent from "@/components/courseCard";

export async function fetchStudentCourses() {
    const response = await fetch("http://localhost:3000/progress/student/courses", {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      }); 
      const data = await response.json();
      return data;
}

const StudentCourses: NextPage = () => {
  const [courses, setCourses] = useState<{ _id: string; title: string; description: string }[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch courses (mock API example)
  const fetchCourses = async () => {
    try {
      const data = await fetchStudentCourses();
      setCourses(data);
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      <SideBarComponent courses={true} student={true} />
      <div className="flex-1 p-8 bg-gray-800 text-gray-200">
      <div className="flex-1">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-700 dark:text-gray-200">Courses</h1>
            <button className="bg-[#2f3d52] text-white px-4 py-2 rounded-md hover:bg-[#1b2027] transition-all duration-300 shadow-md">
                <Link href="/student/courses/enroll">
                    Enroll in Courses
                </Link>
            </button>
        </div>

        {/* Courses List */}
        {loading ? (
          <p className="text-gray-700 dark:text-gray-300">Loading courses...</p>
        ) : courses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <CourseCardComponent course={course} key={course._id} student={true} />
            ))}
          </div>
        ) : (
          <p className="text-gray-700 dark:text-gray-300">No courses available.</p>
        )}
      </div>
    </div>
    </div>
  );
};

export default StudentCourses;
