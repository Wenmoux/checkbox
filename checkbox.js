#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const http = require("http");
const https = require("https");
const { URL } = require("url");
const readline = require("readline");

// Minimal color helpers (no external deps)
const color = {
  dim: (s) => `\x1b[2m${s}\x1b[0m`,
  gray: (s) => `\x1b[90m${s}\x1b[0m`,
  green: (s) => `\x1b[32m${s}\x1b[0m`,
  red: (s) => `\x1b[31m${s}\x1b[0m`,
  cyan: (s) => `\x1b[36m${s}\x1b[0m`,
  yellow: (s) => `\x1b[33m${s}\x1b[0m`,
  bold: (s) => `\x1b[1m${s}\x1b[0m`,
};

const banner = () =>
  console.log(
    color.dim("—".repeat(2)) +
      " " +
      color.bold("checkbox") +
      " " +
      color.dim("—".repeat(2))
  );

function isURL(input) {
  try {
    const u = new URL(input);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch (_) {
    return false;
  }
}

function fetchText(url) {
  return new Promise((resolve, reject) => {
    const lib = url.startsWith("https") ? https : http;
    lib
      .get(url, (res) => {
        if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          return resolve(fetchText(res.headers.location));
        }
        if (res.statusCode && res.statusCode >= 400) {
          return reject(new Error(`HTTP ${res.statusCode} ${res.statusMessage || ""}`));
        }
        const chunks = [];
        res.on("data", (d) => chunks.push(d));
        res.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
      })
      .on("error", reject);
  });
}

async function readText(source) {
  if (!source) throw new Error("No source provided for config");
  if (isURL(source)) return await fetchText(source);
  return fs.readFileSync(path.resolve(source), "utf8");
}

function tryJSONParse(txt) {
  try {
    return JSON.parse(txt);
  } catch (_) {
    return null;
  }
}

