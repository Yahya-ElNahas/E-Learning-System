import Link from "next/link";
import '@/styles/globals.css'

export default function SideBarComponent() {
    return (
        <>
            <div className="w-64 bg-blue-800 text-[#31363F] p-6 dark:bg-gray-900 flex flex-col">
                <h2 className="text-2xl font-bold mb-8">Student Dashboard</h2>
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
                        <Link href="/student/progress">
                            <p className="block py-2 px-4 rounded-[10px] cursor-pointer text-[#EEEEEE] hover:bg-[#1E3E62] dark:hover:bg-[#222831] transition-all duration-300">
                                Progress
                            </p>
                        </Link>
                    </li>
                </ul>

                <Link href="/account">
                    <p className="block py-2 px-4 rounded-[10px] cursor-pointer text-[#EEEEEE] hover:bg-[#1E3E62] dark:hover:bg-[#222831] transition-all duration-300 mt-auto flex items-center">
                        Account
                    </p>
                </Link>
            </div>
        </>
    )
}
