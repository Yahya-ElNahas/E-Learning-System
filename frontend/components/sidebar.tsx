import Link from "next/link";
import { motion } from "framer-motion";
import "@/styles/globals.css";
export default function SideBarComponent({
  courses = false,
  communication = false,
  progress = false,
  student = false,
  instructor = false,
}) {
  const title = student ? "Student Dashboard" : "Instructor Dashboard";

  const menuItems = student
    ? [
        { href: "/student/courses", label: "Courses" },
        { href: "/communication/StudentHome", label: "Communication" },
        { href: "/communication/forums/studentForum", label: "Forums" },
        { href: "/student/notes", label: "Quick Notes" },
        { href: "/student/instructors", label: "Instructors" },
      ]
    : [
        { href: "/instructor/courses", label: "Courses" },
        { href: "/communication/Home", label: "Communication" },
        { href: "/communication/forums/instructor", label: "Forums" },
        { href: "/instructor/students", label: "Students" },
    //   { href: "/instructor/report", label: "Reports" },
      ];

  return (
    <motion.div
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-64 bg-gradient-to-b from-gray-900 via-blue-900 to-red-900 text-white p-6 flex flex-col h-screen"
    >
      <motion.h2
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="text-2xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-red-400"
      >
        {title}
      </motion.h2>

      <ul className="flex-grow space-y-2">
        {menuItems.map((item, index) => (
          <motion.li
            key={item.href}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 * (index + 1), duration: 0.5 }}
          >
            <Link href={item.href}>
              <motion.p
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="block py-2 px-4 rounded-lg cursor-pointer text-gray-200 hover:bg-gradient-to-r hover:from-blue-600 hover:to-red-600 transition-all duration-300"
              >
                {item.label}
              </motion.p>
            </Link>
          </motion.li>
        ))}
      </ul>

      {/* Sidebar for Students or Instructors */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        {student && (
          <ul className="flex-grow">
            <li className="mb-4">
              <Link href="/student/courses">
                <p className="block py-2 px-4 rounded-lg cursor-pointer text-gray-200 hover:bg-gradient-to-r hover:from-blue-600 hover:to-red-600 transition-all duration-300 mt-auto flex items-center">
                  
                </p>
              </Link>
            </li>
            <li className="mb-4">
              <Link href="/communication/forums/studentFourums">
                <p className="block py-2 px-4 rounded-lg cursor-pointer text-gray-200 hover:bg-gradient-to-r hover:from-blue-600 hover:to-red-600 transition-all duration-300 mt-auto flex items-center">
                 
                </p>
              </Link>
            </li>
            <li className="mb-4">
              <Link href="/student/notes">
                <p className="block py-2 px-4 rounded-lg cursor-pointer text-gray-200 hover:bg-gradient-to-r hover:from-blue-600 hover:to-red-600 transition-all duration-300 mt-auto flex items-center">
                
                </p>
              </Link>
            </li>
            <li className="mb-4">
              <Link href="/student/instructors">
                <p className="block py-2 px-4 rounded-lg cursor-pointer text-gray-200 hover:bg-gradient-to-r hover:from-blue-600 hover:to-red-600 transition-all duration-300 mt-auto flex items-center">
  
                </p>
              </Link>
            </li>
          </ul>
        )}

        {instructor && (
          <ul className="flex-grow">
            <li className="mb-4">
              <Link href="/instructor/courses">
                <p className="block py-2 px-4 rounded-lg cursor-pointer text-gray-200 hover:bg-gradient-to-r hover:from-blue-600 hover:to-red-600 transition-all duration-300 mt-auto flex items-center">
                  
                </p>
              </Link>
            </li>
            <li className="mb-4">
              <Link href="/communication/Home">
                <p className="block py-2 px-4 rounded-lg cursor-pointer text-gray-200 hover:bg-gradient-to-r hover:from-blue-600 hover:to-red-600 transition-all duration-300 mt-auto flex items-center">
      
                </p>
              </Link>
            </li>
            <li className="mb-4">
              <Link href="/instructor/students">
                <p className="block py-2 px-4 rounded-lg cursor-pointer text-gray-200 hover:bg-gradient-to-r hover:from-blue-600 hover:to-red-600 transition-all duration-300 mt-auto flex items-center">
                
                </p>
              </Link>
            </li>
          </ul>
        )}

        {/* Account Management */}
        {!(courses || communication || progress) && (
          <Link href="/account">
            <motion.p
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="block py-2 px-4 rounded-lg cursor-pointer text-gray-200 hover:bg-gradient-to-r hover:from-blue-600 hover:to-red-600 transition-all duration-300 mt-auto flex items-center"
            >
              Account
            </motion.p>
          </Link>
        )}
      </motion.div>

      {(courses || communication || progress) && (student || instructor) && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <Link href={student ? "/student" : "/instructor"}>
            <motion.p
              whileHover={{ scale: 1.05 }}
           
              whileTap={{ scale: 0.95 }}
              className="block py-2 px-4 rounded-lg cursor-pointer text-gray-200 hover:bg-gradient-to-r hover:from-blue-600 hover:to-red-600 transition-all duration-300 mt-auto flex items-center"
            >
              Back Home
            </motion.p>
          </Link>
        </motion.div>
      )}
    </motion.div>
  );
}

