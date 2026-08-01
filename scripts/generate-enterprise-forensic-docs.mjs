import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const outDir = path.join(root, "docs", "erp-forensic");

const skipDirs = new Set([".git", ".git-rewrite", ".next", ".vercel", "node_modules"]);
const skipPrefixes = ["docs/forensic-reverse-engineering", "docs/erp-forensic"];
const binaryExts = new Set([".xlsx", ".png", ".jpg", ".jpeg", ".gif", ".webp", ".ico", ".jar", ".zip"]);
const textExts = new Set([
  ".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs", ".json", ".md", ".sql", ".toml", ".css",
  ".svg", ".xml", ".gradle", ".properties", ".java", ".bat", ".yml", ".yaml", ".gitignore",
]);

const DOC_NAMES = [
  "01_Project_Architecture.md",
  "02_Database.md",
  "03_Module_Map.md",
  "04_Accounts.md",
  "05_Sales.md",
  "06_Inventory.md",
  "07_Production.md",
  "08_Reports.md",
  "09_Calculation_Engine.md",
  "10_CRUD_Lifecycle.md",
  "11_Delete_Impact.md",
  "12_Update_Impact.md",
  "13_Data_Flow.md",
  "14_Dependency_Graph.md",
  "15_Business_Rules.md",
  "16_End_to_End_Workflows.md",
  "17_Cross_Module_Dependencies.md",
  "18_Hidden_Side_Effects.md",
  "19_Risk_Analysis.md",
  "20_Sequence_Diagrams.md",
];

function rel(file) {
  return path.relative(root, file).replaceAll("\\", "/");
}

function link(file, line = 1, label = rel(file)) {
  return `[${label}](${file.replaceAll("\\", "/")}:${line})`;
}

function mkdir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function walk(dir) {
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (skipDirs.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    const r = rel(full);
    if (skipPrefixes.some((prefix) => r.startsWith(prefix))) continue;
    if (entry.isDirectory()) files.push(...walk(full));
    else files.push(full);
  }
  return files.sort((a, b) => rel(a).localeCompare(rel(b)));
}

function readText(file) {
  const ext = path.extname(file).toLowerCase();
  if (binaryExts.has(ext)) return null;
  if (!textExts.has(ext) && !textExts.has(path.basename(file))) return null;
  try {
    return fs.readFileSync(file, "utf8");
  } catch {
    return null;
  }
}

function routeFrom(file) {
  const r = rel(file);
  if (!r.startsWith("src/app/") || !r.endsWith("/page.tsx")) return null;
  let route = r
    .replace(/^src\/app\//, "/")
    .replace(/\/page\.tsx$/, "")
    .replace(/\/?\([^/]+\)/g, "")
    .replace(/\[([^\]]+)\]/g, ":$1")
    .replaceAll("//", "/");
  return route || "/";
}

function moduleFor(file) {
  const r = rel(file);
  const route = routeFrom(file) || r;
  const seg = route.split("/").filter(Boolean);
  const first = seg[0] ?? "";
  if (first === "accounts" || r.includes("_actions/accounts") || r.includes("_actions/journal")) return "Accounts";
  if (first === "sales" || r.includes("_actions/sales") || r.includes("_actions/client-orders") || r.includes("_actions/client-sales")) return "Sales";
  if (first === "reports") return "Reports";
  if (route.includes("/stock") || route.includes("/raw-material") || route.includes("/product-purchase") || route.includes("/material") || route.includes("/purchase") || r.includes("_actions/raw-material") || r.includes("_actions/product-purchase") || r.includes("_actions/purchases")) return "Inventory";
  if (route.includes("/production") || route.includes("/consumption") || route.includes("/fabric") || route.includes("/roto-printing") || route.includes("/lamination") || route.includes("/offset-printing") || route.includes("/finishing") || r.includes("_actions/production")) return "Production";
  if (first === "admin" || r.includes("_actions/users-roles") || r.includes("_actions/master") || r.includes("_actions/attendance") || r.includes("_actions/products")) return "Admin";
  if (first === "dashboard") return "Dashboard";
  if (first === "client" || first === "portal") return "Portal";
  return "Core";
}

function heading(title, depth = 2) {
  return `${"#".repeat(depth)} ${title}\n\n`;
}

function bullets(rows, empty = "Not found in source code.") {
  if (!rows.length) return `${empty}\n\n`;
  return rows.map((r) => {
    const label = r.label ?? `\`${r.text.replaceAll("`", "\\`")}\``;
    return `- ${link(r.file, r.line)}: ${label}`;
  }).join("\n") + "\n\n";
}

function write(name, text) {
  fs.writeFileSync(path.join(outDir, name), text.replace(/\r\n/g, "\n"), "utf8");
}

function extractSqlBlocks(records, re) {
  const blocks = [];
  for (const record of records.filter((r) => r.ext === ".sql")) {
    for (let i = 0; i < record.lines.length; i++) {
      const match = record.lines[i].match(re);
      if (!match) continue;
      let end = i + 1;
      for (let j = i + 1; j < record.lines.length; j++) {
        end = j + 1;
        const t = record.lines[j].trim();
        if (t.endsWith(";") && !t.startsWith("--")) break;
        if (/^\$\$;?$/.test(t)) break;
      }
      blocks.push({
        file: record.file,
        rel: record.rel,
        line: i + 1,
        end,
        name: match[1] || match[0],
        text: record.lines.slice(i, end).join("\n"),
      });
    }
  }
  return blocks;
}

