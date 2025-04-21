import axios from "axios";
import { AssessmentData, AssessmentResult } from "@/types/assessment";

// Create an axios instance with the base URL from environment variables
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add interceptor to include auth token in requests
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage (this should be improved with a more secure method in production)
    const token = localStorage.getItem("temp_debug_id_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Profile API endpoints
export const profileApi = {
  createProfile: async (profileData: {
    name: string;
    email: string;
    age?: number;
    gender?: string;
    additionalInfo?: {
      preferences?: { theme?: string };
      settings?: { notifications?: boolean };
    };
  }) => {
    return api.post("/profile", profileData);
  },
};

// Assessment API endpoints
export const assessmentApi = {
  submitAssessment: async (data: AssessmentData): Promise<AssessmentResult> => {
    const response = await api.post<AssessmentResult>("/assessment", data);
    return response.data;
  },

  getAssessments: async (): Promise<AssessmentResult[]> => {
    const response = await api.get<AssessmentResult[]>("/assessment");
    return response.data;
  },

  getAssessmentById: async (id: string): Promise<AssessmentResult> => {
    const response = await api.get<AssessmentResult>(`/assessment/${id}`);
    return response.data;
  },
};

export default api;
