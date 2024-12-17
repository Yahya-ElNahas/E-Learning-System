"use client";
import SideBarComponent from "@/components/sidebar";
import { NextPage } from "next";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { fetchStudentCourses } from "../page";
import '@/styles/globals.css';
import CourseCardComponent from "@/components/courseCard";

export async function fetchAllCourses() {
  const response = await fetch("http://localhost:3000/courses", {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });
  const data = await response.json();
  return data;
}

const StudentEnrollment: NextPage = () => {
  const [courses, setCourses] = useState<{ _id: string; title: string; description: string }[]>([]);
  const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState(""); 

  const fetchCourses = async () => {
    try {
      const enrolled = await fetchStudentCourses();
      const all = await fetchAllCourses();

      const available = all.filter(
        (course: { _id: string }) => !enrolled.some((enrolledCourse: { _id: string }) => enrolledCourse._id === course._id)
      );
      setCourses(available);
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const availableCourses = courses.filter((course) =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) 
    || course.description.toLowerCase().includes(searchTerm.toLowerCase()) 
  );

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      <SideBarComponent courses={true} student={true} />
      <div className="flex-1 p-8 bg-gray-800 text-gray-200">
        <div className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-700 dark:text-gray-200">Available Courses</h1>
            <button className="bg-[#2f3d52] text-white px-4 py-2 rounded-md hover:bg-[#1b2027] transition-all duration-300 shadow-md">
              <Link href="/student/courses">Go to My Courses</Link>
            </button>
          </div>

          <div className="mb-6">
            <input
              type="text"
              placeholder="Search for courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-3 rounded-md bg-gray-100 dark:bg-[#1c1f24] text-gray-900 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#008170]"
            />
          </div>

          {loading ? (
            <p className="text-gray-700 dark:text-gray-300">Loading courses...</p>
          ) : availableCourses.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableCourses.map((course) => (
                <CourseCardComponent course={course} key={course._id} enrollment={true} />
              ))}
            </div>
          ) : (
            <p className="text-gray-700 dark:text-gray-300">All courses are already enrolled!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentEnrollment;
