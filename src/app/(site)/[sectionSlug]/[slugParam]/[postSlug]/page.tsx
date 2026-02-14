import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import {
  fetchPostBySlug,
  fetchRelatedPosts,
  fetchAllPostSlugs,
} from '@/controllers';
import { ArticleSummary, PostGrid, PostMeta, TagList, Rating, ShareButtons, Breadcrumb } from '@/components/ui';
import { PortableTextBody } from '@/components/ui/PortableTextBody';
import RichSchema from '@/components/seo/RichSchema';
import {
  buildBreadcrumbSchema,
  buildBlogPostSchema,
} from '@/components/seo/schema-builders';
import {
  ROUTES,
  postUrl,
  sectionUrl,
  subcategoryUrl,
  absoluteUrl,
} from '@/lib/routes';
import { getImageUrl } from '@/services/sanity/image';
import styles from './page.module.scss';

type PageProps = {
  params: Promise<{ sectionSlug: string; slugParam: string; postSlug: string }>;
};

export async function generateStaticParams() {
  const allSlugs = await fetchAllPostSlugs();
  return allSlugs
    .filter((p) => p.subcategorySlug)
    .map(({ sectionSlug, subcategorySlug, postSlug }) => ({
      sectionSlug,
      slugParam: subcategorySlug!,
      postSlug,
    }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { sectionSlug, slugParam, postSlug } = await params;
  const post = await fetchPostBySlug(postSlug);
  if (!post) {
    return { title: 'Artículo no encontrado' };
  }

  const imageUrl = getImageUrl(post.mainImage);
  const canonical = postUrl(sectionSlug, postSlug, slugParam);

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

export default async function SubcategoryPostPage({ params }: PageProps) {
  const { sectionSlug, slugParam, postSlug } = await params;
  const post = await fetchPostBySlug(postSlug);

  if (!post) {
    notFound();
  }

  const relatedPosts = await fetchRelatedPosts(
    post._id,
    post.section._id,
    post.tags?.map((t) => t._id) ?? [],
    3
  );

  const subcategoryTitle = post.subcategory?.title ?? '';
  const imageUrl = getImageUrl(post.mainImage, 1200, 630);
  const canonical = postUrl(sectionSlug, postSlug, slugParam);

  const breadcrumbItems = [
    { name: 'Inicio', url: absoluteUrl(ROUTES.HOME) },
    { name: post.section.title, url: sectionUrl(sectionSlug) },
    ...(subcategoryTitle
      ? [{ name: subcategoryTitle, url: subcategoryUrl(sectionSlug, slugParam) }]
      : []),
    { name: post.title, url: canonical },
  ];

  const breadcrumbs = buildBreadcrumbSchema(breadcrumbItems);
  const blogPostSchema = buildBlogPostSchema(post, { imageUrl: imageUrl || undefined });

  const breadcrumbVisibleItems = [
    { label: 'Inicio', href: ROUTES.HOME },
    { label: post.section.title, href: `/${sectionSlug}` },
    ...(subcategoryTitle
      ? [{ label: subcategoryTitle, href: `/${sectionSlug}/${slugParam}` }]
      : []),
    { label: post.title, href: `/${sectionSlug}/${slugParam}/${postSlug}` },
  ];

  return (
    <>
      <RichSchema data={breadcrumbs} />
      <RichSchema data={blogPostSchema} />
      <Breadcrumb items={breadcrumbVisibleItems} />
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
            <PostMeta
              author={post.author}
              publishedAt={post.publishedAt}
              readingTime={post.readingTime}
            />
            {post.tags && post.tags.length > 0 && (
              <TagList tags={post.tags} className={styles.tags} />
            )}
            {post.rating != null && (
              <div className={styles.metaFooter}>
                <Rating value={post.rating} />
              </div>
            )}
          </div>
        </header>

        {post.aiSummary && (
          <ArticleSummary text={post.aiSummary} />
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
