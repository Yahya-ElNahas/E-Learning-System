"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { NextPage } from "next";
import "@/styles/globals.css";

interface Question {
  question: string;
  options: string[];
  correctAnswer: string;
  difficulty: string;
}

interface QuizData {
  questionsPool: Question[];
  numberOfQuestions: number;
}

const Quiz: NextPage = () => {
  const params = useParams();
  const courseId = params.id?.slice(0, params.id.indexOf('.'));
  const quizId = params.id?.slice(params.id.indexOf('.')+1);

  const [quizData, setQuizData] = useState<QuizData>();
  const [currentQuestion, setCurrentQuestion] = useState<Question>({question: "", options: [], correctAnswer: "", difficulty: ""});
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [difficulty, setDifficulty] = useState<string>("beginner");
  const [questionsAsked, setQuestionsAsked] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<string[]>([]);
  const [isQuizComplete, setIsQuizComplete] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await fetch(`http://localhost:3000/quizzes/${quizId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch quiz data");
        }

        const data: QuizData = await response.json();
        setQuizData(data);
        selectNextQuestion(data.questionsPool, "beginner");
      } catch (error) {
        console.error("Error fetching quiz data:", error);
      }
    };

    fetchQuiz();
  }, [quizId]);

  const selectNextQuestion = (questionsPool: Question[], currentDifficulty: string) => {
    const freshQuestions = questionsPool.filter((q) => !questionsAsked.includes(q));
    const filteredQuestions = freshQuestions.filter((q) => q.difficulty === currentDifficulty);
    
    if(filteredQuestions.length > 0) {
        const randomIndex = Math.floor(Math.random() * filteredQuestions.length);
        const selectedQuestion = filteredQuestions[randomIndex];
        setQuestionsAsked((prev) => [...prev, selectedQuestion]);
        setCurrentQuestion(selectedQuestion)
    } else {
        const randomIndex = Math.floor(Math.random() * freshQuestions.length);
        const selectedQuestion = freshQuestions[randomIndex];
        setQuestionsAsked((prev) => [...prev, selectedQuestion]);
        setCurrentQuestion(selectedQuestion)
    }
  };

  const handleAnswer = () => {
    if (!selectedAnswer || !quizData) return;

    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;

    const newAnswers = answers;
    answers.push(selectedAnswer);
    setAnswers(newAnswers);

    let nextDifficulty = "beginner";
    if (isCorrect) {
        setScore((prevScore) => prevScore + 1);
        nextDifficulty = difficulty === "beginner" ? "intermediate" : "advanced";
        setDifficulty(nextDifficulty);
    } else if(difficulty === 'advanced') {
        setDifficulty("intermediate");
    } else setDifficulty('beginner');

    if (questionsAsked.length >= quizData.numberOfQuestions) {
      finishQuiz()
      setIsQuizComplete(true);
    } else {
      selectNextQuestion(quizData.questionsPool, nextDifficulty);
      setSelectedAnswer(null);
    }
  };

  const finishQuiz = async () => {
    if (isQuizComplete) return;
  
    let finalScore = selectedAnswer === currentQuestion.correctAnswer
      ? score + 1
      : score;
  
    finalScore = quizData ? (finalScore / quizData.numberOfQuestions) * 100 : 0;

    if(quizData && questionsAsked.length > quizData.numberOfQuestions) questionsAsked.pop();
  
    const finalAnswers = questionsAsked.map((question, index) => ({
      question: question.question,
      correctAnswer: question.correctAnswer,
      answer: answers[index],
      isCorrect: answers[index] === question.correctAnswer,
    }));
  
    try {
      const response = await fetch(`http://localhost:3000/responses/student/quiz`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          quiz_id: quizId,
          answers: finalAnswers,
          score: finalScore,
        }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to post response");
      }
    } catch (error) {
      console.error("Error posting response:", error);
    }
  
    setIsQuizComplete(true);
  };
  

  if (!quizData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-600 dark:text-gray-300">Loading quiz...</p>
      </div>
    );
  }

  if (isQuizComplete) {
    return (
      <div className="flex items-center justify-center h-screen flex-col dark:bg-gray-900 p-6">
        <h1 className="text-3xl font-bold text-green-600">
          {score >= quizData.numberOfQuestions * 0.5
            ? "Quiz Completed!"
            : "Quiz Failed"}
        </h1>
        <p className="text-xl mb-4 text-white">
          Your Score: {score} / {quizData.numberOfQuestions} ({((score / quizData.numberOfQuestions) * 100).toFixed(2)}%)
        </p>
        {score < quizData.numberOfQuestions * 0.5 && (
          <p className="text-red-600 font-semibold">
            You scored less than 50%. Please review the module and try again!
          </p>
        )}
        <div className="w-full max-w-3xl bg-white dark:bg-[#222831] p-6 rounded-lg shadow-md mt-4">
          <h2 className="text-lg font-bold mb-4">Quiz Results</h2>
          <ul className="space-y-4">
            {questionsAsked.map((question, index) => (
              <li key={index} className="p-4 border rounded-md">
                <p className="font-semibold text-gray-800 dark:text-gray-200">
                  Question {index + 1}: {question.question}
                </p>
                <p
                  className={`mt-2 ${
                    answers[index] === question.correctAnswer
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  Your Answer: {answers[index]} (
                  {answers[index] === question.correctAnswer ? "Correct" : "Wrong"}
                  )
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  Correct Answer: {question.correctAnswer}
                </p>
              </li>
            ))}
          </ul>
        </div>
        <button
          className="mt-6 bg-[#222831] text-white px-4 py-2 rounded-md hover:bg-[#1b2027] transition-all duration-300 shadow-md"
          onClick={() => router.push(`/student/courses/${courseId}`)}
        >
          Back to Course
        </button>
      </div>
    );
  }
  

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 dark:bg-gray-900 p-6">
      <div className="w-full flex items-center justify-start mb-6">
      </div>
      <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6">
        Quiz
      </h1>
      {currentQuestion && (
        <div className="bg-white dark:bg-[#222831] p-6 rounded-lg shadow-md w-full max-w-3xl">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
            {currentQuestion.question}
          </h2>
          <ul className="space-y-2">
            {currentQuestion.options.map((option, index) => (
              <li key={index}>
                <button
                  className={`w-full p-2 border rounded-md ${
                    selectedAnswer === option
                      ? "bg-[#008170] text-white"
                      : "bg-gray-100 dark:bg-[#1c1f24] text-gray-800 dark:text-gray-300"
                  } hover:bg-[#005B41] transition-all duration-300`}
                  onClick={() => setSelectedAnswer(option)}
                >
                  {option}
                </button>
              </li>
            ))}
          </ul>
          <button
            onClick={handleAnswer}
            disabled={!selectedAnswer}
            className="w-full mt-4 bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-all duration-300"
          >
            Submit Answer
          </button>
        </div>
      )}
    </div>
  );
};

export default Quiz;
