"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  AssessmentData,
  Gender,
  DietaryHabit,
  StressLevel,
  YesNoAnswer,
} from "@/types/assessment";

export default function AssessmentPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [nextBtnPressed, setNextBtnPressed] = useState(false);
  const [prevBtnPressed, setPrevBtnPressed] = useState(false);
  const [formData, setFormData] = useState<Partial<AssessmentData>>({
    gender: undefined,
    age: undefined,
    workPressure: undefined,
    jobSatisfaction: 5,
    sleepDuration: 7,
    dietaryHabits: undefined,
    workHoursPerDay: 8,
    financialStressLevel: undefined,
    suicidalThoughts: undefined,
    familyMentalHealthHistory: undefined,
    additionalNotes: "",
  });

  const totalSteps = 4;

  const handleInputChange = (field: keyof AssessmentData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSliderChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof AssessmentData
  ) => {
    const value = parseInt(e.target.value);
    handleInputChange(field, value);
  };

  const handleRadioChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof AssessmentData
  ) => {
    const value = e.target.value;
    handleInputChange(field, value);
  };

  const handleTextChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
    field: keyof AssessmentData
  ) => {
    const value = e.target.value;
    handleInputChange(field, value);
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setNextBtnPressed(true);
      setTimeout(() => {
        setNextBtnPressed(false);
        setCurrentStep(currentStep + 1);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 150);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setPrevBtnPressed(true);
      setTimeout(() => {
        setPrevBtnPressed(false);
        setCurrentStep(currentStep - 1);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 150);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // In a real app, this would call an API to submit the assessment data
      // For this demo, we'll just simulate a delay and redirect to results
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Save to localStorage for demonstration purposes
      const mockResult = {
        id: String(Date.now()),
        userId: "1",
        date: new Date().toISOString(),
        data: formData as AssessmentData,
        analysis: {
          overallScore: 68,
          stressScore: 72,
          wellbeingScore: 65,
          riskLevel: "moderate" as const,
          keyInsights: [
            "Your work pressure and financial stress are contributing factors to your overall stress level.",
            "Your sleep duration is adequate but could be improved for better mental health.",
            "Job satisfaction is moderate, which is positive for mental well-being.",
          ],
          recommendations: [
            "Consider stress management techniques such as mindfulness or meditation.",
            "Try to maintain regular sleep schedule of 7-8 hours per night.",
            "Seek financial planning resources to help reduce financial stress.",
            "Take regular breaks during work hours to prevent burnout.",
          ],
        },
      };

      const existingResults = JSON.parse(
        localStorage.getItem("assessmentResults") || "[]"
      );
      localStorage.setItem(
        "assessmentResults",
        JSON.stringify([...existingResults, mockResult])
      );

      // Redirect to results page
      router.push(`/dashboard/results/${mockResult.id}`);
    } catch (error) {
      console.error("Error submitting assessment:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold">
          Mental Health Assessment
        </h1>
        <p className="text-neutral-600 dark:text-neutral-400 mt-1">
          Complete this assessment to receive personalized insights about your
          mental health
        </p>
      </div>

      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex justify-between text-sm mb-2">
          <span>
            Step {currentStep} of {totalSteps}
          </span>
          <span>{Math.round((currentStep / totalSteps) * 100)}% Complete</span>
        </div>
        <div className="w-full h-2 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="neu-flat dark:neu-flat-dark rounded-xl p-6 md:p-8">
        <form onSubmit={handleSubmit}>
          {/* Step 1: Personal Info */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold mb-4">Basic Information</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Gender
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      { value: "male", label: "Male" },
                      { value: "female", label: "Female" },
                      { value: "non-binary", label: "Non-binary" },
                      {
                        value: "prefer-not-to-say",
                        label: "Prefer not to say",
                      },
                    ].map((option) => (
                      <div
                        key={option.value}
                        className="neu-flat dark:neu-flat-dark rounded-lg"
                      >
                        <label
                          className={`flex items-center justify-center p-3 rounded-lg cursor-pointer transition-all ${
                            formData.gender === option.value
                              ? "neu-pressed dark:neu-pressed-dark"
                              : ""
                          }`}
                        >
                          <input
                            type="radio"
                            name="gender"
                            value={option.value}
                            checked={formData.gender === option.value}
                            onChange={(e) => handleRadioChange(e, "gender")}
                            className="sr-only"
                          />
                          <span>{option.label}</span>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="age"
                    className="block text-sm font-medium mb-2"
                  >
                    Age
                  </label>
                  <div className="neu-pressed dark:neu-pressed-dark rounded-lg">
                    <input
                      id="age"
                      type="number"
                      min="1"
                      max="120"
                      value={formData.age || ""}
                      onChange={(e) =>
                        handleInputChange("age", parseInt(e.target.value))
                      }
                      className="w-full p-3 bg-transparent border-none focus:ring-0"
                      placeholder="Enter your age"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Work-related info */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold mb-4">Work Information</h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Work Pressure Level
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                    {[
                      { value: "none", label: "None" },
                      { value: "low", label: "Low" },
                      { value: "moderate", label: "Moderate" },
                      { value: "high", label: "High" },
                      { value: "extreme", label: "Extreme" },
                    ].map((option) => (
                      <div
                        key={option.value}
                        className="neu-flat dark:neu-flat-dark rounded-lg"
                      >
                        <label
                          className={`flex items-center justify-center p-3 rounded-lg cursor-pointer transition-all ${
                            formData.workPressure === option.value
                              ? "neu-pressed dark:neu-pressed-dark"
                              : ""
                          }`}
                        >
                          <input
                            type="radio"
                            name="workPressure"
                            value={option.value}
                            checked={formData.workPressure === option.value}
                            onChange={(e) =>
                              handleRadioChange(e, "workPressure")
                            }
                            className="sr-only"
                          />
                          <span>{option.label}</span>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Job Satisfaction (1-10)
                  </label>
                  <div className="flex items-center gap-4">
                    <span className="text-sm">Low</span>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={formData.jobSatisfaction || 5}
                      onChange={(e) => handleSliderChange(e, "jobSatisfaction")}
                      className="flex-1 h-2 bg-neutral-300 dark:bg-neutral-700 rounded-lg appearance-none"
                    />
                    <span className="text-sm">High</span>
                    <span className="w-8 text-center font-medium">
                      {formData.jobSatisfaction}
                    </span>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="workHours"
                    className="block text-sm font-medium mb-2"
                  >
                    Work Hours Per Day
                  </label>
                  <div className="neu-pressed dark:neu-pressed-dark rounded-lg">
                    <input
                      id="workHours"
                      type="number"
                      min="0"
                      max="24"
                      step="0.5"
                      value={formData.workHoursPerDay || ""}
                      onChange={(e) =>
                        handleInputChange(
                          "workHoursPerDay",
                          parseFloat(e.target.value)
                        )
                      }
                      className="w-full p-3 bg-transparent border-none focus:ring-0"
                      placeholder="Hours per day"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Lifestyle */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold mb-4">
                Lifestyle Information
              </h2>

              <div className="space-y-6">
                <div>
                  <label
                    htmlFor="sleepDuration"
                    className="block text-sm font-medium mb-2"
                  >
                    Average Sleep Duration (hours per night)
                  </label>
                  <div className="flex items-center gap-4">
                    <span className="text-sm">4h</span>
                    <input
                      type="range"
                      min="4"
                      max="12"
                      step="0.5"
                      value={formData.sleepDuration || 7}
                      onChange={(e) => handleSliderChange(e, "sleepDuration")}
                      className="flex-1 h-2 bg-neutral-300 dark:bg-neutral-700 rounded-lg appearance-none"
                    />
                    <span className="text-sm">12h</span>
                    <span className="w-8 text-center font-medium">
                      {formData.sleepDuration}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Dietary Habits
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {[
                      { value: "very-healthy", label: "Very Healthy" },
                      { value: "mostly-healthy", label: "Mostly Healthy" },
                      { value: "average", label: "Average" },
                      { value: "unhealthy", label: "Unhealthy" },
                      { value: "very-unhealthy", label: "Very Unhealthy" },
                    ].map((option) => (
                      <div
                        key={option.value}
                        className="neu-flat dark:neu-flat-dark rounded-lg"
                      >
                        <label
                          className={`flex items-center justify-center p-3 rounded-lg cursor-pointer transition-all ${
                            formData.dietaryHabits === option.value
                              ? "neu-pressed dark:neu-pressed-dark"
                              : ""
                          }`}
                        >
                          <input
                            type="radio"
                            name="dietaryHabits"
                            value={option.value}
                            checked={formData.dietaryHabits === option.value}
                            onChange={(e) =>
                              handleRadioChange(e, "dietaryHabits")
                            }
                            className="sr-only"
                          />
                          <span>{option.label}</span>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Financial Stress Level
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                    {[
                      { value: "none", label: "None" },
                      { value: "low", label: "Low" },
                      { value: "moderate", label: "Moderate" },
                      { value: "high", label: "High" },
                      { value: "extreme", label: "Extreme" },
                    ].map((option) => (
                      <div
                        key={option.value}
                        className="neu-flat dark:neu-flat-dark rounded-lg"
                      >
                        <label
                          className={`flex items-center justify-center p-3 rounded-lg cursor-pointer transition-all ${
                            formData.financialStressLevel === option.value
                              ? "neu-pressed dark:neu-pressed-dark"
                              : ""
                          }`}
                        >
                          <input
                            type="radio"
                            name="financialStressLevel"
                            value={option.value}
                            checked={
                              formData.financialStressLevel === option.value
                            }
                            onChange={(e) =>
                              handleRadioChange(e, "financialStressLevel")
                            }
                            className="sr-only"
                          />
                          <span>{option.label}</span>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Mental Health History */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold mb-4">
                Mental Health Information
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-4">
                    Have you ever had suicidal thoughts?
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { value: "yes", label: "Yes" },
                      { value: "no", label: "No" },
                      {
                        value: "prefer-not-to-say",
                        label: "Prefer not to say",
                      },
                    ].map((option) => (
                      <div
                        key={option.value}
                        className="neu-flat dark:neu-flat-dark rounded-lg"
                      >
                        <label
                          className={`flex items-center justify-center p-3 rounded-lg cursor-pointer transition-all ${
                            formData.suicidalThoughts === option.value
                              ? "neu-pressed dark:neu-pressed-dark"
                              : ""
                          }`}
                        >
                          <input
                            type="radio"
                            name="suicidalThoughts"
                            value={option.value}
                            checked={formData.suicidalThoughts === option.value}
                            onChange={(e) =>
                              handleRadioChange(e, "suicidalThoughts")
                            }
                            className="sr-only"
                          />
                          <span>{option.label}</span>
                        </label>
                      </div>
                    ))}
                  </div>
                  <p className="mt-2 text-xs text-neutral-500">
                    This information is kept strictly confidential and is used
                    only for assessment purposes.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-4">
                    Is there a family history of mental illness?
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { value: "yes", label: "Yes" },
                      { value: "no", label: "No" },
                      {
                        value: "prefer-not-to-say",
                        label: "Prefer not to say",
                      },
                    ].map((option) => (
                      <div
                        key={option.value}
                        className="neu-flat dark:neu-flat-dark rounded-lg"
                      >
                        <label
                          className={`flex items-center justify-center p-3 rounded-lg cursor-pointer transition-all ${
                            formData.familyMentalHealthHistory === option.value
                              ? "neu-pressed dark:neu-pressed-dark"
                              : ""
                          }`}
                        >
                          <input
                            type="radio"
                            name="familyMentalHealthHistory"
                            value={option.value}
                            checked={
                              formData.familyMentalHealthHistory ===
                              option.value
                            }
                            onChange={(e) =>
                              handleRadioChange(e, "familyMentalHealthHistory")
                            }
                            className="sr-only"
                          />
                          <span>{option.label}</span>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="additionalNotes"
                    className="block text-sm font-medium mb-2"
                  >
                    Additional Notes (Optional)
                  </label>
                  <div className="neu-pressed dark:neu-pressed-dark rounded-lg">
                    <textarea
                      id="additionalNotes"
                      value={formData.additionalNotes || ""}
                      onChange={(e) => handleTextChange(e, "additionalNotes")}
                      className="w-full p-3 bg-transparent border-none focus:ring-0 min-h-[100px]"
                      placeholder="Share any additional information that might be relevant..."
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation buttons */}
          <div className="flex justify-between mt-8">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 1}
              onMouseDown={() => currentStep > 1 && setPrevBtnPressed(true)}
              onMouseUp={() => setPrevBtnPressed(false)}
              onMouseLeave={() => setPrevBtnPressed(false)}
              className={`relative flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 
                ${
                  currentStep === 1
                    ? "bg-neutral-100 text-neutral-400 dark:bg-neutral-800 dark:text-neutral-500 cursor-not-allowed"
                    : "skeu-btn dark:skeu-btn-dark text-neutral-700 dark:text-neutral-200 hover:bg-neutral-200 dark:hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                } 
                ${
                  prevBtnPressed && currentStep > 1 ? "transform scale-95" : ""
                }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Previous
              <span className="absolute inset-0 rounded-lg overflow-hidden pointer-events-none">
                <span
                  className={`absolute inset-0 bg-current opacity-0 ${
                    prevBtnPressed && currentStep > 1 ? "animate-ripple" : ""
                  }`}
                ></span>
              </span>
            </button>

            {currentStep < totalSteps ? (
              <button
                type="button"
                onClick={nextStep}
                onMouseDown={() => setNextBtnPressed(true)}
                onMouseUp={() => setNextBtnPressed(false)}
                onMouseLeave={() => setNextBtnPressed(false)}
                className={`relative flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium text-white 
                  bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50
                  transition-all duration-200 
                  ${nextBtnPressed ? "transform scale-95 bg-blue-700" : ""}`}
              >
                Next
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
                <span className="absolute inset-0 rounded-lg overflow-hidden pointer-events-none">
                  <span
                    className={`absolute inset-0 bg-white opacity-0 ${
                      nextBtnPressed ? "animate-ripple" : ""
                    }`}
                  ></span>
                </span>
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className={`relative flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium text-white 
                  bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50
                  transition-all duration-200 
                  ${loading ? "opacity-70 cursor-wait" : ""}`}
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>
                    Submit Assessment
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </>
                )}
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="mt-8 text-sm text-neutral-500 text-center">
        <p>
          Need help? If you&apos;re in crisis, please call the National Suicide
          Prevention Lifeline at 988 or text HOME to 741741 to reach the Crisis
          Text Line.
        </p>
      </div>
    </div>
  );
}
