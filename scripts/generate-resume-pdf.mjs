#!/usr/bin/env node
/**
 * Regenerates public/md-maruf-bin-salim-bhuiyan-resume.pdf from the /resume
 * route, so the PDF and the page can't drift apart. Run it after editing
 * content/resume.ts or the resume's markup or print styles:
 *
 *   pnpm resume:pdf
 *
 * It reuses a dev or production server if one is already answering on
 * localhost:3000 (override with RESUME_URL), and otherwise starts `next dev`
 * itself and shuts it down afterwards.
 *
 * Chrome's --print-to-pdf flag isn't used on purpose: the page fades in on
 * mount, and the flag prints early enough to catch it at opacity 0 - a
 * perfectly blank A4. Driving DevTools lets us wait for the page to settle.
 */
import { spawn } from "node:child_process";
import { mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

const URL_UNDER_TEST = process.env.RESUME_URL ?? "http://localhost:3000/resume";
const OUT = process.env.RESUME_OUT ?? "public/md-maruf-bin-salim-bhuiyan-resume.pdf";
const CHROME =
  process.env.CHROME_PATH ?? "google-chrome-stable";
const DEBUG_PORT = Number(process.env.CHROME_DEBUG_PORT ?? 9333);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function isUp(url) {
  try {
    const res = await fetch(url, { method: "HEAD" });
    return res.ok;
  } catch {
    return false;
  }
}

async function waitFor(url, timeoutMs, label) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if (await isUp(url)) return true;
    await sleep(400);
  }
  throw new Error(`Timed out waiting for ${label} (${url})`);
}

/** Minimal DevTools client - enough to navigate a tab and print it. */
async function connect(port) {
  const targets = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
  const page = targets.find((t) => t.type === "page");
  if (!page) throw new Error("No page target in Chrome");
  const ws = new WebSocket(page.webSocketDebuggerUrl);
  const pending = new Map();
  let id = 0;
  ws.onmessage = (e) => {
    const msg = JSON.parse(e.data);
    if (msg.id && pending.has(msg.id)) {
      pending.get(msg.id)(msg);
      pending.delete(msg.id);
    }
  };
  await new Promise((resolve, reject) => {
    ws.onopen = resolve;
    ws.onerror = reject;
  });
  return {
    send: (method, params = {}) =>
      new Promise((resolve, reject) => {
        const msgId = ++id;
        pending.set(msgId, (msg) =>
          msg.error ? reject(new Error(`${method}: ${msg.error.message}`)) : resolve(msg.result),
        );
        ws.send(JSON.stringify({ id: msgId, method, params }));
      }),
    close: () => ws.close(),
  };
}

let server = null;
let chrome = null;

try {
  if (!(await isUp(URL_UNDER_TEST))) {
    console.log("No server on that URL - starting `next dev`...");
    server = spawn("npx", ["next", "dev", "-p", "3000"], { stdio: "ignore" });
    await waitFor(URL_UNDER_TEST, 60_000, "next dev");
  }

  const profile = await mkdtemp(join(tmpdir(), "resume-pdf-"));
  chrome = spawn(
    CHROME,
    [
      "--headless=new",
      "--disable-gpu",
      "--hide-scrollbars",
      `--user-data-dir=${profile}`,
      `--remote-debugging-port=${DEBUG_PORT}`,
      "about:blank",
    ],
    { stdio: "ignore" },
  );
  await waitFor(`http://127.0.0.1:${DEBUG_PORT}/json/version`, 20_000, "Chrome");

  const cdp = await connect(DEBUG_PORT);
  await cdp.send("Page.enable");
  await cdp.send("Runtime.enable");
  await cdp.send("Emulation.setDeviceMetricsOverride", {
    width: 1200,
    height: 1600,
    deviceScaleFactor: 1,
    mobile: false,
  });
  await cdp.send("Page.navigate", { url: URL_UNDER_TEST });
  await sleep(4000);
  // Anything still mid-fade would print invisible.
  await cdp.send("Runtime.evaluate", {
    expression:
      "document.querySelectorAll('*').forEach(el => { if (getComputedStyle(el).opacity === '0') el.style.opacity = '1' })",
  });
  await sleep(400);

  const { data } = await cdp.send("Page.printToPDF", {
    printBackground: false,
    // honours @page in globals.css: A4, with the resume's own margins
    preferCSSPageSize: true,
    displayHeaderFooter: false,
  });
  await writeFile(OUT, Buffer.from(data, "base64"));
  cdp.close();
  console.log(`Wrote ${OUT}`);
} finally {
  chrome?.kill();
  server?.kill();
}
