import type { ReactNode } from 'react';

export function StatCard({ label, value, tone = 'cyan' }: { label: string; value: string | number; tone?: string }) {
  return (
    <article className={`neo-card stat-card tone-${tone}`}>
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  );
}

export function ContentCard({ title, meta, children }: { title: string; meta?: string; children?: ReactNode }) {
  return (
    <article className="neo-card content-card">
      <div className="media-placeholder" aria-hidden="true">
        <span>GIF / VIDEO</span>
      </div>
      <h3>{title}</h3>
      {meta && <small>{meta}</small>}
      {children}
    </article>
  );
}
