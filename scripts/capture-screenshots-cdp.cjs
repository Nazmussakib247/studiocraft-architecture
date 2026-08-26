const { spawn } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");
const WebSocket = require("ws");

const browser = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const baseUrl = "http://127.0.0.1:8080";
const outputDir = path.resolve("screenshots");
const profileDir = path.resolve(".screenshot-cdp-profile");
const debugPort = 9222;

const captures = [
  ["01-home-hero.png", `${baseUrl}/`, null],
  ["02-home-about.png", `${baseUrl}/`, "about"],
  ["03-home-projects.png", `${baseUrl}/`, "projects"],
  ["04-home-services.png", `${baseUrl}/`, "services"],
  ["05-home-testimonials.png", `${baseUrl}/`, "testimonials"],
  ["06-about-page.png", `${baseUrl}/about`, null],
  ["07-services-page.png", `${baseUrl}/services`, null],
  ["08-portfolio-page.png", `${baseUrl}/portfolio`, null],
  ["09-contact-page.png", `${baseUrl}/contact`, null],
  ["10-admin-login.png", `${baseUrl}/admin`, null],
];

function sleep(ms) { return new Promise((resolve) => setTimeout(resolve, ms)); }

async function cdp(ws, method, params = {}) {
  const id = ++cdp.nextId;
  return new Promise((resolve, reject) => {
    const onMessage = (raw) => {
      const message = JSON.parse(raw.toString());
      if (message.id !== id) return;
      ws.off("message", onMessage);
      if (message.error) reject(new Error(`${method}: ${message.error.message}`));
      else resolve(message.result);
    };
    ws.on("message", onMessage);
    ws.send(JSON.stringify({ id, method, params }));
  });
}
cdp.nextId = 0;

async function waitForDebugEndpoint() {
  for (let attempt = 0; attempt < 30; attempt += 1) {
    try {
      const response = await fetch(`http://127.0.0.1:${debugPort}/json`);
      const pages = await response.json();
      const page = pages.find((item) => item.type === "page");
      if (page) return page;
    } catch {}
    await sleep(250);
  }
  throw new Error("Chrome DevTools endpoint did not start");
}

async function main() {
  fs.mkdirSync(outputDir, { recursive: true });
  const chrome = spawn(browser, [
    "--headless=new",
    "--disable-gpu",
    "--hide-scrollbars",
    "--no-first-run",
    "--no-default-browser-check",
    "--remote-debugging-port=9222",
    "--remote-allow-origins=*",
    `--user-data-dir=${profileDir}`,
    "--window-size=1440,900",
    "about:blank",
  ], { stdio: "ignore", windowsHide: true });

  try {
    const page = await waitForDebugEndpoint();
    const ws = new WebSocket(page.webSocketDebuggerUrl);
    await new Promise((resolve, reject) => { ws.once("open", resolve); ws.once("error", reject); });
    await cdp(ws, "Page.enable");
    await cdp(ws, "Runtime.enable");
    await cdp(ws, "Emulation.setDeviceMetricsOverride", { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });

    for (const [filename, url, sectionId] of captures) {
      await cdp(ws, "Page.navigate", { url });
      await sleep(2800);
      if (sectionId) {
        await cdp(ws, "Runtime.evaluate", { expression: `(() => { const el = document.getElementById(${JSON.stringify(sectionId)}); if (el) { el.scrollIntoView({ block: "start", behavior: "instant" }); window.scrollBy(0, -76); } })()` });
        await sleep(650);
      }
      const screenshot = await cdp(ws, "Page.captureScreenshot", { format: "png", captureBeyondViewport: false });
      fs.writeFileSync(path.join(outputDir, filename), Buffer.from(screenshot.data, "base64"));
      console.log(`Captured ${filename}${sectionId ? ` at #${sectionId}` : ""}`);
    }

    ws.close();
  } finally {
    chrome.kill();
  }
}

main().catch((error) => { console.error(error); process.exitCode = 1; });
