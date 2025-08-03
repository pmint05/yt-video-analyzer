import ytdl from '@distube/ytdl-core';
import path from 'path';
import fs from 'fs';
import ffmpeg from 'fluent-ffmpeg';


export async function getAudioFormats(url: string) {
  try {
    const info = await ytdl.getInfo(url);
    let audioFormats = ytdl.filterFormats(info.formats, 'audioonly');
    return audioFormats;
  } catch (error) {
    console.error('Error fetching video info:', error);
    throw error;
  }
}

export async function downloadAndConvertToWav(youtubeUrl: string, outputPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const audioStream = ytdl(youtubeUrl, {
      quality: "highestaudio",
      filter: "audioonly",
    });

    // Đảm bảo thư mục tồn tại
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });

    ffmpeg(audioStream)
      .audioFrequency(16000)        // 16kHz
      .audioChannels(1)             // Mono
      .audioCodec("pcm_s16le")      // 16-bit PCM
      .format("wav")                // Output format
      .on("error", (err) => {
        console.error("FFmpeg error:", err);
        reject(err);
      })
      .on("end", () => {
        console.log("✅ CONVERT SUCCESS:", outputPath);
        resolve();
      })
      .save(outputPath);
  });
}
