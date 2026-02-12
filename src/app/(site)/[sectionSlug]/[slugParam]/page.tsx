import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  fetchPostBySlug,
  fetchRelatedPosts,
  fetchAllPostSlugs,
  fetchSubcategoryBySlug,
  fetchAllSubcategorySlugs,
} from '@/controllers';
import { PostGrid, TagList, Rating, ShareButtons, Breadcrumb } from '@/components/ui';
import { PortableTextBody } from '@/components/ui/PortableTextBody';
import RichSchema from '@/components/seo/RichSchema';
import {
  buildBreadcrumbSchema,
  buildBlogPostSchema,
} from '@/components/seo/schema-builders';
import {
  ROUTES,
  postPath,
  postUrl,
  sectionUrl,
  subcategoryUrl,
  profilePath,
  absoluteUrl,
} from '@/lib/routes';
import { formatDate, formatReadingTime } from '@/lib/formatters';
import { getImageUrl } from '@/services/sanity/image';
import styles from './page.module.scss';

type PageProps = {
  params: Promise<{ sectionSlug: string; slugParam: string }>;
};

/**
 * Generate static params for both:
 * - Direct posts (no subcategory): { sectionSlug, slugParam: postSlug }
 * - Subcategory listings: { sectionSlug, slugParam: subcategorySlug }
 */
export async function generateStaticParams() {
  const [postSlugs, subcategorySlugs] = await Promise.all([
    fetchAllPostSlugs(),
    fetchAllSubcategorySlugs(),
  ]);

  const postParams = postSlugs
    .filter((p) => !p.subcategorySlug)
    .map(({ sectionSlug, postSlug }) => ({
      sectionSlug,
      slugParam: postSlug,
    }));

  const subcategoryParams = subcategorySlugs.map(({ sectionSlug, subcategorySlug }) => ({
    sectionSlug,
    slugParam: subcategorySlug,
  }));

  return [...postParams, ...subcategoryParams];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { sectionSlug, slugParam } = await params;

  const subcategory = await fetchSubcategoryBySlug(sectionSlug, slugParam);
  if (subcategory) {
    const canonical = subcategoryUrl(sectionSlug, slugParam);
    return {
      title: `${subcategory.title} — ${subcategory.section.title}`,
      description: subcategory.description || `${subcategory.title} en ${subcategory.section.title}`,
      alternates: { canonical },
      openGraph: {
        title: subcategory.title,
        description: subcategory.description || subcategory.title,
        url: canonical,
      },
    };
  }

  const post = await fetchPostBySlug(slugParam);
  if (!post) {
    return { title: 'No encontrado' };
  }

  const imageUrl = getImageUrl(post.mainImage);
  const canonical = postUrl(sectionSlug, slugParam);

  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: canonical,
      type: 'article',
      publishedTime: post.publishedAt,
      authors: [post.author.name],
      images: imageUrl ? [{ url: imageUrl, alt: post.mainImage?.alt ?? post.title }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
    },
  };
}

export default async function SlugParamPage({ params }: PageProps) {
  const { sectionSlug, slugParam } = await params;

  const subcategory = await fetchSubcategoryBySlug(sectionSlug, slugParam);
  if (subcategory) {
    return <SubcategoryView sectionSlug={sectionSlug} subcategory={subcategory} />;
  }

  const post = await fetchPostBySlug(slugParam);
  if (!post) {
    notFound();
  }

  return <PostView sectionSlug={sectionSlug} post={post} postSlug={slugParam} />;
}

// ---------------------------------------------------------------------------
// Subcategory listing view
// ---------------------------------------------------------------------------

interface SubcategoryViewProps {
  sectionSlug: string;
  subcategory: NonNullable<Awaited<ReturnType<typeof fetchSubcategoryBySlug>>>;
}

