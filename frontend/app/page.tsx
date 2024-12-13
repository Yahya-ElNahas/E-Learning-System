"use client";

import { useEffect, useState } from "react";
import CardComponent from "@/components/card";
import NavbarComponent from "@/components/navbar";

export default function App() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetch("http://localhost:3000/courses")
      .then((response) => response.json())
      .then((data) => {
        setCourses(data);
        console.log(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching courses:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-gray-200">
      <NavbarComponent courses={false} />
      <div className="flex justify-center items-center">
        <h1 className="text-6xl font-extrabold font-sans">Courses</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        {courses.map((course) => (
          <CardComponent key={course._id} course={course} />
        ))}
      </div>
    </div>
  );
}
