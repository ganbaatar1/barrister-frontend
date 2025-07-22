import { useMemo } from "react";
import { decodeHTMLEntities } from "../utils/decodeEntities";

/**
 * @param {any[] | Record<string, any>} rawTexts
 * @returns {any[] | Record<string, any>}
 */
export default function useDecodedTexts(rawTexts) {
  const toSafeString = (val) => {
    if (val === null || val === undefined) return "";
    return decodeHTMLEntities(String(val));
  };

  const decodeDeep = (value) => {
    if (typeof value === "string") return toSafeString(value);
    if (Array.isArray(value)) return value.map(decodeDeep);
    if (typeof value === "object" && value !== null) {
      const result = {};
      for (const key in value) {
        result[key] = decodeDeep(value[key]);
      }
      return result;
    }
    return value;
  };

  return useMemo(() => decodeDeep(rawTexts), [rawTexts]);
}
