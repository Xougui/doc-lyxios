import { readFileSync } from 'fs';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkMdx from 'remark-mdx';

const content = readFileSync('src/content/docs/commandes.mdx', 'utf-8');
const processor = unified().use(remarkParse).use(remarkMdx);
const tree = processor.parse(content);

console.log(JSON.stringify(tree, null, 2));
