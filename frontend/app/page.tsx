"use client";

import { useEffect, useState } from "react";
import CardComponent from "@/components/courseCard";
import NavbarComponent from "@/components/navbar";
import { NextPage } from "next";

const App: NextPage = () => {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetch("http://localhost:3000/courses")
      .then((response) => response.json())
      .then((data) => {
        setCourses(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching courses:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return load();
  }

  return (
    <div className="bg-gray-200">
      <NavbarComponent index={true} />
      <div className="flex justify-center items-center">
        <h1 className="text-5xl font-extrabold font-sans text-blue-900 tracking-wide">
          Courses
        </h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        {courses.map((course) => (
          <CardComponent key={course._id} course={course} />
        ))}
      </div>
    </div>
  );
}

export function load() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="text-2xl font-semibold text-teal-600">
          Loading
          <span className="dot-animation"></span>
        </div>
      </div>
  );
}

export default App;