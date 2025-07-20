function TextArea({ label, name, value, onChange, rows = 4, required = false }) {
    return (
      <div className="mb-4">
        {label && <label className="block mb-1 text-gray-800 font-medium">{label}</label>}
        <textarea
          name={name}
          rows={rows}
          value={value}
          onChange={onChange}
          required={required}
          className="w-full border border-gray-300 px-3 py-2 rounded text-gray-800"
        />
      </div>
    );
  }
  
  export default TextArea;
  