import { useState } from 'react';
import { useGaleria } from '../../contexts/GaleriaContext';
import { Button } from '../../components/ui/Button';
import { Modal, ConfirmDialog } from '../../components/ui/Modal';
import { FormField } from '../../components/ui/FormField';
import { ImageUpload } from '../../components/ui/ImageUpload';
import { Badge } from '../../components/ui/Badge';
import { FiPlus, FiEdit, FiTrash2, FiStar, FiImage } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function AdminBanners() {
  const { banners, addBanner, updateBanner, deleteBanner, setPrincipalBanner } = useGaleria();

  const [modal, setModal] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    titulo: '', subtitulo: '', imagem: null, cor: '#e85c0d',
    ctaTexto: 'Agendar Agora', ctaLink: '/agendamento', ativo: true,
  });

  const resetForm = () => setForm({ titulo: '', subtitulo: '', imagem: null, cor: '#e85c0d', ctaTexto: 'Agendar Agora', ctaLink: '/agendamento', ativo: true });

  const handleSave = () => {
    if (!form.titulo) { toast.error('Título obrigatório'); return; }
    setLoading(true);
    setTimeout(() => {
      if (editTarget) {
        updateBanner(editTarget.id, form);
        toast.success('Banner atualizado!');
      } else {
        addBanner(form);
        toast.success('Banner adicionado!');
      }
      setModal(false);
      setEditTarget(null);
      resetForm();
      setLoading(false);
    }, 500);
  };

  const handleDelete = () => {
    setLoading(true);
    setTimeout(() => {
      deleteBanner(deleteTarget.id);
      toast.success('Banner excluído!');
      setDeleteTarget(null);
      setLoading(false);
    }, 400);
  };

  const openEdit = (b) => {
    setEditTarget(b);
    setForm({ ...b });
    setModal(true);
  };

  const openAdd = () => {
    setEditTarget(null);
    resetForm();
    setModal(true);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl text-white tracking-wider">BANNERS</h1>
          <p className="text-[#64748b] text-sm mt-1">Gerencie os banners da página inicial</p>
        </div>
        <Button variant="primary" icon={<FiPlus size={16} />} onClick={openAdd}>Novo Banner</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {banners.sort((a, b) => a.ordem - b.ordem).map(b => (
          <div
            key={b.id}
            className={`bg-[#111111] border rounded-2xl overflow-hidden transition-all ${b.ativo ? 'border-[#1e1e1e]' : 'border-[#1e1e1e] opacity-50'}`}
          >
            {/* Preview */}
            <div
              className="relative h-40 flex items-center justify-center"
              style={{ background: b.imagem ? undefined : `linear-gradient(135deg, ${b.cor || '#e85c0d'}20, transparent)` }}
            >
              {b.imagem
                ? <img src={b.imagem} alt={b.titulo} className="w-full h-full object-cover" />
                : (
                  <div className="text-center">
                    <FiImage size={32} className="mx-auto mb-2 text-[#3a3a3a]" />
                    <p className="font-display text-xl tracking-wider" style={{ color: b.cor }}>{b.titulo}</p>
                    <p className="text-sm text-[#64748b] mt-1">{b.subtitulo}</p>
                  </div>
                )
              }
              {b.principal && (
                <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2 py-1 bg-[#f59e0b] rounded-full text-xs font-bold text-black">
                  <FiStar size={10} /> Principal
                </div>
              )}
            </div>

            {/* Info */}
            <div className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-bold text-white">{b.titulo}</h3>
                  <p className="text-sm text-[#64748b] mt-0.5">{b.subtitulo}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0 ml-3">
                  {!b.principal && (
                    <button
                      onClick={() => { setPrincipalBanner(b.id); toast.success('Banner definido como principal!'); }}
                      className="p-1.5 rounded-lg text-[#f59e0b] hover:bg-[#f59e0b]/10 border border-[#f59e0b]/30 transition-colors"
                      title="Definir como principal"
                    >
                      <FiStar size={14} />
                    </button>
                  )}
                  <button onClick={() => openEdit(b)} className="p-1.5 rounded-lg text-[#94a3b8] hover:bg-[#2a2a2a] border border-[#2a2a2a] transition-colors">
                    <FiEdit size={14} />
                  </button>
                  <button onClick={() => setDeleteTarget(b)} className="p-1.5 rounded-lg text-[#dc2626] hover:bg-[#dc2626]/10 border border-[#dc2626]/20 transition-colors">
                    <FiTrash2 size={14} />
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <div className="w-4 h-4 rounded-full border border-[#2a2a2a] flex-shrink-0" style={{ background: b.cor }} />
                <span className="text-xs text-[#64748b]">{b.ctaTexto}</span>
                <Badge variant={b.ativo ? 'success' : 'muted'}>{b.ativo ? 'Ativo' : 'Inativo'}</Badge>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      <Modal
        isOpen={modal}
        onClose={() => { setModal(false); setEditTarget(null); resetForm(); }}
        title={editTarget ? 'Editar Banner' : 'Novo Banner'}
        size="lg"
        footer={
          <>
            <Button variant="ghost" onClick={() => setModal(false)}>Cancelar</Button>
            <Button variant="primary" onClick={handleSave} loading={loading}>Salvar</Button>
          </>
        }
      >
        <div className="space-y-4">
          <ImageUpload value={form.imagem} onChange={img => setForm(p => ({ ...p, imagem: img }))} label="Imagem do Banner (opcional)" />
          <FormField label="Título" value={form.titulo} onChange={e => setForm(p => ({ ...p, titulo: e.target.value }))} required />
          <FormField label="Subtítulo" value={form.subtitulo} onChange={e => setForm(p => ({ ...p, subtitulo: e.target.value }))} />
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Texto do Botão" value={form.ctaTexto} onChange={e => setForm(p => ({ ...p, ctaTexto: e.target.value }))} />
            <FormField label="Link do Botão" value={form.ctaLink} onChange={e => setForm(p => ({ ...p, ctaLink: e.target.value }))} />
          </div>
          <div className="flex items-center gap-4">
            <div>
              <label className="block text-sm font-semibold text-[#f1f5f9] mb-1.5">Cor</label>
              <input type="color" value={form.cor} onChange={e => setForm(p => ({ ...p, cor: e.target.value }))} className="w-16 h-10 rounded-lg border border-[#2a2a2a] bg-[#1a1a1a] cursor-pointer" />
            </div>
            <div className="flex items-center gap-2 mt-6">
              <input type="checkbox" id="ativoBanner" checked={form.ativo} onChange={e => setForm(p => ({ ...p, ativo: e.target.checked }))} className="accent-[#e85c0d]" />
              <label htmlFor="ativoBanner" className="text-sm text-[#94a3b8]">Banner ativo</label>
            </div>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Excluir Banner"
        message={`Excluir o banner "${deleteTarget?.titulo}"?`}
        loading={loading}
      />
    </div>
  );
}
