import fs from "fs";
import path from "path";
import matter from "gray-matter";

const entriesDir = path.join(process.cwd(), "content", "entries");

function readEntryFile(filename) {
  const slug = filename.replace(/\.md$/, "");
  const fullPath = path.join(entriesDir, filename);
  const raw = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(raw);
  return {
    slug,
    title: data.title || slug,
    date: data.date ? String(data.date) : "",
    type: data.type || "entry",
    content,
  };
}

export function getAllEntries() {
  if (!fs.existsSync(entriesDir)) return [];
  const files = fs.readdirSync(entriesDir).filter((f) => f.endsWith(".md"));
  const entries = files.map(readEntryFile);
  entries.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
  return entries;
}

export function getEntry(slug) {
  return readEntryFile(`${slug}.md`);
}
