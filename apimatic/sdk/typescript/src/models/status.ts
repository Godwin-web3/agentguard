import * as s from "../core/validation/index.js";
import type { EnumSchema } from "../core/validation/schema.js";

export const Status = {
  Rejected: "rejected",
  NeedsHuman: "needs_human",
  Reserved: "reserved",
  Authorized: "authorized",
  Captured: "captured",
  Voided: "voided",
  Failed: "failed",
} as const;
export type Status = (typeof Status)[keyof typeof Status] | (string & {});

export const statusSchema: EnumSchema<Status> = s.enumOf<Status>(Status);
