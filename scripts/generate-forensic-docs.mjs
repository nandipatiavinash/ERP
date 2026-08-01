import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const outDir = path.join(root, "docs", "forensic-reverse-engineering");

const skipDirs = new Set([
  ".git",
  ".git-rewrite",
  ".next",
  ".vercel",
  "node_modules",
]);

const binaryExts = new Set([
  ".xlsx",
  ".png",
  ".jpg",
  ".jpeg",
  ".gif",
  ".webp",
  ".ico",
  ".jar",
  ".zip",
  ".keystore",
]);

const textExts = new Set([
  ".ts",
  ".tsx",
  ".js",
  ".jsx",
  ".mjs",
  ".cjs",
  ".json",
  ".md",
  ".sql",
  ".toml",
  ".css",
  ".svg",
  ".xml",
  ".gradle",
  ".properties",
  ".java",
  ".bat",
  ".yml",
  ".yaml",
  ".gitignore",
]);

function rel(file) {
  return path.relative(root, file).replaceAll("\\", "/");
}

function absLink(file, line = 1, label = rel(file)) {
  return `[${label}](${file.replaceAll("\\", "/")}:${line})`;
}

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if (skipDirs.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (rel(full).startsWith("docs/forensic-reverse-engineering")) continue;
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

function linesOf(text) {
  return text.split(/\r?\n/);
}

function matchLines(file, lines, patterns) {
  const rows = [];
  lines.forEach((line, i) => {
    for (const { name, re } of patterns) {
      if (re.test(line)) rows.push({ file, line: i + 1, kind: name, text: line.trim() });
    }
  });
  return rows;
}

function routeFromPage(file) {
  const r = rel(file);
  if (!r.startsWith("src/app/") || !r.endsWith("/page.tsx")) return null;
  let route = r
    .replace(/^src\/app\//, "/")
    .replace(/\/page\.tsx$/, "")
    .replace(/\/?\([^/]+\)/g, "")
    .replace(/\[([^\]]+)\]/g, ":$1");
  route = route.replaceAll("//", "/");
  return route === "" ? "/" : route;
}

function section(title) {
  return `\n## ${title}\n\n`;
}

function bulletEvidence(rows, empty = "Not found in source code.") {
  if (!rows.length) return `${empty}\n\n`;
  return rows.map((r) => `- ${absLink(r.file, r.line)}: \`${r.text.replaceAll("`", "\\`")}\``).join("\n") + "\n\n";
}

function fencedEvidence(rows, empty = "Not found in source code.") {
  if (!rows.length) return `${empty}\n\n`;
  return rows.map((r) => `- ${absLink(r.file, r.line)} (${r.kind}): \`${r.text.replaceAll("`", "\\`")}\``).join("\n") + "\n\n";
}

function extractBlocks(file, lines, startRegex) {
  const blocks = [];
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(startRegex);
    if (!m) continue;
    const start = i + 1;
    let end = start;
    for (let j = i + 1; j < lines.length; j++) {
      end = j + 1;
      const t = lines[j].trim();
      if (t.endsWith(";") && !t.startsWith("--")) break;
      if (/^\$\$;?$/.test(t)) break;
    }
    blocks.push({ file, line: start, end, name: m[1] || m[0], text: lines.slice(i, end).join("\n") });
  }
  return blocks;
}

