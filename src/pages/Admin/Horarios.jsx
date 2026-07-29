import { useState } from 'react';
import { useHorarios } from '../../contexts/HorariosContext';
import { Button } from '../../components/ui/Button';
import { Modal, ConfirmDialog } from '../../components/ui/Modal';
import { FormField } from '../../components/ui/FormField';
import { StatusBadge, Badge } from '../../components/ui/Badge';
import { FiPlus, FiEdit, FiTrash2, FiLock, FiUnlock, FiClock } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function AdminHorarios() {
  const { horarios, horariosBlockados, addHorario, updateHorario, deleteHorario, toggleAtivo, blockHorarioDate, unblockHorarioDate } = useHorarios();

  const [modal, setModal] = useState(null); // 'add' | 'edit' | 'block'
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [blockData, setBlockData] = useState({ horario: '', data: '', motivo: '' });
  const [form, setForm] = useState({ hora: '', label: '' });
  const [loading, setLoading] = useState(false);

  const handleAdd = () => {
    if (!form.hora) { toast.error('Informe o horário'); return; }
    setLoading(true);
    setTimeout(() => {
      addHorario({ hora: form.hora, label: form.label || form.hora });
      toast.success('Horário adicionado!');
      setModal(null);
      setForm({ hora: '', label: '' });
      setLoading(false);
    }, 400);
  };

  const handleEdit = () => {
    setLoading(true);
    setTimeout(() => {
      updateHorario(editTarget.id, editTarget);
      toast.success('Horário atualizado!');
      setModal(null);
      setLoading(false);
    }, 400);
  };

  const handleDelete = () => {
    setLoading(true);
    setTimeout(() => {
      deleteHorario(deleteTarget.id);
      toast.success('Horário excluído!');
      setDeleteTarget(null);
      setLoading(false);
    }, 400);
  };

  const handleBlock = () => {
    if (!blockData.data) { toast.error('Selecione uma data'); return; }
    blockHorarioDate(blockData.horario, blockData.data, blockData.motivo);
    toast.success('Horário bloqueado para a data!');
    setModal(null);
    setBlockData({ horario: '', data: '', motivo: '' });
  };

  const openBlock = (horario) => {
    setBlockData({ horario: horario.hora, data: '', motivo: '' });
    setModal('block');
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl text-white tracking-wider">HORÁRIOS</h1>
          <p className="text-[#64748b] text-sm mt-1">Gerencie os horários disponíveis para agendamento</p>
        </div>
        <Button variant="primary" icon={<FiPlus size={16} />} onClick={() => setModal('add')}>
          Novo Horário
        </Button>
      </div>

      {/* Horários Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {horarios.sort((a, b) => a.hora.localeCompare(b.hora)).map(h => (
          <div
            key={h.id}
            className={`bg-[#111111] border rounded-2xl p-5 transition-all ${h.ativo ? 'border-[#1e1e1e] hover:border-[#e85c0d]/30' : 'border-[#1e1e1e] opacity-50'}`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${h.ativo ? 'bg-[#e85c0d]/10 border border-[#e85c0d]/30' : 'bg-[#1a1a1a] border border-[#2a2a2a]'}`}>
                  <FiClock size={20} className={h.ativo ? 'text-[#e85c0d]' : 'text-[#64748b]'} />
                </div>
                <div>
                  <p className="font-display text-2xl text-white tracking-wider">{h.hora}</p>
                  <p className="text-xs text-[#64748b]">{h.diaSemana === 'todos' ? 'Todos os dias' : h.diaSemana}</p>
                </div>
              </div>
              <StatusBadge status={h.ativo ? 'available' : 'blocked'} />
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => { toggleAtivo(h.id); toast.success(h.ativo ? 'Horário desativado' : 'Horário ativado'); }}
                className={`flex-1 py-2 rounded-lg text-xs font-bold border transition-colors
                  ${h.ativo ? 'border-[#f59e0b]/30 text-[#f59e0b] hover:bg-[#f59e0b]/10' : 'border-[#22c55e]/30 text-[#22c55e] hover:bg-[#22c55e]/10'}
                `}
              >
                {h.ativo ? <><FiLock className="inline mr-1" size={12}/>Desativar</> : <><FiUnlock className="inline mr-1" size={12}/>Ativar</>}
              </button>
              <button
                onClick={() => openBlock(h)}
                className="flex-1 py-2 rounded-lg text-xs font-bold border border-[#dc2626]/30 text-[#dc2626] hover:bg-[#dc2626]/10 transition-colors"
              >
                <FiLock className="inline mr-1" size={12}/>Bloquear Data
              </button>
              <button
                onClick={() => { setEditTarget({ ...h }); setModal('edit'); }}
                className="p-2 rounded-lg border border-[#2a2a2a] text-[#94a3b8] hover:text-white hover:border-[#e85c0d] transition-colors"
              >
                <FiEdit size={14} />
              </button>
              <button
                onClick={() => setDeleteTarget(h)}
                className="p-2 rounded-lg border border-[#2a2a2a] text-[#dc2626] hover:bg-[#dc2626]/10 transition-colors"
              >
                <FiTrash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Blocked Dates */}
      {horariosBlockados.length > 0 && (
        <div className="bg-[#111111] border border-[#1e1e1e] rounded-2xl p-6">
          <h2 className="font-bold text-white mb-4 flex items-center gap-2"><FiLock size={16} className="text-[#dc2626]" /> Datas Bloqueadas</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {horariosBlockados.map((b, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-[#0a0a0a] border border-[#dc2626]/20 rounded-xl">
                <div>
                  <p className="text-white font-semibold text-sm">{b.horario} — {b.data && new Date(b.data + 'T12:00:00').toLocaleDateString('pt-BR')}</p>
                  {b.motivo && <p className="text-xs text-[#64748b]">{b.motivo}</p>}
                </div>
                <button
                  onClick={() => { unblockHorarioDate(b.horario, b.data); toast.success('Desbloqueado!'); }}
                  className="p-1.5 text-[#22c55e] hover:bg-[#22c55e]/10 rounded-lg transition-colors"
                  title="Desbloquear"
                >
                  <FiUnlock size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Modal */}
      <Modal isOpen={modal === 'add'} onClose={() => setModal(null)} title="Novo Horário"
        footer={<><Button variant="ghost" onClick={() => setModal(null)}>Cancelar</Button><Button variant="primary" onClick={handleAdd} loading={loading}>Adicionar</Button></>}
      >
        <div className="space-y-4">
          <FormField label="Horário (HH:MM)" type="time" value={form.hora} onChange={e => setForm(p => ({ ...p, hora: e.target.value }))} required />
          <FormField label="Label (exibição)" value={form.label} onChange={e => setForm(p => ({ ...p, label: e.target.value }))} placeholder="Ex: 08:00" hint="Deixe vazio para usar o horário como label" />
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={modal === 'edit'} onClose={() => setModal(null)} title="Editar Horário"
        footer={<><Button variant="ghost" onClick={() => setModal(null)}>Cancelar</Button><Button variant="primary" onClick={handleEdit} loading={loading}>Salvar</Button></>}
      >
        {editTarget && (
          <div className="space-y-4">
            <FormField label="Horário (HH:MM)" type="time" value={editTarget.hora} onChange={e => setEditTarget(p => ({ ...p, hora: e.target.value }))} required />
            <FormField label="Label" value={editTarget.label} onChange={e => setEditTarget(p => ({ ...p, label: e.target.value }))} />
          </div>
        )}
      </Modal>

      {/* Block Modal */}
      <Modal isOpen={modal === 'block'} onClose={() => setModal(null)} title={`Bloquear ${blockData.horario}`}
        footer={<><Button variant="ghost" onClick={() => setModal(null)}>Cancelar</Button><Button variant="danger" onClick={handleBlock}>Bloquear</Button></>}
      >
        <div className="space-y-4">
          <p className="text-[#94a3b8] text-sm">Selecione a data em que este horário ficará bloqueado (indisponível para novos agendamentos).</p>
          <FormField label="Data para bloqueio" type="date" value={blockData.data} onChange={e => setBlockData(p => ({ ...p, data: e.target.value }))} required />
          <FormField label="Motivo (opcional)" value={blockData.motivo} onChange={e => setBlockData(p => ({ ...p, motivo: e.target.value }))} placeholder="Ex: Manutenção, evento privado..." />
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Excluir Horário"
        message={`Excluir o horário ${deleteTarget?.hora}? Agendamentos existentes não serão afetados.`}
        loading={loading}
      />
    </div>
  );
}
