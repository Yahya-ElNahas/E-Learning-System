"use client";
import { useRouter } from "next/navigation";
import SideBarComponent from "@/components/sidebar"; // Adjust the path as needed

const Home = () => {
  const router = useRouter();

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <SideBarComponent courses={false} student={true} />

      {/* Main Content */}
      <div className="flex flex-col flex-1 items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 text-white p-6">
        <h1 className="mb-10 text-4xl font-bold animate-fade-in">
          Communication Portal
        </h1>
        <div className="flex flex-wrap gap-6 justify-center items-center">
          {/* Group Chat Card */}
          <div
            onClick={() => router.push("/communication/group")}
            className="w-72 h-44 bg-gradient-to-br from-blue-500 to-indigo-500 text-white flex flex-col justify-center items-center rounded-xl cursor-pointer shadow-lg card animate-slide-up transform hover:scale-105 hover:shadow-2xl transition-all duration-300"
          >
            <h2 className="text-xl font-semibold mb-2">Group Chat</h2>
            <p className="text-sm opacity-90">
              Collaborate with your groups effortlessly.
            </p>
          </div>

          {/* Private Chat Card */}
          <div
            onClick={() => router.push("/communication/privateChat")}
            className="w-72 h-44 bg-gradient-to-br from-purple-500 to-pink-500 text-white flex flex-col justify-center items-center rounded-xl cursor-pointer shadow-lg card animate-slide-up transform hover:scale-105 hover:shadow-2xl transition-all duration-300"
          >
            <h2 className="text-xl font-semibold mb-2">Private Chat</h2>
            <p className="text-sm opacity-90">
              Have personal conversations securely.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
