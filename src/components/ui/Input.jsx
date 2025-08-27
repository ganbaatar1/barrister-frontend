import React from "react";

function Input({
  label,
  name,
  value,
  onChange,
  type = "text",
  required = false,
  placeholder = "",
  id,
}) {
  return (
    <div className="mb-4">
      {label && (
        <label htmlFor={id || name} className="block mb-1 text-gray-800 font-medium">
          {label}
        </label>
      )}
      <input
        id={id || name}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        className="w-full border border-gray-300 px-3 py-2 rounded text-gray-800 focus:outline-none focus:ring-2 focus:ring-yellow-500"
      />
    </div>
  );
}

export default Input;
