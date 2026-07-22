import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const docsDir = path.join(__dirname, '../src/content/docs');
const MAX_BADGES = 3;
const MAX_AGE_DAYS = 30;
const now = new Date();

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
const badgeFiles = [];

for (const file of files) {
  const content = fs.readFileSync(file, 'utf-8');
  const frontmatterMatch = content.match(/^---[\r\n]+([\s\S]*?)[\r\n]+---/);
  
  if (frontmatterMatch) {
    const frontmatter = frontmatterMatch[1];
    const badgeMatch = frontmatter.match(/sidebar:[\s\S]*?badge:\s*([\s\S]*?)(?=(?:[\r\n]+\w+:|$))/);
    
    if (badgeMatch) {
      const stats = fs.statSync(file);
      const relativePath = path.relative(docsDir, file).replace(/\\/g, '/');
      
      let badgeText = '';
      const textMatch = badgeMatch[1].match(/text:\s*["']?([^"'\r\n]+)["']?/);
      if (textMatch) badgeText = textMatch[1].trim();

      let badgeDate = null;
      const lastUpdatedMatch = frontmatter.match(/^lastUpdated:\s*(.*)$/m);
      if (lastUpdatedMatch) {
        const parsedDate = new Date(lastUpdatedMatch[1].trim());
        if (!isNaN(parsedDate.getTime())) {
          badgeDate = parsedDate;
        }
      }
      if (!badgeDate) {
        badgeDate = new Date(stats.mtimeMs);
      }

      const ageInDays = (now.getTime() - badgeDate.getTime()) / (1000 * 60 * 60 * 24);

      badgeFiles.push({
        file,
        relativePath,
        badgeDate,
        ageInDays,
        badgeText,
        fullContent: content
      });
    }
  }
}

console.log(`Nombre total de fichiers avec un badge : ${badgeFiles.length}`);

// Déterminer la langue du fichier selon le préfixe relatif (default: fr, en, es)
function getLanguage(relativePath) {
  if (relativePath.startsWith('en/')) return 'en';
  if (relativePath.startsWith('es/')) return 'es';
  return 'fr';
}

// 1. Détecter les badges expirés (> 30 jours)
const expiredBadges = badgeFiles.filter(b => b.ageInDays > MAX_AGE_DAYS);
const validBadges = badgeFiles.filter(b => b.ageInDays <= MAX_AGE_DAYS);

// Groupe par langue
const badgesByLang = { fr: [], en: [], es: [] };
for (const b of validBadges) {
  const lang = getLanguage(b.relativePath);
  badgesByLang[lang].push(b);
}

const toKeep = [];
const overflowBadges = [];

for (const lang of Object.keys(badgesByLang)) {
  badgesByLang[lang].sort((a, b) => b.badgeDate.getTime() - a.badgeDate.getTime());
  toKeep.push(...badgesByLang[lang].slice(0, MAX_BADGES));
  overflowBadges.push(...badgesByLang[lang].slice(MAX_BADGES));
}

const toRemove = [...expiredBadges, ...overflowBadges];


if (expiredBadges.length > 0) {
  console.log(`\nBadges expirés (> ${MAX_AGE_DAYS} jours) :`);
  expiredBadges.forEach(b => console.log(` - [${b.badgeText}] ${b.relativePath} (${Math.floor(b.ageInDays)}j)`));
}

if (overflowBadges.length > 0) {
  console.log(`\nBadges en surplus (> ${MAX_BADGES} badges max) :`);
  overflowBadges.forEach(b => console.log(` - [${b.badgeText}] ${b.relativePath}`));
}

if (toRemove.length > 0) {
  if (process.argv.includes('--check')) {
    console.error(`\n[ERREUR CI] Des badges doivent être retirés (${toRemove.length} au total) !`);
    toRemove.forEach(b => console.error(` - [${b.badgeText}] ${b.relativePath}`));
    process.exit(1);
  }

  console.log(`\nSuppression des badges non retenus...`);
  toRemove.forEach(b => {
    console.log(` - Retrait de [${b.badgeText}] dans ${b.relativePath}`);
    
    let content = fs.readFileSync(b.file, 'utf-8');
    const frontmatterMatch = content.match(/^---([\s\S]*?)---/);
    
    if (frontmatterMatch) {
      let fm = frontmatterMatch[1];
      
      fm = fm.replace(/sidebar:\s*[\r\n]+\s*badge:\s*[\s\S]*?(?=\r?\n\w|\r?\n---|$)/, '');
      fm = fm.replace(/sidebar:\s*[\r\n]+/g, '');
      fm = fm.replace(/(\r?\n){3,}/g, '\r\n\r\n');

      const newContent = content.replace(/^---[\s\S]*?---/, `---${fm}---`);
      fs.writeFileSync(b.file, newContent, 'utf-8');
    }
  });
} else {
  console.log(`Aucune action requise. ${toKeep.length} badge(s) valide(s) conservé(s).`);
}
