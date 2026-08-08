const toneClasses = {
  neutral: "bg-[var(--color-bg-subtle)] text-[var(--color-ink-muted)]",
  info: "bg-[var(--color-brand-blue-tint)] text-[var(--color-brand-blue)]",
  success: "bg-green-50 text-green-700",
  warning: "bg-amber-50 text-amber-700",
  danger: "bg-red-50 text-red-700",
} as const;

export type Tone = keyof typeof toneClasses;

export function StatusBadge({ children, tone = "neutral" }: { children: string; tone?: Tone }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${toneClasses[tone]}`}
    >
      {children.replace(/_/g, " ")}
    </span>
  );
}

const contactToneMap: Record<string, Tone> = {
  new: "info",
  in_progress: "warning",
  resolved: "success",
};

export function contactStatusTone(status: string): Tone {
  return contactToneMap[status] ?? "neutral";
}
