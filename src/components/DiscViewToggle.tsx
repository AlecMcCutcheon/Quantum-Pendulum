interface DiscViewToggleProps {
  discView: boolean;
  onChange: (discView: boolean) => void;
  disabled?: boolean;
}

export function DiscViewToggle({
  discView,
  onChange,
  disabled = false,
}: DiscViewToggleProps) {
  return (
    <div className="flex w-full max-w-md gap-2 text-left">
      <button
        type="button"
        disabled={disabled}
        onClick={() => onChange(false)}
        className={`flex-1 rounded-lg border px-3 py-2 text-xs tracking-wide uppercase transition-colors disabled:opacity-50 ${
          !discView
            ? "border-accent bg-accent/15 text-accent"
            : "border-white/15 bg-void/60 text-star/55 hover:border-white/25"
        }`}
      >
        3D view
      </button>
      <button
        type="button"
        disabled={disabled}
        onClick={() => onChange(true)}
        className={`flex-1 rounded-lg border px-3 py-2 text-xs tracking-wide uppercase transition-colors disabled:opacity-50 ${
          discView
            ? "border-accent bg-accent/15 text-accent"
            : "border-white/15 bg-void/60 text-star/55 hover:border-white/25"
        }`}
      >
        Disc view
      </button>
    </div>
  );
}
