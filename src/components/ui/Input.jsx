function Input({ label, name, value, onChange, type = "text", required = false }) {
  return (
    <div className="mb-4">
      {label && <label className="block mb-1 text-gray-800 font-medium">{label}</label>}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full border border-gray-300 px-3 py-2 rounded text-gray-800"
      />
    </div>
  );
}

export default Input;
