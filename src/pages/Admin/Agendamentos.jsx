import { useState, useMemo } from 'react';
import { useAgendamentos } from '../../contexts/AgendamentosContext';
import { usePacotes } from '../../contexts/PacotesContext';
import { Table } from '../../components/ui/Table';
import { Button } from '../../components/ui/Button';
import { Modal, ConfirmDialog } from '../../components/ui/Modal';
import { StatusBadge } from '../../components/ui/Badge';
import { SearchBar } from '../../components/ui/SearchBar';
import { FormField } from '../../components/ui/FormField';
import { formatDate, formatCurrency } from '../../utils/formatters';
import { useDebounce } from '../../hooks/useDebounce';
import {
  FiCalendar, FiFilter, FiEdit, FiTrash2, FiCheckCircle,
  FiXCircle, FiPhone, FiMail, FiUsers, FiPackage
} from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function AdminAgendamentos() {
  const { agendamentos, updateAgendamento, deleteAgendamento, confirmAgendamento, cancelAgendamento } = useAgendamentos();
  const { pacotes } = usePacotes();

  const [search, setSearch] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [loading, setLoading] = useState(false);

  const debouncedSearch = useDebounce(search, 300);

  const filtered = useMemo(() => {
    let list = [...agendamentos];
    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      list = list.filter(a =>
        a.clienteNome?.toLowerCase().includes(q) ||
        a.clienteEmail?.toLowerCase().includes(q) ||
        a.codigo?.toLowerCase().includes(q)
      );
    }
    if (filterDate) list = list.filter(a => a.data === filterDate);
    if (filterStatus) list = list.filter(a => a.status === filterStatus);
    return list.sort((a, b) => b.data.localeCompare(a.data) || a.horario.localeCompare(b.horario));
  }, [agendamentos, debouncedSearch, filterDate, filterStatus]);

  const handleConfirm = (ag) => {
    confirmAgendamento(ag.id);
    toast.success(`Agendamento ${ag.codigo} confirmado!`);
  };
  const handleCancel = (ag) => {
    cancelAgendamento(ag.id);
    toast.success(`Agendamento ${ag.codigo} cancelado.`);
  };
  const handleDelete = () => {
    setLoading(true);
    setTimeout(() => {
      deleteAgendamento(deleteTarget.id);
      toast.success('Agendamento excluído.');
      setDeleteTarget(null);
      setLoading(false);
    }, 500);
  };

  const handleSaveEdit = () => {
    setLoading(true);
    setTimeout(() => {
      updateAgendamento(editTarget.id, editTarget);
      toast.success('Agendamento atualizado!');
      setEditTarget(null);
      setLoading(false);
    }, 500);
  };

  const columns = [
    { key: 'codigo', label: 'Código', sortable: true, width: '110px' },
    {
      key: 'clienteNome', label: 'Cliente', sortable: true,
      render: (val, row) => (
        <div>
          <p className="font-semibold text-white">{val}</p>
          <p className="text-xs text-[#64748b]">{row.clienteEmail}</p>
        </div>
      )
    },
    {
      key: 'data', label: 'Data / Hora', sortable: true,
      render: (val, row) => (
        <div>
          <p className="text-white">{formatDate(val)}</p>
          <p className="text-xs text-[#e85c0d] font-semibold">{row.horario}</p>
        </div>
      )
    },
    { key: 'pacoteNome', label: 'Pacote', sortable: true },
    {
      key: 'qtdJogadores', label: 'Jog.', width: '60px',
      render: (val) => <span className="text-center block">{val}</span>
    },
    {
      key: 'valorTotal', label: 'Valor', sortable: true,
      render: (val) => <span className="text-[#e85c0d] font-bold">{formatCurrency(val)}</span>
    },
    {
      key: 'status', label: 'Status', sortable: true,
      render: (val) => <StatusBadge status={val} />
    },
    {
      key: 'id', label: 'Ações', width: '160px',
      render: (_, row) => (
        <div className="flex items-center gap-1.5">
          {row.status === 'pending' && (
            <button onClick={() => handleConfirm(row)} className="p-1.5 rounded-lg text-[#22c55e] hover:bg-[#22c55e]/10 transition-colors" title="Confirmar">
              <FiCheckCircle size={16} />
            </button>
          )}
          {row.status !== 'cancelled' && (
            <button onClick={() => handleCancel(row)} className="p-1.5 rounded-lg text-[#f59e0b] hover:bg-[#f59e0b]/10 transition-colors" title="Cancelar">
              <FiXCircle size={16} />
            </button>
          )}
          <button onClick={() => setEditTarget({ ...row })} className="p-1.5 rounded-lg text-[#94a3b8] hover:bg-[#2a2a2a] transition-colors" title="Editar">
            <FiEdit size={16} />
          </button>
          <button onClick={() => setDeleteTarget(row)} className="p-1.5 rounded-lg text-[#dc2626] hover:bg-[#dc2626]/10 transition-colors" title="Excluir">
            <FiTrash2 size={16} />
          </button>
        </div>
      )
    },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl text-white tracking-wider">AGENDAMENTOS</h1>
          <p className="text-[#64748b] text-sm mt-1">{filtered.length} registro(s) encontrado(s)</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-[#111111] border border-[#1e1e1e] rounded-2xl p-4">
        <div className="flex flex-wrap gap-3 items-end">
          <div className="flex-1 min-w-[180px]">
            <SearchBar value={search} onChange={setSearch} placeholder="Buscar por nome, e-mail ou código..." />
          </div>
          <div className="min-w-[140px]">
            <label className="block text-xs text-[#64748b] font-semibold mb-1.5 uppercase tracking-wider">Data</label>
            <input type="date" value={filterDate} onChange={e => setFilterDate(e.target.value)} className="input-field text-sm py-2" />
          </div>
          <div className="min-w-[130px]">
            <label className="block text-xs text-[#64748b] font-semibold mb-1.5 uppercase tracking-wider">Status</label>
            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="input-field text-sm py-2">
              <option value="">Todos</option>
              <option value="confirmed">Confirmado</option>
              <option value="pending">Pendente</option>
              <option value="cancelled">Cancelado</option>
            </select>
          </div>
          {(search || filterDate || filterStatus) && (
            <Button variant="ghost" size="sm" onClick={() => { setSearch(''); setFilterDate(''); setFilterStatus(''); }}>
              Limpar Filtros
            </Button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#111111] border border-[#1e1e1e] rounded-2xl p-4">
        <Table columns={columns} data={filtered} emptyMessage="Nenhum agendamento encontrado." pageSize={10} />
      </div>

      {/* Edit Modal */}
      {editTarget && (
        <Modal
          isOpen={!!editTarget}
          onClose={() => setEditTarget(null)}
          title={`Editar Agendamento — ${editTarget.codigo}`}
          size="lg"
          footer={
            <>
              <Button variant="ghost" onClick={() => setEditTarget(null)}>Cancelar</Button>
              <Button variant="primary" onClick={handleSaveEdit} loading={loading}>Salvar</Button>
            </>
          }
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2 p-4 bg-[#0a0a0a] rounded-xl border border-[#2a2a2a] space-y-2">
              <div className="flex items-center gap-2 text-sm text-[#94a3b8]"><FiUsers size={14} className="text-[#e85c0d]" /> {editTarget.clienteNome}</div>
              <div className="flex items-center gap-2 text-sm text-[#94a3b8]"><FiMail size={14} className="text-[#e85c0d]" /> {editTarget.clienteEmail}</div>
              <div className="flex items-center gap-2 text-sm text-[#94a3b8]"><FiPhone size={14} className="text-[#e85c0d]" /> {editTarget.clienteTelefone}</div>
            </div>
            <FormField
              label="Data"
              type="date"
              value={editTarget.data}
              onChange={e => setEditTarget(p => ({ ...p, data: e.target.value }))}
            />
            <FormField
              label="Horário"
              value={editTarget.horario}
              onChange={e => setEditTarget(p => ({ ...p, horario: e.target.value }))}
            />
            <div>
              <label className="block text-sm font-semibold text-[#f1f5f9] mb-1.5">Pacote</label>
              <select
                value={editTarget.pacoteId}
                onChange={e => {
                  const p = pacotes.find(p => p.id === e.target.value);
                  setEditTarget(prev => ({ ...prev, pacoteId: e.target.value, pacoteNome: p?.nome, valorTotal: p?.preco }));
                }}
                className="input-field"
              >
                {pacotes.map(p => <option key={p.id} value={p.id}>{p.nome} — {formatCurrency(p.preco)}</option>)}
              </select>
            </div>
            <FormField
              label="Qtd. Jogadores"
              type="number"
              value={editTarget.qtdJogadores}
              onChange={e => setEditTarget(p => ({ ...p, qtdJogadores: e.target.value }))}
              min="1"
            />
            <div>
              <label className="block text-sm font-semibold text-[#f1f5f9] mb-1.5">Status</label>
              <select
                value={editTarget.status}
                onChange={e => setEditTarget(p => ({ ...p, status: e.target.value }))}
                className="input-field"
              >
                <option value="pending">Pendente</option>
                <option value="confirmed">Confirmado</option>
                <option value="cancelled">Cancelado</option>
              </select>
            </div>
            <FormField
              label="Observações"
              type="textarea"
              value={editTarget.observacoes || ''}
              onChange={e => setEditTarget(p => ({ ...p, observacoes: e.target.value }))}
              rows={2}
              className="sm:col-span-2"
            />
          </div>
        </Modal>
      )}

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Excluir Agendamento"
        message={`Tem certeza que deseja excluir permanentemente o agendamento ${deleteTarget?.codigo} de ${deleteTarget?.clienteNome}?`}
        loading={loading}
      />
    </div>
  );
}
