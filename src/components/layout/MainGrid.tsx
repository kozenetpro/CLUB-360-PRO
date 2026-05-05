interface MainGridProps {
  children: React.ReactNode;
}

export default function MainGrid({ children }: MainGridProps) {
  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[var(--sidebar-width)_minmax(0,1fr)]">
      {children}
    </div>
  );
}
