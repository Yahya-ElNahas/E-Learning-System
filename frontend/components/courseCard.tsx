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

  const handleCardClick = () => {
    if (student) {
      router.push(`/student/courses/${course._id}`); 
    } else router.push(`/instructor/courses/${course._id}`)
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
      <div className="bg-green-100 dark:bg-green-800 p-6 rounded-lg shadow-md transition-shadow duration-300">
        <h2 className="text-lg font-bold text-green-700 dark:text-green-300 mb-2">Enrollment Successful!</h2>
        <p className="text-gray-600 dark:text-gray-300">You have been successfully enrolled in {course.title}.</p>
      </div>
    );
  }

  if (student || instructor) {
    return (
      <div
        className="bg-white dark:bg-[#222831] p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer"
        onClick={handleCardClick} 
      >
        <h2 className="text-xl font-bold text-gray-700 dark:text-gray-200 mb-2">{course.title}</h2>
        <p>Completion Percentage: {course.completion_percentage}%</p>
        <p>Modules: {course.modulesNo}</p>
        {instructor && (
          <>
            <p>Enrolled Students: {course.enrolledNo}</p>
            <p>Completed Students: {course.completedNo}</p>
            <p>Average Score: {course.avgScore}</p>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-[#222831] p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
      <h2 className="text-xl font-bold text-gray-700 dark:text-gray-200 mb-2">{course.title}</h2>

      {enrollment && (
        <>
          <p className="text-gray-600 dark:text-gray-300">{course.description}</p>
          <button
            className="mt-4 w-full bg-[#008170] text-white py-2 rounded-md hover:bg-[#005B41] transition-all duration-300"
            onClick={enroll}
          >
            Enroll
          </button>
        </>
      )}
    </div>
  );
}
