import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ClientNavbar } from '../../components/client/ClientNavbar';
import { ClientFooter } from '../../components/client/ClientFooter';
import { formatDate, formatCurrency } from '../../utils/formatters';
import { FiCheck, FiCalendar, FiTarget, FiShare2, FiHome } from 'react-icons/fi';

export default function Confirmacao() {
  const location = useLocation();
  const navigate = useNavigate();
  const { agendamento, pacote } = location.state || {};

  if (!agendamento) {
    navigate('/');
    return null;
  }

  return (
    <div className="min-h-screen bg-[#080808]">
      <ClientNavbar />
      <div className="pt-24 pb-20">
        <div className="max-w-lg mx-auto px-4 text-center">
          {/* Success Icon */}
          <div className="relative inline-flex mb-8">
            <div className="w-24 h-24 rounded-full bg-[#22c55e]/15 border-2 border-[#22c55e]/40 flex items-center justify-center">
              <FiCheck size={48} className="text-[#22c55e]" />
            </div>
            <div className="absolute -top-1 -right-1 w-8 h-8 bg-[#22c55e] rounded-full flex items-center justify-center animate-bounce">
              <FiTarget size={14} className="text-white" />
            </div>
          </div>

          <h1 className="font-display text-[clamp(2.2rem,8vw,3rem)] text-white tracking-wider mb-2 leading-none">
            <span className="text-[#22c55e]">AGENDAMENTO</span><br />CONFIRMADO!
          </h1>
          <p className="text-[#94a3b8] mb-8 text-lg">
            Seu agendamento foi realizado com sucesso. Guarde o código abaixo!
          </p>

          {/* Booking Code */}
          <div className="bg-[#111111] border border-[#22c55e]/30 rounded-2xl p-6 mb-6">
            <p className="text-sm text-[#64748b] mb-2">Código do Agendamento</p>
            <p className="font-display text-4xl text-[#22c55e] tracking-widest">{agendamento.codigo}</p>
          </div>

          {/* Summary */}
          <div className="bg-[#111111] border border-[#2a2a2a] rounded-2xl p-6 text-left mb-8 space-y-3">
            <h2 className="font-bold text-white mb-4">Resumo do Agendamento</h2>
            {[
              { label: 'Nome', value: agendamento.clienteNome },
              { label: 'Data', value: formatDate(agendamento.data) },
              { label: 'Horário', value: agendamento.horario },
              { label: 'Pacote', value: agendamento.pacoteNome },
              { label: 'Jogadores', value: agendamento.qtdJogadores },
              { label: 'Valor', value: formatCurrency(agendamento.valorTotal) },
              { label: 'Status', value: '⏳ Aguardando Confirmação' },
            ].map(item => (
              <div key={item.label} className="flex justify-between py-2 border-b border-[#1e1e1e] last:border-0">
                <span className="text-[#64748b] text-sm">{item.label}</span>
                <span className="text-white font-semibold text-sm">{item.value}</span>
              </div>
            ))}
          </div>

          <div className="space-y-3">
            <Link
              to="/meus-agendamentos"
              className="flex items-center justify-center gap-2 w-full py-3 bg-[#e85c0d] hover:bg-[#c44d0b] text-white font-bold rounded-xl transition-all"
            >
              <FiCalendar size={18} />
              Ver Meus Agendamentos
            </Link>
            <Link
              to="/"
              className="flex items-center justify-center gap-2 w-full py-3 border border-[#2a2a2a] hover:border-[#e85c0d] text-[#94a3b8] hover:text-white font-semibold rounded-xl transition-all"
            >
              <FiHome size={18} />
              Voltar ao Início
            </Link>
          </div>

          <p className="text-xs text-[#64748b] mt-6">
            Entraremos em contato pelo WhatsApp/E-mail para confirmar seu agendamento.
          </p>
        </div>
      </div>
      <ClientFooter />
    </div>
  );
}
