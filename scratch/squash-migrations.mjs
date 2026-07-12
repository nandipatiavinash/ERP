import fs from "fs";
import path from "path";

const migrationsDir = "supabase/migrations";

function squash() {
  const files = fs.readdirSync(migrationsDir)
    .filter(f => f.endsWith(".sql"))
    .sort((a, b) => {
      const aNum = parseInt(a.split("_")[0], 10);
      const bNum = parseInt(b.split("_")[0], 10);
      return aNum - bNum;
    });

  console.log(`Found ${files.length} migration files to squash.`);

  let consolidatedSql = "";
  for (const file of files) {
    console.log(`Reading: ${file}`);
    const filePath = path.join(migrationsDir, file);
    const content = fs.readFileSync(filePath, "utf-8");
    consolidatedSql += `-- --- START OF MIGRATION: ${file} ---\n`;
    consolidatedSql += content;
    consolidatedSql += "\n\n";
  }

  // Append the reports.filter_by_date permission insert
  consolidatedSql += `-- --- NEW SYSTEM PERMISSIONS ---\n`;
  consolidatedSql += `INSERT INTO public.permissions (module, action, description)
VALUES ('reports', 'filter_by_date', 'Filter by Date')
ON CONFLICT (module, action) DO NOTHING;\n\n`;

  // Write consolidated schema to 001_initial_schema.sql
  const targetPath = path.join(migrationsDir, "001_initial_schema.sql");
  fs.writeFileSync(targetPath, consolidatedSql, "utf-8");
  console.log("Successfully wrote consolidated schema to 001_initial_schema.sql");

  // Delete the other migration files
  for (const file of files) {
    if (file !== "001_initial_schema.sql") {
      const filePath = path.join(migrationsDir, file);
      fs.unlinkSync(filePath);
      console.log(`Deleted legacy file: ${file}`);
    }
  }
}

squash();
