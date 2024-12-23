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
  isOutdated: boolean;
  difficulty_level: string;
  resources?: {path: string, type: string}[]
}

const CourseDetails: React.FC<{ params: Promise<{ id: string }> }> = ({ params }) => {
  const unwrappedParams = use(params);
  const [modules, setModules] = useState<Module[]>([]);
  const [filteredModules, setFilteredModules] = useState<Module[]>([]);
  const [course, setCourse] = useState<{ title: string }>({ title: "" });
  const [avgScore, setAvgScore] = useState<number>(0);
  const [filterApplied, setFilterApplied] = useState(false);

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/modules/course/${unwrappedParams.id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );
        const data: Module[] = await response.json();
        const mod = data.filter((module) => !module.isOutdated);
        setModules(mod);
        setFilteredModules(mod); 
      } catch (error) {
        console.error("Error fetching course details:", error);
      }
    };

    const fetchCourse = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/courses/${unwrappedParams.id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );
        const data = await response.json();
        setCourse(data);
      } catch (error) {
        console.error("Error fetching course details:", error);
      }
    };

    const fetchAvgScore = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/responses/student/avgScore/all",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );
        const data = await response.json();
        setAvgScore(data.average);
      } catch (error) {
        console.error("Error fetching average score:", error);
      }
    };

    fetchCourse();
    fetchModules();
    fetchAvgScore();
  }, [unwrappedParams.id]);

  const handleFilterModules = () => {
    if (!avgScore) return;
    let filtered = !filterApplied;
    setFilterApplied(filtered);

    if(filtered) {
      let filteredMod;
      if (avgScore >= 80) {
        filteredMod = modules; 
      } else if (avgScore >= 60 && avgScore < 80) {
        filteredMod = modules.filter((module) => module.difficulty_level !== "advanced");
      } else {
        filteredMod = modules.filter((module) => module.difficulty_level === "beginner");
      }

      setFilteredModules(filteredMod);
    } else setFilteredModules(modules)
  };

  if (!modules) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      <SideBarComponent courses={true} student={true} />
      <div className="flex-1 p-8 bg-gray-800 text-gray-200">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-200">{course.title}</h1>
          <button
            onClick={handleFilterModules}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-all duration-300"
          >
            {filterApplied ? "Show All Modules" : "Filter Modules by Score"}
          </button>
        </div>

        <div className="flex-1 p-6">
          <div className="space-y-6">
            {filteredModules.map((module) => (
              <ModuleCardComponent
                module={module}
                key={module._id}
                courseId={unwrappedParams.id}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
