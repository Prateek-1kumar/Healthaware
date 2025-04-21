"use client";

import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { AssessmentResult } from "@/types/assessment";
import { assessmentApi } from "@/lib/api";
import {
  FiChevronRight,
  FiAlertCircle,
  FiBarChart2,
  FiCalendar,
} from "react-icons/fi";

export default function Dashboard() {
  const { user } = useAuth();
  const [greeting, setGreeting] = useState("");
  const [mounted, setMounted] = useState(false);

  // Fetch assessment results
  const {
    data: assessmentResults,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["assessments"],
    queryFn: assessmentApi.getAssessments,
    enabled: !!user, // Only fetch if the user is logged in
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    staleTime: 1000 * 60, // Consider data stale after 1 minute
  });

  // Get the most recent assessment result
  const latestAssessment = assessmentResults?.length
    ? assessmentResults.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      )[0]
    : null;

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
            <FiChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
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
                <span className="font-medium">
                  {latestAssessment
                    ? `${latestAssessment.analysis.overallScore}/100`
                    : "No data yet"}
                </span>
              </div>
              <div className="w-full h-2 bg-neutral-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full transition-all duration-500"
                  style={{
                    width: latestAssessment
                      ? `${latestAssessment.analysis.overallScore}%`
                      : "0%",
                  }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Last Assessment</span>
                <span className="font-medium">
                  {latestAssessment
                    ? new Date(latestAssessment.date).toLocaleDateString()
                    : "Never"}
                </span>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Assessment Count</span>
                <span className="font-medium">
                  {assessmentResults?.length || 0}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Results Card */}
        <div className="md:col-span-2 neu-flat rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Assessments</h2>

          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <div className="text-5xl mb-4 text-red-500">
                <FiAlertCircle className="mx-auto" />
              </div>
              <p className="text-gray-800 mb-6">
                Error loading your assessments. Please try again later.
              </p>
            </div>
          ) : assessmentResults?.length ? (
            <div className="space-y-4">
              {assessmentResults.slice(0, 3).map((result) => (
                <Link
                  key={result.id}
                  href={`/dashboard/results/${result.id}`}
                  className="block p-4 glass-sm rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-50 rounded-full text-blue-600">
                        <FiBarChart2 className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium">Mental Health Assessment</p>
                        <p className="text-sm text-neutral-500 flex items-center gap-1 mt-1">
                          <FiCalendar className="h-3 w-3" />
                          {new Date(result.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          result.analysis.riskLevel === "low"
                            ? "bg-green-100 text-green-800"
                            : result.analysis.riskLevel === "moderate"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {result.analysis.riskLevel === "low"
                          ? "Low Risk"
                          : result.analysis.riskLevel === "moderate"
                          ? "Moderate Risk"
                          : "High Risk"}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}

              {assessmentResults.length > 3 && (
                <Link
                  href="/dashboard/results"
                  className="text-center block w-full p-3 text-blue-600 hover:text-blue-700 font-medium"
                >
                  View all assessments
                </Link>
              )}
            </div>
          ) : (
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
          )}
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
