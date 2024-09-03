const API_URL = "http://127.0.0.1:8000/api/v1/tours";

// Fetch all tours
export const getTours = async () => {
  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error("Failed to fetch tours");
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching tours:", error);
    throw error;
  }
};
