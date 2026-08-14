interface Props {
  onLogout: () => void;
}

export function AppHeader({ onLogout }: Props) {
  return (
    <header className="pointer-events-none absolute inset-x-0 top-0 z-40 flex h-16 items-center justify-between bg-transparent px-5">
      <div className="pointer-events-auto flex items-center gap-2.5">
        <span
          aria-hidden
          className="flex size-8 items-center justify-center rounded-full border border-atelier-gold-dim font-display text-small font-bold text-atelier-gold"
        >
          M
        </span>
        <div className="text-left">
          <p className="font-display text-small font-bold leading-tight text-atelier-text">MCM ATELIER</p>
          <p className="font-mono text-micro tracking-label text-atelier-gold">MÜNCHEN · 1976</p>
        </div>
      </div>

      <button
        type="button"
        onClick={onLogout}
        className="pointer-events-auto -mr-2 min-h-11 px-2 font-mono text-caption text-atelier-muted transition-colors hover:text-atelier-text focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-atelier-gold"
      >
        로그아웃
      </button>
    </header>
  );
}
