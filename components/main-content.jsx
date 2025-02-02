"use client";

import React, { useState, useEffect, Suspense } from "react";
import UserDetails from "./userdetails";
import TodoList from "./todolist";

function MainContent() {
  const [activeTab, setActiveTab] = useState("user-details");

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
      <main className="flex-1 overflow-auto bg-white px-6 pb-6 pt-24  flex flex-col items-start justify-start">
        <div className="mb-6">
          <button
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors mr-2 ${
              activeTab === "user-details"
                ? "bg-blue-600 text-white"
                : "border border-blue-500 text-blue-500 hover:bg-blue-50"
            }`}
            onClick={() => handleTabChange("user-details")}
          >
            User Details
          </button>
          <button
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === "todos"
                ? "bg-blue-600 text-white"
                : "border border-blue-500 text-blue-500 hover:bg-blue-50"
            }`}
            onClick={() => handleTabChange("todos")}
          >
            To-dos
          </button>
        </div>
        {activeTab === "user-details" ? <UserDetails /> : <TodoList />}
      </main>
  );
}

export default MainContent;
