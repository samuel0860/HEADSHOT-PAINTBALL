import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAgendamentos } from '../../contexts/AgendamentosContext';
import { useHorarios } from '../../contexts/HorariosContext';
import { usePacotes } from '../../contexts/PacotesContext';
import { useClientes } from '../../contexts/ClientesContext';
import { ClientNavbar } from '../../components/client/ClientNavbar';
import { ClientFooter } from '../../components/client/ClientFooter';
import { Button } from '../../components/ui/Button';
import { FormField } from '../../components/ui/FormField';
import { formatCurrency, formatDate, getMinDate, phoneMask } from '../../utils/formatters';
import { validateEmail, validatePhone, validateRequired } from '../../utils/validators';
import { FiCalendar, FiClock, FiPackage, FiUsers, FiUser, FiCheck, FiChevronRight, FiTarget } from 'react-icons/fi';
import toast from 'react-hot-toast';

const STEPS = [
  { id: 1, label: 'Data', icon: FiCalendar },
  { id: 2, label: 'Horário', icon: FiClock },
  { id: 3, label: 'Pacote', icon: FiPackage },
  { id: 4, label: 'Grupo', icon: FiUsers },
  { id: 5, label: 'Dados', icon: FiUser },
  { id: 6, label: 'Revisar', icon: FiCheck },
];

