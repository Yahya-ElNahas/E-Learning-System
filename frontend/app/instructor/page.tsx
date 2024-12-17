"use client";

import { NextPage } from "next";
import '@/styles/globals.css'
import SideBarComponent from "@/components/sidebar";

const InstructorDashBoard: NextPage = () => {
  return (
    <div className="flex min-h-screen bg-gray-900 text-white">

      <SideBarComponent instructor={true} title="Instructor Dashboard"/>

      <div className="flex-1 p-8 bg-gray-800 text-gray-200">
        <h1 className="text-3xl font-bold mb-6">Welcome to your Dashboard</h1>
      </div>
    </div>
  );
};

export default InstructorDashBoard;
