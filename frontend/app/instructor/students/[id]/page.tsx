"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { NextPage } from "next";
import "@/styles/globals.css";
import { fetchStudentCourses } from "@/app/student/courses/page";
import SideBarComponent from "@/components/sidebar";
import Link from "next/link";
import CourseCardComponent from "@/components/courseCard";

const Student: NextPage = () => {
    const params = useParams();
    const userId = Array.isArray(params.id) ? params.id[0] : params.id;

    const [courses, setCourses] = useState<{ _id: string; title: string; description: string }[]>([]);
      const [loading, setLoading] = useState(true);
      const [searchTerm, setSearchTerm] = useState(""); 
    
      const fetchCourses = async () => {
        try {
          const data = await fetchStudentCourses(userId);
          console.log(data  )
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
    
      const filteredCourses = courses.filter((course) =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase())
        || course.description.toLowerCase().includes(searchTerm.toLowerCase()) 
      );
    
      return (
        <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
          <SideBarComponent courses={true} instructor={true} />
          <div className="flex-1 p-8 bg-gray-800 text-gray-200">
            <div className="flex-1">
    
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
              ) : filteredCourses.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCourses.map((course) => (
                    <CourseCardComponent course={course} key={course._id} instructor={true} />
                  ))}
                </div>
              ) : (
                <p className="text-gray-700 dark:text-gray-300">No courses available.</p>
              )}
            </div>
          </div>
        </div>
      );
}

export default Student;