export default function Agendamento() {
  const navigate = useNavigate();
  const { addAgendamento, getHorariosOcupados, isHorarioOcupado } = useAgendamentos();
  const { getHorariosAtivos, isBlocked } = useHorarios();
  const { getPacotesAtivos, getPacoteById } = usePacotes();
  const { addCliente } = useClientes();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    data: '',
    horario: '',
    pacoteId: '',
    qtdJogadores: 2,
    nome: '',
    email: '',
    telefone: '',
    observacoes: '',
  });
  const [errors, setErrors] = useState({});

  const horariosAtivos = getHorariosAtivos();
  const pacotesAtivos = getPacotesAtivos();
  const selectedPacote = getPacoteById(formData.pacoteId);

  const horariosDisponiveis = formData.data
    ? horariosAtivos.filter(h => !isHorarioOcupado(formData.data, h.hora) && !isBlocked(h.hora, formData.data))
    : [];

  const update = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const validateStep = () => {
    const errs = {};
    switch (step) {
      case 1:
        if (!formData.data) errs.data = 'Selecione uma data';
        break;
      case 2:
        if (!formData.horario) errs.horario = 'Selecione um horário';
        break;
      case 3:
        if (!formData.pacoteId) errs.pacoteId = 'Selecione um pacote';
        break;
      case 4:
        if (!formData.qtdJogadores || formData.qtdJogadores < 1) errs.qtdJogadores = 'Mínimo 1 jogador';
        break;
      case 5:
        if (!validateRequired(formData.nome)) errs.nome = 'Nome é obrigatório';
        if (!validateEmail(formData.email)) errs.email = 'E-mail inválido';
        if (!validatePhone(formData.telefone)) errs.telefone = 'Telefone inválido';
        break;
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const nextStep = () => {
    if (validateStep()) setStep(s => Math.min(s + 1, 6));
  };

  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Add or get client
      const cliente = addCliente({
        nome: formData.nome,
        email: formData.email,
        telefone: formData.telefone,
      });

      // Create appointment
      const ag = addAgendamento({
        clienteId: cliente.id,
        clienteNome: formData.nome,
        clienteEmail: formData.email,
        clienteTelefone: formData.telefone,
        data: formData.data,
        horario: formData.horario,
        pacoteId: formData.pacoteId,
        pacoteNome: selectedPacote?.nome,
        qtdJogadores: Number(formData.qtdJogadores),
        valorTotal: selectedPacote?.preco || 0,
        observacoes: formData.observacoes,
      });

      toast.success('Agendamento realizado com sucesso!');
      navigate('/confirmacao', { state: { agendamento: ag, pacote: selectedPacote } });
    } catch (err) {
      toast.error('Erro ao realizar agendamento. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080808] flex flex-col">
      <ClientNavbar />
      <div className="flex-1 pt-24 pb-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">

          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#e85c0d]/10 border border-[#e85c0d]/30 rounded-full mb-4">
              <FiCalendar size={14} className="text-[#e85c0d]" />
              <span className="text-sm text-[#e85c0d] font-semibold tracking-wider">AGENDAMENTO</span>
            </div>
            <h1 className="font-display text-5xl text-white tracking-wider">RESERVE SUA <span className="text-gradient">VAGA</span></h1>
          </div>

          {/* Step Indicator */}
          <div className="flex items-center justify-center mb-10 overflow-x-auto pb-2">
            {STEPS.map((s, i) => (
              <div key={s.id} className="flex items-center">
                <div className={`flex flex-col items-center ${step >= s.id ? 'opacity-100' : 'opacity-40'}`}>
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all
                      ${step > s.id ? 'bg-[#e85c0d] border-[#e85c0d]' : step === s.id ? 'border-[#e85c0d] bg-[#e85c0d]/10' : 'border-[#2a2a2a]'}
                    `}
                  >
                    {step > s.id ? <FiCheck size={16} className="text-white" /> : <s.icon size={16} className={step === s.id ? 'text-[#e85c0d]' : 'text-[#64748b]'} />}
                  </div>
                  <span className={`text-xs mt-1 font-semibold hidden sm:block ${step === s.id ? 'text-[#e85c0d]' : 'text-[#64748b]'}`}>{s.label}</span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`w-8 sm:w-16 h-0.5 mx-1 transition-all ${step > s.id ? 'bg-[#e85c0d]' : 'bg-[#2a2a2a]'}`} />
                )}
              </div>
            ))}
          </div>

          {/* Step Content */}
          <div className="bg-[#111111] border border-[#2a2a2a] rounded-2xl p-6 sm:p-8 animate-fadeIn">

            {/* Step 1 — Data */}
            {step === 1 && (
              <div className="space-y-6">
                <h2 className="font-display text-2xl text-white tracking-wider">ESCOLHA A DATA</h2>
                <FormField
                  label="Data do Agendamento"
                  type="date"
                  value={formData.data}
                  onChange={(e) => update('data', e.target.value)}
                  min={getMinDate()}
                  error={errors.data}
                  required
                />
                {formData.data && (
                  <p className="text-sm text-[#94a3b8]">
                    📅 {new Date(formData.data + 'T12:00:00').toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })}
                  </p>
                )}
              </div>
            )}

            {/* Step 2 — Horário */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="text-center sm:text-left">
                  <h2 className="font-display text-2xl text-white tracking-wider">ESCOLHA O HORÁRIO</h2>
                  <p className="text-[#64748b] text-sm mt-1">Data selecionada: <strong className="text-[#e85c0d]">{formatDate(formData.data)}</strong></p>
                </div>
                {horariosDisponiveis.length === 0 ? (
                  <div className="text-center py-8 text-[#64748b]">
                    <FiClock size={40} className="mx-auto mb-3 opacity-40" />
                    <p>Não há horários disponíveis para esta data.</p>
                    <button onClick={prevStep} className="mt-3 text-[#e85c0d] underline text-sm">Escolher outra data</button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {horariosAtivos.map((h) => {
                      const ocupado = isHorarioOcupado(formData.data, h.hora) || isBlocked(h.hora, formData.data);
                      return (
                        <button
                          key={h.id}
                          disabled={ocupado}
                          onClick={() => !ocupado && update('horario', h.hora)}
                          className={`py-4 rounded-xl border-2 font-bold text-lg transition-all duration-200 flex flex-col items-center justify-center
                            ${ocupado ? 'border-[#1e1e1e] text-[#3a3a3a] cursor-not-allowed bg-[#0a0a0a]' :
                              formData.horario === h.hora
                                ? 'border-[#e85c0d] bg-[#e85c0d]/10 text-[#e85c0d] shadow-[0_0_20px_rgba(232,92,13,0.15)] scale-[1.02]'
                                : 'border-[#2a2a2a] text-[#94a3b8] hover:border-[#e85c0d]/40 hover:text-white bg-[#111111]'
                            }
                          `}
                        >
                          {h.hora}
                          {ocupado && <span className="text-[10px] uppercase tracking-widest mt-1 opacity-50">Indisponível</span>}
                        </button>
                      );
                    })}
                  </div>
                )}
                {errors.horario && <p className="text-xs text-[#dc2626] text-center sm:text-left">⚠ {errors.horario}</p>}
              </div>
            )}

            {/* Step 3 — Pacote */}
            {step === 3 && (
              <div className="space-y-6">
                <div className="text-center sm:text-left">
                  <h2 className="font-display text-2xl text-white tracking-wider">ESCOLHA O PACOTE</h2>
                  <p className="text-[#64748b] text-sm mt-1">Selecione o pacote para o seu grupo</p>
                </div>
                <div className="space-y-3">
                  {pacotesAtivos.map((pacote) => (
                    <button
                      key={pacote.id}
                      onClick={() => update('pacoteId', pacote.id)}
                      className={`w-full text-left p-4 sm:p-5 rounded-xl border-2 transition-all duration-200 relative overflow-hidden group
                        ${formData.pacoteId === pacote.id
                          ? 'border-[#e85c0d] bg-[#e85c0d]/5'
                          : 'border-[#2a2a2a] hover:border-[#e85c0d]/40 bg-[#111111]'
                        }
                      `}
                    >
                      {formData.pacoteId === pacote.id && (
                        <div className="absolute top-0 right-0 w-16 h-16 bg-[#e85c0d]/10 rounded-bl-full -z-10" />
                      )}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-white text-lg">{pacote.nome}</span>
                            {pacote.popular && <span className="text-[10px] px-2 py-0.5 bg-[#e85c0d] text-white rounded-full uppercase tracking-wider font-bold">Popular</span>}
                          </div>
                          <p className="text-sm text-[#94a3b8]">{pacote.qtdBolas} bolas {pacote.tempoJogo > 0 ? `• ${pacote.tempoJogo} min` : ''}</p>
                        </div>
                        <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto mt-2 sm:mt-0">
                          <span className="font-display text-2xl text-[#e85c0d]">{formatCurrency(pacote.preco)}</span>
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ml-4
                            ${formData.pacoteId === pacote.id ? 'border-[#e85c0d] bg-[#e85c0d]' : 'border-[#2a2a2a]'}
                          `}>
                            {formData.pacoteId === pacote.id && <FiCheck size={14} className="text-white" />}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
                {errors.pacoteId && <p className="text-xs text-[#dc2626] text-center sm:text-left">⚠ {errors.pacoteId}</p>}
              </div>
            )}

            {/* Step 4 — Jogadores */}
            {step === 4 && (
              <div className="space-y-6">
                <div className="text-center sm:text-left">
                  <h2 className="font-display text-2xl text-white tracking-wider">QUANTIDADE DE JOGADORES</h2>
                  <p className="text-[#64748b] text-sm mt-1">
                    Pacote selecionado: <strong className="text-[#e85c0d]">{selectedPacote?.nome}</strong>
                  </p>
                </div>
                
                <div className="max-w-xs mx-auto sm:mx-0">
                  <FormField
                    label="Número Exato de Jogadores"
                    type="number"
                    value={formData.qtdJogadores}
                    onChange={(e) => update('qtdJogadores', e.target.value)}
                    min="1"
                    max="24"
                    error={errors.qtdJogadores}
                    required
                  />
                </div>

                <div>
                  <p className="text-xs text-[#64748b] font-semibold uppercase tracking-wider mb-3 text-center sm:text-left">Ou escolha rapidamente:</p>
                  <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                    {[2, 4, 6, 8, 10, 12, 16, 20].map((n) => (
                      <button
                        key={n}
                        onClick={() => update('qtdJogadores', n)}
                        className={`py-2.5 rounded-lg border text-sm font-bold transition-all
                          ${Number(formData.qtdJogadores) === n
                            ? 'border-[#e85c0d] bg-[#e85c0d]/10 text-[#e85c0d] scale-105'
                            : 'border-[#2a2a2a] text-[#64748b] hover:border-[#e85c0d]/40 hover:text-white bg-[#111111]'
                          }
                        `}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 5 — Dados */}
            {step === 5 && (
              <div className="space-y-6">
                <div className="text-center sm:text-left">
                  <h2 className="font-display text-2xl text-white tracking-wider">SEUS DADOS</h2>
                  <p className="text-[#64748b] text-sm mt-1">Como entraremos em contato com você</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  <FormField
                    label="Nome Completo"
                    value={formData.nome}
                    onChange={(e) => update('nome', e.target.value)}
                    placeholder="Ex: João da Silva"
                    error={errors.nome}
                    required
                    className="sm:col-span-2"
                  />
                  <FormField
                    label="Telefone / WhatsApp"
                    value={formData.telefone}
                    onChange={(e) => update('telefone', e.target.value)}
                    placeholder="(31) 99999-9999"
                    mask="phone"
                    error={errors.telefone}
                    required
                  />
                  <FormField
                    label="E-mail"
                    type="email"
                    value={formData.email}
                    onChange={(e) => update('email', e.target.value)}
                    placeholder="seu@email.com"
                    error={errors.email}
                    required
                  />
                  <FormField
                    label="Observações (opcional)"
                    type="textarea"
                    value={formData.observacoes}
                    onChange={(e) => update('observacoes', e.target.value)}
                    placeholder="Alguma informação adicional para a nossa equipe?"
                    className="sm:col-span-2"
                    rows={3}
                  />
                </div>
              </div>
            )}

            {/* Step 6 — Resumo */}
            {step === 6 && (
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="font-display text-2xl text-white tracking-wider">CONFIRME SEU AGENDAMENTO</h2>
                  <p className="text-[#64748b] text-sm mt-1">Revise os detalhes antes de finalizar</p>
                </div>
                
                <div className="bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl overflow-hidden">
                  <div className="p-5 sm:p-6 space-y-4">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pb-4 border-b border-[#1e1e1e]">
                      <div>
                        <p className="text-[#64748b] text-xs uppercase tracking-wider mb-1">Data</p>
                        <p className="text-white font-semibold text-sm">{formatDate(formData.data)}</p>
                      </div>
                      <div>
                        <p className="text-[#64748b] text-xs uppercase tracking-wider mb-1">Horário</p>
                        <p className="text-[#e85c0d] font-bold text-sm">{formData.horario}</p>
                      </div>
                      <div className="col-span-2 sm:col-span-2">
                        <p className="text-[#64748b] text-xs uppercase tracking-wider mb-1">Pacote</p>
                        <p className="text-white font-semibold text-sm">{selectedPacote?.nome}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 pb-4 border-b border-[#1e1e1e]">
                      <div className="col-span-2 sm:col-span-1">
                        <p className="text-[#64748b] text-xs uppercase tracking-wider mb-1">Responsável</p>
                        <p className="text-white font-semibold text-sm truncate">{formData.nome}</p>
                        <p className="text-[#94a3b8] text-xs mt-0.5">{formData.telefone}</p>
                      </div>
                      <div className="col-span-2 sm:col-span-1 sm:text-right">
                        <p className="text-[#64748b] text-xs uppercase tracking-wider mb-1">Jogadores</p>
                        <p className="text-white font-semibold text-sm">{formData.qtdJogadores} pessoas</p>
                      </div>
                    </div>

                    <div className="flex justify-between items-end pt-2">
                      <div>
                        <p className="text-[#64748b] text-xs uppercase tracking-wider mb-1">Total Previsto</p>
                        <p className="text-xs text-[#94a3b8]">{formData.qtdJogadores}x {formatCurrency(selectedPacote?.preco || 0)}</p>
                      </div>
                      <div className="text-right">
                        <span className="font-display text-4xl text-[#e85c0d] leading-none">
                          {formatCurrency((selectedPacote?.preco || 0) * formData.qtdJogadores)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <p className="text-xs text-[#64748b] text-center max-w-md mx-auto">
                  Ao confirmar, você concorda com nossos termos. O pagamento será realizado no local no dia do evento.
                </p>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center gap-3 mt-8 pt-6 border-t border-[#2a2a2a]">
              <Button variant="ghost" onClick={prevStep} disabled={step === 1} className="flex-1 sm:flex-none justify-center">
                Voltar
              </Button>
              {step < 6 ? (
                <Button variant="primary" onClick={nextStep} className="flex-1 justify-center" icon={<FiChevronRight size={16} />}>
                  Próximo
                </Button>
              ) : (
                <Button variant="primary" onClick={handleSubmit} loading={loading} size="lg" className="flex-[2] sm:flex-1 justify-center shadow-[0_0_20px_rgba(232,92,13,0.3)]">
                  ✅ Confirmar Agendamento
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
      <ClientFooter />
    </div>
  );
}
