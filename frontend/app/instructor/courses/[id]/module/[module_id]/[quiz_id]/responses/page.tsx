"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "@/styles/globals.css";

interface Response {
  _id: string;
  answers: { question: string; answer: string; isCorrect: boolean }[];
  userEmail: string;
  score: number;
  submittedAt: string;
}

export default function ResponsesPage({ params: paramsPromise }: { params: Promise<{ quiz_id: string; module_id: string; id: string; }> }) {
  const [params, setParams] = useState<{ quiz_id: string; module_id: string; id: string; } | null>(null);
  const [responses, setResponses] = useState<Response[]>([]);
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
    const fetchResponses = async () => {
      if (!params) return;

      try {
        const response = await fetch(`http://localhost:3000/responses/student/quiz/${params.quiz_id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });
        if (!response.ok) throw new Error("Failed to fetch responses");
        const data = await response.json();
        for(const res of data) {
            try {
                const resp = await fetch(`http://localhost:3000/users/${res.user_id}`, {
                  method: "GET",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  credentials: "include",
                });
                if (!response.ok) throw new Error("Failed to fetch email");
                const user = await resp.json();
                res.userEmail = user.email;
              } catch (err) {
                setError("Error fetching email");
                console.error(err);
              }
        }
        setResponses(data);
      } catch (err) {
        setError("Error fetching responses");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchResponses();
  }, [params]);

  if (loading || !params) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading responses...</p>
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

  return (
    <div className="p-8 bg-gray-100 dark:bg-[#222831] min-h-screen">
      <h1 className="text-3xl font-bold text-gray-700 dark:text-gray-200 mb-6">
        Quiz Responses
      </h1>

      {responses.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-300">No responses found for this quiz.</p>
      ) : (
        <div className="bg-white dark:bg-[#1e293b] shadow-md rounded-lg p-6">
          <table className="w-full table-auto border-collapse border border-gray-300 dark:border-gray-700">
            <thead>
              <tr className="bg-gray-200 dark:bg-[#334155]">
                <th className="border border-gray-300 dark:border-gray-700 px-4 py-2">Student Email</th>
                <th className="border border-gray-300 dark:border-gray-700 px-4 py-2">Score</th>
                <th className="border border-gray-300 dark:border-gray-700 px-4 py-2">Submitted At</th>
                <th className="border border-gray-300 dark:border-gray-700 px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {responses.map((response) => (
                <tr key={response._id} className="hover:bg-gray-100 dark:hover:bg-[#475569]">
                  <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">
                    {response.userEmail}
                  </td>
                  <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">
                    {response.score}
                  </td>
                  <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">
                    {new Date(response.submittedAt).toLocaleString()}
                  </td>
                  <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-center">
                    <button
                      className="bg-[#008170] text-white py-2 px-4 rounded-md hover:bg-[#005B41] transition-all duration-300"
                      onClick={() => router.push(`/instructor/courses/${params.id}/module/${params.module_id}}/${params.quiz_id}/responses/${response._id}`)}
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
