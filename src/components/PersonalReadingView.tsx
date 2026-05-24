import type { PersonalReading } from "../types/reading";

interface PersonalReadingViewProps {
  personal: PersonalReading;
  compact?: boolean;
}

export function PersonalReadingView({
  personal,
  compact = false,
}: PersonalReadingViewProps) {
  const textSm = compact ? "text-xs" : "text-sm";
  const textBase = compact ? "text-sm" : "text-base";
  const gap = compact ? "gap-4" : "gap-6";

  return (
    <div className={`flex flex-col ${gap}`}>
      <p
        className={`leading-relaxed font-medium text-star/95 ${textBase}`}
      >
        {personal.hook}
      </p>

      <p className={`leading-relaxed text-star/70 ${textSm}`}>
        Here is the personal translation of what is happening in your
        headspace right now, and how to break the circuit.
      </p>

      <div className={`flex flex-col ${compact ? "gap-4" : "gap-5"}`}>
        {personal.sections.map((section, i) => (
          <section key={section.heading}>
            <h3
              className={`font-display font-semibold text-accent ${compact ? "text-sm" : "text-base"}`}
            >
              {i + 1}. {section.heading}
            </h3>
            <p
              className={`mt-2 leading-relaxed text-star/85 ${textSm}`}
            >
              {section.body}
            </p>
          </section>
        ))}
      </div>

      <section>
        <h3
          className={`font-display font-semibold text-gold ${compact ? "text-sm" : "text-base"}`}
        >
          Your operational protocol
        </h3>
        <p className={`mt-1 text-star/55 ${compact ? "text-[10px]" : "text-xs"}`}>
          To break paralysis and collapse this loop into a stable reality,
          execute these three steps in order.
        </p>
        <ol className={`mt-3 flex flex-col ${compact ? "gap-2.5" : "gap-3"}`}>
          {personal.protocol.steps.map((step, i) => (
            <li
              key={step.heading}
              className={`rounded-lg border border-white/10 bg-white/[0.04] ${compact ? "px-3 py-2.5" : "px-4 py-3"}`}
            >
              <p
                className={`font-medium text-accent/90 ${compact ? "text-xs" : "text-sm"}`}
              >
                Step {i + 1}: {step.heading}
              </p>
              <p
                className={`mt-1.5 leading-relaxed text-star/80 ${textSm}`}
              >
                {step.body}
              </p>
            </li>
          ))}
        </ol>
      </section>

      <div
        className={`rounded-lg border border-gold/30 bg-gold/[0.08] ${compact ? "px-3 py-2.5" : "px-4 py-3"}`}
      >
        <p className="text-[10px] font-semibold tracking-wide text-gold uppercase">
          Takeaway
        </p>
        <p
          className={`mt-2 leading-relaxed font-medium text-star/90 ${textSm}`}
        >
          {personal.takeaway}
        </p>
      </div>
    </div>
  );
}
