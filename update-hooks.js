#!/usr/bin/env node

// This script will update all hooks to use the global error handling
// Run this script from the project root

const fs = require("fs");
const path = require("path");
const glob = require("glob");

const hooksPattern = "src/hooks/**/*.ts";
const files = glob.sync(hooksPattern);

const importToAdd = `import { handleError } from "../../utils/errorHandling";`;

files.forEach((file) => {
  const content = fs.readFileSync(file, "utf8");

  // Skip if already imported
  if (content.includes("handleError")) {
    console.log(`Skipping ${file} - already has handleError import`);
    return;
  }

  // Skip if no onError handler
  if (!content.includes("onError:")) {
    console.log(`Skipping ${file} - no onError handler found`);
    return;
  }

  let updatedContent = content;

  // Add import after the last import statement
  const lastImportMatch = content.match(/^import.*$/gm);
  if (lastImportMatch) {
    const lastImport = lastImportMatch[lastImportMatch.length - 1];
    updatedContent = content.replace(
      lastImport,
      `${lastImport}\n${importToAdd}`
    );
  }

  // Replace onError implementations
  const onErrorRegex = /onError:\s*\(error:\s*unknown\)\s*=>\s*{[\s\S]*?}/g;
  updatedContent = updatedContent.replace(onErrorRegex, (match) => {
    return `onError: (error: unknown) => {
      handleError(error);
    }`;
  });

  fs.writeFileSync(file, updatedContent);
  console.log(`Updated ${file}`);
});

console.log("Done updating hooks!");
