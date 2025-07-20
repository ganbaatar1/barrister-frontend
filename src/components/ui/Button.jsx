function Button({ children, onClick, className = "", type = "button" }) {
  return (
    <button
      onClick={onClick}
      type={type}
      className={`px-4 py-2 rounded text-white bg-yellow-600 hover:bg-yellow-700 transition ${className}`}
    >
      {children}
    </button>
  );
}

export default Button;
