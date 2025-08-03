import "dotenv/config";
import axios from "axios";
import fs from "fs";
import FormData from "form-data";

export async function transcribeWithScribe(filePath: string) {
  const form = new FormData();
  form.append("file", fs.createReadStream(filePath));
  form.append("diarise", "true");
  form.append("timestamps_granularity", "word");
  form.append("model_id", "scribe_v1");

  const response = await axios.post("https://api.elevenlabs.io/v1/speech-to-text", form, {
    headers: {
      ...form.getHeaders(),
      "xi-api-key": process.env.ELEVENLABS_API_KEY!,
    },
  });
  if (response.status !== 200) {
    throw new Error(`Failed to transcribe audio: ${response.statusText}`);
  }

  console.log("🗒️ TRANSCRIPTION SUCCESS:", filePath)

  return response.data;
}