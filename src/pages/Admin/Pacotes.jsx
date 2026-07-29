import { useState } from 'react';
import { usePacotes } from '../../contexts/PacotesContext';
import { Button } from '../../components/ui/Button';
import { Modal, ConfirmDialog } from '../../components/ui/Modal';
import { FormField } from '../../components/ui/FormField';
import { formatCurrency } from '../../utils/formatters';
import { FiPlus, FiEdit, FiTrash2, FiTarget, FiCheck, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';

const emptyForm = {
  nome: '', descricao: '', preco: '', qtdBolas: '', tempoJogo: '',
  incluso: ['', '', ''], cor: '#e85c0d', popular: false, ativo: true,
  tipo: 'inicial', info: '',
};

export default function AdminPacotes() {
  const { pacotes, addPacote, updatePacote, deletePacote, toggleAtivo } = usePacotes();

  const [modal, setModal] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const resetForm = () => setForm(emptyForm);

  const handleSave = () => {
    if (!form.nome || !form.preco || !form.qtdBolas) { toast.error('Nome, preço e qtd. de bolas são obrigatórios'); return; }
    setLoading(true);
    const data = {
      ...form,
      preco: parseFloat(form.preco) || 0,
      qtdBolas: parseInt(form.qtdBolas) || 0,
      tempoJogo: parseInt(form.tempoJogo) || 0,
      incluso: form.incluso.filter(Boolean),
    };
    setTimeout(() => {
      if (editTarget) {
        updatePacote(editTarget.id, data);
        toast.success('Pacote atualizado!');
      } else {
        addPacote(data);
        toast.success('Pacote criado!');
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
      deletePacote(deleteTarget.id);
      toast.success('Pacote excluído!');
      setDeleteTarget(null);
      setLoading(false);
    }, 400);
  };

  const openEdit = (p) => {
    setEditTarget(p);
    setForm({ ...p, incluso: [...(p.incluso || []), '', '', ''].slice(0, 3) });
    setModal(true);
  };

  const tipoLabel = { inicial: 'Inicial', recarga: 'Recarga', promocional: 'Promocional' };
  const tipoCor = { inicial: '#e85c0d', recarga: '#f59e0b', promocional: '#ec4899' };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl text-white tracking-wider">PACOTES</h1>
          <p className="text-[#64748b] text-sm mt-1">{pacotes.filter(p => p.ativo).length} de {pacotes.length} pacote(s) ativo(s)</p>
        </div>
        <Button variant="primary" icon={<FiPlus size={16} />} onClick={() => { resetForm(); setEditTarget(null); setModal(true); }}>
          Novo Pacote
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {pacotes.sort((a, b) => a.preco - b.preco).map(pacote => (
          <div
            key={pacote.id}
            className={`bg-[#111111] border-2 rounded-2xl p-5 transition-all ${pacote.ativo ? 'border-[#1e1e1e] hover:border-[#e85c0d]/30' : 'border-[#1e1e1e] opacity-50'}`}
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <span
                  className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                  style={{ color: tipoCor[pacote.tipo] || '#e85c0d', background: (tipoCor[pacote.tipo] || '#e85c0d') + '15' }}
                >
                  {tipoLabel[pacote.tipo] || pacote.tipo}
                </span>
                <h3 className="font-display text-xl text-white tracking-wider mt-2">{pacote.nome}</h3>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0 ml-2">
                <button onClick={() => { toggleAtivo(pacote.id); toast.success(pacote.ativo ? 'Desativado' : 'Ativado'); }}
                  className={`p-1.5 rounded-lg border transition-colors ${pacote.ativo ? 'border-[#f59e0b]/30 text-[#f59e0b] hover:bg-[#f59e0b]/10' : 'border-[#22c55e]/30 text-[#22c55e] hover:bg-[#22c55e]/10'}`}>
                  {pacote.ativo ? <FiX size={14} /> : <FiCheck size={14} />}
                </button>
                <button onClick={() => openEdit(pacote)} className="p-1.5 rounded-lg border border-[#2a2a2a] text-[#94a3b8] hover:text-white transition-colors">
                  <FiEdit size={14} />
                </button>
                <button onClick={() => setDeleteTarget(pacote)} className="p-1.5 rounded-lg border border-[#dc2626]/20 text-[#dc2626] hover:bg-[#dc2626]/10 transition-colors">
                  <FiTrash2 size={14} />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 mb-3">
              <span className="font-display text-3xl" style={{ color: pacote.cor || '#e85c0d' }}>{formatCurrency(pacote.preco)}</span>
              {pacote.popular && <span className="text-xs px-2 py-0.5 bg-[#e85c0d] text-white rounded-full font-bold">Popular</span>}
            </div>

            <div className="flex items-center gap-3 text-sm text-[#94a3b8] mb-3">
              <span className="flex items-center gap-1"><FiTarget size={13} className="text-[#e85c0d]" />{pacote.qtdBolas} bolas</span>
              {pacote.tempoJogo > 0 && <span>{pacote.tempoJogo} min</span>}
            </div>

            {pacote.incluso?.length > 0 && (
              <ul className="space-y-1">
                {pacote.incluso.map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-xs text-[#64748b]">
                    <FiCheck size={11} className="text-[#22c55e]" /> {item}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>

      <Modal
        isOpen={modal}
        onClose={() => { setModal(false); resetForm(); setEditTarget(null); }}
        title={editTarget ? 'Editar Pacote' : 'Novo Pacote'}
        size="lg"
        footer={<><Button variant="ghost" onClick={() => setModal(false)}>Cancelar</Button><Button variant="primary" onClick={handleSave} loading={loading}>Salvar</Button></>}
      >
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Nome do Pacote" value={form.nome} onChange={e => setForm(p => ({ ...p, nome: e.target.value }))} required className="col-span-2" />
          <div>
            <label className="block text-sm font-semibold text-[#f1f5f9] mb-1.5">Tipo</label>
            <select value={form.tipo} onChange={e => setForm(p => ({ ...p, tipo: e.target.value }))} className="input-field">
              <option value="inicial">Pacote Inicial</option>
              <option value="recarga">Recarga</option>
              <option value="promocional">Promocional</option>
            </select>
          </div>
          <FormField label="Preço (R$)" type="number" value={form.preco} onChange={e => setForm(p => ({ ...p, preco: e.target.value }))} required />
          <FormField label="Qtd. Bolinhas" type="number" value={form.qtdBolas} onChange={e => setForm(p => ({ ...p, qtdBolas: e.target.value }))} required />
          <FormField label="Tempo de Jogo (min)" type="number" value={form.tempoJogo} onChange={e => setForm(p => ({ ...p, tempoJogo: e.target.value }))} hint="0 para recargas" />
          <FormField label="Descrição" type="textarea" value={form.descricao} onChange={e => setForm(p => ({ ...p, descricao: e.target.value }))} rows={2} className="col-span-2" />
          <div className="col-span-2">
            <label className="block text-sm font-semibold text-[#f1f5f9] mb-2">O que está incluso (até 3 itens)</label>
            {[0, 1, 2].map(i => (
              <input key={i} type="text" value={form.incluso[i] || ''} onChange={e => {
                const d = [...form.incluso]; d[i] = e.target.value; setForm(p => ({ ...p, incluso: d }));
              }} placeholder={`Item ${i + 1}`} className="input-field text-sm mb-2" />
            ))}
          </div>
          <FormField label="Info adicional" value={form.info} onChange={e => setForm(p => ({ ...p, info: e.target.value }))} placeholder="Ex: Máx. 6x6 jogadores" className="col-span-2" />
          <div className="flex items-center gap-6 col-span-2">
            <div>
              <label className="block text-sm font-semibold text-[#f1f5f9] mb-1.5">Cor</label>
              <input type="color" value={form.cor} onChange={e => setForm(p => ({ ...p, cor: e.target.value }))} className="w-16 h-10 rounded-lg border border-[#2a2a2a] bg-[#1a1a1a] cursor-pointer" />
            </div>
            <div className="flex items-center gap-2 mt-5">
              <input type="checkbox" id="popularPac" checked={form.popular} onChange={e => setForm(p => ({ ...p, popular: e.target.checked }))} className="accent-[#e85c0d]" />
              <label htmlFor="popularPac" className="text-sm text-[#94a3b8]">Marcar como popular</label>
            </div>
            <div className="flex items-center gap-2 mt-5">
              <input type="checkbox" id="ativoPac" checked={form.ativo} onChange={e => setForm(p => ({ ...p, ativo: e.target.checked }))} className="accent-[#e85c0d]" />
              <label htmlFor="ativoPac" className="text-sm text-[#94a3b8]">Pacote ativo</label>
            </div>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Excluir Pacote"
        message={`Excluir o pacote "${deleteTarget?.nome}"? Esta ação não pode ser desfeita.`}
        loading={loading}
      />
    </div>
  );
}
