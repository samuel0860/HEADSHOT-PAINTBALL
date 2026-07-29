import { useState } from 'react';
import { useGaleria } from '../../contexts/GaleriaContext';
import { ClientNavbar } from '../../components/client/ClientNavbar';
import { ClientFooter } from '../../components/client/ClientFooter';
import { FiX, FiChevronLeft, FiChevronRight, FiZoomIn } from 'react-icons/fi';

function Lightbox({ fotos, index, onClose }) {
  const [current, setCurrent] = useState(index);
  const prev = () => setCurrent(c => (c - 1 + fotos.length) % fotos.length);
  const next = () => setCurrent(c => (c + 1) % fotos.length);

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center" onClick={onClose}>
      <button onClick={(e) => { e.stopPropagation(); onClose(); }} className="absolute top-4 right-4 p-3 text-white hover:text-[#e85c0d] transition-colors">
        <FiX size={28} />
      </button>
      <button onClick={(e) => { e.stopPropagation(); prev(); }} className="absolute left-4 p-3 rounded-full bg-black/50 text-white hover:bg-[#e85c0d]/20 hover:text-[#e85c0d] transition-all">
        <FiChevronLeft size={28} />
      </button>
      <button onClick={(e) => { e.stopPropagation(); next(); }} className="absolute right-4 p-3 rounded-full bg-black/50 text-white hover:bg-[#e85c0d]/20 hover:text-[#e85c0d] transition-all">
        <FiChevronRight size={28} />
      </button>
      <div onClick={e => e.stopPropagation()} className="max-w-5xl max-h-[85vh] mx-12">
        <img src={fotos[current].url} alt={fotos[current].titulo} className="max-w-full max-h-[80vh] object-contain rounded-xl" />
        <p className="text-center text-[#94a3b8] text-sm mt-3">{fotos[current].titulo} — {current + 1}/{fotos.length}</p>
      </div>
    </div>
  );
}

export default function Galeria() {
  const { getFotosAtivas } = useGaleria();
  const fotos = getFotosAtivas();
  const [lightboxIndex, setLightboxIndex] = useState(null);

  return (
    <div className="min-h-screen bg-[#080808]">
      <ClientNavbar />
      <div className="pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#e85c0d]/10 border border-[#e85c0d]/30 rounded-full mb-4">
              <span className="text-sm text-[#e85c0d] font-semibold tracking-wider">NOSSA ARENA</span>
            </div>
            <h1 className="font-display text-[clamp(2.5rem,8vw,4rem)] text-white tracking-wider leading-none">
              GALERIA <span className="text-gradient">DE FOTOS</span>
            </h1>
            <p className="text-[#94a3b8] mt-3 text-lg">Veja como é a experiência no Headshot Paintball Viçosa</p>
          </div>

          {fotos.length === 0 ? (
            <div className="text-center py-20 text-[#64748b]">
              <FiZoomIn size={48} className="mx-auto mb-4 opacity-30" />
              <p>Nenhuma foto na galeria ainda.</p>
            </div>
          ) : (
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
              {fotos.map((foto, i) => (
                <div
                  key={foto.id}
                  onClick={() => setLightboxIndex(i)}
                  className="relative overflow-hidden rounded-2xl cursor-pointer group break-inside-avoid"
                >
                  <img
                    src={foto.url}
                    alt={foto.titulo}
                    className="w-full object-cover group-hover:scale-110 transition-transform duration-500"
                    style={{ minHeight: '200px' }}
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center flex-col gap-2">
                    <FiZoomIn size={32} className="text-white" />
                    <span className="text-white font-semibold">{foto.titulo}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {lightboxIndex !== null && (
        <Lightbox fotos={fotos} index={lightboxIndex} onClose={() => setLightboxIndex(null)} />
      )}

      <ClientFooter />
    </div>
  );
}
