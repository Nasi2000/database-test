import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface ModuleItem {
  slug: string;
  title: string;
  description: string;
  order: number;
}

export interface ModuleSection {
  id: string;
  title: string;
  icon: string;
  description: string;
  items: ModuleItem[];
}

const CONTENT_DIR = path.join(process.cwd(), 'content');

export function getSections(): ModuleSection[] {
  const configPath = path.join(CONTENT_DIR, 'modules.json');
  const raw = fs.readFileSync(configPath, 'utf-8');
  return JSON.parse(raw) as ModuleSection[];
}

export function getArticle(sectionId: string, slug: string) {
  const filePath = path.join(CONTENT_DIR, sectionId, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(raw);
  return {
    meta: data as { title: string; description?: string; order?: number },
    content,
    sectionId,
    slug,
  };
}

export function getAllArticles() {
  const sections = getSections();
  const articles: { sectionId: string; slug: string; title: string; sectionTitle: string }[] = [];

  for (const section of sections) {
    for (const item of section.items) {
      articles.push({
        sectionId: section.id,
        slug: item.slug,
        title: item.title,
        sectionTitle: section.title,
      });
    }
  }
  return articles;
}
