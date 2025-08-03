# 🎬 YouTube Analysis Node.js Service

This service accepts a YouTube video URL, verifies playback via Puppeteer, captures a thumbnail screenshot, extracts and transcribes audio via ElevenLabs Scribe, analyzes AI content probability using GPTZero, and returns the results via a REST API.

---

## 🚀 Features

- Accepts YouTube URL via `POST /analyze`
- Uses Puppeteer to verify video playback and take a screenshot
- Downloads audio with `ytdl-core`, converts to WAV via FFmpeg
- Transcribes audio using ElevenLabs Scribe API
- Analyzes AI-generated probability of each sentence using GPTZero
- Stores result metadata (JSON + screenshot path)
- Exposes `GET /result/:id` to retrieve result
- Dockerized & ready to deploy on small GCE VM

---

## 🛠️ Setup Instructions

### 1. Clone the project

```bash
git clone https://github.com/your-username/youtube-analyzer.git
cd youtube-analyzer
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the service

In development environment:

```bash
npm run dev
```

In production environment:

Transpile TypeScript

```bash
npm run build
```

Then

```bash
npm start
```

By default, the server runs on [http://localhost:8080](http://localhost:8080).

---

## 🔐 Environment Variables

Create a `.env` file in the root directory:

```env
PORT=8080

# ElevenLabs
ELEVENLABS_API_KEY=your_elevenlabs_api_key

# GPTZero
GPTZERO_API_KEY=your_gptzero_api_key

# Puppeteer
CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium
```

---

## ⚙️ Design Decisions

### Puppeteer for Screenshot

Used Puppeteer with headless Chromium to programmatically load the YouTube page, ensure playback started, and capture a screenshot.

### Audio Pipeline

`ytdl-core` downloads only the audio stream. It’s piped to FFmpeg to convert it to a standard 16kHz, mono, 16-bit WAV format, required by ElevenLabs.

### Transcription via ElevenLabs

Scribe API is used for accurate word-level transcription with speaker diarisation.

### GPTZero Integration

Each sentence in the transcript is sent to GPTZero to determine whether it was likely AI-generated. `ai_probability` is appended to the JSON result.

### Worker Threads

Heavy tasks like transcription and screenshot are handled in separate threads using Piscina to keep the main thread responsive.

### Persistence

Results are saved as a `.json` file in `uploads/` directory, and screenshots saved as `.png`. Retrieval via `/result/:id`.

---

## 🐳 Docker Usage

### Build and run locally

```bash
docker build -t youtube-analyzer .
docker run -p 8080:8080 --env-file .env -v $(pwd)/uploads:/app/uploads youtube-analyzer
```

### Docker Compose

```bash
docker compose up --build
```

---

## ☁️ Deployment on GCE VM

- Use `e2-micro` (or similar)
- Open port 8080 via firewall rule
- Install Docker on VM
- Clone repo, build, and run as shown above

---

## 📂 Sample Output

```json
{
	"success": true,
	"job": {
		"status": "completed",
		"url": "https://www.youtube.com/H2k62_DPdr4",
		"result": {
			"success": true,
			"thumbnail": "uploads/thumbnail/66fdd6dd-5d06-49bb-9018-10f457fbfc3d.png",
			"transcription": {
				"sentences": [
					{
						"text": "Hi, my name is John.",
						"ai_probability": 0.001
					},
					{
						"text": "Nice to meet you.",
						"ai_probability": 0.002
					}
					// ...
				],
				"language_code": "eng",
				"language_probability": 0.9436402320861816,
				"text": "Hi, my name is John. Nice to meet you. Hi John, I'm Sarah. Nice to meet you too. How are you doing today? I'm doing pretty well, thanks.",
				"words": [
					{
						"text": "Hi,",
						"start": 0.159,
						"end": 0.559,
						"type": "word",
						"logprob": 0
					},
					{
						"text": " ",
						"start": 0.559,
						"end": 0.74,
						"type": "spacing",
						"logprob": 0
					},
					{
						"text": "my",
						"start": 0.74,
						"end": 0.839,
						"type": "word",
						"logprob": 0
					}
					// ...
				]
			}
		}
	}
}
```

---

## ⚠️ Known Issues

### ⚠️ Warning: TypeScript + Piscina Worker Filename Issue

When using Piscina with TypeScript, you must be aware that:

- TypeScript **does not include dynamically referenced files like `workerWrapper.ts`** in the compiled `dist/` folder unless they are explicitly imported elsewhere.
- This leads to the compiled `.js` file being missing in `dist/`, causing runtime errors when running the app in production (Docker).
- Conversely, if you reference the `.ts` file directly (for example in Docker where TypeScript is interpreted), it will work, but **not locally**, where `ts-node` or compiled JS is used.

#### ✅ Recommendation:

- **In local development**, use the compiled `.js` version:

```ts
new Piscina({
	filename: path.resolve(__dirname, "./workers/workerWrapper.js"),
});
```

- **In Docker (when using ts-node or interpreting TypeScript directly)**, use the `.ts` version:

```ts
new Piscina({
	filename: path.resolve(__dirname, "./workers/workerWrapper.ts"),
});
```

#### 🛠️ Solution Options:

1. **Ensure TypeScript compiles the worker**:

- Add a dummy import to `workerWrapper.ts` somewhere in your codebase to force inclusion during `tsc`.

```ts
// force-include.ts
import "./workers/workerWrapper";
```

Then reference `.js` safely.

2. **Use a conditional runtime check** to set the appropriate path based on environment:

```ts
const isDev = process.env.NODE_ENV !== "production";
const workerPath = isDev
	? path.resolve(__dirname, "./workers/workerWrapper.ts")
	: path.resolve(__dirname, "./workers/workerWrapper.js");

new Piscina({ filename: workerPath });
```

> ⚠️ If you skip this, you may encounter:
>
> ```
> Error [ERR_MODULE_NOT_FOUND]: Cannot find module '.../workerWrapper.js'
> ```

---

## 📎 License

MIT

---

## 👨‍💻 Author

Thong Pham – [thongpham.is-a.dev](https://thongpham.is-a.dev)
