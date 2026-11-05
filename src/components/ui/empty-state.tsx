type Props = {
  title: string;
  description: string;
};

export function EmptyState({ title, description }: Props) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-2 px-6 py-16 text-center">
      <h2 className="text-lg font-semibold text-[var(--foreground)]">{title}</h2>
      <p className="max-w-md text-sm text-[var(--muted)]">{description}</p>
    </div>
  );
}