// Minimal YAML parser: supports top-level key: value and simple arrays (dash list)
function parseSimpleYAML(yaml) {
  const out = {};
  let currentArrayKey = null;
  const lines = yaml
    .split(/\r?\n/)
    .map((l) => l.replace(/\t/g, "  "))
    .map((l) => l.replace(/#.*$/, ""))
    .map((l) => l.trimEnd())
    .filter((l) => l.trim() !== "");

  for (const line of lines) {
    const mItem = line.match(/^\s*-\s+(.*)$/);
    if (mItem && currentArrayKey) {
      out[currentArrayKey].push(normalizeScalar(mItem[1]));
      continue;
    }
    const mKV = line.match(/^([^:#]+):\s*(.*)$/);
    if (mKV) {
      const key = mKV[1].trim();
      const val = mKV[2].trim();
      if (val === "") {
        out[key] = [];
        currentArrayKey = key;
      } else {
        out[key] = normalizeScalar(val);
        currentArrayKey = null;
      }
    }
  }
  return out;
}

function normalizeScalar(v) {
  if (v === "true") return true;
  if (v === "false") return false;
  if (/^-?\d+(?:\.\d+)?$/.test(v)) return Number(v);
  if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
    return v.slice(1, -1);
  }
  return v;
}

function resolveTasksFromConfig(cfg, scriptsDir) {
  const list = [];
  const tasks = Array.isArray(cfg?.tasks) ? cfg.tasks : [];
  for (const t of tasks) {
    if (typeof t === "string") {
      list.push({ name: t, file: `${t}.js` });
    } else if (t && typeof t === "object") {
      const name = t.name || t.file || "task";
      let file = t.file || t.name || name;
      if (!/\.js$/.test(file)) file += ".js";
      list.push({ name, file });
    }
  }

  // Fallback: scan scriptsDir for .js files if no tasks provided
  if (list.length === 0) {
    try {
      const files = fs.readdirSync(scriptsDir).filter((f) => f.endsWith(".js"));
      files.sort();
      for (const f of files) list.push({ name: path.basename(f, ".js"), file: f });
    } catch (_) {
      // ignore
    }
  }
  return list;
}

function parseArgs(argv) {
  const args = {
    config: process.env.CONFIG || process.env.CONFIG_URL || "",
    tasks: (process.env.TASKS || "").split(/[,\s]+/).filter(Boolean),
    scriptsDir: process.env.SCRIPTS_DIR || "scripts",
    dryRun: /^(1|true|yes)$/i.test(process.env.DRY_RUN || ""),
    list: false,
    help: false,
  };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === "-h" || a === "--help") args.help = true;
    else if (a === "-l" || a === "--list") args.list = true;
    else if (a === "-n" || a === "--dry-run") args.dryRun = true;
    else if ((a === "-c" || a === "--config") && argv[i + 1]) args.config = argv[++i];
    else if ((a === "-t" || a === "--tasks") && argv[i + 1]) args.tasks = argv[++i].split(/[,\s]+/).filter(Boolean);
    else if ((a === "-s" || a === "--scripts") && argv[i + 1]) args.scriptsDir = argv[++i];
  }
  return args;
}

function printHelp() {
  banner();
  console.log(
    [
      color.bold("Usage") + ": node checkbox.js [options]",
      "",
      color.bold("Options"),
      "  -c, --config <path|url>   Load config (JSON or simple YAML)",
      "  -t, --tasks <a,b>        Comma list to run specific tasks",
      "  -s, --scripts <dir>      Directory of task scripts (default: scripts)",
      "  -l, --list               List tasks and exit",
      "  -n, --dry-run            Print plan without executing",
      "  -h, --help               Show help",
      "",
      color.bold("Env"),
      "  CONFIG / CONFIG_URL      Same as --config",
      "  TASKS                    Same as --tasks",
      "  SCRIPTS_DIR              Same as --scripts",
      "  DRY_RUN                  Same as --dry-run",
    ].join("\n")
  );
}

function filterTasks(all, picks) {
  if (!picks || picks.length === 0) return all;
  const set = new Set(picks.map((s) => s.toLowerCase()));
  return all.filter((t) => set.has(t.name.toLowerCase()) || set.has(t.file.toLowerCase()));
}

async function promptPick(tasks) {
  if (!process.stdin.isTTY || !process.stdout.isTTY) return tasks; // non-interactive
  banner();
  console.log(color.bold("Tasks"));
  tasks.forEach((t, i) => console.log(`  ${color.gray(String(i + 1).padStart(2, " "))} ${t.name}`));
  console.log("\nSelect: number ranges (e.g. 1-3,5) or Enter for all");
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const answer = await new Promise((r) => rl.question(color.cyan("> "), (a) => r(a)));
  rl.close();
  const pick = answer.trim();
  if (!pick) return tasks;
  const wanted = new Set();
  for (const seg of pick.split(/[,\s]+/).filter(Boolean)) {
    const m = seg.match(/^(\d+)-(\d+)$/);
    if (m) {
      const a = Number(m[1]);
      const b = Number(m[2]);
      const [from, to] = a <= b ? [a, b] : [b, a];
      for (let i = from; i <= to; i++) wanted.add(i);
    } else if (/^\d+$/.test(seg)) {
      wanted.add(Number(seg));
    }
  }
  const res = [];
  let idx = 1;
  for (const t of tasks) {
    if (wanted.has(idx++)) res.push(t);
  }
  return res.length ? res : tasks;
}

async function loadConfig(configPathOrUrl, scriptsDir) {
  if (!configPathOrUrl) return { tasks: [], scriptsDir };
  const text = await readText(configPathOrUrl);
  const asJson = tryJSONParse(text);
  if (asJson) return asJson;
  // try simple YAML
  return parseSimpleYAML(text);
}

async function runTask(task, scriptsDir, dryRun) {
  const full = path.resolve(scriptsDir, task.file);
  if (!fs.existsSync(full)) {
    console.log(`${color.gray("→")} ${task.name} ${color.red("skipped")} ${color.dim("(not found)")}`);
    return { name: task.name, status: "skipped", ms: 0 };
  }
  if (dryRun) {
    console.log(`${color.gray("→")} ${task.name} ${color.yellow("planned")}`);
    return { name: task.name, status: "planned", ms: 0 };
  }
  const start = Date.now();
  try {
    const mod = require(full);
    if (typeof mod === "function") {
      const maybe = mod();
      if (maybe && typeof maybe.then === "function") await maybe;
    } else if (mod && typeof mod.run === "function") {
      const maybe = mod.run();
      if (maybe && typeof maybe.then === "function") await maybe;
    }
    const ms = Date.now() - start;
    console.log(`${color.gray("→")} ${task.name} ${color.green("done")} ${color.dim(`(${ms}ms)`)}`);
    return { name: task.name, status: "done", ms };
  } catch (err) {
    const ms = Date.now() - start;
    console.log(`${color.gray("→")} ${task.name} ${color.red("fail")} ${color.dim(`(${ms}ms)`)}`);
    console.log(color.dim(String(err && err.stack ? err.stack : err)));
    return { name: task.name, status: "fail", ms };
  }
}

async function main() {
  const args = parseArgs(process.argv);
  if (args.help) {
    printHelp();
    return;
  }

  const cfg = await loadConfig(args.config, args.scriptsDir).catch((e) => {
    console.log(color.red("Failed to load config:"), e.message || e);
    return { tasks: [], scriptsDir: args.scriptsDir };
  });

  const scriptsDir = cfg.scriptsDir || args.scriptsDir || "scripts";
  const allTasks = resolveTasksFromConfig(cfg, scriptsDir);

  if (args.list) {
    banner();
    if (allTasks.length === 0) {
      console.log(color.dim("No tasks found."));
      return;
    }
    console.log(color.bold("Tasks"));
    allTasks.forEach((t) => console.log(`  • ${t.name} ${color.dim(t.file)}`));
    return;
  }

  let picked = filterTasks(allTasks, args.tasks);
  if (!args.tasks.length && picked.length) picked = await promptPick(picked);

  banner();
  if (picked.length === 0) {
    console.log(color.dim("No tasks to run."));
    return;
  }

  console.log(color.bold(`Run ${picked.length} task(s)`) + (args.dryRun ? color.yellow(" [dry-run]") : ""));
  let totalMs = 0;
  let ok = 0,
    fail = 0,
    skipped = 0;
  for (const t of picked) {
    const res = await runTask(t, scriptsDir, args.dryRun);
    totalMs += res.ms;
    if (res.status === "done") ok++;
    else if (res.status === "fail") fail++;
    else skipped++;
  }
  console.log(
    color.bold("Summary:") +
      ` ${color.green(ok + " ok")}, ${fail ? color.red(fail + " fail") : color.dim("0 fail")}, ${color.dim(skipped + " skip")} ${color.dim(`(${totalMs}ms)`)}`
  );
}

if (require.main === module) {
  main().catch((e) => {
    console.error(color.red("Fatal:"), e && e.stack ? e.stack : e);
    process.exitCode = 1;
  });
}
