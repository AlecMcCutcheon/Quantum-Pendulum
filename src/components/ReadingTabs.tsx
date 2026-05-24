import { useId, useState, type ReactNode } from "react";

export type ReadingTabId = "scholarly" | "personal";

interface ReadingTabsProps {
  hasPersonal: boolean;
  scholarly: ReactNode;
  personal: ReactNode;
  compact?: boolean;
}

export function ReadingTabs({
  hasPersonal,
  scholarly,
  personal,
  compact = false,
}: ReadingTabsProps) {
  const [tab, setTab] = useState<ReadingTabId>("scholarly");
  const baseId = useId();

  if (!hasPersonal) {
    return <>{scholarly}</>;
  }

  const tabClass = (active: boolean) =>
    `rounded-lg px-3 py-1.5 font-medium transition ${compact ? "text-xs" : "text-sm"} ${
      active
        ? "bg-accent/20 text-accent ring-1 ring-accent/35"
        : "text-star/50 hover:bg-white/5 hover:text-star/80"
    }`;

  return (
    <div>
      <div
        role="tablist"
        aria-label="Reading view"
        className="flex gap-1 border-b border-white/10 pb-2"
      >
        <button
          type="button"
          role="tab"
          id={`${baseId}-tab-scholarly`}
          aria-selected={tab === "scholarly"}
          aria-controls={`${baseId}-panel-scholarly`}
          className={tabClass(tab === "scholarly")}
          onClick={() => setTab("scholarly")}
        >
          Card reading
        </button>
        <button
          type="button"
          role="tab"
          id={`${baseId}-tab-personal`}
          aria-selected={tab === "personal"}
          aria-controls={`${baseId}-panel-personal`}
          className={tabClass(tab === "personal")}
          onClick={() => setTab("personal")}
        >
          For you
        </button>
      </div>

      <div className={compact ? "mt-3" : "mt-4"}>
        <div
          role="tabpanel"
          id={`${baseId}-panel-scholarly`}
          aria-labelledby={`${baseId}-tab-scholarly`}
          hidden={tab !== "scholarly"}
        >
          {scholarly}
        </div>
        <div
          role="tabpanel"
          id={`${baseId}-panel-personal`}
          aria-labelledby={`${baseId}-tab-personal`}
          hidden={tab !== "personal"}
        >
          {personal}
        </div>
      </div>
    </div>
  );
}

export { detailParagraphs } from "../lib/detailParagraphs";
