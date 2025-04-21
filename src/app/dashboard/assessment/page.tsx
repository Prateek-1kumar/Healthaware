"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  FiChevronLeft,
  FiChevronRight,
  FiCheck,
  FiAlertTriangle,
} from "react-icons/fi";
import {
  AssessmentData,
  Gender,
  DietaryHabit,
  StressLevel,
  YesNoAnswer,
} from "@/types/assessment";
import { assessmentApi } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

export default function AssessmentPage() {
  const router = useRouter();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [currentStep, setCurrentStep] = useState(1);
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

  // Create mutation for submitting assessment
  const submitAssessmentMutation = useMutation({
    mutationFn: (data: AssessmentData) => assessmentApi.submitAssessment(data),
    onSuccess: (result) => {
      // Invalidate and refetch assessment queries
      queryClient.invalidateQueries({ queryKey: ["assessments"] });
      queryClient.invalidateQueries({ queryKey: ["assessment", result.id] });

      // Redirect to results page with the new assessment ID
      router.push(`/dashboard/results/${result.id}`);
    },
    onError: (error) => {
      console.error("Error submitting assessment:", error);
      // Handle error display to the user
      setSubmitError("Failed to submit assessment. Please try again later.");
    },
  });

  const totalSteps = 4;
  const [submitError, setSubmitError] = useState<string | null>(null);

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

  const validateCurrentStep = () => {
    if (currentStep === 1) {
      if (!formData.gender) return "Please select your gender";
      if (!formData.age) return "Please enter your age";
    } else if (currentStep === 2) {
      if (!formData.workPressure)
        return "Please select your work pressure level";
    } else if (currentStep === 3) {
      if (!formData.dietaryHabits) return "Please select your dietary habits";
      if (!formData.financialStressLevel)
        return "Please select your financial stress level";
    } else if (currentStep === 4) {
      if (!formData.suicidalThoughts)
        return "Please answer all required questions";
      if (!formData.familyMentalHealthHistory)
        return "Please answer all required questions";
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    // Final validation to ensure all required fields are completed
    const errorMsg = validateCurrentStep();
    if (errorMsg) {
      setSubmitError(errorMsg);
      return;
    }

    // Check if we have all required data
    if (
      formData.gender &&
      formData.age &&
      formData.workPressure &&
      formData.jobSatisfaction &&
      formData.sleepDuration &&
      formData.dietaryHabits &&
      formData.workHoursPerDay &&
      formData.financialStressLevel &&
      formData.suicidalThoughts &&
      formData.familyMentalHealthHistory
    ) {
      // Submit the data to the backend
      submitAssessmentMutation.mutate(formData as AssessmentData);
    } else {
      setSubmitError("Please complete all required fields before submitting");
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

      {submitError && (
        <div className="mb-6 p-4 flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          <FiAlertTriangle className="flex-shrink-0 text-xl" />
          <p>{submitError}</p>
        </div>
      )}

      <div className="neu-flat dark:neu-flat-dark rounded-xl p-6 md:p-8 mb-6">
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
                </div>

                <div>
                  <label className="block text-sm font-medium mb-4">
                    Do you have a family history of mental health issues?
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
                      rows={4}
                      value={formData.additionalNotes || ""}
                      onChange={(e) => handleTextChange(e, "additionalNotes")}
                      className="w-full p-3 bg-transparent border-none focus:ring-0 resize-none"
                      placeholder="Share any additional information that might be relevant to your mental health..."
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 1}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium 
                ${
                  currentStep === 1
                    ? "opacity-50 cursor-not-allowed"
                    : "neu-flat dark:neu-flat-dark hover:opacity-90"
                }
                ${prevBtnPressed ? "neu-pressed dark:neu-pressed-dark" : ""}
              `}
            >
              <FiChevronLeft className="text-lg" /> Previous
            </button>

            {currentStep < totalSteps ? (
              <button
                type="button"
                onClick={nextStep}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium bg-blue-600 text-white shadow-md hover:bg-blue-700 active:scale-95 transition-all 
                ${nextBtnPressed ? "neu-pressed dark:neu-pressed-dark" : ""}
              `}
              >
                Next <FiChevronRight className="text-lg" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={submitAssessmentMutation.isPending}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium bg-green-600 text-white shadow-md hover:bg-green-700 active:scale-95 transition-all disabled:opacity-70 disabled:hover:bg-green-600 disabled:active:scale-100"
              >
                {submitAssessmentMutation.isPending ? (
                  <>
                    <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></span>
                    Submitting...
                  </>
                ) : (
                  <>
                    Submit <FiCheck className="text-lg" />
                  </>
                )}
              </button>
            )}
          </div>
        </form>
      </div>

      {currentStep === 1 && (
        <div className="glass-sm p-4 rounded-lg text-neutral-600 dark:text-neutral-400 text-sm">
          <p className="flex items-start gap-2">
            <FiAlertTriangle className="text-amber-500 mt-0.5 flex-shrink-0" />
            <span>
              Your privacy is important to us. All your responses will be kept
              confidential and used only to provide you with personalized
              insights.
            </span>
          </p>
        </div>
      )}
    </div>
  );
}
