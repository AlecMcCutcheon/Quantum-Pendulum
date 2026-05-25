interface DrawButtonProps {
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
  label?: string;
  loadingLabel?: string;
}

export function DrawButton({
  onClick,
  disabled = false,
  loading = false,
  label = "Fetch quantum impulse",
  loadingLabel = "Measuring…",
}: DrawButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || loading}
      className="font-display relative overflow-hidden rounded-full border border-accent/50 bg-accent/15 px-10 py-3.5 text-sm font-semibold tracking-widest text-accent uppercase transition hover:border-accent hover:bg-accent/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:cursor-not-allowed disabled:opacity-50"
      style={
        loading
          ? undefined
          : {
              backgroundImage:
                "linear-gradient(90deg, transparent 0%, rgba(167,139,250,0.25) 50%, transparent 100%)",
              backgroundSize: "200% 100%",
              animation: "shimmer 2.5s ease-in-out infinite",
            }
      }
    >
      {loading ? loadingLabel : label}
    </button>
  );
}
