"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import SideBarComponent from "@/components/sidebar";
import "@/styles/globals.css";

interface Analytics {
  enrolledStudents: number;
  completedStudents: number;
  performanceMetrics: {
    belowAverage: number;
    average: number;
    aboveAverage: number;
    excellent: number;
  };
  averageCompletionPercentage: number;
  moduleRatings: {
    moduleId: string;
    avgRating: number;
  }[];
}

const CourseAnalytics: React.FC = () => {
  const { id } = useParams();
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch(`http://localhost:3000/progress/${id}/analytics`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error(`Error fetching analytics: ${response.statusText}`);
        }

        const data = await response.json();
        setAnalytics(data);
      } catch (error) {
        console.error("Error fetching analytics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
        <SideBarComponent instructor={true} />
        <div className="flex-1 flex items-center justify-center text-gray-200">
          <p>Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      <SideBarComponent instructor={true} />
      <div className="flex-1 p-8 bg-gray-800 text-gray-200">
        <h1 className="text-3xl font-bold mb-6">Course Analytics</h1>
        {analytics ? (
          <div className="space-y-6">
            {/* Enrollment Metrics */}
            <div className="p-4 bg-gray-700 rounded">
              <h2 className="text-xl font-semibold">Enrollment Metrics</h2>
              <p>Enrolled Students: {analytics.enrolledStudents}</p>
              <p>Completed Students: {analytics.completedStudents}</p>
              <p>Average Completion Percentage: {analytics.averageCompletionPercentage?.toFixed(2)}%</p>
            </div>

            {/* Performance Metrics */}
            <div className="p-4 bg-gray-700 rounded">
              <h2 className="text-xl font-semibold">Performance Metrics</h2>
              <ul>
                <li>Below Average: {analytics.performanceMetrics.belowAverage}</li>
                <li>Average: {analytics.performanceMetrics.average}</li>
                <li>Above Average: {analytics.performanceMetrics.aboveAverage}</li>
                <li>Excellent: {analytics.performanceMetrics.excellent}</li>
              </ul>
            </div>

            {/* Module Ratings */}
            <div className="p-4 bg-gray-700 rounded">
              <h2 className="text-xl font-semibold">Module Ratings</h2>
              {analytics.moduleRatings.length > 0 ? (
                <ul>
                  {analytics.moduleRatings.map((module) => (
                    <li key={module.moduleId} className="mb-2">
                      Module ID: {module.moduleId} - Average Rating: {module.avgRating.toFixed(2)}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No module ratings available</p>
              )}
            </div>
          </div>
        ) : (
          <p>No analytics available</p>
        )}
      </div>
    </div>
  );
};

export default CourseAnalytics;
