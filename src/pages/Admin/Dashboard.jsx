import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAgendamentos } from '../../contexts/AgendamentosContext';
import { useClientes } from '../../contexts/ClientesContext';
import { usePacotes } from '../../contexts/PacotesContext';
import { formatCurrency, formatDate, getTodayString } from '../../utils/formatters';
import { StatusBadge } from '../../components/ui/Badge';
import {
  FiCalendar, FiUsers, FiCheckCircle, FiClock, FiTrendingUp,
  FiPackage, FiAlertCircle, FiArrowRight, FiDollarSign
} from 'react-icons/fi';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';

function StatCard({ title, value, subtitle, icon: Icon, color = '#e85c0d', to }) {
  const card = (
    <div
      className="bg-[#111111] border border-[#1e1e1e] rounded-2xl p-6 hover:border-opacity-60 transition-all duration-300 group relative overflow-hidden"
      style={{ '--card-color': color }}
    >
      <div
        className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-5 -translate-y-8 translate-x-8"
        style={{ background: color }}
      />
      <div className="flex items-start justify-between mb-4">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center"
          style={{ background: color + '20', border: `1px solid ${color}30` }}
        >
          <Icon size={22} style={{ color }} />
        </div>
        {to && (
          <FiArrowRight size={16} className="text-[#3a3a3a] group-hover:text-[#94a3b8] transition-colors" />
        )}
      </div>
      <div className="font-display text-4xl text-white tracking-wider mb-1">{value}</div>
      <div className="text-sm font-semibold text-white mb-0.5">{title}</div>
      {subtitle && <div className="text-xs text-[#64748b]">{subtitle}</div>}
    </div>
  );
  return to ? <Link to={to}>{card}</Link> : card;
}

