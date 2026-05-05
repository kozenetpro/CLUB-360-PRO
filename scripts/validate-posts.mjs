import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const postsDir = path.join(process.cwd(), "src/_posts");
const languageDirPattern = /^[a-z]{2}(?:-[A-Z]{2})?$/;
const requiredFields = ["title", "description", "date"];
const errors = [];

function isPostFile(fileName) {
  return fileName.endsWith(".md") || fileName.endsWith(".mdx");
}

function validateArrayOfStrings(value, label, filePath) {
  if (value === undefined) {
    return;
  }

  if (!Array.isArray(value) || value.some((item) => typeof item !== "string")) {
    errors.push(`${filePath}: "${label}" must be an array of strings.`);
  }
}

function validateCollaborators(value, label, filePath) {
  if (value === undefined) {
    return;
  }

  if (!Array.isArray(value)) {
    errors.push(`${filePath}: "${label}" must be an array.`);
    return;
  }

  value.forEach((collaborator, index) => {
    const valid =
      collaborator &&
      typeof collaborator === "object" &&
      typeof collaborator.name === "string" &&
      typeof collaborator.src === "string";

    if (!valid) {
      errors.push(`${filePath}: "${label}[${index}]" must include string "name" and "src" fields.`);
    }
  });
}

function validatePost(filePath) {
  const source = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(source);

  requiredFields.forEach((field) => {
    if (!data[field]) {
      errors.push(`${filePath}: missing required frontmatter field "${field}".`);
    }
  });

  if (data.title !== undefined && typeof data.title !== "string") {
    errors.push(`${filePath}: "title" must be a string.`);
  }

  if (data.description !== undefined && typeof data.description !== "string") {
    errors.push(`${filePath}: "description" must be a string.`);
  }

  if (data.date && Number.isNaN(new Date(data.date).getTime())) {
    errors.push(`${filePath}: "date" must be a valid date.`);
  }

  if (data.lastModified && Number.isNaN(new Date(data.lastModified).getTime())) {
    errors.push(`${filePath}: "lastModified" must be a valid date.`);
  }

  if (data.translationKey !== undefined && typeof data.translationKey !== "string") {
    errors.push(`${filePath}: "translationKey" must be a string.`);
  }

  validateArrayOfStrings(data.categories, "categories", filePath);
  validateArrayOfStrings(data.tags, "tags", filePath);
  validateCollaborators(data.collaborators, "collaborators", filePath);

  if (!content.trim()) {
    errors.push(`${filePath}: post content is empty.`);
  }
}

if (!fs.existsSync(postsDir)) {
  console.log("No src/_posts directory found. Skipping post validation.");
  process.exit(0);
}

const languageDirs = fs
  .readdirSync(postsDir, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name);

languageDirs.forEach((lang) => {
  if (!languageDirPattern.test(lang)) {
    errors.push(`${path.join("src/_posts", lang)}: language folders must use codes like "en", "pt", or "pt-BR".`);
    return;
  }

  const langDir = path.join(postsDir, lang);
  fs.readdirSync(langDir)
    .filter(isPostFile)
    .forEach((fileName) => validatePost(path.join(langDir, fileName)));
});

if (errors.length > 0) {
  console.error("Post validation failed:\n");
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log("Post validation passed.");
