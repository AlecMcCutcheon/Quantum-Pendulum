import type { Orientation } from "../../../types/deck";
import type { PersonalReading } from "../../../types/reading";

export type PersonalPatch = { personal: PersonalReading };
export type CardPersonal = Partial<Record<Orientation, PersonalPatch>>;
