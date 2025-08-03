import "dotenv/config"
import path from 'node:path';
import puppeteer from 'puppeteer';

const environment = process.env.NODE_ENV;
const isProduction = environment === "production";

export async function launchBrowser({
  headless = true,
}: {
  headless?: boolean;
}) {
  const browser = await puppeteer.launch({
    headless,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--no-zygote',
      // '--single-process',
      '--lang=en-US,en',
      '--window-size=1280,720'
    ],
    ...(isProduction && {
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || puppeteer.executablePath(),
    }),
  });
  return browser;
}

export async function takeYTScreenshot(url: string, headless = true, outputPath: string): Promise<string> {
  try {
    const browser = await launchBrowser({ headless });
    const page = await browser.newPage();
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36'
    );
    // await page.setExtraHTTPHeaders({
    //   'Accept-Language': 'en-US,en;q=0.9',
    // });
    await page.setViewport({ width: 1280, height: 800 });
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
    await page.waitForSelector('video', { timeout: 10000 });


    // // Attempt to play the video in case autoplay is blocked
    // await page.evaluate(() => {
    //   const video = document.querySelector('video');
    //   if (video && video.paused) {
    //     video.muted = true; // Mute to allow autoplay
    //     video.play().catch(() => { });
    //   }

    //   const moviePlayer = document.querySelector('#movie_player');
    //   if (moviePlayer) {
    //     (moviePlayer as any).playVideo()
    //   }
    // });

    // // Wait for the YouTube player to start playing
    // await page.waitForFunction(() => {
    //   const video = document.querySelector('video');
    //   // Check if the video element exists and is playing (not paused, not ended, and currentTime > 0)
    //   return (
    //     video &&
    //     !video.paused &&
    //     !video.ended &&
    //     video.currentTime > 0 &&
    //     video.readyState >= 2
    //   );
    // }, { timeout: 50000 });
    await page.screenshot({
      path: outputPath as `${string}.png`,
    });

    await browser.close();
    console.log("📸 SCREENSHOT TAKEN");
    return outputPath;

  } catch (error) {
    console.error('Error taking screenshot:', error);
    throw error;
  }
}