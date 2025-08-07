import React from "react";

function TextArea({
  label,
  name,
  value,
  onChange,
  rows = 4,
  required = false,
  id,
  placeholder = "",
}) {
  return (
    <div className="mb-4">
      {label && (
        <label htmlFor={id || name} className="block mb-1 text-gray-800 font-medium">
          {label}
        </label>
      )}
      <textarea
        id={id || name}
        name={name}
        rows={rows}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        className="w-full border border-gray-300 px-3 py-2 rounded text-gray-800 focus:outline-none focus:ring-2 focus:ring-yellow-500"
      />
    </div>
  );
}

export default TextArea;
