/** One QRNG integer after consumption (mixed or passthrough). */
export interface ConsumedQuantumRecord {
  poolIndex: number;
  impulseIndex: number;
  fieldIndex: number;
  qrng: number;
  mixed: number;
  micByte: number | null;
  /** ~50% expected when mic XOR is active — full word mix, not loudness. */
  xorSpread: number;
  at: number;
}

export interface QuantumConsumptionLedger {
  records: ConsumedQuantumRecord[];
  impulsesConsumed: number;
  /** Mean XOR bit spread (~50% is normal). */
  avgXorSpread: number;
  /** Mean anchor/angle shift vs direct QRNG impulse. */
  avgImpulsePhaseShift: number;
  /** Mean |micByte − 128| — rises when you make sound. */
  avgMicActivity: number;
  lastImpulsePhaseShift: number;
  lastMicActivity: number;
  lastXorSpread: number;
  /** Recent impulse shifts for rolling average (session only). */
  impulsePhaseHistory: number[];
  micActivityHistory: number[];
}
