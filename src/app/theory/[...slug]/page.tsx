import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getArticle, getSections } from '@/lib/content';
import { MarkdownContent } from '@/components/MarkdownContent';

interface Props {
  params: Promise<{ slug: string[] }>;
}

export async function generateStaticParams() {
  const sections = getSections();
  return sections.flatMap((section) =>
    section.items.map((item) => ({
      slug: [section.id, item.slug],
    }))
  );
}

export default async function TheoryPage({ params }: Props) {
  const { slug } = await params;
  const [sectionId, articleSlug] = slug;
  const article = getArticle(sectionId, articleSlug);

  if (!article) notFound();

  const sections = getSections();
  const section = sections.find((s) => s.id === sectionId);
  const items = section?.items ?? [];
  const currentIndex = items.findIndex((i) => i.slug === articleSlug);
  const prev = currentIndex > 0 ? items[currentIndex - 1] : null;
  const next = currentIndex < items.length - 1 ? items[currentIndex + 1] : null;

  return (
    <div>
      <nav className="text-sm text-[var(--text-muted)] mb-4">
        <Link href="/" className="hover:text-[var(--accent)]">
          Главная
        </Link>
        <span className="mx-2">/</span>
        <span>{section?.title}</span>
      </nav>

      <MarkdownContent content={article.content} />

      <div className="flex justify-between mt-10 pt-6 border-t border-[var(--border)]">
        {prev ? (
          <Link
            href={`/theory/${sectionId}/${prev.slug}`}
            className="text-sm text-[var(--accent)] hover:underline"
          >
            ← {prev.title}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link
            href={`/theory/${sectionId}/${next.slug}`}
            className="text-sm text-[var(--accent)] hover:underline"
          >
            {next.title} →
          </Link>
        ) : (
          <span />
        )}
      </div>
    </div>
  );
}
