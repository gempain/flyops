import fs from "fs";
import path from "path";
import { glob } from "glob";

function extractUsedTranslationPaths(content: string): Set<string> {
  const paths = new Set<string>();
  const useTranslationsRegex = /const\s+(\w+)\s*=\s*useTranslations\(\s*(?:"([^"]*)"|'([^']*)')?\s*\)/g;
  const translationVars = new Map<string, string>();

  let match;
  while ((match = useTranslationsRegex.exec(content)) !== null) {
    translationVars.set(match[1], match[2] || match[3] || "");
  }

  for (const [varName, namespace] of translationVars.entries()) {
    const tCallRegex = new RegExp(`${varName}\\(\\s*(?:"([^"]+)"|'([^']+)'|\`([^\`]+)\`)`, "g");
    let keyMatch;
    while ((keyMatch = tCallRegex.exec(content)) !== null) {
      const key = keyMatch[1] || keyMatch[2] || keyMatch[3];
      if (key && !key.includes("${")) {
        paths.add(namespace ? `${namespace}.${key}` : key);
      }
    }
  }

  return paths;
}

function removeUnusedKeys(obj: any, usedPaths: Set<string>, prefix = ""): any {
  const result: any = {};
  for (const key in obj) {
    const fullPath = prefix ? `${prefix}.${key}` : key;
    if (typeof obj[key] === "object" && obj[key] !== null && !Array.isArray(obj[key])) {
      const cleaned = removeUnusedKeys(obj[key], usedPaths, fullPath);
      if (Object.keys(cleaned).length > 0) result[key] = cleaned;
    } else if (usedPaths.has(fullPath)) {
      result[key] = obj[key];
    }
  }
  return result;
}

async function main() {
  console.log("🔍 Analyzing translation usage...\n");

  const files = await glob("**/*.{ts,tsx}", {
    cwd: process.cwd(),
    ignore: ["node_modules/**", "**/*.d.ts", ".next/**", "dist/**"],
    absolute: true,
  });

  const usedPaths = new Set<string>();
  files
    .filter((f) => f.includes("/app/") || f.includes("/lib/") || f.includes("/components/"))
    .forEach((file) => {
      extractUsedTranslationPaths(fs.readFileSync(file, "utf-8")).forEach((p) => usedPaths.add(p));
    });

  console.log(`✅ Found ${usedPaths.size} unique translation paths in use\n`);

  const translationDir = path.join(process.cwd(), "messages");
  const translationFiles = fs.readdirSync(translationDir).filter((f) => f.endsWith(".json"));

  console.log("🧹 Updating translation files...\n");

  translationFiles.forEach((file) => {
    const filePath = path.join(translationDir, file);
    const translations = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    const cleaned = removeUnusedKeys(translations, usedPaths);
    fs.writeFileSync(filePath, JSON.stringify(cleaned, null, 2) + "\n", "utf-8");
    console.log(`✅ Updated ${file}`);
  });

  console.log("\n✨ Cleanup complete!");
}

main().catch((error) => {
  console.error("❌ Error:", error);
  process.exit(1);
});
