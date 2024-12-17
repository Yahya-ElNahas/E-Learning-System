"use client";
import React, { useEffect, useState } from "react";
import SideBarComponent from "@/components/sidebar";
import ModuleCardComponent from "@/components/moduleCard";

interface Module {
  _id: string;
  title: string;
  content: string;
}

const CourseDetails: React.FC<{ params: { id: string } }> = ({ params }) => {
  const [modules, setModules] = useState<Module[]>([]);
  const [course, setCourse] = useState<{ title: string }>({ title: "" });

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const response = await fetch(`http://localhost:3000/instructor/courses/${params.id}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });
        const data = await response.json();
        setCourse(data.course);
        setModules(data.modules);
      } catch (error) {
        console.error("Error fetching course data:", error);
      }
    };

    fetchCourseData();
  }, [params.id]);

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      <SideBarComponent instructor={true} />
      <div className="flex-1 p-8 bg-gray-800 text-gray-200">
        <h1 className="text-3xl font-bold mb-6">{course.title}</h1>
        <div className="space-y-4">
          {modules.map((module) => (
            <ModuleCardComponent module={module} key={module._id} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
