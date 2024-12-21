"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SideBarComponent from "@/components/sidebar";
import "@/styles/globals.css";

interface Course {
  _id: string;
  title: string;
}

const CourseList: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch("http://localhost:3000/courses", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error(`Error fetching courses: ${response.statusText}`);
        }

        const data = await response.json();
        setCourses(data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleCourseClick = (courseId: string) => {
    router.push(`/instructor/courses/${courseId}/analytics`);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
        <SideBarComponent instructor={true} />
        <div className="flex-1 flex items-center justify-center text-gray-200">
          <p>Loading courses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      <SideBarComponent instructor={true} />
      <div className="flex-1 p-8 bg-gray-800 text-gray-200">
        <h1 className="text-3xl font-bold mb-6">Instructor Courses</h1>
        <div className="space-y-4">
          {courses && courses.length > 0 ? (
            courses.map((course) => (
              <div
                key={course._id}
                className="p-4 bg-gray-700 rounded shadow cursor-pointer hover:bg-gray-600"
                onClick={() => handleCourseClick(course._id)}
              >
                <h2 className="text-xl font-semibold">{course.title}</h2>
              </div>
            ))
          ) : (
            <p>No courses found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseList;
