// 📁 src/utils/decodeEntities.js

export function decodeHTMLEntities(text) {
  const element = document.createElement("textarea");
  element.innerHTML = text;
  return element.value;
}
