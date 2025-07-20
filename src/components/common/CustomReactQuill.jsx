// 📁 src/components/common/CustomReactQuill.jsx
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import quillModules from "../../utils/quillModules";
import quillFormats from "../../utils/quillFormats";

function CustomReactQuill({ value, onChange, placeholder = "" }) {
  return (
    <ReactQuill
      value={value}
      onChange={onChange}
      modules={quillModules}
      formats={quillFormats}
      placeholder={placeholder}
      theme="snow"
    />
  );
}

export default CustomReactQuill;
