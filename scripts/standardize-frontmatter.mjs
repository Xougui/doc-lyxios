import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const docsDir = path.join(__dirname, '../src/content/docs');

// Function to recursively find all .mdx files
function findMdxFiles(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      findMdxFiles(filePath, fileList);
    } else if (filePath.endsWith('.mdx') || filePath.endsWith('.md')) {
      fileList.push(filePath);
    }
  }
  return fileList;
}

const files = findMdxFiles(docsDir);
const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

for (const file of files) {
  let content = fs.readFileSync(file, 'utf-8');
  
  // Regex to match frontmatter, supporting CRLF
  const frontmatterRegex = /^---[\r\n]+([\s\S]*?)[\r\n]+---/;
  const match = content.match(frontmatterRegex);
  
  if (match) {
    let frontmatter = match[1];
    let updated = false;

    // Relative path for slug calculation
    const relativePath = path.relative(docsDir, file).replace(/\\/g, '/');
    const slugParts = relativePath.replace(/\.mdx?$/, '');
    
    // Ensure slug
    if (!/^slug:/m.test(frontmatter)) {
      frontmatter = `slug: ${slugParts}\r\n` + frontmatter;
      updated = true;
    }
    
    // Update lastUpdated
    if (/^lastUpdated:.*$/m.test(frontmatter)) {
      const oldDate = frontmatter.match(/^lastUpdated:\s*(.*)$/m)[1].trim();
      if (oldDate !== today) {
        frontmatter = frontmatter.replace(/^lastUpdated:.*$/m, `lastUpdated: ${today}`);
        updated = true;
      }
    } else {
      frontmatter += `\r\nlastUpdated: ${today}`;
      updated = true;
    }

    if (updated) {
      const newContent = content.replace(frontmatterRegex, `---\r\n${frontmatter}\r\n---`);
      fs.writeFileSync(file, newContent, 'utf-8');
      console.log(`[UPDATED] ${relativePath}`);
    }
  } else {
    console.log(`[NO FRONTMATTER] ${file}`);
  }
}

console.log('Terminé.');
