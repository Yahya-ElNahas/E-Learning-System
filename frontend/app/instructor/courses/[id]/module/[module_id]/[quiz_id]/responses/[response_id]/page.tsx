"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "@/styles/globals.css";

interface Answer {
  question: string;
  answer: string;
  correctAnswer: string;
  isCorrect: boolean;
}

interface Response {
  _id: string;
  answers: Answer[];
  userEmail: string;
  score: number;
  createdAt: string;
}

export default function ResponseDetailsPage({
  params: paramsPromise,
}: {
  params: Promise<{ quiz_id: string; module_id: string; id: string; response_id: string }>;
}) {
  const [params, setParams] = useState<{
    quiz_id: string;
    module_id: string;
    id: string;
    response_id: string;
  } | null>(null);
  const [response, setResponse] = useState<Response | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchParams = async () => {
      const unwrappedParams = await paramsPromise;
      setParams(unwrappedParams);
    };

    fetchParams();
  }, [paramsPromise]);

  useEffect(() => {
    const fetchResponse = async () => {
      if (!params) return;

      try {
        const response = await fetch(
          `http://localhost:3000/responses/${params.response_id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );
        if (!response.ok) throw new Error("Failed to fetch response details");
        const data = await response.json();
        console.log(data)
        try {
          const userResponse = await fetch(`http://localhost:3000/users/${data.user_id}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          });
          if (!userResponse.ok) throw new Error("Failed to fetch email");
          const user = await userResponse.json();
          data.userEmail = user.email;
        } catch (err) {
          setError("Error fetching email");
          console.error(err);
        }
        setResponse(data);
      } catch (err) {
        setError("Error fetching response details");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchResponse();
  }, [params]);

  if (loading || !params) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading response details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>{error}</p>
      </div>
    );
  }

  if (!response) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Response not found</p>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-100 dark:bg-[#222831] min-h-screen">
      <h1 className="text-3xl font-bold text-gray-700 dark:text-gray-200 mb-6">
        Response Details
      </h1>

      <div className="bg-white dark:bg-[#1e293b] shadow-md rounded-lg p-6">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-700 dark:text-gray-200 mb-2">
            Student Email: {response.userEmail}
          </h2>
          <p className="text-gray-600 dark:text-gray-300">Score: {response.score}</p>
          <p className="text-gray-600 dark:text-gray-300">Submitted At: {new Date(response.createdAt).toLocaleString()}</p>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">Answers</h3>
          <table className="w-full table-auto border-collapse border border-gray-300 dark:border-gray-700">
            <thead>
              <tr className="bg-gray-200 dark:bg-[#334155]">
                <th className="border border-gray-300 dark:border-gray-700 px-4 py-2">Question</th>
                <th className="border border-gray-300 dark:border-gray-700 px-4 py-2">Your Answer</th>
                <th className="border border-gray-300 dark:border-gray-700 px-4 py-2">Correct Answer</th>
                <th className="border border-gray-300 dark:border-gray-700 px-4 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {response.answers.map((answer, index) => (
                <tr key={index} className="hover:bg-gray-100 dark:hover:bg-[#475569]">
                  <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">
                    {answer.question}
                  </td>
                  <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">{answer.answer}</td>
                  <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">{answer.correctAnswer}</td>
                  <td
                    className={`border border-gray-300 dark:border-gray-700 px-4 py-2 ${
                      answer.answer == answer.correctAnswer ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {answer.answer == answer.correctAnswer ? "Correct" : "Incorrect"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-6">
        <button
          onClick={() => router.push(`/instructor/courses/${params.id}/module/${params.module_id}/${params.quiz_id}/responses`)}
          className="bg-[#008170] text-white py-2 px-4 rounded-md hover:bg-[#005B41] transition-all duration-300"
        >
          Back to Responses
        </button>
      </div>
    </div>
  );
}
