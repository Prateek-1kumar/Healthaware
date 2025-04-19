"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { AssessmentResult } from "@/types/assessment";

export default function ResultsPage() {
  const { user } = useAuth();
  const [results, setResults] = useState<AssessmentResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const fetchResults = () => {
      try {
        // In a real app, you would fetch from an API
        const storedResults = localStorage.getItem("assessmentResults");
        const parsedResults = storedResults ? JSON.parse(storedResults) : [];
        setResults(parsedResults);
      } catch (error) {
        console.error("Error fetching results:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  if (!mounted) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getRiskLevelClasses = (riskLevel: string) => {
    switch (riskLevel) {
      case "low":
        return "bg-green-100 text-green-800";
      case "moderate":
        return "bg-yellow-100 text-yellow-800";
      case "high":
        return "bg-red-100 text-red-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  return (
    <div>
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Assessment Results</h1>
          <p className="text-gray-800 mt-1">
            View and track your mental health assessment history
          </p>
        </div>
        <Link
          href="/dashboard/assessment"
          className="skeu-btn px-4 py-3 rounded-lg text-center font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors"
        >
          Take New Assessment
        </Link>
      </div>

      {loading ? (
        <div className="glass-card p-12 text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-4 text-gray-800">Loading your results...</p>
        </div>
      ) : results.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <div className="text-6xl mb-4">📋</div>
          <h2 className="text-xl font-semibold mb-2">No Assessments Yet</h2>
          <p className="text-gray-800 mb-6">
            Take your first mental health assessment to get personalized
            insights.
          </p>
          <Link
            href="/dashboard/assessment"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Start Assessment
          </Link>
        </div>
      ) : (
        <div className="grid gap-6">
          {results.map((result) => (
            <Link
              key={result.id}
              href={`/dashboard/results/${result.id}`}
              className="block"
            >
              <div className="neu-flat rounded-xl p-6 hover:shadow-lg transition-shadow">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-gray-700 text-sm font-medium">
                        {formatDate(result.date)}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${getRiskLevelClasses(
                          result.analysis.riskLevel
                        )}`}
                      >
                        {result.analysis.riskLevel.charAt(0).toUpperCase() +
                          result.analysis.riskLevel.slice(1)}{" "}
                        Risk
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mt-4">
                      <div>
                        <div className="text-sm text-gray-700 mb-1 font-medium">
                          Overall Score
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-full h-2 bg-neutral-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-blue-500 rounded-full"
                              style={{
                                width: `${result.analysis.overallScore}%`,
                              }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium text-gray-800">
                            {result.analysis.overallScore}
                          </span>
                        </div>
                      </div>

                      <div>
                        <div className="text-sm text-gray-700 mb-1 font-medium">
                          Stress
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-full h-2 bg-neutral-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-red-500 rounded-full"
                              style={{
                                width: `${result.analysis.stressScore}%`,
                              }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium text-gray-800">
                            {result.analysis.stressScore}
                          </span>
                        </div>
                      </div>

                      <div>
                        <div className="text-sm text-gray-700 mb-1 font-medium">
                          Well-being
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-full h-2 bg-neutral-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-green-500 rounded-full"
                              style={{
                                width: `${result.analysis.wellbeingScore}%`,
                              }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium text-gray-800">
                            {result.analysis.wellbeingScore}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 neu-flat rounded-lg px-4 py-2 text-blue-700 font-medium">
                    <span>View Details</span>
                    <span aria-hidden="true">→</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
