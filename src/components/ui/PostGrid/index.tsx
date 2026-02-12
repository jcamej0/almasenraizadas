import type { PostListItem } from '@/lib/types';
import { PostCard } from '../PostCard';
import styles from './PostGrid.module.scss';

interface PostGridProps {
  posts: PostListItem[];
  columns?: number;
}

export function PostGrid({ posts, columns }: PostGridProps) {
  if (posts.length === 0) return null;

  return (
    <section className={styles.grid} aria-label="Listado de artículos">
      {posts.map((post) => (
        <PostCard key={post._id} post={post} />
      ))}
    </section>
  );
}
