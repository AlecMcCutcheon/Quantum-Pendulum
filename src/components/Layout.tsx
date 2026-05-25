import type { ReactNode } from "react";
import { QrngSettings } from "./QrngSettings";
import { Starfield } from "./Starfield";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="relative min-h-dvh overflow-x-hidden">
      <Starfield className="fixed inset-0" seed={0x71a9_0f0c} />
      <div className="relative z-10 flex min-h-dvh flex-col">
        <header className="border-b border-white/5 px-4 py-5 text-center sm:px-6">
          <h1 className="font-display text-xl font-semibold tracking-[0.2em] text-accent uppercase sm:text-2xl">
            Quantum Pendulum
          </h1>
          <p className="mt-1 text-sm text-star/60">
            Live entropy driving motion and meaning
          </p>
        </header>
        <main className="flex flex-1 flex-col items-center overflow-x-hidden px-3 py-6 max-sm:py-5 sm:px-6 sm:py-12">
          {children}
        </main>
      </div>
      <QrngSettings />
    </div>
  );
}
