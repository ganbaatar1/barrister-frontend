// 📁 src/utils/useDecodedText.js
import { useMemo } from "react";
import { decodeHTMLEntities } from "../utils/decodeEntities";

/** Helpers (модуль түвшинд — тогтвортой reference) */
const toSafeString = (val) => {
  if (val === null || val === undefined) return "";
  return decodeHTMLEntities(String(val));
};

const decodeDeep = (value) => {
  if (typeof value === "string") return toSafeString(value);
  if (Array.isArray(value)) return value.map(decodeDeep);
  if (value && typeof value === "object") {
    const out = {};
    for (const k of Object.keys(value)) out[k] = decodeDeep(value[k]);
    return out;
  }
  return value;
};

/**
 * @param {any[] | Record<string, any>} rawTexts
 * @returns {any[] | Record<string, any>}
 */
export default function useDecodedText(rawTexts) {
  return useMemo(() => decodeDeep(rawTexts), [rawTexts]);
}
