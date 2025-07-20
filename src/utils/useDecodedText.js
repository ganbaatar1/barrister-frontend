import { useMemo } from "react";
import { decodeHTMLEntities } from "../utils/decodeEntities";

/**
 * Утгуудыг массив эсвэл объект хэлбэрээр авч, string болгож decode хийнэ.
 * @param {any[] | Record<string, any>} rawTexts
 * @returns {string[] | Record<string, string>}
 */
export default function useDecodedTexts(rawTexts) {
  const toSafeString = (val) => {
    if (val === null || val === undefined) return "";
    return decodeHTMLEntities(String(val));
  };

  return useMemo(() => {
    if (Array.isArray(rawTexts)) {
      return rawTexts.map(toSafeString);
    }

    if (typeof rawTexts === "object" && rawTexts !== null) {
      const decodedObj = {};
      for (const key in rawTexts) {
        decodedObj[key] = toSafeString(rawTexts[key]);
      }
      return decodedObj;
    }

    return rawTexts;
  }, [rawTexts]);
}
