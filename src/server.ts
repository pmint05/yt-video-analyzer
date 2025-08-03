import { IMAGE_OUTPUT_PATH, AUDIO_OUTPUT_PATH, JSON_OUTPUT_PATH } from './constants/const';
import fs from 'fs'
import app from "./app";
import config from './config/config'

if (!fs.existsSync(IMAGE_OUTPUT_PATH)) {
  fs.mkdirSync(IMAGE_OUTPUT_PATH, { recursive: true });
}

if (!fs.existsSync(AUDIO_OUTPUT_PATH)) {
  fs.mkdirSync(AUDIO_OUTPUT_PATH, { recursive: true });
}

if (!fs.existsSync(JSON_OUTPUT_PATH)) {
  fs.mkdirSync(JSON_OUTPUT_PATH, { recursive: true });
}

app.listen(config.port, () => {
  console.log(`Server is running on http://localhost:${config.port} in ${config.nodeEnv} mode`);
});