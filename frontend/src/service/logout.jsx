import api from "./apiService";

export const logout = async (setAccessToken) => {
  try {
    await api.post("/auth/logout"); // 🔥 Calls backend to remove token from DB
    setAccessToken(null); // 🔥 Clears access token in React state
    console.log("User logged out successfully");
  } catch (error) {
    console.error("Logout failed:", error);
  }
};
