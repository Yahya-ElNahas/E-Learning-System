"use client";
import { useEffect, useState } from "react";
import React, { use } from "react";
import "@/styles/globals.css";
import SideBarComponent from "@/components/sidebar";
import ModuleCardComponent from "@/components/moduleCard";

interface Module {
  _id: string;
  title: string;
  content: string;
}

const CourseDetails: React.FC<{ params: Promise<{ id: string }> }> = ({ params }) => {
  const unwrappedParams = use(params);
  const [modules, setModules] = useState<Module[]>([]);
  const [course, setCourse] = useState<{title: string}>({title:""});

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const response = await fetch(`http://localhost:3000/modules/course/${unwrappedParams.id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });
        const data = await response.json();
        setModules(data);
      } catch (error) {
        console.error("Error fetching course details:", error);
      }
    };

    const fetchCourse = async () => {
      try {
        const response = await fetch(`http://localhost:3000/courses/${unwrappedParams.id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });
        const data = await response.json();
        setCourse(data);
      } catch (error) {
        console.error("Error fetching course details:", error);
      }
    };

    fetchCourse();
    fetchModules();
  }, [unwrappedParams.id]);

  if (!modules) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      <SideBarComponent courses={true} student={true} title={course.title} />
        <div className="flex-1 p-8 bg-gray-800 text-gray-200">
        <div className="flex-1">

      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="space-y-6">
          {modules.map((module) => (
            <ModuleCardComponent module={module} key={module._id} courseId={unwrappedParams.id} />
          ))}
        </div>
      </div>
      </div>
    </div>
    </div>
  );
};

export default CourseDetails;
