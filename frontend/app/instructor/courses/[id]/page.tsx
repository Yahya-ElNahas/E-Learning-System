"use client";
import React, { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import SideBarComponent from "@/components/sidebar";
import ModuleCardComponent from "@/components/moduleCard";
import "@/styles/globals.css";

interface Module {
  _id: string;
  title: string;
  content: string;
}

const CourseDetails: React.FC<{ params: Promise<{ id: string }> }> = ({ params }) => {
  const unwrappedParams = use(params);
  const [modules, setModules] = useState<Module[]>([]);
  const [course, setCourse] = useState<{ title: string }>({ title: "" });
  const router = useRouter();

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const response = await fetch(`http://localhost:3000/courses/${unwrappedParams.id}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });
        const data = await response.json();
        setCourse(data);
      } catch (error) {
        console.error("Error fetching course data:", error);
      }
    };

    const fetchModuleData = async () => {
      try {
        const response = await fetch(`http://localhost:3000/modules/course/${unwrappedParams.id}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });
        const data = await response.json();
        setModules(data);
      } catch (error) {
        console.error("Error fetching course data:", error);
      }
    };

    fetchCourseData();
    fetchModuleData();
  }, [unwrappedParams.id]);

  const handleCreateModule = () => {
    router.push(`/instructor/courses/${unwrappedParams.id}/module`);
  };

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      <SideBarComponent instructor={true} />
      <div className="flex-1 p-8 bg-gray-800 text-gray-200">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">
            {course?.title || "Loading course title..."}
          </h1>
          <button
            onClick={handleCreateModule}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            + Create Module
          </button>
        </div>
        <div className="space-y-4">
          {modules && modules.length > 0 ? (
            modules.map((module) => (
              <ModuleCardComponent module={module} key={module._id} courseId={unwrappedParams.id} instructor={true} />
            ))
          ) : (
            <p>No modules found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
