import "dotenv/config";
import axios, { AxiosResponse } from "axios";
export async function detectSingleString(text: string): Promise<AxiosResponse> {
  try {
    if (process.env.GPTZERO_API_KEY == null && process.env.NODE_ENV !== "development") {
      throw new Error("GPTZero API key is not set in environment variables.");
    }
    if (process.env.GPTZERO_API_KEY === "") {
      return {
        data: {
          documents: [
            {
              average_generated_prob: Math.random(), // Simulate a random probability for development
            }
          ]
        }
      } as AxiosResponse;
    }

    const response = await axios.post("https://api.gptzero.me/v2/predict/text", {
      document: text,
      multilingual: false

    }, {
      headers: {
        "Content-Type": "application/json",
        'x-api-key': process.env.GPTZERO_API_KEY || "",
      },
    });

    if (response.status !== 200) {
      throw new Error(`Failed to detect text: ${response.statusText}`);
    }

    return response;
  } catch (error) {
    console.error("Error detecting text:", error);
    throw error;
  }
} 