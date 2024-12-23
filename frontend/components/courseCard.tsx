import { useState } from "react";
import "@/styles/globals.css";
import { useRouter } from "next/navigation";

interface Course {
  title: string;
  description: string;
  _id: string;
  completion_percentage?: number;
  enrolledNo?: number;
  completedNo?: number;
  modulesNo?: number;
  avgScore?: string;
}

interface CardComponentProps {
  course: Course;
  enrollment?: boolean;
  student?: boolean;
  instructor?: boolean;
}

export default function CourseCardComponent({ course, enrollment = false, student = false, instructor = false }: CardComponentProps) {
  const [enrolled, setEnrolled] = useState(false);

  const router = useRouter();

  const handleCourseClick = () => {
    if (student) {
      router.push(`/student/courses/${course._id}`);
    } else {
      router.push(`/instructor/courses/${course._id}`);
    }
  };

  const handleAnalyticsClick = () => {
    router.push(`/instructor/courses/${course._id}/analytics`);
  };

  const enroll = async () => {
    try {
      const response = await fetch("http://localhost:3000/progress", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ course_id: course._id }),
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Enrollment failed");
      }

      setEnrolled(true);
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    } catch (error) {
      console.error("Error enrolling:", error);
    }
  };

  if (enrolled) {
    return (
      <div className="bg-gradient-to-r from-green-100 to-green-200 dark:from-green-800 dark:to-green-900 p-6 rounded-lg shadow-lg transition-all duration-300">
        <h2 className="text-2xl font-extrabold text-green-800 dark:text-green-200 mb-2">Enrollment Successful!</h2>
        <p className="text-gray-700 dark:text-gray-300">You have been successfully enrolled in {course.title}.</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all transform duration-300">
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">{course.title}</h2>
      <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">Completion Percentage: {course.completion_percentage || 0}%</p>
      <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">Modules: {course.modulesNo || 0}</p>

      {student && (
        <div className="mt-4 flex gap-4">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-600 transition-all duration-300"
          onClick={handleCourseClick}
        >
          View Course
        </button>
      </div>
      )}

      {instructor && (
        <div className="mt-4">
          <p className="text-gray-600 dark:text-gray-400 text-sm">Enrolled Students: {course.enrolledNo || 0}</p>
          <p className="text-gray-600 dark:text-gray-400 text-sm">Completed Students: {course.completedNo || 0}</p>
          <p className="text-gray-600 dark:text-gray-400 text-sm">Average Score: {course.avgScore || "N/A"}</p>

          <div className="mt-4 flex gap-4">
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-600 transition-all duration-300"
              onClick={handleCourseClick}
            >
              View Course
            </button>
            <button
              className="bg-green-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-600 transition-all duration-300"
              onClick={handleAnalyticsClick}
            >
              Analytics
            </button>
          </div>
        </div>
      )}

      {enrollment && (
        <>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{course.description}</p>
          <button
            className="w-full bg-gradient-to-r from-green-500 to-teal-500 text-white py-2 rounded-lg font-semibold hover:from-green-600 hover:to-teal-600 transition-all duration-300"
            onClick={enroll}
          >
            Enroll Now
          </button>
        </>
      )}
    </div>
  );
}
