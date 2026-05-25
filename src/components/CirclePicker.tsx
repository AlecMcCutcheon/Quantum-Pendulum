import {
  DIVINATION_CIRCLES,
  circleDirectionsLabel,
} from "../data/divinationCircles";

interface CirclePickerProps {
  value: string;
  onChange: (id: string) => void;
  disabled?: boolean;
}

export function CirclePicker({
  value,
  onChange,
  disabled = false,
}: CirclePickerProps) {
  return (
    <label className="flex w-full max-w-md flex-col gap-2 text-left">
      <span className="font-display text-xs tracking-widest text-accent/80 uppercase">
        Divination circle
      </span>
      <select
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-lg border border-white/15 bg-void/80 px-4 py-2.5 text-sm text-star outline-none focus:border-accent focus:ring-1 focus:ring-accent disabled:opacity-50"
      >
        {DIVINATION_CIRCLES.map((c) => (
          <option key={c.id} value={c.id}>
            {circleDirectionsLabel(c)}
          </option>
        ))}
      </select>
    </label>
  );
}
