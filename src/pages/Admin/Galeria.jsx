import { useState } from 'react';
import { useGaleria } from '../../contexts/GaleriaContext';
import { Button } from '../../components/ui/Button';
import { Modal, ConfirmDialog } from '../../components/ui/Modal';
import { FormField } from '../../components/ui/FormField';
import { ImageUpload } from '../../components/ui/ImageUpload';
import { FiPlus, FiEdit, FiTrash2, FiArrowUp, FiArrowDown, FiImage } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function AdminGaleria() {
  const { galeria, addFoto, updateFoto, deleteFoto, reorderFotos } = useGaleria();

  const [modal, setModal] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ url: null, titulo: '', ativo: true });

  const sortedGaleria = [...galeria].sort((a, b) => a.ordem - b.ordem);

  const resetForm = () => setForm({ url: null, titulo: '', ativo: true });

  const handleSave = () => {
    if (!form.url) { toast.error('Adicione uma imagem'); return; }
    setLoading(true);
    setTimeout(() => {
      if (editTarget) {
        updateFoto(editTarget.id, form);
        toast.success('Foto atualizada!');
      } else {
        addFoto(form);
        toast.success('Foto adicionada à galeria!');
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
      deleteFoto(deleteTarget.id);
      toast.success('Foto excluída!');
      setDeleteTarget(null);
      setLoading(false);
    }, 400);
  };

  const moveUp = (index) => {
    if (index === 0) return;
    const list = [...sortedGaleria];
    [list[index], list[index - 1]] = [list[index - 1], list[index]];
    reorderFotos(list);
  };

  const moveDown = (index) => {
    if (index === sortedGaleria.length - 1) return;
    const list = [...sortedGaleria];
    [list[index], list[index + 1]] = [list[index + 1], list[index]];
    reorderFotos(list);
  };

  const openEdit = (foto) => {
    setEditTarget(foto);
    setForm({ url: foto.url, titulo: foto.titulo, ativo: foto.ativo });
    setModal(true);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl text-white tracking-wider">GALERIA</h1>
          <p className="text-[#64748b] text-sm mt-1">{galeria.length} foto(s) na galeria</p>
        </div>
        <Button variant="primary" icon={<FiPlus size={16} />} onClick={() => { resetForm(); setEditTarget(null); setModal(true); }}>
          Adicionar Foto
        </Button>
      </div>

      {galeria.length === 0 ? (
        <div className="text-center py-20 text-[#64748b] bg-[#111111] border border-[#1e1e1e] rounded-2xl">
          <FiImage size={48} className="mx-auto mb-4 opacity-30" />
          <p className="text-xl font-semibold text-white mb-2">Galeria vazia</p>
          <p className="text-sm mb-6">Adicione fotos para exibir na galeria do site.</p>
          <Button variant="primary" icon={<FiPlus size={16} />} onClick={() => setModal(true)}>Adicionar Primeira Foto</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedGaleria.map((foto, i) => (
            <div
              key={foto.id}
              className={`bg-[#111111] border border-[#1e1e1e] rounded-2xl overflow-hidden group transition-all hover:border-[#e85c0d]/30 ${!foto.ativo ? 'opacity-50' : ''}`}
            >
              <div className="relative aspect-video">
                <img src={foto.url} alt={foto.titulo} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-2 left-2 bg-[#0a0a0a]/80 text-white text-xs px-2 py-1 rounded-full font-bold">
                  #{foto.ordem}
                </div>
                {!foto.ativo && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                    <span className="text-[#64748b] font-semibold text-sm">Inativo</span>
                  </div>
                )}
              </div>
              <div className="p-3 flex items-center justify-between gap-2">
                <p className="text-sm font-semibold text-white truncate flex-1">{foto.titulo}</p>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button onClick={() => moveUp(i)} disabled={i === 0} className="p-1.5 rounded text-[#64748b] hover:text-white disabled:opacity-30 hover:bg-[#2a2a2a] transition-colors">
                    <FiArrowUp size={14} />
                  </button>
                  <button onClick={() => moveDown(i)} disabled={i === sortedGaleria.length - 1} className="p-1.5 rounded text-[#64748b] hover:text-white disabled:opacity-30 hover:bg-[#2a2a2a] transition-colors">
                    <FiArrowDown size={14} />
                  </button>
                  <button onClick={() => openEdit(foto)} className="p-1.5 rounded text-[#94a3b8] hover:text-white hover:bg-[#2a2a2a] transition-colors">
                    <FiEdit size={14} />
                  </button>
                  <button onClick={() => setDeleteTarget(foto)} className="p-1.5 rounded text-[#dc2626] hover:bg-[#dc2626]/10 transition-colors">
                    <FiTrash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={modal}
        onClose={() => { setModal(false); resetForm(); setEditTarget(null); }}
        title={editTarget ? 'Editar Foto' : 'Adicionar Foto'}
        footer={<><Button variant="ghost" onClick={() => setModal(false)}>Cancelar</Button><Button variant="primary" onClick={handleSave} loading={loading}>Salvar</Button></>}
      >
        <div className="space-y-4">
          <ImageUpload value={form.url} onChange={url => setForm(p => ({ ...p, url }))} label="Selecione a foto" />
          <FormField label="Título da Foto" value={form.titulo} onChange={e => setForm(p => ({ ...p, titulo: e.target.value }))} placeholder="Ex: Arena Principal" required />
          <div className="flex items-center gap-2">
            <input type="checkbox" id="ativoGal" checked={form.ativo} onChange={e => setForm(p => ({ ...p, ativo: e.target.checked }))} className="accent-[#e85c0d]" />
            <label htmlFor="ativoGal" className="text-sm text-[#94a3b8]">Exibir na galeria</label>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Excluir Foto"
        message={`Excluir a foto "${deleteTarget?.titulo}" da galeria?`}
        loading={loading}
      />
    </div>
  );
}
