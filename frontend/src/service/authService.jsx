import axios from "axios";

export const refreshAccessToken = async (setAccessToken) => {
  try {
    // console.log("Current cookies:", document.cookie);

    const response = await axios.post(
      "http://localhost:3000/auth/refresh",
      {}, // 🔥 Empty object for request body
      {
        withCredentials: true, // ✅ Fixed Typo
        headers: {
          "Content-Type": "application/json", // ✅ Ensures correct request type
        },
      },
    );

    setAccessToken(response.data.accessToken);
    return response.data.accessToken;
  } catch (error) {
    console.log(
      "Error in refreshAccessToken:",
      error.response?.data || error.message,
    );
    return null;
  }
};
