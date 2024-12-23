'use client'

import React, { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import SideBarComponent from "@/components/sidebar"

interface Analytics {
  enrolledStudents: number
  completedStudents: number
  performanceMetrics: {
    belowAverage: number
    average: number
    aboveAverage: number
    excellent: number
  }
  averageCompletionPercentage: number
  moduleRatings: {
    moduleId: string
    moduleTitle: string
    avgRating: number
  }[]
}

const CourseAnalytics: React.FC = () => {
  const { id } = useParams()
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch(`http://localhost:3000/progress/${id}/analytics`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        })

        if (!response.ok) {
          throw new Error(`Error fetching analytics: ${response.statusText}`)
        }

        const data = await response.json()
        setAnalytics(data)
      } catch (error) {
        console.error("Error fetching analytics:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [id])

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
        <SideBarComponent instructor={true} />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-2xl text-blue-500 animate-pulse">Loading analytics...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <SideBarComponent instructor={true} />
      <div className="flex-1 p-8 overflow-y-auto">
        <h1 className="text-4xl font-bold mb-8 text-white text-center animate-fade-in">
          Course Analytics
        </h1>
        {analytics ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white/10 backdrop-blur-lg border border-gray-700 rounded-lg p-6 animate-slide-up">
              <h2 className="text-2xl font-semibold mb-4 text-blue-400">Enrollment Metrics</h2>
              <div className="space-y-2 text-gray-300">
                <p>Enrolled Students: {analytics.enrolledStudents}</p>
                <p>Completed Students: {analytics.completedStudents}</p>
                <p>Average Completion: {analytics.averageCompletionPercentage?.toFixed(2)}%</p>
              </div>
              <div className="mt-6 h-48 flex items-center justify-center">
                <div className="relative w-40 h-40">
                  <svg viewBox="0 0 36 36" className="w-full h-full">
                    <path
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#4299e1"
                      strokeWidth="2"
                      strokeDasharray={`${analytics.averageCompletionPercentage}, 100`}
                    />
                    <text x="18" y="20" textAnchor="middle" fill="#4299e1" fontSize="8">
                      {analytics.averageCompletionPercentage?.toFixed(2)}%
                    </text>
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-lg border border-gray-700 rounded-lg p-6 animate-slide-up">
              <h2 className="text-2xl font-semibold mb-4 text-blue-400">Performance Metrics</h2>
              <div className="space-y-4">
                {Object.entries(analytics.performanceMetrics).map(([key, value]) => (
                  <div key={key} className="flex items-center">
                    <span className="w-1/3 text-gray-400 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                    <div className="w-2/3 bg-gray-700 rounded-full h-4">
                      <div
                        className="bg-blue-500 rounded-full h-4"
                        style={{ width: `${(value / analytics.enrolledStudents) * 100}%` }}
                      ></div>
                    </div>
                    <span className="ml-2 text-gray-300">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="md:col-span-2 bg-white/10 backdrop-blur-lg border border-gray-700 rounded-lg p-6 animate-slide-up">
              <h2 className="text-2xl font-semibold mb-4 text-blue-400">Module Ratings</h2>
              {analytics.moduleRatings.length > 0 ? (
                <div className="space-y-4">
                  {analytics.moduleRatings.map((module) => (
                    <div key={module.moduleId} className="flex items-center">
                      <span className="w-1/3 text-gray-400">Module: {module.moduleTitle}</span>
                      <div className="w-2/3 bg-gray-700 rounded-full h-4">
                        <div
                          className="bg-teal-500 rounded-full h-4"
                          style={{ width: `${(module.avgRating / 5) * 100}%` }}
                        ></div>
                      </div>
                      <span className="ml-2 text-gray-300">{module.avgRating.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400">No module ratings available</p>
              )}
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-400">No analytics available</p>
        )}
      </div>
    </div>
  )
}

export default CourseAnalytics

