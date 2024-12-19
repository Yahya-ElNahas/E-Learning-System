import Link from "next/link";
import '@/styles/globals.css'

export default function SideBarComponent({courses = false, communication = false, progress = false, student = false, instructor = false }) {
    const title = student ? "Student Dashboard" : "Instructor Dashboard";
    return (
        <>
            <div className="w-64 bg-blue-800 text-[#31363F] p-6 dark:bg-gray-900 flex flex-col">
                <h2 className="text-2xl font-bold mb-8">{title}</h2>
                { student &&
                <ul className="flex-grow">
                    <li className="mb-4">
                        <Link href="/student/courses">
                            <p className="block py-2 px-4 rounded-[10px] cursor-pointer text-[#EEEEEE] hover:bg-[#1E3E62] dark:hover:bg-[#222831] transition-all duration-300">
                                Courses
                            </p>
                        </Link>
                    </li>
                    <li className="mb-4">
                        <Link href="/student/communication">
                            <p className="block py-2 px-4 rounded-[10px] cursor-pointer text-[#EEEEEE] hover:bg-[#1E3E62] dark:hover:bg-[#222831] transition-all duration-300">
                                Communication
                            </p>
                        </Link>
                    </li>
                    <li className="mb-4">
                        <Link href="/student/notes">
                            <p className="block py-2 px-4 rounded-[10px] cursor-pointer text-[#EEEEEE] hover:bg-[#1E3E62] dark:hover:bg-[#222831] transition-all duration-300">
                                Quick Notes
                            </p>
                        </Link>
                    </li>
                    <li className="mb-4">
                        <Link href="/student/instructors">
                            <p className="block py-2 px-4 rounded-[10px] cursor-pointer text-[#EEEEEE] hover:bg-[#1E3E62] dark:hover:bg-[#222831] transition-all duration-300">
                                Instructors
                            </p>
                        </Link>
                    </li>
                </ul>
                }
                { instructor &&
                    <ul className="flex-grow">
                    <li className="mb-4">
                        <Link href="/instructor/courses">
                            <p className="block py-2 px-4 rounded-[10px] cursor-pointer text-[#EEEEEE] hover:bg-[#1E3E62] dark:hover:bg-[#222831] transition-all duration-300">
                                Courses
                            </p>
                        </Link>
                    </li>
                    <li className="mb-4">
                        <Link href="/instructor/communication">
                            <p className="block py-2 px-4 rounded-[10px] cursor-pointer text-[#EEEEEE] hover:bg-[#1E3E62] dark:hover:bg-[#222831] transition-all duration-300">
                                Communication
                            </p>
                        </Link>
                    </li>
                    <li className="mb-4">
                        <Link href="/instructor/students">
                            <p className="block py-2 px-4 rounded-[10px] cursor-pointer text-[#EEEEEE] hover:bg-[#1E3E62] dark:hover:bg-[#222831] transition-all duration-300">
                                Students
                            </p>
                        </Link>
                    </li>
                </ul>
                }

                {!(courses || communication || progress) && <Link href="/account">
                    <p className="block py-2 px-4 rounded-[10px] cursor-pointer text-[#EEEEEE] hover:bg-[#1E3E62] dark:hover:bg-[#222831] transition-all duration-300 mt-auto flex items-center">
                        Account
                    </p>
                </Link>}
                {(courses || communication || progress) && (student) && <Link href="/student">
                    <p className="block py-2 px-4 rounded-[10px] cursor-pointer text-[#EEEEEE] hover:bg-[#1E3E62] dark:hover:bg-[#222831] transition-all duration-300 mt-auto flex items-center">
                        {'<- Back Home'}
                    </p>
                </Link>}
                {(courses || communication || progress) && (instructor) && <Link href="/instructor">
                    <p className="block py-2 px-4 rounded-[10px] cursor-pointer text-[#EEEEEE] hover:bg-[#1E3E62] dark:hover:bg-[#222831] transition-all duration-300 mt-auto flex items-center">
                        {'<- Back Home'}
                    </p>
                </Link>}
            </div>
        </>
    )
}
