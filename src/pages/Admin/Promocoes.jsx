import { useState } from 'react';
import { usePromocoes } from '../../contexts/PromocoesContext';
import { Button } from '../../components/ui/Button';
import { Modal, ConfirmDialog } from '../../components/ui/Modal';
import { FormField } from '../../components/ui/FormField';
import { ImageUpload } from '../../components/ui/ImageUpload';
import { StatusBadge } from '../../components/ui/Badge';
import { formatCurrency } from '../../utils/formatters';
import { FiPlus, FiEdit, FiTrash2, FiTag, FiToggleLeft, FiToggleRight } from 'react-icons/fi';
import toast from 'react-hot-toast';

const emptyForm = {
  titulo: '', descricao: '', pacote: '', preco: '', precoOriginal: '',
  validoDe: '', validoAte: '', destaque: ['', '', ''], imagem: null,
  ativo: true, cor: '#ec4899',
};

export default function AdminPromocoes() {
  const { promocoes, addPromocao, updatePromocao, deletePromocao, toggleAtivo } = usePromocoes();

  const [modal, setModal] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const resetForm = () => setForm(emptyForm);

  const handleSave = () => {
    if (!form.titulo || !form.preco) { toast.error('Título e preço são obrigatórios'); return; }
    setLoading(true);
    const data = {
      ...form,
      preco: parseFloat(form.preco) || 0,
      precoOriginal: form.precoOriginal ? parseFloat(form.precoOriginal) : null,
      destaque: form.destaque.filter(Boolean),
    };
    setTimeout(() => {
      if (editTarget) {
        updatePromocao(editTarget.id, data);
        toast.success('Promoção atualizada!');
      } else {
        addPromocao(data);
        toast.success('Promoção criada!');
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
      deletePromocao(deleteTarget.id);
      toast.success('Promoção excluída!');
      setDeleteTarget(null);
      setLoading(false);
    }, 400);
  };

  const openEdit = (p) => {
    setEditTarget(p);
    setForm({ ...p, destaque: [...(p.destaque || []), '', '', ''].slice(0, 3) });
    setModal(true);
  };

  const today = new Date().toISOString().split('T')[0];
  const isActive = (p) => p.ativo && p.validoAte >= today;

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl text-white tracking-wider">PROMOÇÕES</h1>
          <p className="text-[#64748b] text-sm mt-1">{promocoes.filter(p => isActive(p)).length} promoção(ões) ativa(s)</p>
        </div>
        <Button variant="primary" icon={<FiPlus size={16} />} onClick={() => { resetForm(); setEditTarget(null); setModal(true); }}>
          Nova Promoção
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {promocoes.sort((a, b) => (b.criadoEm || '').localeCompare(a.criadoEm || '')).map(p => (
          <div
            key={p.id}
            className={`bg-[#111111] border rounded-2xl overflow-hidden transition-all ${p.ativo ? 'border-[#1e1e1e]' : 'border-[#1e1e1e] opacity-60'}`}
          >
            <div className="p-5 relative" style={{ background: `linear-gradient(135deg, ${p.cor || '#ec4899'}15, transparent)` }}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <FiTag size={14} style={{ color: p.cor || '#ec4899' }} />
                    <h3 className="font-display text-2xl text-white tracking-wider">{p.titulo}</h3>
                  </div>
                  <p className="text-sm font-semibold mb-2" style={{ color: p.cor || '#ec4899' }}>{p.pacote}</p>
                  <div className="flex items-center gap-3">
                    <span className="font-display text-3xl" style={{ color: p.cor || '#ec4899' }}>{formatCurrency(Number(p.preco))}</span>
                    {p.precoOriginal && <span className="text-sm text-[#64748b] line-through">{formatCurrency(Number(p.precoOriginal))}</span>}
                  </div>
                </div>
                <div className="text-right space-y-2 flex-shrink-0">
                  <StatusBadge status={isActive(p) ? 'confirmed' : p.ativo ? 'cancelled' : 'blocked'} />
                  <div className="flex items-center gap-1.5 justify-end">
                    <button onClick={() => { toggleAtivo(p.id); toast.success(p.ativo ? 'Desativado' : 'Ativado'); }}
                      className="p-1.5 rounded-lg border border-[#2a2a2a] text-[#94a3b8] hover:text-white hover:border-[#e85c0d] transition-colors">
                      {p.ativo ? <FiToggleRight size={16} /> : <FiToggleLeft size={16} />}
                    </button>
                    <button onClick={() => openEdit(p)} className="p-1.5 rounded-lg border border-[#2a2a2a] text-[#94a3b8] hover:text-white transition-colors">
                      <FiEdit size={14} />
                    </button>
                    <button onClick={() => setDeleteTarget(p)} className="p-1.5 rounded-lg border border-[#dc2626]/20 text-[#dc2626] hover:bg-[#dc2626]/10 transition-colors">
                      <FiTrash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
              <p className="text-xs text-[#64748b] mt-3">
                {p.validoDe && new Date(p.validoDe + 'T12:00:00').toLocaleDateString('pt-BR')} → {p.validoAte && new Date(p.validoAte + 'T12:00:00').toLocaleDateString('pt-BR')}
              </p>
            </div>
          </div>
        ))}
      </div>

      <Modal
        isOpen={modal}
        onClose={() => { setModal(false); resetForm(); setEditTarget(null); }}
        title={editTarget ? 'Editar Promoção' : 'Nova Promoção'}
        size="lg"
        footer={<><Button variant="ghost" onClick={() => setModal(false)}>Cancelar</Button><Button variant="primary" onClick={handleSave} loading={loading}>Salvar</Button></>}
      >
        <div className="space-y-4">
          <ImageUpload value={form.imagem} onChange={img => setForm(p => ({ ...p, imagem: img }))} label="Imagem da Promoção (opcional)" />
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Título" value={form.titulo} onChange={e => setForm(p => ({ ...p, titulo: e.target.value }))} required className="col-span-2" />
            <FormField label="Nome do Pacote" value={form.pacote} onChange={e => setForm(p => ({ ...p, pacote: e.target.value }))} placeholder="Ex: Pacote com 400 Bolinhas" className="col-span-2" />
            <FormField label="Preço (R$)" type="number" value={form.preco} onChange={e => setForm(p => ({ ...p, preco: e.target.value }))} required />
            <FormField label="Preço Original (opcional)" type="number" value={form.precoOriginal} onChange={e => setForm(p => ({ ...p, precoOriginal: e.target.value }))} />
            <FormField label="Válido de" type="date" value={form.validoDe} onChange={e => setForm(p => ({ ...p, validoDe: e.target.value }))} required />
            <FormField label="Válido até" type="date" value={form.validoAte} onChange={e => setForm(p => ({ ...p, validoAte: e.target.value }))} required />
          </div>
          <FormField label="Descrição" type="textarea" value={form.descricao} onChange={e => setForm(p => ({ ...p, descricao: e.target.value }))} rows={2} />
          <div>
            <label className="block text-sm font-semibold text-[#f1f5f9] mb-2">Destaques (até 3)</label>
            {[0, 1, 2].map(i => (
              <input key={i} type="text" value={form.destaque[i] || ''} onChange={e => {
                const d = [...form.destaque]; d[i] = e.target.value; setForm(p => ({ ...p, destaque: d }));
              }} placeholder={`Destaque ${i + 1}`} className="input-field text-sm mb-2" />
            ))}
          </div>
          <div className="flex items-center gap-4">
            <div>
              <label className="block text-sm font-semibold text-[#f1f5f9] mb-1.5">Cor</label>
              <input type="color" value={form.cor} onChange={e => setForm(p => ({ ...p, cor: e.target.value }))} className="w-16 h-10 rounded-lg border border-[#2a2a2a] bg-[#1a1a1a] cursor-pointer" />
            </div>
            <div className="flex items-center gap-2 mt-5">
              <input type="checkbox" id="ativoPromo" checked={form.ativo} onChange={e => setForm(p => ({ ...p, ativo: e.target.checked }))} className="accent-[#e85c0d]" />
              <label htmlFor="ativoPromo" className="text-sm text-[#94a3b8]">Promoção ativa</label>
            </div>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Excluir Promoção"
        message={`Excluir a promoção "${deleteTarget?.titulo}"?`}
        loading={loading}
      />
    </div>
  );
}
