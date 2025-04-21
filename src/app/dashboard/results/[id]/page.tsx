"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { AssessmentResult } from "@/types/assessment";
import { assessmentApi } from "@/lib/api";
import { FiArrowLeft, FiFileText, FiAlertCircle, FiInfo } from "react-icons/fi";

export default function ResultDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch assessment result using React Query
  const {
    data: result,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["assessment", id],
    queryFn: () => assessmentApi.getAssessmentById(id as string),
    enabled: !!id && mounted, // Only run query when ID is available and component is mounted
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    staleTime: 1000 * 60, // Consider data stale after 1 minute
  });

  if (!mounted) return null;

  if (isLoading) {
    return (
      <div className="glass-card p-12 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
        <p className="mt-4 text-gray-800">Loading assessment result...</p>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="glass-card p-12 text-center">
        <div className="text-5xl mb-4 text-amber-500">
          <FiAlertCircle className="mx-auto" />
        </div>
        <h2 className="text-xl font-semibold mb-2">Result Not Found</h2>
        <p className="text-gray-800 mb-6">
          The assessment result you are looking for doesn&apos;t exist or has
          been deleted.
        </p>
        <Link
          href="/dashboard/results"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Back to Results
        </Link>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
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

  const getWorkPressureText = (level: string) => {
    const mapping: Record<string, string> = {
      none: "No work pressure",
      low: "Low work pressure",
      moderate: "Moderate work pressure",
      high: "High work pressure",
      extreme: "Extreme work pressure",
    };
    return mapping[level] || "Unknown";
  };

  const getDietaryHabitsText = (habit: string) => {
    const mapping: Record<string, string> = {
      "very-healthy": "Very healthy diet",
      "mostly-healthy": "Mostly healthy diet",
      average: "Average diet",
      unhealthy: "Unhealthy diet",
      "very-unhealthy": "Very unhealthy diet",
    };
    return mapping[habit] || "Unknown";
  };

  const getFinancialStressText = (level: string) => {
    const mapping: Record<string, string> = {
      none: "No financial stress",
      low: "Low financial stress",
      moderate: "Moderate financial stress",
      high: "High financial stress",
      extreme: "Extreme financial stress",
    };
    return mapping[level] || "Unknown";
  };

  const getYesNoText = (value: string) => {
    if (!value) return "Unknown";
    if (value === "prefer-not-to-say") return "Prefer not to say";
    return value.charAt(0).toUpperCase() + value.slice(1);
  };

  return (
    <div>
      <div className="mb-8">
        <Link
          href="/dashboard/results"
          className="flex items-center gap-2 text-blue-700 hover:text-blue-800 mb-4 font-medium"
        >
          <FiArrowLeft className="text-lg" />
          <span>Back to Results</span>
        </Link>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">
              Assessment Result
            </h1>
            <div className="flex items-center gap-3 mt-2">
              <span className="text-gray-800 font-medium flex items-center gap-1">
                <FiFileText className="text-sm" />
                {formatDate(result.date)}
              </span>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${getRiskLevelClasses(
                  result.analysis.riskLevel
                )}`}
              >
                {result.analysis.riskLevel.charAt(0).toUpperCase() +
                  result.analysis.riskLevel.slice(1)}{" "}
                Risk
              </span>
            </div>
          </div>

          <Link
            href="/dashboard/assessment"
            className="skeu-btn px-4 py-2 rounded-lg text-center font-medium text-blue-700 hover:text-blue-800 transition-colors"
          >
            Take New Assessment
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Overall Analysis Section */}
        <div className="skeu-inset rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-6">Overall Analysis</h2>

          <div className="grid grid-cols-3 gap-6 mb-8">
            <div>
              <div className="text-center mb-2">
                <div className="text-5xl font-bold text-blue-600">
                  {result.analysis.overallScore}
                </div>
                <div className="text-sm text-gray-700 mt-1 font-medium">
                  Overall Score
                </div>
              </div>
              <div className="h-2 bg-neutral-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full"
                  style={{ width: `${result.analysis.overallScore}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="text-center mb-2">
                <div className="text-5xl font-bold text-red-500">
                  {result.analysis.stressScore}
                </div>
                <div className="text-sm text-gray-700 mt-1 font-medium">
                  Stress Score
                </div>
              </div>
              <div className="h-2 bg-neutral-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-red-500 rounded-full"
                  style={{ width: `${result.analysis.stressScore}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="text-center mb-2">
                <div className="text-5xl font-bold text-green-500">
                  {result.analysis.wellbeingScore}
                </div>
                <div className="text-sm text-gray-700 mt-1 font-medium">
                  Well-being
                </div>
              </div>
              <div className="h-2 bg-neutral-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500 rounded-full"
                  style={{ width: `${result.analysis.wellbeingScore}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-medium text-lg">Key Insights</h3>
            <ul className="space-y-2">
              {result.analysis.keyInsights.map((insight, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="text-blue-700 mt-0.5">•</span>
                  <span className="text-gray-800">{insight}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Assessment Data */}
        <div className="glass-card p-6">
          <h2 className="text-xl font-semibold mb-6">Assessment Data</h2>

          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-700 mb-1 font-medium">
                  Gender
                </div>
                <div className="font-medium text-gray-800">
                  {result.data.gender
                    ? result.data.gender.charAt(0).toUpperCase() +
                      result.data.gender.slice(1)
                    : "Not specified"}
                </div>
              </div>

              <div>
                <div className="text-sm text-gray-700 mb-1 font-medium">
                  Age
                </div>
                <div className="font-medium text-gray-800">
                  {result.data.age} years
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-700 mb-1 font-medium">
                  Work Pressure
                </div>
                <div className="font-medium text-gray-800">
                  {getWorkPressureText(result.data.workPressure)}
                </div>
              </div>

              <div>
                <div className="text-sm text-gray-700 mb-1 font-medium">
                  Job Satisfaction
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-full h-2 bg-neutral-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full"
                      style={{
                        width: `${(result.data.jobSatisfaction / 10) * 100}%`,
                      }}
                    ></div>
                  </div>
                  <span className="font-medium text-gray-800">
                    {result.data.jobSatisfaction}/10
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-700 mb-1 font-medium">
                  Sleep Duration
                </div>
                <div className="font-medium text-gray-800">
                  {result.data.sleepDuration} hours
                </div>
              </div>

              <div>
                <div className="text-sm text-gray-700 mb-1 font-medium">
                  Work Hours
                </div>
                <div className="font-medium text-gray-800">
                  {result.data.workHoursPerDay} hours/day
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-700 mb-1 font-medium">
                  Dietary Habits
                </div>
                <div className="font-medium text-gray-800">
                  {getDietaryHabitsText(result.data.dietaryHabits)}
                </div>
              </div>

              <div>
                <div className="text-sm text-gray-700 mb-1 font-medium">
                  Financial Stress
                </div>
                <div className="font-medium text-gray-800">
                  {getFinancialStressText(result.data.financialStressLevel)}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-700 mb-1 font-medium">
                  Suicidal Thoughts
                </div>
                <div className="font-medium text-gray-800">
                  {getYesNoText(result.data.suicidalThoughts)}
                </div>
              </div>

              <div>
                <div className="text-sm text-gray-700 mb-1 font-medium">
                  Family Mental Health History
                </div>
                <div className="font-medium text-gray-800">
                  {getYesNoText(result.data.familyMentalHealthHistory)}
                </div>
              </div>
            </div>

            {result.data.additionalNotes && (
              <div>
                <div className="text-sm text-gray-700 mb-1 font-medium">
                  Additional Notes
                </div>
                <div className="p-3 bg-neutral-100 rounded-lg text-sm text-gray-800">
                  {result.data.additionalNotes}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Recommendations */}
        <div className="neu-flat rounded-xl p-6 lg:col-span-2">
          <h2 className="text-xl font-semibold mb-6">Recommendations</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {result.analysis.recommendations.map((recommendation, index) => (
              <div key={index} className="flex gap-4 p-4 glass-sm rounded-xl">
                <div className="text-2xl text-blue-600">💡</div>
                <div>
                  <div className="text-gray-800">{recommendation}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 text-center">
        <div className="flex items-center justify-center gap-2 text-sm text-gray-800 mb-4">
          <FiInfo className="text-amber-500" />
          <p>
            This assessment provides general insights and is not a clinical
            diagnosis. Please consult with a healthcare professional for
            personalized advice.
          </p>
        </div>
        <button
          onClick={() => window.print()}
          className="skeu-btn px-4 py-2 rounded-lg text-gray-800 hover:text-gray-900 font-medium"
        >
          Print Results
        </button>
      </div>
    </div>
  );
}
