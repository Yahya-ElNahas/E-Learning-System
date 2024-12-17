"use client";
import { NextPage } from "next";
import { useEffect, useState } from "react";
import SideBarComponent from "@/components/sidebar";
import "@/styles/globals.css";

export async function fetchInstructors() {
  const response = await fetch("http://localhost:3000/users/instructors/all", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
  const data: {_id: string, email: string, name: string, role: string}[] = await response.json();
  console.log(data)
  return data;
}

const Instructors: NextPage = () => {
  const [instructors, setInstructors] = useState<
    { _id: string; name: string; email: string; profile_picture_url?: string }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(""); // State for search input

  // Fetch instructors
  const fetchAllInstructors = async () => {
    try {
      const data = await fetchInstructors();
      setInstructors(data);
    } catch (error) {
      console.error("Error fetching instructors:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllInstructors();
  }, []);

  // Filter instructors based on search term
  const filteredInstructors = instructors.filter((instructor) =>
    instructor.name.toLowerCase().includes(searchTerm.toLowerCase())
    || instructor.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      <SideBarComponent courses={false} student={true} />
      <div className="flex-1 p-8 bg-gray-800 text-gray-200">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-700 dark:text-gray-200">Instructors</h1>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search for instructors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 rounded-md bg-gray-100 dark:bg-[#1c1f24] text-gray-900 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#008170]"
          />
        </div>

        {/* Instructors List */}
        {loading ? (
          <p className="text-gray-700 dark:text-gray-300">Loading instructors...</p>
        ) : filteredInstructors.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredInstructors.map((instructor) => (
              <div
                key={instructor._id}
                className="bg-white dark:bg-[#222831] p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                {instructor.profile_picture_url ? (
                  <img
                    src={instructor.profile_picture_url}
                    alt={instructor.name}
                    className="w-20 h-20 rounded-full mx-auto mb-4 object-cover"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-gray-300 mx-auto mb-4"></div>
                )}
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 text-center">
                  {instructor.name}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                  {instructor.email}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-700 dark:text-gray-300">No instructors found.</p>
        )}
      </div>
    </div>
  );
};

export default Instructors;
