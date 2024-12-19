"use client";
import SideBarComponent from "@/components/sidebar";
import { NextPage } from "next";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import "@/styles/globals.css";
import CourseCardComponent from "@/components/courseCard";

export async function fetchStudentCourses(id?: string) {
  const url = id
    ? `http://localhost:3000/progress/${id}/courses`
    : "http://localhost:3000/progress/student/courses";
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
  const data = await response.json();
  return data;
}

const StudentCourses: NextPage = () => {
  const [courses, setCourses] = useState<
    { _id: string; title: string; description: string; completion_percentage: number; enrolledNo: number; completedNo: number; modulesNo: number }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showCompleted, setShowCompleted] = useState(false);
  const [avgScore, setAvgScore] = useState<string>('');

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

  const fetchAvgScore = async () => {
    try {
      const response = await fetch('http://localhost:3000/responses/student/avgScore/all', {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      const data = await response.json();
      setAvgScore(data.average);
    } catch (error) {
      console.error("Error fetching average score:", error);
    }
  };

  useEffect(() => {
    fetchCourses();
    fetchAvgScore();
  }, []);

  const filteredCourses = courses
    .filter((course) =>
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((course) => (showCompleted ? true : course.completion_percentage < 100));

    return (
      <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
        <SideBarComponent courses={true} student={true} />
        <div className="flex-1 p-8 bg-gray-800 text-gray-200">
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-4">
                <h1 className="text-3xl font-bold text-gray-700 dark:text-gray-200">Courses</h1>
                <span className="text-sm text-gray-500 dark:text-gray-400 bg-gray-200 dark:bg-gray-700 px-3 py-1 rounded">
                  Average Score: {avgScore ? avgScore : 'Error'}
                </span>
              </div>
              <button className="bg-[#2f3d52] text-white px-4 py-2 rounded-md hover:bg-[#1b2027] transition-all duration-300 shadow-md">
                <Link href="/student/courses/enroll">Enroll in Courses</Link>
              </button>
            </div>
    
            <div className="mb-6 flex gap-4 items-center">
              <input
                type="text"
                placeholder="Search for courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-3 rounded-md bg-gray-100 dark:bg-[#1c1f24] text-gray-900 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#008170]"
              />
              <button
                onClick={() => setShowCompleted((prev) => !prev)}
                className={`px-4 py-2 rounded-md text-white ${
                  showCompleted
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-red-600 hover:bg-red-700"
                } transition-all duration-300`}
              >
                {showCompleted ? "Hide Completed Courses" : "Show Completed Courses"}
              </button>
            </div>
    
            {loading ? (
              <p className="text-gray-700 dark:text-gray-300">Loading courses...</p>
            ) : filteredCourses.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCourses.map((course) => (
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
