import { useRef, useState } from 'react';
import { FiUpload, FiX, FiImage } from 'react-icons/fi';

export function ImageUpload({ value, onChange, label = 'Upload de Imagem', accept = 'image/*' }) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  const handleFile = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => onChange(e.target.result);
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleInputChange = (e) => {
    const file = e.target.files[0];
    if (file) handleFile(file);
  };

  if (value) {
    return (
      <div className="relative group rounded-xl overflow-hidden border border-[#2a2a2a]">
        <img src={value} alt="Preview" className="w-full h-48 object-cover" />
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="p-2 bg-[#e85c0d] rounded-lg text-white hover:bg-[#c44d0b] transition-colors"
          >
            <FiUpload size={18} />
          </button>
          <button
            type="button"
            onClick={() => onChange(null)}
            className="p-2 bg-[#dc2626] rounded-lg text-white hover:bg-[#b91c1c] transition-colors"
          >
            <FiX size={18} />
          </button>
        </div>
        <input ref={inputRef} type="file" accept={accept} className="hidden" onChange={handleInputChange} />
      </div>
    );
  }

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all
        ${dragging ? 'border-[#e85c0d] bg-[#e85c0d]/10' : 'border-[#2a2a2a] hover:border-[#e85c0d]/50 hover:bg-[#e85c0d]/5'}
      `}
    >
      <FiImage size={40} className="text-[#64748b]" />
      <div className="text-center">
        <p className="text-[#f1f5f9] font-semibold">{label}</p>
        <p className="text-sm text-[#64748b] mt-1">Arraste ou clique para selecionar</p>
        <p className="text-xs text-[#64748b]">PNG, JPG, WEBP — máx 5MB</p>
      </div>
      <input ref={inputRef} type="file" accept={accept} className="hidden" onChange={handleInputChange} />
    </div>
  );
}
