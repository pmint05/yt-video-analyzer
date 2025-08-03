import { resolve } from "node:path";
import { downloadAndConvertToWav, getAudioFormats } from "../services/ytdl";
import { transcribeWithScribe } from "../services/elevenlabs";
import { AUDIO_OUTPUT_PATH, IMAGE_OUTPUT_PATH, JSON_OUTPUT_PATH } from "../constants/const";

import { takeYTScreenshot } from "../services/puppeteer";

export const filename = resolve(__filename);

export async function analyzeVideo({
	id,
	url,
}: {
	id: string;
	url: string;
}) {
	try {
		console.log("📊 START ANALYZING FOR:", id, url);
		const imageFilePath = `${IMAGE_OUTPUT_PATH}/${id}.png`;
		const audioFilePath = `${AUDIO_OUTPUT_PATH}/${id}.wav`;

		await takeYTScreenshot(url, true, imageFilePath);
		await downloadAndConvertToWav(url, audioFilePath);
		const transcription = await transcribeWithScribe(audioFilePath);

		console.log("✅ ANALYSIS COMPLETED FOR:", id, url);

		return {
			id,
			url,
			result: {
				success: true,
				thumbnail: `${IMAGE_OUTPUT_PATH}/${id}.png`,
				transcription,
			}
		}
	} catch (error: any) {
		if (error instanceof Error) {
			console.error("Error analyzing video:", error.message);
		} else {
			console.error("Unexpected error analyzing video:", error);
		}
		if (error?.response) {
			console.error("API response error:", JSON.stringify(error.response.data, null, 2));
		} else {
			console.error("Error analyzing video:", error);
		}
		return {
			success: false,
			id,
			url,
			error: error.message || "Unknown error",
		}
	}
}