import { FiSearch, FiX } from 'react-icons/fi';

export function SearchBar({ value, onChange, placeholder = 'Pesquisar...', className = '' }) {
  return (
    <div className={`relative ${className}`}>
      <FiSearch size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64748b]" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="input-field pl-9 pr-9"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748b] hover:text-white transition-colors"
        >
          <FiX size={14} />
        </button>
      )}
    </div>
  );
}
