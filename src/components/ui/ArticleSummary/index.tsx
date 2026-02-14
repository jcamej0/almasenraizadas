/**
 * ArticleSummary — Reusable aside block that highlights what the reader
 * will learn from the article.  Renders inside <article> right after the
 * header and before the main prose, using semantic <aside> so it does not
 * interfere with the document outline or SEO structure.
 *
 * @example
 * <ArticleSummary text="Descubre los beneficios del aceite de lavanda…" />
 * <ArticleSummary title="Lo que aprenderás" text={post.aiSummary} />
 */

import styles from './ArticleSummary.module.scss';

const DEFAULT_TITLE = 'Resumen del artículo';

interface ArticleSummaryProps {
  /** Short summary text (2–3 lines recommended). */
  text: string;
  /** Optional heading override. Defaults to "Resumen del artículo". */
  title?: string;
  /** Optional extra className for layout tweaks. */
  className?: string;
}

export function ArticleSummary({
  text,
  title = DEFAULT_TITLE,
  className,
}: ArticleSummaryProps) {
  const rootClass = className
    ? `${styles.summary} ${className}`
    : styles.summary;

  return (
    <aside className={rootClass} aria-label={title}>
      <div className={styles.icon} aria-hidden="true">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
        </svg>
      </div>
      <div className={styles.body}>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.text}>{text}</p>
      </div>
    </aside>
  );
}
