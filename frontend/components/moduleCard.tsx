import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Module {
  _id: string;
  title: string;
  content: string;
  difficulty_level: string;
}

interface Props {
  module: Module;
  courseId: string;
  instructor?: boolean;
}

export default function ModuleCardComponent({ module, courseId, instructor = false }: Props) {
  if (!courseId) throw new Error("Course ID should be provided");

  const [quiz, setQuiz] = useState<{ _id: string; numberOfResponses: number } | null>(null);
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
        if (data._id) setQuiz({ _id: data._id, numberOfResponses: data.numberOfResponses });
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
    if (quiz) {
      router.push(`/instructor/courses/${courseId}/module/${module._id}/${quiz._id}`);
    }
  };

  const deleteQuiz = async () => {
    if (quiz && quiz.numberOfResponses === 0) {
      try {
        await fetch(`http://localhost:3000/quizzes/${quiz._id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });
        setQuiz(null);
      } catch (error) {
        console.error("Error deleting quiz:", error);
      }
    }
  };

  const deleteModule = async () => {
    try {
      await fetch(`http://localhost:3000/modules/${module._id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      window.location.reload(); 
    } catch (error) {
      console.error("Error deleting module:", error);
    }
  };

  return (
    <div
      key={module._id}
      className="bg-white dark:bg-[#222831] p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 relative"
    >
      {quiz && !instructor && (
        <div className="absolute top-4 right-4">
          <button
            className="bg-[#C63C51] text-white py-2 px-4 rounded-md hover:bg-[#6e222e] transition-all duration-300"
            onClick={() => router.push(`/student/courses/quiz/${courseId}.${quiz._id}`)}
          >
            Take Quiz
          </button>
        </div>
      )}
      {quiz && instructor && quiz.numberOfResponses === 0 && (
        <div className="absolute top-4 right-4 flex gap-2">
          <button
            className="bg-[#C63C51] text-white py-2 px-4 rounded-md hover:bg-[#6e222e] transition-all duration-300"
            onClick={editQuiz}
          >
            Edit Quiz
          </button>
          <button
            className="bg-[#C63C51] text-white py-2 px-4 rounded-md hover:bg-[#6e222e] transition-all duration-300"
            onClick={deleteQuiz}
          >
            Delete Quiz
          </button>
        </div>
      )}
      {!quiz && instructor && (
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
      <p className="text-gray-600 dark:text-gray-300 mb-4">Difficulty Level: {module.difficulty_level}</p>

      {!instructor && (
        <button className="w-full bg-[#008170] text-white py-2 rounded-md hover:bg-[#005B41] transition-all duration-300">
          Download Resources
        </button>
      )}
      {instructor && (
        <div className="w-full flex gap-2">
          <button
            className="w-[70%] bg-[#008170] text-white py-2 rounded-md hover:bg-[#005B41] transition-all duration-300"
            onClick={() => router.push(`/instructor/courses/${courseId}/module/${module._id}`)}
          >
            Edit
          </button>
          <button
            className="w-[30%] bg-[#C63C51] text-white py-2 rounded-md hover:bg-[#6e222e] transition-all duration-300"
            onClick={() => deleteModule()}
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
