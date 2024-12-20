import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Module {
  _id: string;
  title: string;
  content: string;
}

interface Props {
  module: Module;
  courseId: string;
  instructor?: boolean;
}

export default function ModuleCardComponent({ module, courseId, instructor = false }: Props) {
  if (!courseId) throw new Error("Course ID should be provided");

  const [quizId, setQuizId] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await fetch(`http://localhost:3000/quizzes/module/${module._id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });
        const data = await response.json();
        if (data) setQuizId(data._id);
      } catch (error) {
        console.error("Error fetching quiz:", error);
      }
    };
    fetchQuiz();
  }, [module._id]);

  const createQuiz = async () => {
    try {
      const response = await fetch("http://localhost:3000/quizzes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          module_id: module._id,
        }),
      });

      const data = await response.json();
      if (data._id) {
        router.push(`/instructor/courses/${courseId}/module/${module._id}/${data._id}`);
      }
    } catch (error) {
      console.error("Error creating quiz:", error);
    }
  };

  const editQuiz = () => {
    if (quizId) {
      router.push(`/instructor/courses/${courseId}/module/${module._id}/${quizId}`);
    }
  };

  return (
    <div
      key={module._id}
      className="bg-white dark:bg-[#222831] p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 relative"
    >
      {quizId && !instructor && (
        <div className="absolute top-4 right-4">
          <button
            className="bg-[#C63C51] text-white py-2 px-4 rounded-md hover:bg-[#6e222e] transition-all duration-300"
            onClick={() => router.push(`/student/courses/quiz/${quizId}`)}
          >
            Take Quiz
          </button>
        </div>
      )}
      {quizId && instructor && (
        <div className="absolute top-4 right-4">
          <button
            className="bg-[#C63C51] text-white py-2 px-4 rounded-md hover:bg-[#6e222e] transition-all duration-300"
            onClick={editQuiz}
          >
            Edit Quiz
          </button>
        </div>
      )}
      {!quizId && instructor && (
        <div className="absolute top-4 right-4">
          <button
            className="bg-[#C63C51] text-white py-2 px-4 rounded-md hover:bg-[#6e222e] transition-all duration-300"
            onClick={createQuiz}
          >
            Create Quiz
          </button>
        </div>
      )}

      <h2 className="text-xl font-bold text-gray-700 dark:text-gray-200 mb-2">{module.title}</h2>
      <p className="text-gray-600 dark:text-gray-300 mb-4">{module.content}</p>
      {!instructor && (
        <button className="w-full bg-[#008170] text-white py-2 rounded-md hover:bg-[#005B41] transition-all duration-300">
          Download Resources
        </button>
      )}
      {instructor && (
        <button
          className="w-full bg-[#008170] text-white py-2 rounded-md hover:bg-[#005B41] transition-all duration-300"
          onClick={() => router.push(`/instructor/courses/${courseId}/module/${module._id}`)}
        >
          Edit
        </button>
      )}
    </div>
  );
}
