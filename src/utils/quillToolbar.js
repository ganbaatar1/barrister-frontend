// 📁 src/utils/quillToolbar.js
export const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ align: [] }],
    [{ color: [] }, { background: [] }],
    ["link", "image"],
    ["clean"],
  ],
};

export const quillFormats = [
  "header",
  "bold", "italic", "underline", "strike",
  "list", "indent",
  "align",
  "color", "background",
  "link", "image",
];
