import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Module {
    _id: string;
    title: string;
    content: string;
}

interface Props {
    module: Module;
    courseId: string
}

export default function ModuleCardComponent({module, courseId}: Props) {

    if(!courseId) throw new Error('Course ID should be provided');

    const [quizId, setQuizId] = useState<string>('');

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
                try {
                    const data = await response.json();
                    if(data) setQuizId(data._id);
                } catch(e) {}
            } catch(e) {
                console.error(e);
            }
        }
        fetchQuiz();
    }, []);

    const takeQuiz = async () => {
        router.push(`/student/courses/quiz/${quizId}`)
    }


    return (
        <div
          key={module._id}
          className="bg-white dark:bg-[#222831] p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 relative"
        >
          {(quizId) && (
            <div className="absolute top-4 right-4">
              <button className="bg-[#C63C51] text-white py-2 px-4 rounded-md hover:bg-[#6e222e] transition-all duration-300"
              onClick={takeQuiz}
              >
                Take Quiz
              </button>
            </div>
          )}
      
          <h2 className="text-xl font-bold text-gray-700 dark:text-gray-200 mb-2">
            {module.title}
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">{module.content}</p>
          <button className="w-full bg-[#008170] text-white py-2 rounded-md hover:bg-[#005B41] transition-all duration-300">
            Download Resources
          </button>
        </div>
      );
      
}