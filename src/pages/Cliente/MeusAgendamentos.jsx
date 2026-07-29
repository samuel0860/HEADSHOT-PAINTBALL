import { useState } from 'react';
import { useAgendamentos } from '../../contexts/AgendamentosContext';
import { ClientNavbar } from '../../components/client/ClientNavbar';
import { ClientFooter } from '../../components/client/ClientFooter';
import { Button } from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/Badge';
import { FormField } from '../../components/ui/FormField';
import { ConfirmDialog } from '../../components/ui/Modal';
import { formatDate, formatCurrency } from '../../utils/formatters';
import { validateEmail } from '../../utils/validators';
import { FiSearch, FiCalendar, FiX, FiPackage, FiClock, FiUsers } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function MeusAgendamentos() {
  const { getAgendamentosByEmail, cancelAgendamento } = useAgendamentos();
  const [email, setEmail] = useState('');
  const [search, setSearch] = useState('');
  const [agendamentos, setAgendamentos] = useState(null);
  const [emailError, setEmailError] = useState('');
  const [cancelTarget, setCancelTarget] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = () => {
    if (!validateEmail(email)) {
      setEmailError('Digite um e-mail válido');
      return;
    }
    setEmailError('');
    const found = getAgendamentosByEmail(email);
    setAgendamentos(found);
    setSearch('');
  };

  const handleCancel = () => {
    setLoading(true);
    setTimeout(() => {
      cancelAgendamento(cancelTarget.id);
      setAgendamentos(prev => prev.map(a => a.id === cancelTarget.id ? { ...a, status: 'cancelled' } : a));
      toast.success('Agendamento cancelado com sucesso.');
      setCancelTarget(null);
      setLoading(false);
    }, 600);
  };

  const filtered = agendamentos
    ? agendamentos.filter(a =>
        !search || a.pacoteNome?.toLowerCase().includes(search.toLowerCase()) || a.data.includes(search) || a.codigo?.toLowerCase().includes(search.toLowerCase())
      ).sort((a, b) => b.criadoEm?.localeCompare(a.criadoEm || ''))
    : null;

  const statusColor = { confirmed: 'text-[#22c55e]', pending: 'text-[#f59e0b]', cancelled: 'text-[#dc2626]' };

  return (
    <div className="min-h-screen bg-[#080808]">
      <ClientNavbar />
      <div className="pt-24 pb-20">
        <div className="max-w-4xl mx-auto px-4">

          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#e85c0d]/10 border border-[#e85c0d]/30 rounded-full mb-4">
              <FiCalendar size={14} className="text-[#e85c0d]" />
              <span className="text-sm text-[#e85c0d] font-semibold tracking-wider">MEUS AGENDAMENTOS</span>
            </div>
            <h1 className="font-display text-[clamp(2.5rem,8vw,4rem)] text-white tracking-wider leading-none">
              SUAS <span className="text-gradient">RESERVAS</span>
            </h1>
            <p className="text-[#94a3b8] mt-3">Digite seu e-mail para visualizar seus agendamentos</p>
          </div>

          {/* Email Search */}
          <div className="bg-[#111111] border border-[#2a2a2a] rounded-2xl p-6 mb-8">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <FormField
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setEmailError(''); }}
                  placeholder="Digite seu e-mail cadastrado"
                  error={emailError}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <Button variant="primary" onClick={handleSearch} icon={<FiSearch size={16} />} size="lg">
                Buscar
              </Button>
            </div>
          </div>

          {/* Results */}
          {filtered !== null && (
            <>
              {filtered.length === 0 ? (
                <div className="text-center py-16 text-[#64748b]">
                  <FiCalendar size={48} className="mx-auto mb-4 opacity-30" />
                  <p className="text-xl font-semibold text-white mb-2">Nenhum agendamento encontrado</p>
                  <p className="text-sm">Nenhum agendamento encontrado para <strong>{email}</strong>.</p>
                  <Button variant="primary" className="mt-6" onClick={() => window.location.href = '/agendamento'}>
                    Fazer um Agendamento
                  </Button>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-[#94a3b8] text-sm">
                      <strong className="text-white">{filtered.length}</strong> agendamento(s) encontrado(s)
                    </p>
                    <div className="w-48">
                      <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Filtrar..."
                        className="input-field text-sm py-2"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    {filtered.map((ag) => (
                      <div
                        key={ag.id}
                        className={`bg-[#111111] border rounded-2xl p-5 transition-all duration-200
                          ${ag.status === 'cancelled' ? 'border-[#1e1e1e] opacity-60' : 'border-[#2a2a2a] hover:border-[#e85c0d]/30'}
                        `}
                      >
                        <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                          <div>
                            <div className="flex flex-wrap items-center gap-3 mb-1">
                              <span className="font-display text-xl text-white tracking-wider">{ag.codigo}</span>
                              <StatusBadge status={ag.status} />
                            </div>
                            <p className="text-sm text-[#64748b]">Agendado em {new Date(ag.criadoEm).toLocaleDateString('pt-BR')}</p>
                          </div>
                          {ag.status !== 'cancelled' && (
                            <Button
                              variant="danger"
                              size="sm"
                              icon={<FiX size={14} />}
                              onClick={() => setCancelTarget(ag)}
                            >
                              Cancelar
                            </Button>
                          )}
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          {[
                            { icon: <FiCalendar size={15} />, label: 'Data', value: formatDate(ag.data) },
                            { icon: <FiClock size={15} />, label: 'Horário', value: ag.horario },
                            { icon: <FiPackage size={15} />, label: 'Pacote', value: ag.pacoteNome },
                            { icon: <FiUsers size={15} />, label: 'Jogadores', value: ag.qtdJogadores },
                          ].map(item => (
                            <div key={item.label} className="bg-[#0a0a0a] rounded-xl p-3">
                              <div className="flex items-center gap-1.5 text-[#64748b] text-xs mb-1">
                                {item.icon} {item.label}
                              </div>
                              <p className="text-white font-semibold text-sm">{item.value}</p>
                            </div>
                          ))}
                        </div>

                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#1e1e1e]">
                          <span className="text-[#64748b] text-sm">Valor Total</span>
                          <span className="font-display text-2xl text-[#e85c0d]">{formatCurrency(ag.valorTotal)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>

      <ConfirmDialog
        isOpen={!!cancelTarget}
        onClose={() => setCancelTarget(null)}
        onConfirm={handleCancel}
        title="Cancelar Agendamento"
        message={`Tem certeza que deseja cancelar o agendamento ${cancelTarget?.codigo}? Esta ação não pode ser desfeita.`}
        confirmText="Sim, Cancelar"
        loading={loading}
      />

      <ClientFooter />
    </div>
  );
}
