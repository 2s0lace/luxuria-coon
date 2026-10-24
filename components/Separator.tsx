/** Statyczny separator tonalny — bez ruchu konkurującego z treścią. */
export default function Separator({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`flex h-14 w-full items-center justify-center ${className}`}
    >
      <div className="h-1 w-[min(24rem,60vw)] rounded-full bg-on-surface/10" />
    </div>
  );
}
