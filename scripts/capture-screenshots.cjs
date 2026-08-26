const { spawnSync } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

const browser = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const outputDir = path.resolve("screenshots");
const userDataDir = path.resolve(".screenshot-browser-profile");
const baseUrl = "http://127.0.0.1:8080";

const captures = [
  ["01-home-hero.png", `${baseUrl}/`],
  ["02-home-about.png", `${baseUrl}/#about`],
  ["03-home-projects.png", `${baseUrl}/#projects`],
  ["04-home-services.png", `${baseUrl}/#services`],
  ["05-home-testimonials.png", `${baseUrl}/#testimonials`],
  ["06-about-page.png", `${baseUrl}/about`],
  ["07-services-page.png", `${baseUrl}/services`],
  ["08-portfolio-page.png", `${baseUrl}/portfolio`],
  ["09-contact-page.png", `${baseUrl}/contact`],
  ["10-admin-login.png", `${baseUrl}/admin`],
];

fs.mkdirSync(outputDir, { recursive: true });
for (const [filename, url] of captures) {
  const destination = path.join(outputDir, filename);
  const result = spawnSync(browser, [
    "--headless=new",
    "--disable-gpu",
    "--hide-scrollbars",
    "--no-first-run",
    "--no-default-browser-check",
    `--user-data-dir=${userDataDir}`,
    "--window-size=1440,900",
    "--virtual-time-budget=5000",
    "--run-all-compositor-stages-before-draw",
    `--screenshot=${destination}`,
    url,
  ], { encoding: "utf8", timeout: 30000 });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`Chrome failed for ${url}: ${result.stderr || result.stdout}`);
  console.log(`Captured ${filename}`);
}