function SubcategoryView({ sectionSlug, subcategory }: SubcategoryViewProps) {
  const breadcrumbs = buildBreadcrumbSchema([
    { name: 'Inicio', url: absoluteUrl(ROUTES.HOME) },
    { name: subcategory.section.title, url: sectionUrl(sectionSlug) },
    { name: subcategory.title, url: subcategoryUrl(sectionSlug, subcategory.slug.current) },
  ]);

  return (
    <>
      <RichSchema data={breadcrumbs} />
      <Breadcrumb
        items={[
          { label: 'Inicio', href: ROUTES.HOME },
          { label: subcategory.section.title, href: `/${sectionSlug}` },
          { label: subcategory.title, href: `/${sectionSlug}/${subcategory.slug.current}` },
        ]}
      />
      <header className={styles.subcategoryHeader} aria-labelledby="subcategory-title">
        <h1 id="subcategory-title" className={styles.subcategoryTitle}>
          {subcategory.title}
        </h1>
        {subcategory.description && (
          <p className={styles.subcategoryDescription}>{subcategory.description}</p>
        )}
      </header>
      <section className={styles.subcategoryContent} aria-label={`Artículos de ${subcategory.title}`}>
        {subcategory.posts.length > 0 ? (
          <PostGrid posts={subcategory.posts} />
        ) : (
          <p className={styles.empty}>
            Todavía no hay artículos en esta subcategoría.
          </p>
        )}
      </section>
    </>
  );
}

// ---------------------------------------------------------------------------
// Post detail view (no subcategory)
// ---------------------------------------------------------------------------

interface PostViewProps {
  sectionSlug: string;
  post: NonNullable<Awaited<ReturnType<typeof fetchPostBySlug>>>;
  postSlug: string;
}

async function PostView({ sectionSlug, post, postSlug }: PostViewProps) {
  const relatedPosts = await fetchRelatedPosts(
    post._id,
    post.section._id,
    post.tags?.map((t) => t._id) ?? [],
    3
  );

  const imageUrl = getImageUrl(post.mainImage, 1200, 630);
  const canonical = postUrl(sectionSlug, postSlug);
  const breadcrumbs = buildBreadcrumbSchema([
    { name: 'Inicio', url: absoluteUrl(ROUTES.HOME) },
    { name: post.section.title, url: sectionUrl(sectionSlug) },
    { name: post.title, url: canonical },
  ]);
  const blogPostSchema = buildBlogPostSchema(post, { imageUrl: imageUrl || undefined });

  return (
    <>
      <RichSchema data={breadcrumbs} />
      <RichSchema data={blogPostSchema} />
      <Breadcrumb
        items={[
          { label: 'Inicio', href: ROUTES.HOME },
          { label: post.section.title, href: `/${sectionSlug}` },
          { label: post.title, href: `/${sectionSlug}/${postSlug}` },
        ]}
      />
      <article className={styles.article}>
        <header className={styles.header}>
          <div className={styles.imageWrapper}>
            <Image
              src={imageUrl || '/placeholder.jpg'}
              alt={post.mainImage?.alt ?? post.title}
              width={1200}
              height={630}
              className={styles.mainImage}
              priority
              sizes="100vw"
            />
          </div>
          <div className={styles.headerContent}>
            <h1 className={styles.title}>{post.title}</h1>
            <div className={styles.meta}>
              <Link
                href={profilePath(post.author.slug.current)}
                className={styles.authorLink}
              >
                {post.author.name}
              </Link>
              <time dateTime={post.publishedAt} className={styles.date}>
                {formatDate(post.publishedAt)}
              </time>
            </div>
            {post.tags && post.tags.length > 0 && (
              <TagList tags={post.tags} className={styles.tags} />
            )}
            <div className={styles.metaFooter}>
              {post.rating != null && <Rating value={post.rating} />}
              {post.rating != null && post.readingTime != null && (
                <span className={styles.separator} aria-hidden>·</span>
              )}
              {post.readingTime != null && (
                <span className={styles.readingTime}>
                  {formatReadingTime(post.readingTime)}
                </span>
              )}
            </div>
          </div>
        </header>

        {post.aiSummary && (
          <aside className={styles.aiSummary} aria-label="Resumen con IA">
            <h2 className={styles.aiSummaryTitle}>Resumen</h2>
            <p className={styles.aiSummaryText}>{post.aiSummary}</p>
          </aside>
        )}

        <div className={styles.prose}>
          {post.body && post.body.length > 0 ? (
            <PortableTextBody value={post.body} />
          ) : (
            <p>{post.excerpt}</p>
          )}
        </div>

        <footer className={styles.footer}>
          <ShareButtons
            title={post.title}
            url={canonical}
          />
        </footer>
      </article>

      {relatedPosts.length > 0 && (
        <section
          className={styles.related}
          aria-labelledby="related-posts-heading"
        >
          <h2 id="related-posts-heading" className={styles.relatedTitle}>
            Artículos relacionados
          </h2>
          <PostGrid posts={relatedPosts} />
        </section>
      )}
    </>
  );
}
