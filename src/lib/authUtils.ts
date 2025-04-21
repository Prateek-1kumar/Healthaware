/**
 * Temporary utility functions for authentication related tasks
 */

import { User } from "firebase/auth";

/**
 * Logs the ID token for a Firebase user.
 * This is a temporary utility function for debugging purposes.
 *
 * @param user The Firebase user object
 * @returns A promise that resolves when the token has been logged
 */
export const logUserIdToken = async (user: User): Promise<void> => {
  try {
    const idToken = await user.getIdToken(true);
    console.log("=================== USER ID TOKEN ===================");
    console.log(idToken);
    console.log("=====================================================");

    // Optional: Store in localStorage for easier access during development
    // WARNING: This is for temporary debugging only - DO NOT use in production
    localStorage.setItem("temp_debug_id_token", idToken);
    console.log(
      "Token also saved to localStorage.temp_debug_id_token for temporary debugging purposes"
    );
  } catch (error) {
    console.error("Error fetching ID token:", error);
  }
};