function codeBlock(blocks) {
  if (!blocks.length) return "Not found in source code.\n\n";
  return blocks
    .map((b) => `- ${link(b.file, b.line)}-${b.end}: \`${b.name.replaceAll("`", "\\`")}\`\n\n\`\`\`sql\n${b.text}\n\`\`\``)
    .join("\n\n") + "\n\n";
}

function evidence(records, filter) {
  const rows = [];
  for (const record of records) {
    record.lines.forEach((text, i) => {
      const trimmed = text.trim();
      if (filter(trimmed, record, i + 1)) rows.push({ file: record.file, rel: record.rel, line: i + 1, text: trimmed });
    });
  }
  return rows;
}

function parseExportedFunctions(record) {
  const fns = [];
  const exportRe = /^export\s+(?:async\s+)?function\s+([A-Za-z0-9_$]+)/;
  const constExportRe = /^export\s+(?:async\s+)?function\s+([A-Za-z0-9_$]+)/;
  record.lines.forEach((line, i) => {
    let m = line.match(exportRe);
    if (m) {
      fns.push({ name: m[1], file: record.file, rel: record.rel, line: i + 1, module: moduleFor(record.file) });
      return;
    }
    m = line.match(/^export\s+const\s+([A-Za-z0-9_$]+)\s*=\s*(?:async\s*)?\(/);
    if (m) fns.push({ name: m[1], file: record.file, rel: record.rel, line: i + 1, module: moduleFor(record.file) });
  });
  return fns;
}

function extractFunctionBody(lines, startLine) {
  const startIdx = startLine - 1;
  let braceDepth = 0;
  let started = false;
  const bodyLines = [];
  for (let i = startIdx; i < lines.length; i++) {
    const line = lines[i];
    bodyLines.push(line);
    for (const ch of line) {
      if (ch === "{") { braceDepth++; started = true; }
      if (ch === "}") braceDepth--;
    }
    if (started && braceDepth === 0) break;
  }
  return bodyLines.join("\n");
}

function extractDbOps(text) {
  const ops = [];
  const fromRe = /\.from\(["'`]([^"'`]+)["'`]\)/g;
  const rpcRe = /\.rpc\(["'`]([^"'`]+)["'`]/g;
  let m;
  while ((m = fromRe.exec(text))) {
    const after = text.slice(m.index, m.index + 200);
    const op = after.match(/\.(select|insert|update|delete|upsert)\(/)?.[1] ?? "access";
    ops.push({ table: m[1], op });
  }
  while ((m = rpcRe.exec(text))) ops.push({ table: m[1], op: "rpc" });
  return ops;
}

function findCallers(fnName, records) {
  const callers = [];
  const callRe = new RegExp(`\\b${fnName}\\s*\\(`);
  const importRe = new RegExp(`import\\s*\\{[^}]*\\b${fnName}\\b[^}]*\\}\\s*from`);
  for (const record of records) {
    record.lines.forEach((line, i) => {
      if (importRe.test(line) || (callRe.test(line) && !line.match(/^export\s+(async\s+)?function\s+${fnName}/))) {
        callers.push({ file: record.file, rel: record.rel, line: i + 1, text: line.trim() });
      }
    });
  }
  return callers;
}

function resolveImplementation(fn, records) {
  const record = records.find((r) => r.file === fn.file);
  if (!record) return fn;
  const body = extractFunctionBody(record.lines, fn.line);
  const delegate = body.match(/return\s+([a-zA-Z_][a-zA-Z0-9_]*)\.([a-zA-Z_][a-zA-Z0-9_]*)\s*\(/);
  if (!delegate) return fn;
  const [, modVar, implName] = delegate;
  const importLine = record.lines.find((l) => l.includes(`import * as ${modVar}`));
  if (!importLine) return fn;
  const modMatch = importLine.match(/from\s+["']([^"']+)["']/);
  if (!modMatch) return fn;
  let modPath = modMatch[1];
  if (modPath.startsWith("@/")) modPath = modPath.replace("@/", "src/") + ".ts";
  else if (modPath.startsWith("./")) modPath = path.join(path.dirname(record.rel), modPath).replaceAll("\\", "/") + ".ts";
  else modPath = modPath + ".ts";
  const cand = records.find((r) => r.rel.replaceAll("\\", "/") === modPath || r.rel.replaceAll("\\", "/").endsWith("/" + path.basename(modPath)));
  if (!cand) return fn;
  const impl = parseExportedFunctions(cand).find((f) => f.name === implName);
  return impl ?? fn;
}

function traceFunction(fn, records, visited = new Set(), depth = 0) {
  fn = resolveImplementation(fn, records);
  const key = `${fn.rel}:${fn.name}`;
  if (visited.has(key) || depth > 12) return { fn, callers: [], dbOps: [], callees: [], revalidations: [], throws: [] };
  visited.add(key);

  const record = records.find((r) => r.file === fn.file);
  if (!record) return { fn, callers: [], dbOps: [], callees: [], revalidations: [], throws: [] };

  const body = extractFunctionBody(record.lines, fn.line);
  const dbOps = extractDbOps(body).map((op) => ({ ...op, fn: fn.name, file: fn.file, line: fn.line }));
  const revalidations = [...body.matchAll(/revalidatePath\(["'`]([^"'`]+)["'`]/g)].map((m) => m[1]);
  const throws = [...body.matchAll(/throw new Error\(([^)]+)\)/g)].map((m) => m[1].trim());

  const internalCallRe = /\b([a-zA-Z_][a-zA-Z0-9_]*)\s*\(/g;
  const skip = new Set(["if", "for", "while", "switch", "catch", "return", "throw", "new", "await", "typeof", "Number", "String", "parseInt", "parseFloat", "Math", "Date", "JSON", "Array", "Object", "console", "Error", "FormData", "Record", "Set", "Map", "Promise", "Intl", "Boolean"]);
  const calleeNames = new Set();
  let cm;
  while ((cm = internalCallRe.exec(body))) {
    if (!skip.has(cm[1]) && cm[1] !== fn.name) calleeNames.add(cm[1]);
  }

  const allFns = records.flatMap(parseExportedFunctions);
  const callees = [];
  for (const name of calleeNames) {
    const targets = allFns.filter((f) => f.name === name);
    for (const target of targets) {
      callees.push(traceFunction(target, records, visited, depth + 1));
    }
  }

  return {
    fn,
    callers: findCallers(fn.name, records),
    dbOps,
    revalidations,
    throws,
    callees,
  };
}

function flattenTrace(trace, acc = { dbOps: [], revalidations: [], throws: [], chain: [] }) {
  acc.chain.push(`${trace.fn.name} @ ${trace.fn.rel}:${trace.fn.line}`);
  acc.dbOps.push(...trace.dbOps);
  acc.revalidations.push(...trace.revalidations);
  acc.throws.push(...trace.throws);
  for (const c of trace.callees) flattenTrace(c, acc);
  return acc;
}

function renderTraceTree(trace, depth = 0) {
  let out = `${"  ".repeat(depth)}- \`${trace.fn.name}\` ${link(trace.fn.file, trace.fn.line)}\n`;
  if (trace.dbOps.length) {
    for (const op of trace.dbOps) {
      out += `${"  ".repeat(depth + 1)}- DB: \`${op.op}\` on \`${op.table}\`\n`;
    }
  }
  if (trace.revalidations.length) {
    out += `${"  ".repeat(depth + 1)}- revalidatePath: ${trace.revalidations.map((p) => `\`${p}\``).join(", ")}\n`;
  }
  if (trace.throws.length) {
    out += `${"  ".repeat(depth + 1)}- throws: ${trace.throws.slice(0, 5).map((t) => `\`${t.slice(0, 80)}\``).join("; ")}\n`;
  }
  for (const c of trace.callees) out += renderTraceTree(c, depth + 1);
  return out;
}

function renderSequenceDiagram(entry, trace) {
  const flat = flattenTrace(trace);
  let seq = "```mermaid\nsequenceDiagram\n";
  seq += "  participant User\n  participant UI\n  participant ServerAction\n  participant Helper\n  participant Supabase\n  participant Cache\n\n";
  const entryLabel = entry.label ?? (entry.text ? entry.text.slice(0, 60) : trace.fn.name);
  seq += `  User->>UI: ${entryLabel}\n`;
  seq += `  UI->>ServerAction: ${trace.fn.name}()\n`;
  let step = 1;
  for (const name of [...new Set(flat.chain.slice(1))].slice(0, 8)) {
    seq += `  ServerAction->>Helper: ${name.split(" @ ")[0]}()\n`;
    step++;
  }
  const tables = [...new Set(flat.dbOps.map((o) => `${o.op}:${o.table}`))];
  for (const t of tables.slice(0, 10)) {
    const [op, table] = t.split(":");
    seq += `  Helper->>Supabase: ${op} ${table}\n`;
  }
  for (const p of [...new Set(flat.revalidations)].slice(0, 6)) {
    seq += `  ServerAction->>Cache: revalidatePath(${p})\n`;
  }
  seq += "  ServerAction-->>UI: response / throw\n";
  seq += "```\n\n";
  return seq;
}

// --- Index repository ---
const files = walk(root);
const records = files.map((file) => {
  const text = readText(file);
  const lines = text == null ? [] : text.split(/\r?\n/);
  return {
    file,
    rel: rel(file),
    ext: path.extname(file).toLowerCase(),
    text: text ?? "",
    lines,
    bytes: fs.statSync(file).size,
    binary: text == null,
    route: routeFrom(file),
    module: moduleFor(file),
  };
});
const source = records.filter((r) => !r.binary);
const binary = records.filter((r) => r.binary);
const pages = source.filter((r) => r.route);

const imports = evidence(source, (t) => t.startsWith("import "));
const exportsRows = evidence(source, (t) => t.startsWith("export "));
const dbRows = evidence(source, (t) => /\.from\(["'`][A-Za-z0-9_ -]+["'`]\)|\.rpc\(["'`][A-Za-z0-9_]+["'`]|\.(select|insert|update|delete|upsert)\(/.test(t));
const authRows = evidence(source, (t) => /auth\.|getUser\(|signIn|signOut|updateSession|requirePermission|hasPermission|has_permission|roles|permissions|role_permissions|is_admin|requireUser|requireRole/i.test(t));
const buttonRows = evidence(source, (t) => /<Button|<button|\bonClick=|\bhandleDelete\b|\bhandleSubmit\b|\baction=|\bformAction\b/.test(t));
const formRows = evidence(source, (t) => /<form|FormData|onSubmit|handleSubmit|z\.|required|throw new Error|return \{ error/i.test(t));
const calcRows = evidence(source, (t) => /(gst|tax|discount|quantity|meters|weight|average|rate|closing|opening|outstanding|credit|debit|ledger|balance|production|consumption|waste|grand|total|round|amount|hours|overtime|stock|net_profit|net_loss|wip)/i.test(t));
const deleteRows = evidence(source, (t) => /\.delete\(|deleted_at|soft_delete|softDelete|handleDelete|Delete|delete[A-Z_]|DROP TABLE|ON DELETE/i.test(t));
const updateRows = evidence(source, (t) => /\.update\(|updated_at|\.set\(/i.test(t));
const statusRows = evidence(source, (t) => /(status|draft|confirmed|cancelled|available|reserved|sold|consumed|completed|pending|approved|inactive|active|voided|backorder|is_draft)/i.test(t));
const uiRows = evidence(source, (t) => /<Table|<table|Dialog|searchParams|filter|sort|order\(|limit\(|range\(|ilike\(|gte\(|lte\(|loading|toast|router\.refresh|revalidatePath|useSearchParams|pagination/i.test(t));
const sideEffectRows = evidence(source, (t) => /revalidatePath|router\.refresh|revalidateAllReports|generateNextJournalNo|current_stock|accounts_journal|journal_no|bill_number|order_number|dispatch_number/i.test(t));
const ruleRows = evidence(source, (t) => /throw new Error|\.refine\(|check\s*\(|\.min\(|\.max\(|\.positive\(|cannot|must be|required|if \(!|if \(error|status ===|status !==|unique|ON DELETE|CASCADE/i.test(t));

const tableBlocks = extractSqlBlocks(source, /^\s*create\s+table(?:\s+if\s+not\s+exists)?\s+public\.([A-Za-z0-9_]+)/i);
const alterBlocks = extractSqlBlocks(source, /^\s*alter\s+table\s+(?:public\.)?([A-Za-z0-9_]+)/i);
const functionBlocks = extractSqlBlocks(source, /^\s*create\s+or\s+replace\s+function\s+public\.([A-Za-z0-9_]+)/i);
const triggerBlocks = extractSqlBlocks(source, /^\s*create\s+trigger\s+([A-Za-z0-9_]+)/i);
const policyBlocks = extractSqlBlocks(source, /^\s*create\s+policy\s+"?([^"]+)"?/i);
const indexBlocks = extractSqlBlocks(source, /^\s*create\s+(?:unique\s+)?index(?:\s+if\s+not\s+exists)?\s+([A-Za-z0-9_]+)/i);
const viewBlocks = extractSqlBlocks(source, /^\s*create(?:\s+or\s+replace)?\s+view\s+(?:public\.)?([A-Za-z0-9_]+)/i);

const tableNames = Array.from(new Set([
  ...tableBlocks.map((b) => b.name),
  ...dbRows.map((r) => r.text.match(/\.from\(["'`]([^"'`]+)["'`]\)/)?.[1]).filter(Boolean),
])).sort();

const exportedFns = source.flatMap(parseExportedFunctions);
const actionFns = exportedFns.filter((f) => f.rel.includes("_actions"));

// Build UI -> action map
const uiActionEntries = [];
for (const fn of actionFns) {
  const callers = findCallers(fn.name, source);
  for (const caller of callers) {
    if (caller.text.startsWith("import")) {
      uiActionEntries.push({ action: fn.name, actionFile: fn.file, actionLine: fn.line, uiFile: caller.file, uiLine: caller.line, uiRel: caller.rel, module: moduleFor(caller.file) });
    }
  }
}

// Build action registry: map exported name -> all implementations (wrapper + impl)
const actionRegistry = new Map();
for (const fn of actionFns) {
  const impl = resolveImplementation(fn, source);
  actionRegistry.set(fn.name, impl);
}
const traces = [...actionRegistry.entries()].map(([name, fn]) => traceFunction(fn, source));

mkdir(outDir);

// README
let readme = "# ERP Forensic Reverse Engineering Deliverables\n\n";
readme += `Generated from source under \`${root}\`.\n\n`;
readme += `Source/text files indexed: ${source.length}. Binary/non-text artifacts cataloged: ${binary.length}.\n\n`;
readme += `Exported functions traced: ${exportedFns.length}. Server actions traced: ${actionFns.length}. UI-to-action bindings: ${uiActionEntries.length}.\n\n`;
readme += "Every statement is tied to source references. Where direct implementation evidence is absent, documents state: **Not found in source code.**\n\n";
for (const name of DOC_NAMES) readme += `- [${name}](./${name})\n`;
write("README.md", readme);

// 01 Architecture
let arch = "# 01 Project Architecture\n\n";
arch += heading("Coverage");
arch += `- Source files indexed: ${source.length}\n`;
arch += `- Pages: ${pages.length}\n`;
arch += `- Server action files: ${source.filter((r) => r.rel.includes("_actions")).length}\n`;
arch += `- SQL migrations: ${source.filter((r) => r.ext === ".sql").length}\n`;
arch += `- Database tables (schema + runtime references): ${tableNames.length}\n\n`;
arch += heading("Framework And Runtime");
arch += bullets(evidence(source.filter((r) => ["package.json", "next.config.ts", "capacitor.config.json", "middleware.ts"].includes(r.rel)), () => true));
arch += heading("Authentication Flow");
arch += `- Middleware: ${link(path.join(root, "middleware.ts"), 1)} calls \`updateSession\` from Supabase middleware.\n`;
arch += `- Session user: ${link(path.join(root, "src/lib/auth.ts"), 7)} \`getSessionUser\` reads \`auth.getUser()\` then \`users\` joined with \`roles\`.\n`;
arch += `- Permission gate: ${link(path.join(root, "src/lib/auth.ts"), 108)} \`requirePermission\` redirects to \`/403\` when permission missing; admin bypass at line 110.\n\n`;
arch += heading("Navigation And Permission Keys");
arch += bullets(evidence(source.filter((r) => r.rel === "src/lib/navigation.ts"), (t) => /href:|permission:|roles:/.test(t)));
arch += heading("Routes");
for (const p of pages) arch += `- \`${p.route}\` → ${link(p.file, 1)} (module: \`${p.module}\`)\n`;
arch += "\n";
arch += heading("Server Action Registry");
arch += bullets(evidence(source.filter((r) => r.rel === "src/app/(app)/_actions.ts"), (t) => /^export async function/.test(t)));
arch += heading("Supabase Database Access (sample — full list in 02)");
arch += bullets(dbRows.slice(0, 200), dbRows.length ? undefined : "Not found in source code.");
if (dbRows.length > 200) arch += `_… and ${dbRows.length - 200} additional database access lines. See 02_Database.md per table._\n\n`;
write("01_Project_Architecture.md", arch);

// 02 Database
let db = "# 02 Database\n\n";
for (const table of tableNames) {
  db += heading(table, 2);
  db += heading("Schema Definition", 3);
  db += codeBlock(tableBlocks.filter((b) => b.name === table));
  db += heading("Alterations / FK / Constraints", 3);
  db += codeBlock(alterBlocks.filter((b) => b.name === table || b.text.includes(table)));
  db += heading("Indexes", 3);
  db += codeBlock(indexBlocks.filter((b) => b.text.includes(table)));
  db += heading("RLS Policies", 3);
  db += codeBlock(policyBlocks.filter((b) => b.text.includes(table)));
  db += heading("Triggers", 3);
  db += codeBlock(triggerBlocks.filter((b) => b.text.includes(table)));
  db += heading("Views / RPCs", 3);
  db += codeBlock([...viewBlocks, ...functionBlocks].filter((b) => b.text.includes(table)));
  db += heading("Runtime Read/Write/Update/Delete Evidence", 3);
  const reads = dbRows.filter((r) => r.text.includes(`.from("${table}")`) || r.text.includes(`.from('${table}')`));
  db += bullets(reads.length ? reads : []);
}
write("02_Database.md", db);

// 03 Module Map
const modules = ["Admin", "Accounts", "Sales", "Inventory", "Production", "Reports", "Dashboard", "Portal", "Core"];
let moduleMap = "# 03 Module Map\n\n";
moduleMap += heading("Module Index From Navigation");
moduleMap += bullets(evidence(source.filter((r) => r.rel === "src/lib/navigation.ts"), (t) => /key:|label:|href:/.test(t)));
for (const mod of modules) {
  moduleMap += heading(mod);
  const modPages = pages.filter((p) => p.module === mod);
  moduleMap += heading("Pages", 3);
  moduleMap += modPages.length ? modPages.map((p) => `- \`${p.route}\`: ${link(p.file, 1)}`).join("\n") + "\n\n" : "Not found in source code.\n\n";
  moduleMap += heading("Server Actions", 3);
  moduleMap += bullets(actionFns.filter((f) => f.module === mod).map((f) => ({ file: f.file, line: f.line, text: `export function ${f.name}`, label: `\`${f.name}\`` })));
  moduleMap += heading("Tables Touched", 3);
  const modDb = dbRows.filter((r) => moduleFor(r.file) === mod);
  const tables = [...new Set(modDb.map((r) => r.text.match(/\.from\(["'`]([^"'`]+)["'`]\)/)?.[1]).filter(Boolean))].sort();
  moduleMap += tables.length ? tables.map((t) => `- \`${t}\``).join("\n") + "\n\n" : "Not found in source code.\n\n";
}
write("03_Module_Map.md", moduleMap);

function moduleDoc(filename, mod, title) {
  let doc = `# ${title}\n\n`;
  const modPages = pages.filter((p) => p.module === mod);
  const modActions = actionFns.filter((f) => f.module === mod);
  const modTraces = traces.filter((t) => t.fn.module === mod);

  for (const p of modPages) {
    doc += heading(`${p.route}`, 2);
    doc += `File: ${link(p.file, 1)}\n\n`;
    const navPerm = evidence(source.filter((r) => r.rel === "src/lib/navigation.ts"), (t) => t.includes(p.route));
    doc += heading("Permissions", 3);
    doc += bullets([...authRows.filter((r) => r.file === p.file), ...navPerm]);
    doc += heading("UI / Tables / Filters / Dialogs / Loading", 3);
    doc += bullets(uiRows.filter((r) => r.file === p.file));
    doc += heading("Buttons And Event Handlers", 3);
    doc += bullets(buttonRows.filter((r) => r.file === p.file));
    doc += heading("Forms And Validation", 3);
    doc += bullets(formRows.filter((r) => r.file === p.file));
    doc += heading("Inline Database Queries (page-level)", 3);
    doc += bullets(dbRows.filter((r) => r.file === p.file));
    doc += heading("Calculations Displayed", 3);
    doc += bullets(calcRows.filter((r) => r.file === p.file));
    const pageActions = uiActionEntries.filter((e) => e.uiFile === p.file || e.uiRel.startsWith(path.dirname(p.rel)));
    doc += heading("Bound Server Actions", 3);
    doc += pageActions.length
      ? pageActions.map((e) => `- UI ${link(e.uiFile, e.uiLine)} imports \`${e.action}\` → ${link(e.actionFile, e.actionLine)}`).join("\n") + "\n\n"
      : "Not found in source code.\n\n";
  }

  doc += heading("Execution Traces (Server Actions)", 2);
  for (const trace of modTraces.slice(0, 40)) {
    doc += heading(trace.fn.name, 3);
    doc += "```\n" + renderTraceTree(trace) + "```\n\n";
    const uiCalls = trace.callers.filter((c) => c.text.startsWith("import"));
    doc += heading("Called From UI", 4);
    doc += bullets(uiCalls.length ? uiCalls : []);
  }

  doc += heading("Delete Operations In Module", 2);
  doc += bullets(deleteRows.filter((r) => moduleFor(r.file) === mod));
  doc += heading("Update Operations In Module", 2);
  doc += bullets(updateRows.filter((r) => moduleFor(r.file) === mod));
  write(filename, doc);
}

moduleDoc("04_Accounts.md", "Accounts", "04 Accounts");
moduleDoc("05_Sales.md", "Sales", "05 Sales");
moduleDoc("06_Inventory.md", "Inventory", "06 Inventory");
moduleDoc("07_Production.md", "Production", "07 Production");
moduleDoc("08_Reports.md", "Reports", "08 Reports");

// 09 Calculations
let calc = "# 09 Calculation Engine\n\n";
calc += heading("SQL Generated Columns");
calc += codeBlock(tableBlocks.filter((b) => /generated always as/i.test(b.text)));
calc += heading("Database RPC Functions");
calc += codeBlock(functionBlocks);
for (const mod of modules) {
  calc += heading(mod);
  const rows = calcRows.filter((r) => moduleFor(r.file) === mod);
  calc += bullets(rows.slice(0, 150));
  if (rows.length > 150) calc += `_… ${rows.length - 150} additional calculation lines in source._\n\n`;
}
write("09_Calculation_Engine.md", calc);

// 10 CRUD Lifecycle
let crud = "# 10 CRUD Lifecycle\n\n";
crud += "Traces CRUD by module with initiation point and downstream effects evidenced in the same execution chain.\n\n";
for (const mod of modules) {
  crud += heading(mod);
  const modTraces = traces.filter((t) => t.fn.module === mod);
  for (const trace of modTraces) {
    const flat = flattenTrace(trace);
    if (!flat.dbOps.length) continue;
    crud += heading(trace.fn.name, 3);
    crud += `- Entry: ${link(trace.fn.file, trace.fn.line)}\n`;
    crud += `- Call chain: ${flat.chain.join(" → ")}\n`;
    crud += `- Tables: ${[...new Set(flat.dbOps.map((o) => `${o.op}@${o.table}`))].join(", ")}\n`;
    crud += `- Cache invalidation: ${[...new Set(flat.revalidations)].join(", ") || "none evidenced"}\n\n`;
  }
}
write("10_CRUD_Lifecycle.md", crud);

// 11 Delete Impact
let del = "# 11 Delete Impact\n\n";
del += heading("Delete Server Actions — Full Traces");
const deleteTraces = traces.filter((t) => /delete|softDelete|Deactivate|clearSystem/i.test(t.fn.name));
for (const trace of deleteTraces) {
  del += heading(trace.fn.name, 3);
  del += `- Implementation: ${link(trace.fn.file, trace.fn.line)}\n\n`;
  del += "```\n" + renderTraceTree(trace) + "```\n\n";
  del += heading("UI Entry Points", 4);
  del += bullets(trace.callers.filter((c) => c.text.startsWith("import")));
  del += heading("Identifier Matching Evidence", 4);
  const record = source.find((r) => r.file === trace.fn.file);
  const body = record ? extractFunctionBody(record.lines, trace.fn.line) : "";
  del += bullets([...body.matchAll(/\.eq\(["'`]([^"'`]+)["'`]/g)].map((m, i) => ({
    file: trace.fn.file, line: trace.fn.line, text: `.eq("${m[1]}")`, label: `filter column \`${m[1]}\``,
  })));
}
del += heading("SQL ON DELETE / CASCADE / Soft Delete");
del += codeBlock([...tableBlocks, ...alterBlocks, ...triggerBlocks].filter((b) => /delete|deleted_at|cascade|set null/i.test(b.text)));
for (const mod of modules) {
  del += heading(mod);
  del += bullets(deleteRows.filter((r) => moduleFor(r.file) === mod).slice(0, 100));
}
write("11_Delete_Impact.md", del);

// 12 Update Impact
let upd = "# 12 Update Impact\n\n";
upd += heading("Update Server Actions — Full Traces");
const updateTraces = traces.filter((t) => /save|update|confirm|approve|finalize|consume|revert|link|change|checkIn|checkOut/i.test(t.fn.name) && !/delete|Delete/i.test(t.fn.name));
for (const trace of updateTraces.slice(0, 60)) {
  const flat = flattenTrace(trace);
  if (!flat.dbOps.some((o) => o.op === "update" || o.op === "insert" || o.op === "upsert")) continue;
  upd += heading(trace.fn.name, 3);
  upd += "```\n" + renderTraceTree(trace) + "```\n\n";
  upd += `- Fields/status throws: ${flat.throws.slice(0, 8).map((t) => `\`${t.slice(0, 60)}\``).join("; ") || "none"}\n\n`;
}
upd += heading("Status Transition Evidence");
upd += bullets(statusRows.slice(0, 300));
write("12_Update_Impact.md", upd);

// 13 Data Flow
let flow = "# 13 Data Flow\n\n";
flow += heading("UI → Server Action → Database Chains");
for (const entry of uiActionEntries) {
  const trace = traces.find((t) => t.fn.name === entry.action);
  if (!trace) continue;
  flow += heading(`${entry.action} (from ${entry.uiRel})`, 3);
  flow += `- UI import: ${link(entry.uiFile, entry.uiLine)}\n`;
  flow += `- Action: ${link(entry.actionFile, entry.actionLine)}\n\n`;
  flow += "```\n" + renderTraceTree(trace) + "```\n\n";
}
write("13_Data_Flow.md", flow);

// 14 Dependency Graph
let dep = "# 14 Dependency Graph\n\n";
dep += heading("Cross-Table Dependencies (FK from migrations)");
for (const b of alterBlocks.filter((x) => /references|foreign key/i.test(x.text))) {
  dep += `- ${link(b.file, b.line)}: \`${b.text.split("\n")[0].trim().slice(0, 100)}\`\n`;
}
dep += "\n";
for (const mod of modules) {
  dep += heading(mod);
  dep += "```mermaid\ngraph TD\n";
  dep += `  M_${mod.replaceAll(" ", "_")}["${mod}"]\n`;
  const tables = [...new Set(dbRows.filter((r) => moduleFor(r.file) === mod).map((r) => r.text.match(/\.from\(["'`]([^"'`]+)["'`]\)/)?.[1]).filter(Boolean))];
  for (const t of tables) dep += `  M_${mod.replaceAll(" ", "_")} --> T_${t}["${t}"]\n`;
  dep += "```\n\n";
}
write("14_Dependency_Graph.md", dep);

// 15 Business Rules
let rules = "# 15 Business Rules\n\n";
rules += "Rules extracted from `throw new Error`, Zod `.refine`, SQL `check` constraints, and conditional guards.\n\n";
rules += heading("Validation Schemas (helpers.ts)");
rules += bullets(evidence(source.filter((r) => r.rel.includes("_actions/helpers.ts")), (t) => /Schema|refine|enum|min\(|max\(|positive/i.test(t)));
rules += heading("Runtime Guard Throws By Module");
for (const mod of modules) {
  rules += heading(mod, 3);
  rules += bullets(ruleRows.filter((r) => moduleFor(r.file) === mod && /throw new Error/.test(r.text)).slice(0, 80));
}
rules += heading("SQL Check Constraints And Status Enums");
rules += codeBlock(tableBlocks.filter((b) => /check\s*\(|status text not null/i.test(b.text)));
write("15_Business_Rules.md", rules);

// 16 End-to-End Workflows
let workflows = "# 16 End to End Workflows\n\n";
const workflowsDef = [
  { name: "Fabric Production → Roll → Stock", start: "saveProduction", mod: "Production" },
  { name: "Sales Order → Delivery → Roll Allocation → Billing", start: "createSalesOrder", mod: "Sales" },
  { name: "Sales Delivery Confirmation", start: "confirmSalesDelivery", mod: "Sales" },
  { name: "Sales Billing (Draft → Finalize)", start: "prepareSalesOrderDraftBilling", mod: "Sales" },
  { name: "Journal Entry", start: "saveJournalEntry", mod: "Accounts" },
  { name: "Raw Material Purchase → Stock", start: "saveRawMaterialPurchase", mod: "Inventory" },
  { name: "Product Purchase → Journal", start: "saveProductPurchase", mod: "Inventory" },
  { name: "Client Portal Order → Approval → Sales Order", start: "createClientOrder", mod: "Sales" },
  { name: "Closing Stock Report Save", start: "saveClosingStock", mod: "Reports" },
  { name: "Profit & Loss Save", start: "saveProfitLoss", mod: "Reports" },
];
for (const wf of workflowsDef) {
  const trace = traces.find((t) => t.fn.name === wf.start);
  workflows += heading(wf.name, 2);
  if (!trace) { workflows += "Not found in source code.\n\n"; continue; }
  workflows += "```\n" + renderTraceTree(trace) + "```\n\n";
  const flat = flattenTrace(trace);
  workflows += `- Tables written/read: ${[...new Set(flat.dbOps.map((o) => o.table))].join(", ")}\n`;
  workflows += `- Paths revalidated: ${[...new Set(flat.revalidations)].join(", ")}\n\n`;
}
write("16_End_to_End_Workflows.md", workflows);

// 17 Cross Module Dependencies
let cross = "# 17 Cross Module Dependencies\n\n";
cross += heading("Production → Inventory → Sales → Accounts chain");
cross += "Evidence from `revalidatePath` and shared tables in server actions:\n\n";
const crossPatterns = [
  { from: "Production", tables: ["loom_production_entries", "fabric_rolls", "roto_film_rolls"], to: "Inventory" },
  { from: "Sales", tables: ["sales_orders", "sales_order_items", "fabric_rolls"], to: "Accounts" },
  { from: "Accounts", tables: ["accounts_journal"], to: "Reports" },
];
for (const cp of crossPatterns) {
  cross += heading(`${cp.from} → ${cp.to}`, 3);
  for (const table of cp.tables) {
    const writers = dbRows.filter((r) => r.text.includes(`.from("${table}")`) && /\.(insert|update|delete|upsert)\(/.test(r.text));
    cross += `- \`${table}\`: ${writers.length} write operations evidenced\n`;
    cross += bullets(writers.slice(0, 15));
  }
}
cross += heading("Shared Helper: revalidateAllReports");
cross += bullets(evidence(source.filter((r) => r.rel.includes("_actions/helpers.ts")), (t) => /revalidateAllReports|revalidatePath/.test(t)));
cross += heading("Journal Number Generation");
cross += bullets(evidence(source.filter((r) => r.rel.includes("_actions/helpers.ts")), (t) => /generateNextJournalNo|get_next_journal_no/.test(t)));
write("17_Cross_Module_Dependencies.md", cross);

// 18 Hidden Side Effects
let hidden = "# 18 Hidden Side Effects\n\n";
hidden += "Side effects not obvious from UI labels: cache revalidation, journal creation, stock adjustments, roll status changes.\n\n";
for (const trace of traces) {
  const flat = flattenTrace(trace);
  const hasSideEffects = flat.revalidations.length > 1 || flat.dbOps.length > 3;
  if (!hasSideEffects) continue;
  hidden += heading(trace.fn.name, 3);
  hidden += `- Entry: ${link(trace.fn.file, trace.fn.line)}\n`;
  if (flat.revalidations.length) hidden += `- Revalidates: ${[...new Set(flat.revalidations)].join(", ")}\n`;
  const tables = [...new Set(flat.dbOps.map((o) => o.table))];
  hidden += `- Tables touched: ${tables.join(", ")}\n\n`;
}
hidden += heading("revalidatePath / router.refresh Evidence");
hidden += bullets(sideEffectRows.slice(0, 200));
write("18_Hidden_Side_Effects.md", hidden);

// 19 Risk Analysis
let risks = "# 19 Risk Analysis\n\n";
risks += "Source-code risk evidence only. Items without direct evidence: Not found in source code.\n\n";
risks += heading("Duplicate Key / Number Generation");
risks += bullets(evidence(source, (t) => /journal_no|bill_number|order_number|dispatch_number|get_next|next_year_number|unique|max\(/.test(t)));
risks += heading("Missing Transaction / Rollback Evidence");
risks += bullets(evidence(source, (t) => /transaction|rollback|begin|commit/i.test(t)));
risks += heading("Unsafe Casts And TODO Markers");
risks += bullets(evidence(source, (t) => /as any|TODO|FIXME|console\.error/.test(t)));
risks += heading("Broad Queries / Performance");
risks += bullets(evidence(source, (t) => /limit\(500|select\("\*"\)|Promise\.all/.test(t)));
risks += heading("Hard Delete vs Soft Delete Mix");
risks += bullets(deleteRows.filter((r) => /\.delete\(|deleted_at|softDelete/.test(r.text)).slice(0, 150));
write("19_Risk_Analysis.md", risks);

// 20 Sequence Diagrams
let seq = "# 20 Sequence Diagrams\n\n";
const keyActions = [
  "saveProduction", "confirmSalesDelivery", "finalizeSalesOrderBilling", "deleteSalesOrderCompletely",
  "saveJournalEntry", "softDeleteJournalEntryGroup", "saveRawMaterialPurchase", "saveProductPurchase",
  "saveClosingStock", "approveClientOrder", "consumeFabricRoll", "clearSystemTransactions",
];
for (const name of keyActions) {
  const trace = traces.find((t) => t.fn.name === name);
  if (!trace) continue;
  const entry = uiActionEntries.find((e) => e.action === name) ?? { text: name, label: name };
  seq += heading(name, 2);
  seq += renderSequenceDiagram(entry, trace);
  seq += heading("Evidence Tree", 3);
  seq += "```\n" + renderTraceTree(trace) + "```\n\n";
}
write("20_Sequence_Diagrams.md", seq);

console.log(`Generated ${DOC_NAMES.length} forensic documents in ${outDir}`);
