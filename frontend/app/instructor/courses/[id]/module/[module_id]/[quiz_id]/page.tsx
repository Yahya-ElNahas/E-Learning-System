"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import "@/styles/globals.css";

interface Question {
  question: string;
  options: string[];
  correctAnswer: string;
  difficulty: string;
}

const EditQuizPage = () => {
  const router = useRouter();
  const params = useParams();
  const [quiz_id, setQuiz_id] = useState<string | null>(null);
  const [course_id, setCourse_id] = useState<string | null>(null);
  const [questionsPool, setQuestionsPool] = useState<Question[]>([]);
  const [numberOfQuestions, setNumberOfQuestions] = useState<number>(0);
  const [newQuestion, setNewQuestion] = useState<Question>({
    question: "",
    options: ["", "", "", ""],
    correctAnswer: "",
    difficulty: "beginner",
  });

  useEffect(() => {
    const loadParams = async () => {
        if (params) {
          const quiz_id = Array.isArray(params.quiz_id) ? params.quiz_id[0] : params.quiz_id;
          const course_id = Array.isArray(params.id) ? params.id[0] : params.id;
          if (quiz_id) {
            setQuiz_id(quiz_id);
          } else {
            setQuiz_id(null);
          }
          if (course_id) {
            setCourse_id(course_id);
          } else {
            setCourse_id(null);
          }
        }
      };
      
    loadParams();
  }, [params]);

  const fetchQuiz = async () => {
    if (!quiz_id) return;

    try {
      const response = await fetch(`http://localhost:3000/quizzes/${quiz_id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      const data = await response.json();
      setQuestionsPool(data.questionsPool);
      setNumberOfQuestions(data.numberOfQuestions);
    } catch (error) {
      console.error("Error fetching quiz:", error);
    }
  };

  useEffect(() => {
    fetchQuiz();
  }, [quiz_id]);

  const addQuestion = () => {
    setQuestionsPool([...questionsPool, newQuestion]);
    setNewQuestion({
      question: "",
      options: ["", "", "", ""],
      correctAnswer: "",
      difficulty: "beginner",
    });
  };

  const removeQuestion = (index: number) => {
    const updatedQuestionsPool = [...questionsPool];
    updatedQuestionsPool.splice(index, 1);
    setQuestionsPool(updatedQuestionsPool);
  };

  const saveQuiz = async () => {
    if (!quiz_id) return;

    try {
      await fetch(`http://localhost:3000/quizzes/${quiz_id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ questionsPool, numberOfQuestions }),
      });
      router.push(`/instructor/courses/${course_id}`)
    } catch (error) {
      console.error("Error saving quiz:", error);
    }
  };

  if (!quiz_id) {
    return <p>Loading...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-8">
      <div className="max-w-3xl mx-auto bg-white dark:bg-[#222831] p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-gray-700 dark:text-gray-200 mb-6">
          Edit Quiz
        </h1>

        {/* Questions List */}
        <div className="space-y-4">
          {questionsPool.map((question, index) => (
            <div
              key={index}
              className="p-4 bg-gray-200 dark:bg-[#333941] rounded-md"
            >
              <div className="flex justify-between">
                <h2 className="text-lg font-bold text-gray-700 dark:text-gray-200">
                  {question.question}
                </h2>
                <button
                  onClick={() => removeQuestion(index)}
                  className="bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600"
                >
                  Remove
                </button>
              </div>
              <ul className="list-disc list-inside mt-2 text-gray-600 dark:text-gray-300">
                {question.options.map((option, idx) => (
                  option && <li key={idx}>{option}</li>
                ))}
              </ul>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Correct Answer: {question.correctAnswer} | Difficulty:{" "}
                {question.difficulty}
              </p>
            </div>
          ))}
        </div>

        {/* Add New Question */}
        <div className="mt-8">
          <h2 className="text-xl font-bold text-gray-700 dark:text-gray-200 mb-4">
            Add New Question
          </h2>
          <input
            type="text"
            placeholder="Question"
            value={newQuestion.question}
            onChange={(e) =>
              setNewQuestion({ ...newQuestion, question: e.target.value })
            }
            className="w-full mb-4 p-2 rounded-md bg-gray-100 dark:bg-[#333941] text-gray-900 dark:text-gray-300 focus:outline-none"
          />
          <div className="grid grid-cols-2 gap-4 mb-4">
            {newQuestion.options.map((option, index) => (
              <input
                key={index}
                type="text"
                placeholder={`Option ${index + 1}`}
                value={option}
                onChange={(e) => {
                  const updatedOptions = [...newQuestion.options];
                  updatedOptions[index] = e.target.value;
                  setNewQuestion({ ...newQuestion, options: updatedOptions });
                }}
                className="p-2 rounded-md bg-gray-100 dark:bg-[#333941] text-gray-900 dark:text-gray-300 focus:outline-none"
              />
            ))}
          </div>
          <select
            value={newQuestion.correctAnswer}
            onChange={(e) =>
              setNewQuestion({ ...newQuestion, correctAnswer: e.target.value })
            }
            className="w-full mb-4 p-2 rounded-md bg-gray-100 dark:bg-[#333941] text-gray-900 dark:text-gray-300 focus:outline-none"
          >
            <option value="">Select Correct Answer</option>
            {newQuestion.options.map((option, index) => (
              <option key={index} value={option}>
                {option || `Option ${index + 1}`}
              </option>
            ))}
          </select>
          <select
            value={newQuestion.difficulty}
            onChange={(e) =>
              setNewQuestion({ ...newQuestion, difficulty: e.target.value })
            }
            className="w-full mb-4 p-2 rounded-md bg-gray-100 dark:bg-[#333941] text-gray-900 dark:text-gray-300 focus:outline-none"
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">intermediate</option>
            <option value="advanced">advanced</option>
          </select>
          <button
            onClick={addQuestion}
            className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700"
          >
            Add Question
          </button>
        </div>
            <br />
        <h2 className="text-xl font-bold text-gray-700 dark:text-gray-200 mb-4">
            Number of Questions:
          </h2>

        <input
            type="number"
            placeholder="Number of Questions"
            value={numberOfQuestions}
            onChange={(e) => {
                const value = e.target.value ? Number(e.target.value) : 0;
                if (!isNaN(value) && value >= 0) { 
                setNumberOfQuestions(value);
                }
            }}
            className="w-full mb-4 p-2 rounded-md bg-gray-100 dark:bg-[#333941] text-gray-900 dark:text-gray-300 focus:outline-none"
        />


        {/* Save Button */}
        <button
          onClick={saveQuiz}
          className="mt-8 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
        >
          Save Quiz
        </button>
      </div>
    </div>
  );
};

export default EditQuizPage;
