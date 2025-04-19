"use client";

import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Dashboard() {
  const { user } = useAuth();
  const [greeting, setGreeting] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const hours = new Date().getHours();
    if (hours < 12) {
      setGreeting("Good Morning");
    } else if (hours < 18) {
      setGreeting("Good Afternoon");
    } else {
      setGreeting("Good Evening");
    }
  }, []);

  if (!mounted) return null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">
            {greeting}, {user?.name || "there"}!
          </h1>
          <p className="text-gray-800 mt-1">
            Welcome to your mental health dashboard
          </p>
        </div>
        <Link
          href="/dashboard/assessment"
          className="skeu-btn px-6 py-3 rounded-full text-center font-medium bg-blue-600 text-black hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg active:scale-95 focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 focus:outline-none"
        >
          <span className="flex items-center justify-center gap-2">
            <span>Start New Assessment</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 transition-transform group-hover:translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </span>
        </Link>
      </div>

      {/* Dashboard cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Quick Stats Card */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold mb-4">Your Status</h2>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Overall Well-being</span>
                <span className="font-medium">No data yet</span>
              </div>
              <div className="w-full h-2 bg-neutral-200 rounded-full overflow-hidden">
                <div className="w-0 h-full bg-blue-500 rounded-full"></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Last Assessment</span>
                <span className="font-medium">Never</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Assessment Streak</span>
                <span className="font-medium">0 days</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Results Card */}
        <div className="md:col-span-2 neu-flat rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Assessments</h2>

          <div className="text-center py-8">
            <div className="text-5xl mb-4">📊</div>
            <p className="text-gray-800 mb-6">
              You haven&apos;t taken any assessments yet
            </p>
            <Link
              href="/dashboard/assessment"
              className="inline-block mt-4 px-6 py-3 skeu-btn rounded-full bg-blue-600 hover:bg-blue-700 transition-colors shadow-md"
            >
              Take Your First Assessment
            </Link>
          </div>
        </div>
      </div>

      {/* Resources section */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Mental Health Resources</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              title: "Stress Management",
              description:
                "Learn effective techniques to manage daily stress and anxiety.",
              icon: "🧘",
            },
            {
              title: "Sleep Improvement",
              description:
                "Tips and practices for better sleep quality and duration.",
              icon: "😴",
            },
            {
              title: "Work-Life Balance",
              description:
                "Strategies to maintain a healthy balance between work and personal life.",
              icon: "⚖️",
            },
          ].map((resource, index) => (
            <div
              key={index}
              className="glass-sm rounded-xl p-5 flex items-start gap-4 hover:shadow-md transition-shadow"
            >
              <div className="text-3xl">{resource.icon}</div>
              <div>
                <h3 className="font-medium mb-1">{resource.title}</h3>
                <p className="text-sm text-gray-800">{resource.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
