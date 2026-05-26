import type { ReactNode } from 'react';

export function Modal({ open, title, children, onClose }: {
  open: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
}) {
  if (!open) return null;
  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <section className="modal-panel" onMouseDown={(event) => event.stopPropagation()}>
        <header>
          <h2>{title}</h2>
          <button className="icon-button" type="button" onClick={onClose} aria-label="Cerrar">x</button>
        </header>
        {children}
      </section>
    </div>
  );
}