const CHART_COLORS = ['#e85c0d', '#dc2626', '#22c55e', '#f59e0b', '#ec4899'];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-3 text-sm shadow-xl">
        <p className="text-[#94a3b8] mb-1">{label}</p>
        {payload.map(p => (
          <p key={p.name} style={{ color: p.color }} className="font-bold">
            {p.name}: {p.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function Dashboard() {
  const { agendamentos, getStats, getTodayAgendamentos } = useAgendamentos();
  const { clientes } = useClientes();
  const { pacotes } = usePacotes();

  const stats = getStats();
  const todayAgendamentos = getTodayAgendamentos();

  // Chart data: last 7 days
  const weekData = useMemo(() => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayAgs = agendamentos.filter(a => a.data === dateStr);
      days.push({
        dia: d.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit' }),
        Confirmados: dayAgs.filter(a => a.status === 'confirmed').length,
        Pendentes: dayAgs.filter(a => a.status === 'pending').length,
        Cancelados: dayAgs.filter(a => a.status === 'cancelled').length,
      });
    }
    return days;
  }, [agendamentos]);

  // Pie: status distribution
  const pieData = [
    { name: 'Confirmados', value: stats.confirmados },
    { name: 'Pendentes', value: stats.pendentes },
    { name: 'Cancelados', value: stats.cancelados },
  ].filter(d => d.value > 0);

  // Recent bookings
  const recentAgs = [...agendamentos]
    .sort((a, b) => (b.criadoEm || '').localeCompare(a.criadoEm || ''))
    .slice(0, 5);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div>
        <h1 className="font-display text-4xl text-white tracking-wider">DASHBOARD</h1>
        <p className="text-[#64748b] mt-1">Bem-vindo ao painel Headshot Paintball · {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' })}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          title="Total de Agendamentos"
          value={stats.total}
          subtitle="Todos os períodos"
          icon={FiCalendar}
          color="#e85c0d"
          to="/admin/agendamentos"
        />
        <StatCard
          title="Agendamentos Hoje"
          value={stats.hoje}
          subtitle={formatDate(getTodayString())}
          icon={FiClock}
          color="#f59e0b"
          to="/admin/agendamentos"
        />
        <StatCard
          title="Total de Clientes"
          value={clientes.length}
          subtitle="Cadastrados no sistema"
          icon={FiUsers}
          color="#22c55e"
          to="/admin/clientes"
        />
        <StatCard
          title="Receita Total"
          value={formatCurrency(stats.receita)}
          subtitle="Agendamentos ativos"
          icon={FiDollarSign}
          color="#ec4899"
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard title="Confirmados" value={stats.confirmados} icon={FiCheckCircle} color="#22c55e" />
        <StatCard title="Pendentes" value={stats.pendentes} icon={FiAlertCircle} color="#f59e0b" />
        <StatCard title="Pacotes Ativos" value={pacotes.filter(p => p.ativo).length} icon={FiPackage} color="#e85c0d" to="/admin/pacotes" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Bar Chart */}
        <div className="xl:col-span-2 bg-[#111111] border border-[#1e1e1e] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-bold text-white">Agendamentos — Últimos 7 dias</h2>
              <p className="text-xs text-[#64748b] mt-0.5">Distribuição por status</p>
            </div>
            <FiTrendingUp size={20} className="text-[#e85c0d]" />
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={weekData} barSize={10}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e1e1e" />
              <XAxis dataKey="dia" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(232,92,13,0.05)' }} />
              <Bar dataKey="Confirmados" fill="#22c55e" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Pendentes" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Cancelados" fill="#dc2626" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="bg-[#111111] border border-[#1e1e1e] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-bold text-white">Status Geral</h2>
              <p className="text-xs text-[#64748b] mt-0.5">Distribuição total</p>
            </div>
          </div>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={4} dataKey="value">
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={['#22c55e', '#f59e0b', '#dc2626'][i]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: '12px', color: '#94a3b8' }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-60 text-[#64748b]">Sem dados ainda</div>
          )}
        </div>
      </div>

      {/* Today's appointments & Recent */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        {/* Today */}
        <div className="bg-[#111111] border border-[#1e1e1e] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-white">Agendamentos de Hoje</h2>
            <Link to="/admin/agendamentos" className="text-xs text-[#e85c0d] hover:underline">Ver todos →</Link>
          </div>
          {todayAgendamentos.length === 0 ? (
            <div className="text-center py-8 text-[#64748b]">
              <FiCalendar size={32} className="mx-auto mb-2 opacity-30" />
              <p className="text-sm">Nenhum agendamento hoje</p>
            </div>
          ) : (
            <div className="space-y-3">
              {todayAgendamentos.map(ag => (
                <div key={ag.id} className="flex items-center gap-3 p-3 bg-[#0a0a0a] rounded-xl border border-[#1e1e1e]">
                  <div className="w-10 h-10 rounded-lg bg-[#e85c0d]/10 border border-[#e85c0d]/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-[#e85c0d] text-xs font-bold">{ag.horario}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{ag.clienteNome}</p>
                    <p className="text-xs text-[#64748b]">{ag.pacoteNome} · {ag.qtdJogadores} jog.</p>
                  </div>
                  <StatusBadge status={ag.status} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent */}
        <div className="bg-[#111111] border border-[#1e1e1e] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-white">Últimos Agendamentos</h2>
            <Link to="/admin/agendamentos" className="text-xs text-[#e85c0d] hover:underline">Ver todos →</Link>
          </div>
          <div className="space-y-3">
            {recentAgs.map(ag => (
              <div key={ag.id} className="flex items-center gap-3 p-3 bg-[#0a0a0a] rounded-xl border border-[#1e1e1e]">
                <div className="w-8 h-8 rounded-full bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center flex-shrink-0">
                  <FiUsers size={14} className="text-[#64748b]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{ag.clienteNome}</p>
                  <p className="text-xs text-[#64748b]">{formatDate(ag.data)} às {ag.horario}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <StatusBadge status={ag.status} />
                  <p className="text-xs text-[#e85c0d] font-bold mt-1">{formatCurrency(ag.valorTotal)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
