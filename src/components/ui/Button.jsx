import React from "react";

function Button({ children, onClick, className = "", type = "button", disabled = false }) {
  return (
    <button
      onClick={onClick}
      type={type}
      disabled={disabled}
      className={`px-4 py-2 rounded text-white bg-yellow-600 hover:bg-yellow-700 transition disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {children}
    </button>
  );
}

export default Button;
