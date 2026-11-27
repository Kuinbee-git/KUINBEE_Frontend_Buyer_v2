import styles from "../supplier-page.module.css";

export function SupplierMetrics({
  metrics,
  label,
}: {
  metrics: ReadonlyArray<{ label: string; value: string }>;
  label: string;
}) {
  return (
    <dl className={styles.metrics} aria-label={label}>
      {metrics.map(({ label, value }) => (
        <div className={styles.metric} key={label}>
          <dt>{label}</dt>
          <dd>{value}</dd>
        </div>
      ))}
    </dl>
  );
}
