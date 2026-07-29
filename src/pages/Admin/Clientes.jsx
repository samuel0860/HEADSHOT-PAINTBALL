import { useState, useMemo } from 'react';
import { useClientes } from '../../contexts/ClientesContext';
import { useAgendamentos } from '../../contexts/AgendamentosContext';
import { Table } from '../../components/ui/Table';
import { Button } from '../../components/ui/Button';
import { Modal, ConfirmDialog } from '../../components/ui/Modal';
import { FormField } from '../../components/ui/FormField';
import { StatusBadge } from '../../components/ui/Badge';
import { SearchBar } from '../../components/ui/SearchBar';
import { formatDate, formatCurrency } from '../../utils/formatters';
import { useDebounce } from '../../hooks/useDebounce';
import { FiUsers, FiEdit, FiTrash2, FiCalendar, FiEye } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function AdminClientes() {
  const { clientes, updateCliente, deleteCliente, searchClientes } = useClientes();
  const { getAgendamentosByCliente } = useAgendamentos();

  const [search, setSearch] = useState('');
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [viewTarget, setViewTarget] = useState(null);
  const [loading, setLoading] = useState(false);

  const debouncedSearch = useDebounce(search, 300);

  const filtered = useMemo(() => {
    return searchClientes(debouncedSearch).sort((a, b) => b.dataCadastro.localeCompare(a.dataCadastro));
  }, [clientes, debouncedSearch]);

  const handleSaveEdit = () => {
    setLoading(true);
    setTimeout(() => {
      updateCliente(editTarget.id, editTarget);
      toast.success('Cliente atualizado!');
      setEditTarget(null);
      setLoading(false);
    }, 500);
  };

  const handleDelete = () => {
    setLoading(true);
    setTimeout(() => {
      deleteCliente(deleteTarget.id);
      toast.success('Cliente excluído!');
      setDeleteTarget(null);
      setLoading(false);
    }, 400);
  };

  const clienteAgs = viewTarget ? getAgendamentosByCliente(viewTarget.id) : [];

  const columns = [
    {
      key: 'nome', label: 'Cliente', sortable: true,
      render: (val, row) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#e85c0d]/15 border border-[#e85c0d]/20 flex items-center justify-center flex-shrink-0">
            <span className="text-[#e85c0d] font-bold text-sm">{val.charAt(0).toUpperCase()}</span>
          </div>
          <div>
            <p className="font-semibold text-white">{val}</p>
            <p className="text-xs text-[#64748b]">{row.email}</p>
          </div>
        </div>
      )
    },
    { key: 'telefone', label: 'Telefone', sortable: false },
    {
      key: 'dataCadastro', label: 'Cadastro', sortable: true,
      render: (val) => formatDate(val)
    },
    {
      key: 'id', label: 'Agend.', width: '80px',
      render: (_, row) => {
        const count = getAgendamentosByCliente(row.id).length;
        return <span className={`font-bold ${count > 0 ? 'text-[#e85c0d]' : 'text-[#64748b]'}`}>{count}</span>;
      }
    },
    {
      key: '_actions', label: 'Ações', width: '120px',
      render: (_, row) => (
        <div className="flex items-center gap-1.5">
          <button onClick={() => setViewTarget(row)} className="p-1.5 rounded-lg text-[#94a3b8] hover:bg-[#2a2a2a] transition-colors" title="Ver histórico">
            <FiEye size={15} />
          </button>
          <button onClick={() => setEditTarget({ ...row })} className="p-1.5 rounded-lg text-[#94a3b8] hover:bg-[#2a2a2a] transition-colors" title="Editar">
            <FiEdit size={15} />
          </button>
          <button onClick={() => setDeleteTarget(row)} className="p-1.5 rounded-lg text-[#dc2626] hover:bg-[#dc2626]/10 transition-colors" title="Excluir">
            <FiTrash2 size={15} />
          </button>
        </div>
      )
    },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl text-white tracking-wider">CLIENTES</h1>
          <p className="text-[#64748b] text-sm mt-1">{clientes.length} cliente(s) cadastrado(s)</p>
        </div>
      </div>

      <div className="bg-[#111111] border border-[#1e1e1e] rounded-2xl p-4">
        <SearchBar value={search} onChange={setSearch} placeholder="Buscar por nome, e-mail ou telefone..." className="max-w-md" />
      </div>

      <div className="bg-[#111111] border border-[#1e1e1e] rounded-2xl p-4">
        <Table columns={columns} data={filtered} emptyMessage="Nenhum cliente encontrado." pageSize={10} />
      </div>

      {/* View History Modal */}
      <Modal
        isOpen={!!viewTarget}
        onClose={() => setViewTarget(null)}
        title={`Histórico — ${viewTarget?.nome}`}
        size="lg"
      >
        {viewTarget && (
          <div className="space-y-4">
            <div className="p-4 bg-[#0a0a0a] rounded-xl border border-[#2a2a2a]">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div><span className="text-[#64748b]">E-mail:</span> <span className="text-white ml-2">{viewTarget.email}</span></div>
                <div><span className="text-[#64748b]">Telefone:</span> <span className="text-white ml-2">{viewTarget.telefone}</span></div>
                <div><span className="text-[#64748b]">Cadastro:</span> <span className="text-white ml-2">{formatDate(viewTarget.dataCadastro)}</span></div>
                <div><span className="text-[#64748b]">Agendamentos:</span> <span className="text-[#e85c0d] font-bold ml-2">{clienteAgs.length}</span></div>
              </div>
            </div>

            <h3 className="font-bold text-white flex items-center gap-2"><FiCalendar size={16} className="text-[#e85c0d]" /> Histórico de Agendamentos</h3>

            {clienteAgs.length === 0 ? (
              <p className="text-[#64748b] text-sm text-center py-6">Nenhum agendamento encontrado.</p>
            ) : (
              <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                {clienteAgs.sort((a, b) => b.data.localeCompare(a.data)).map(ag => (
                  <div key={ag.id} className="flex items-center gap-3 p-3 bg-[#0a0a0a] rounded-xl border border-[#1e1e1e]">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-[#e85c0d]">{ag.codigo}</span>
                        <StatusBadge status={ag.status} />
                      </div>
                      <p className="text-sm text-[#94a3b8] mt-0.5">{formatDate(ag.data)} às {ag.horario} — {ag.pacoteNome}</p>
                    </div>
                    <span className="text-[#e85c0d] font-bold text-sm flex-shrink-0">{formatCurrency(ag.valorTotal)}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="pt-2 border-t border-[#1e1e1e] flex justify-between items-center">
              <span className="text-sm text-[#64748b]">Total gasto</span>
              <span className="font-display text-2xl text-[#e85c0d]">
                {formatCurrency(clienteAgs.filter(a => a.status !== 'cancelled').reduce((s, a) => s + (a.valorTotal || 0), 0))}
              </span>
            </div>
          </div>
        )}
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={!!editTarget}
        onClose={() => setEditTarget(null)}
        title="Editar Cliente"
        footer={<><Button variant="ghost" onClick={() => setEditTarget(null)}>Cancelar</Button><Button variant="primary" onClick={handleSaveEdit} loading={loading}>Salvar</Button></>}
      >
        {editTarget && (
          <div className="space-y-4">
            <FormField label="Nome Completo" value={editTarget.nome} onChange={e => setEditTarget(p => ({ ...p, nome: e.target.value }))} required />
            <FormField label="E-mail" type="email" value={editTarget.email} onChange={e => setEditTarget(p => ({ ...p, email: e.target.value }))} required />
            <FormField label="Telefone" value={editTarget.telefone} onChange={e => setEditTarget(p => ({ ...p, telefone: e.target.value }))} mask="phone" />
          </div>
        )}
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Excluir Cliente"
        message={`Excluir permanentemente o cliente "${deleteTarget?.nome}"? Seus agendamentos serão mantidos.`}
        loading={loading}
      />
    </div>
  );
}