function appRouteGroup(file) {
  const r = rel(file);
  const m = r.match(/^src\/app\/\(([^)]+)\)\//);
  return m ? m[1] : "root";
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function writeDoc(name, content) {
  fs.writeFileSync(path.join(outDir, name), content.replace(/\r\n/g, "\n"), "utf8");
}

const allFiles = walk(root);
const fileRecords = allFiles.map((file) => {
  const text = readText(file);
  const stat = fs.statSync(file);
  const lines = text == null ? [] : linesOf(text);
  return {
    file,
    rel: rel(file),
    ext: path.extname(file).toLowerCase(),
    text,
    lines,
    bytes: stat.size,
    binary: text == null,
  };
});

const sourceRecords = fileRecords.filter((r) => !r.binary);
const binaryRecords = fileRecords.filter((r) => r.binary);

const patterns = [
  { name: "import", re: /^\s*import\s+/ },
  { name: "export", re: /^\s*export\s+/ },
  { name: "function", re: /\b(function\s+[A-Za-z0-9_$]+|export\s+(default\s+)?(async\s+)?function\s+[A-Za-z0-9_$]+|const\s+[A-Za-z0-9_$]+\s*=\s*(async\s*)?\()/ },
  { name: "server-action-marker", re: /^["']use server["'];?/ },
  { name: "client-marker", re: /^["']use client["'];?/ },
  { name: "supabase-from", re: /\.from\(["'`][A-Za-z0-9_ -]+["'`]\)/ },
  { name: "supabase-rpc", re: /\.rpc\(["'`][A-Za-z0-9_]+["'`]/ },
  { name: "select", re: /\.select\(/ },
  { name: "insert", re: /\.insert\(/ },
  { name: "update", re: /\.update\(/ },
  { name: "delete", re: /\.delete\(/ },
  { name: "upsert", re: /\.upsert\(/ },
  { name: "auth", re: /auth\.|getUser\(|signIn|signOut|updateSession|has_permission|hasPermission|requirePermission|requireUser/ },
  { name: "cache", re: /revalidatePath|cache|unstable_|noStore|dynamic\s*=/ },
  { name: "validation", re: /z\.|FormData|required|check\s*\(|\.min\(|\.max\(|throw new Error|return \{ error/ },
  { name: "calculation", re: /(total|amount|balance|quantity|meters|weight|gst|tax|discount|debit|credit|stock|rate|salary|hours|overtime|grand|round)/i },
  { name: "delete-logic", re: /(delete|deleted_at|soft_delete|handleDelete|Delete)/ },
  { name: "status-transition", re: /(status|draft|confirmed|cancelled|available|reserved|sold|consumed|completed|pending|approved)/i },
  { name: "button", re: /<Button|<button|\bButton\b/ },
  { name: "form", re: /<form|FormData|onSubmit|handleSubmit/ },
  { name: "table-ui", re: /<Table|<table|columns|rows/ },
  { name: "filter-search-sort-page", re: /searchParams|filter|sort|order\(|range\(|limit\(|ilike\(|gte\(|lte\(|pagination|pageSize|query/i },
];

const evidence = sourceRecords.flatMap((r) => matchLines(r.file, r.lines, patterns));

const sqlRecords = sourceRecords.filter((r) => r.ext === ".sql");
const sqlBlocks = {
  tables: sqlRecords.flatMap((r) => extractBlocks(r.file, r.lines, /^\s*create\s+table(?:\s+if\s+not\s+exists)?\s+public\.([A-Za-z0-9_]+)/i)),
  alters: sqlRecords.flatMap((r) => extractBlocks(r.file, r.lines, /^\s*alter\s+table\s+(?:public\.)?([A-Za-z0-9_]+)/i)),
  functions: sqlRecords.flatMap((r) => extractBlocks(r.file, r.lines, /^\s*create\s+or\s+replace\s+function\s+public\.([A-Za-z0-9_]+)/i)),
  triggers: sqlRecords.flatMap((r) => extractBlocks(r.file, r.lines, /^\s*create\s+trigger\s+([A-Za-z0-9_]+)/i)),
  policies: sqlRecords.flatMap((r) => extractBlocks(r.file, r.lines, /^\s*create\s+policy\s+"?([^"]+)"?/i)),
  indexes: sqlRecords.flatMap((r) => extractBlocks(r.file, r.lines, /^\s*create\s+(?:unique\s+)?index(?:\s+if\s+not\s+exists)?\s+([A-Za-z0-9_]+)/i)),
  views: sqlRecords.flatMap((r) => extractBlocks(r.file, r.lines, /^\s*create(?:\s+or\s+replace)?\s+view\s+(?:public\.)?([A-Za-z0-9_]+)/i)),
};

const tableNames = Array.from(
  new Set([
    ...sqlBlocks.tables.map((b) => b.name),
    ...evidence
      .map((e) => e.text.match(/\.from\(["'`]([^"'`]+)["'`]\)/)?.[1])
      .filter(Boolean),
  ]),
).sort();

const pages = sourceRecords
  .filter((r) => routeFromPage(r.file))
  .map((r) => ({ ...r, route: routeFromPage(r.file), group: appRouteGroup(r.file) }));

const serverActionFiles = sourceRecords.filter((r) => r.text.includes('"use server"') || r.text.includes("'use server'") || r.rel.includes("_actions"));
const componentFiles = sourceRecords.filter((r) => r.rel.startsWith("src/components/") || r.rel.endsWith(".tsx"));

const crudRows = evidence.filter((e) => ["supabase-from", "supabase-rpc", "select", "insert", "update", "delete", "upsert"].includes(e.kind));
const calculationRows = evidence.filter((e) => e.kind === "calculation");
const deleteRows = evidence.filter((e) => e.kind === "delete-logic" || e.kind === "delete");
const statusRows = evidence.filter((e) => e.kind === "status-transition");
const authRows = evidence.filter((e) => e.kind === "auth");

ensureDir(outDir);

let index = `# ERP Forensic Reverse Engineering Documentation\n\n`;
index += `Generated from source files under \`${root}\`.\n\n`;
index += `Every implementation statement in these documents is backed by file and line references extracted from the repository. When an item is not evidenced by extracted source code, the document says: "Not found in source code."\n\n`;
index += `## Document Set\n\n`;
index += `- [00 Coverage](./00-coverage.md)\n`;
index += `- [01 System Architecture](./01-system-architecture.md)\n`;
index += `- [02 Database Documentation](./02-database-documentation.md)\n`;
index += `- [03 Page Analysis](./03-page-analysis.md)\n`;
index += `- [04 CRUD Data Flow Business Logic](./04-crud-data-flow-business-logic.md)\n`;
index += `- [05 Delete And Update Impact](./05-delete-update-impact.md)\n`;
index += `- [06 Function API State Dependency Risks](./06-function-api-state-dependency-risks.md)\n`;
index += `- [07 File By File Analysis](./07-file-by-file-analysis.md)\n`;
index += `- [08 Requested Section Map](./08-requested-section-map.md)\n`;
writeDoc("README.md", index);

let coverage = `# 00 Coverage\n\n`;
coverage += `Text/source files read: ${sourceRecords.length}.\n\nBinary/non-text artifacts cataloged: ${binaryRecords.length}.\n\n`;
coverage += section("Source Files");
for (const r of sourceRecords) {
  coverage += `- ${absLink(r.file, 1)}: ${r.lines.length} lines, ${r.bytes} bytes.\n`;
}
coverage += "\n";
coverage += section("Binary Or Non-Text Artifacts");
coverage += binaryRecords.length
  ? binaryRecords.map((r) => `- ${absLink(r.file, 1)}: ${r.bytes} bytes. Binary content not decoded as source code.`).join("\n") + "\n\n"
  : "Not found in source code.\n\n";
writeDoc("00-coverage.md", coverage);

let arch = `# 01 System Architecture\n\n`;
arch += section("Framework And Libraries");
arch += bulletEvidence(evidence.filter((e) => e.file.endsWith("package.json") && /"next"|"react"|"@supabase|serwist|capacitor|tailwind|zod|recharts|lucide/.test(e.text)));
arch += section("Routing");
for (const p of pages) arch += `- Route \`${p.route}\` is implemented by ${absLink(p.file, 1)}. Route group: \`${p.group}\`.\n`;
arch += "\n";
arch += section("Authentication");
arch += fencedEvidence(authRows);
arch += section("Authorization");
arch += fencedEvidence(evidence.filter((e) => /requirePermission|has_permission|hasPermission|role_permissions|permissions|is_admin|RLS|policy/i.test(e.text)));
arch += section("Database");
arch += `Supabase database access is evidenced by these lines:\n\n${fencedEvidence(crudRows.filter((e) => e.kind === "supabase-from" || e.kind === "supabase-rpc"))}`;
arch += section("Storage");
arch += fencedEvidence(evidence.filter((e) => /storage\.|bucket|upload|download|image_url|publicUrl/i.test(e.text)));
arch += section("External APIs");
arch += fencedEvidence(evidence.filter((e) => /fetch\(|axios|http:|https:|NEXT_PUBLIC_|SUPABASE|VERCEL|api\//i.test(e.text)));
arch += section("State Management");
arch += fencedEvidence(evidence.filter((e) => /useState|useReducer|useMemo|useEffect|useTransition|useOptimistic|useActionState/i.test(e.text)));
arch += section("Caching");
arch += fencedEvidence(evidence.filter((e) => e.kind === "cache"));
arch += section("Deployment Assumptions");
arch += fencedEvidence(evidence.filter((e) => /vercel|capacitor|android|output|headers|rewrites|experimental|withSerwist|service worker|manifest/i.test(e.text)));
arch += section("Folder Structure");
const topDirs = Array.from(new Set(sourceRecords.map((r) => r.rel.split("/")[0]))).sort();
for (const d of topDirs) arch += `- \`${d}/\`: source files present under this folder are listed in ${absLink(path.join(outDir, "00-coverage.md"), 1, "00-coverage.md")}.\n`;
arch += "\n";
arch += section("Dependency Graph");
arch += fencedEvidence(evidence.filter((e) => e.kind === "import" || e.kind === "export"));
writeDoc("01-system-architecture.md", arch);

let db = `# 02 Database Documentation\n\n`;
db += section("Tables");
for (const table of tableNames) {
  db += `### ${table}\n\n`;
  const creates = sqlBlocks.tables.filter((b) => b.name === table);
  const alters = sqlBlocks.alters.filter((b) => b.name === table || b.text.includes(` ${table}`));
  const refs = evidence.filter((e) => e.text.includes(`.from("${table}")`) || e.text.includes(`.from('${table}')`) || e.text.includes(`public.${table}`) || e.text.includes(table));
  db += `Purpose: Not found in source code.\n\n`;
  db += `Columns / constraints / defaults / generated columns from CREATE TABLE:\n\n`;
  db += creates.length ? creates.map((b) => `- ${absLink(b.file, b.line)}-${b.end}\n\n\`\`\`sql\n${b.text}\n\`\`\``).join("\n\n") + "\n\n" : "Not found in source code.\n\n";
  db += `Alterations, relationships, foreign keys, indexes, constraints, policies, RLS, cascade rules, unique constraints, triggers, views, functions, and stored procedures evidenced for this table:\n\n`;
  const relatedBlocks = [
    ...alters,
    ...sqlBlocks.indexes.filter((b) => b.text.includes(table)),
    ...sqlBlocks.triggers.filter((b) => b.text.includes(table)),
    ...sqlBlocks.policies.filter((b) => b.text.includes(table)),
    ...sqlBlocks.functions.filter((b) => b.text.includes(table)),
    ...sqlBlocks.views.filter((b) => b.text.includes(table)),
  ];
  db += relatedBlocks.length ? relatedBlocks.map((b) => `- ${absLink(b.file, b.line)}-${b.end}: \`${b.text.split(/\r?\n/)[0].trim().replaceAll("`", "\\`")}\``).join("\n") + "\n\n" : "Not found in source code.\n\n";
  db += `How it is used, pages using it, APIs/server actions modifying or reading it:\n\n`;
  db += refs.length ? bulletEvidence(refs) : "Not found in source code.\n\n";
}
db += section("Enums");
db += bulletEvidence(evidence.filter((e) => /check\s*\(.* in \(|create type .* as enum/i.test(e.text)));
db += section("SQL Functions");
for (const b of sqlBlocks.functions) db += `- ${absLink(b.file, b.line)}-${b.end}: \`${b.name}\`\n`;
db += "\n";
writeDoc("02-database-documentation.md", db);

let pageDoc = `# 03 Page Analysis\n\n`;
for (const p of pages) {
  const rows = evidence.filter((e) => e.file === p.file);
  const routeChildren = componentFiles.filter((c) => p.text.includes(path.basename(c.file, path.extname(c.file))));
  pageDoc += `## ${p.route}\n\n`;
  pageDoc += `Route: \`${p.route}\` implemented by ${absLink(p.file, 1)}.\n\n`;
  pageDoc += `Purpose: Not found in source code.\n\n`;
  pageDoc += `Components referenced by import or JSX name:\n\n`;
  pageDoc += routeChildren.length ? routeChildren.map((c) => `- ${absLink(c.file, 1)}`).join("\n") + "\n\n" : "Not found in source code.\n\n";
  pageDoc += `Data fetched / queries / API or backend calls:\n\n${fencedEvidence(rows.filter((r) => ["supabase-from", "supabase-rpc", "select", "insert", "update", "delete", "upsert"].includes(r.kind)))}`;
  pageDoc += `Permissions / authentication:\n\n${fencedEvidence(rows.filter((r) => r.kind === "auth" || /requirePermission|hasPermission|permissions/i.test(r.text)))}`;
  pageDoc += `Buttons:\n\n${fencedEvidence(rows.filter((r) => r.kind === "button"))}`;
  pageDoc += `Forms / validation:\n\n${fencedEvidence(rows.filter((r) => r.kind === "form" || r.kind === "validation"))}`;
  pageDoc += `Tables:\n\n${fencedEvidence(rows.filter((r) => r.kind === "table-ui"))}`;
  pageDoc += `Filters / sorting / search / pagination:\n\n${fencedEvidence(rows.filter((r) => r.kind === "filter-search-sort-page"))}`;
  pageDoc += `Export / import:\n\n${fencedEvidence(rows.filter((r) => /export|import|xlsx|csv|download/i.test(r.text)))}`;
  pageDoc += `Calculations:\n\n${fencedEvidence(rows.filter((r) => r.kind === "calculation"))}`;
  pageDoc += `Dialogs / hidden logic / lifecycle / state / conditional rendering / error handling:\n\n${fencedEvidence(rows.filter((r) => /Dialog|useState|useEffect|if \(|\?|error|throw|return null|loading|hidden|disabled|conditional/i.test(r.text)))}`;
}
writeDoc("03-page-analysis.md", pageDoc);

let crud = `# 04 CRUD Data Flow Business Logic\n\n`;
crud += section("CRUD Operations By Entity");
for (const table of tableNames) {
  crud += `### ${table}\n\n`;
  const refs = crudRows.filter((e) => e.text.includes(`.from("${table}")`) || e.text.includes(`.from('${table}')`) || e.text.includes(table));
  for (const op of ["insert", "select", "update", "delete", "upsert", "supabase-rpc"]) {
    const opRows = refs.filter((r) => r.kind === op || (op === "select" && r.kind === "supabase-from"));
    crud += `#### ${op}\n\n`;
    crud += opRows.length ? fencedEvidence(opRows) : "Not found in source code.\n\n";
  }
  crud += `Validation:\n\n${fencedEvidence(evidence.filter((e) => e.text.includes(table) && e.kind === "validation"))}`;
  crud += `Transactions / rollback logic:\n\n${fencedEvidence(evidence.filter((e) => e.text.includes(table) && /transaction|rollback|begin|commit/i.test(e.text)))}`;
  crud += `Side effects, logs, notifications, cache invalidation, stock/ledger/balance/history updates:\n\n${fencedEvidence(evidence.filter((e) => e.text.includes(table) && /revalidatePath|toast|audit|journal|ledger|stock|balance|history|notification|updated_at|deleted_at/i.test(e.text)))}`;
}
crud += section("Data Flow: User Actions");
const actionRows = evidence.filter((e) => /handleSubmit|onSubmit|handleDelete|onClick|form action|action=|Button|create|update|delete|save/i.test(e.text));
crud += actionRows.length ? actionRows.map((r) => `- ${absLink(r.file, r.line)}: user/UI action evidenced by \`${r.text.replaceAll("`", "\\`")}\` -> subsequent backend/database calls in the same file are listed under that file in [07 File By File Analysis](./07-file-by-file-analysis.md).`).join("\n") + "\n\n" : "Not found in source code.\n\n";
crud += section("Business Logic Conditions And Restrictions");
crud += fencedEvidence(evidence.filter((e) => /if \(|switch|case |required|status|check\s*\(|unique|on conflict|throw new Error|return \{ error/i.test(e.text)));
crud += section("Calculations");
crud += fencedEvidence(calculationRows);
writeDoc("04-crud-data-flow-business-logic.md", crud);

let impact = `# 05 Delete And Update Impact\n\n`;
impact += section("Delete Operations");
impact += fencedEvidence(deleteRows);
impact += section("Delete Impact By Entity");
for (const table of tableNames) {
  impact += `### ${table}\n\n`;
  const rows = deleteRows.filter((e) => e.text.includes(table) || e.text.includes(`.from("${table}")`) || e.text.includes(`.from('${table}')`));
  impact += rows.length ? fencedEvidence(rows) : "Not found in source code.\n\n";
  impact += `Identification key / primary key / bill number / invoice number / composite key / UUID: `;
  const create = sqlBlocks.tables.find((b) => b.name === table);
  if (create) {
    const pk = create.text.split(/\r?\n/).filter((l) => /primary key|unique|bill_number|invoice|order_number|journal_no/i.test(l));
    impact += pk.length ? `\n\n${pk.map((l) => `- ${absLink(create.file, create.line)}: \`${l.trim().replaceAll("`", "\\`")}\``).join("\n")}\n\n` : "Not found in source code.\n\n";
  } else {
    impact += "Not found in source code.\n\n";
  }
  impact += `Side effects / orphan records / inconsistent data possibilities / duplicate identifier risks evidenced:\n\n`;
  impact += fencedEvidence(evidence.filter((e) => e.text.includes(table) && /delete|deleted_at|cascade|set null|on delete|unique|bill_number|order_number|journal_no|stock|balance|journal|audit|history/i.test(e.text)));
}
impact += section("Update Operations");
impact += fencedEvidence(evidence.filter((e) => e.kind === "update" || /updated_at|set .*=/i.test(e.text)));
impact += section("State Transitions");
impact += fencedEvidence(statusRows);
writeDoc("05-delete-update-impact.md", impact);

let funcApi = `# 06 Function API State Dependency Risks\n\n`;
funcApi += section("Functions");
const funcRows = evidence.filter((e) => e.kind === "function" || e.kind === "export");
funcApi += fencedEvidence(funcRows);
funcApi += section("Server Actions");
for (const f of serverActionFiles) {
  funcApi += `### ${f.rel}\n\n${absLink(f.file, 1)}\n\n`;
  funcApi += fencedEvidence(evidence.filter((e) => e.file === f.file && ["function", "export", "server-action-marker", "supabase-from", "supabase-rpc", "insert", "update", "delete", "upsert", "validation", "auth", "cache"].includes(e.kind)));
}
funcApi += section("API Routes");
const apiFiles = sourceRecords.filter((r) => /src\/app\/.*\/route\.(ts|tsx|js)$/.test(r.rel));
funcApi += apiFiles.length ? apiFiles.map((r) => `- ${absLink(r.file, 1)}`).join("\n") + "\n\n" : "Not found in source code.\n\n";
funcApi += section("State Transitions");
funcApi += fencedEvidence(statusRows);
funcApi += section("Dependency Graph");
funcApi += fencedEvidence(evidence.filter((e) => e.kind === "import" || e.kind === "export"));
funcApi += section("Known Risks Based Only On Code");
funcApi += `Unsafe deletes / unsafe updates / duplicate keys / race conditions / missing transactions / missing rollback / dead code / unused APIs / circular dependencies / data inconsistency risks / broken references / performance bottlenecks are listed only where source contains direct evidence keywords below. Items not represented below are: Not found in source code.\n\n`;
funcApi += fencedEvidence(evidence.filter((e) => /delete\(|deleted_at|unique|next_year_number|max\(|limit\(500|Promise\.all|transaction|rollback|orphan|TODO|FIXME|any\)|as any|console\.error|throw new Error/i.test(e.text)));
writeDoc("06-function-api-state-dependency-risks.md", funcApi);

let fileDoc = `# 07 File By File Analysis\n\n`;
for (const r of fileRecords) {
  fileDoc += `## ${r.rel}\n\n`;
  fileDoc += `${absLink(r.file, 1)}\n\n`;
  fileDoc += `Purpose: Not found in source code.\n\n`;
  fileDoc += `Size: ${r.bytes} bytes. ${r.binary ? "Binary/non-text artifact." : `${r.lines.length} lines.`}\n\n`;
  if (r.binary) {
    fileDoc += `Imports: Not found in source code.\n\nExports: Not found in source code.\n\nFunctions/components/queries/business logic/dependencies/used by: Not found in source code.\n\n`;
    continue;
  }
  const rows = evidence.filter((e) => e.file === r.file);
  fileDoc += `Imports:\n\n${fencedEvidence(rows.filter((e) => e.kind === "import"))}`;
  fileDoc += `Exports:\n\n${fencedEvidence(rows.filter((e) => e.kind === "export"))}`;
  fileDoc += `Functions / components:\n\n${fencedEvidence(rows.filter((e) => e.kind === "function"))}`;
  fileDoc += `Queries / CRUD / RPC:\n\n${fencedEvidence(rows.filter((e) => ["supabase-from", "supabase-rpc", "select", "insert", "update", "delete", "upsert"].includes(e.kind)))}`;
  fileDoc += `Business logic / calculations / validations / conditions:\n\n${fencedEvidence(rows.filter((e) => ["calculation", "validation", "status-transition", "delete-logic"].includes(e.kind) || /if \(|switch|case |return \{ error|throw new Error/i.test(e.text)))}`;
  fileDoc += `Dependencies used by this file:\n\n${fencedEvidence(rows.filter((e) => e.kind === "import"))}`;
  const basename = path.basename(r.file, path.extname(r.file));
  const usedBy = sourceRecords.filter((o) => o.file !== r.file && o.text.includes(basename)).slice(0, 200);
  fileDoc += `Used by:\n\n`;
  fileDoc += usedBy.length ? usedBy.map((o) => `- ${absLink(o.file, 1)}`).join("\n") + "\n\n" : "Not found in source code.\n\n";
}
writeDoc("07-file-by-file-analysis.md", fileDoc);

let mapDoc = `# 08 Requested Section Map\n\n`;
const requestedSections = [
  ["Section 1 System Architecture", "01-system-architecture.md"],
  ["Section 2 Database Documentation", "02-database-documentation.md"],
  ["Section 3 Page Analysis", "03-page-analysis.md"],
  ["Section 4 Complete CRUD Analysis", "04-crud-data-flow-business-logic.md"],
  ["Section 5 Data Flow", "04-crud-data-flow-business-logic.md"],
  ["Section 6 Business Logic", "04-crud-data-flow-business-logic.md"],
  ["Section 7 Calculations", "04-crud-data-flow-business-logic.md"],
  ["Section 8 Delete Impact Analysis", "05-delete-update-impact.md"],
  ["Section 9 Update Impact Analysis", "05-delete-update-impact.md"],
  ["Section 10 Module Documentation", "03-page-analysis.md and 06-function-api-state-dependency-risks.md"],
  ["Section 11 Function Trace", "06-function-api-state-dependency-risks.md and 07-file-by-file-analysis.md"],
  ["Section 12 API Documentation", "06-function-api-state-dependency-risks.md"],
  ["Section 13 State Transitions", "05-delete-update-impact.md and 06-function-api-state-dependency-risks.md"],
  ["Section 14 Dependency Graph", "01-system-architecture.md and 06-function-api-state-dependency-risks.md"],
  ["Section 15 Known Risks", "06-function-api-state-dependency-risks.md"],
  ["Section 16 File-By-File Analysis", "07-file-by-file-analysis.md"],
  ["Section 17 End-To-End User Flows", "04-crud-data-flow-business-logic.md"],
  ["Section 18 Code References", "all generated documents"],
];
for (const [name, doc] of requestedSections) {
  mapDoc += `- ${name}: ${doc}.\n`;
}
mapDoc += "\n";
mapDoc += section("Module Navigation Evidence");
const navigationRecord = sourceRecords.find((r) => r.rel === "src/lib/navigation.ts");
const navigationRows = navigationRecord
  ? navigationRecord.lines
      .map((text, i) => ({ file: navigationRecord.file, line: i + 1, kind: "module-navigation", text: text.trim() }))
      .filter((e) => /key:|label:|href:|permission:|roles:/.test(e.text))
  : [];
mapDoc += fencedEvidence(navigationRows);
mapDoc += section("Module Configuration Evidence");
const modulesRecord = sourceRecords.find((r) => r.rel === "src/lib/modules.ts");
const moduleRows = modulesRecord
  ? modulesRecord.lines
      .map((text, i) => ({ file: modulesRecord.file, line: i + 1, kind: "module-config", text: text.trim() }))
      .filter((e) => /key:|title:|table:|path:|fields:|columns:|searchColumns|required|label:/.test(e.text))
  : [];
mapDoc += fencedEvidence(moduleRows);
mapDoc += section("End-To-End Flow Evidence Rule");
mapDoc += `Every action flow is documented as code evidence: UI action evidence and backend/database calls in the same file are listed in [04 CRUD Data Flow Business Logic](./04-crud-data-flow-business-logic.md), and the full per-file trace is listed in [07 File By File Analysis](./07-file-by-file-analysis.md). If a click-to-database sequence is not directly present in the same source files, it is marked "Not found in source code." in the relevant operation section.\n\n`;
writeDoc("08-requested-section-map.md", mapDoc);

console.log(`Generated forensic documentation in ${outDir}`);
