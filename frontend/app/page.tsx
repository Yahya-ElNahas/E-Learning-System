'use client'

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Spinner } from "@nextui-org/react"
import CardComponent from "@/components/courseCard"
import NavbarComponent from "@/components/navbar"
import { NextPage } from "next"
import '@/components/courses.css'

const App: NextPage = () => {
  const [courses, setCourses] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    fetch("http://localhost:3000/courses")
      .then((response) => response.json())
      .then((data) => {
        setCourses(data)
        setLoading(false)
      })
      .catch((error) => {
        console.error("Error fetching courses:", error)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return <LoadingComponent />
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-blue-900 text-white">
      <NavbarComponent courses={true} />
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex justify-center items-center my-8"
      >
        <h1 className="text-6xl font-extrabold font-sans text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-red-400 to-blue-400 tracking-wide">
          Courses
        </h1>
      </motion.div>

      <div className="flex flex-wrap justify-center gap-6 px-4">
        {courses.map((course, index) => (
          <motion.div
            key={course._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
          >
            <CardComponent course={course} />
          </motion.div>
        ))}
      </div>
    </div>
  )
}

const LoadingComponent = () => {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-b from-black via-gray-900 to-blue-900 text-white">
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
      >
        <Spinner size="lg" color="danger" />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mt-4 text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-red-400 to-blue-400"
      >
        Loading Courses
      </motion.div>
    </div>
  )
}

export default App

