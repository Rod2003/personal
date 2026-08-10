import fs from 'node:fs';
import path from 'node:path';
import { marked } from 'marked';

export interface Article {
  slug: string;
  title: string;
  body: string;
}

const contentDirectory = path.join(process.cwd(), 'src/content/articles');

const readArticle = (filename: string): Article => {
  const markdown = fs.readFileSync(path.join(contentDirectory, filename), 'utf8').trim();
  const [titleLine, ...bodyLines] = markdown.split(/\r?\n/);

  if (!titleLine.startsWith('# ')) {
    throw new Error(`${filename} must start with a level-one Markdown heading`);
  }

  return {
    slug: filename.replace(/^\d+-/, '').replace(/\.md$/, ''),
    title: titleLine.slice(2).trim(),
    body: marked.parse(bodyLines.join('\n').trim()) as string,
  };
};

export const articles = fs
  .readdirSync(contentDirectory)
  .filter((filename) => filename.endsWith('.md'))
  .sort()
  .map(readArticle);
