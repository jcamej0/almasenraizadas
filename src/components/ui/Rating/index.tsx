import styles from './Rating.module.scss';

interface RatingProps {
  value: number;
  max?: number;
}

export function Rating({ value, max = 5 }: RatingProps) {
  const filled = Math.min(Math.max(0, Math.round(value)), max);
  const empty = max - filled;

  return (
    <span
      className={styles.rating}
      aria-label={`Puntuación: ${value} de ${max}`}
      role="img"
    >
      {'★'.repeat(filled)}
      {'☆'.repeat(empty)}
    </span>
  );
}
