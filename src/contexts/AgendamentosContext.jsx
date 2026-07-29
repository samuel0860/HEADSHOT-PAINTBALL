import { createContext, useContext } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { INITIAL_AGENDAMENTOS } from '../mocks/agendamentos';
import { generateId, generateBookingCode, getTodayString } from '../utils/formatters';

const AgendamentosContext = createContext(null);

export function AgendamentosProvider({ children }) {
  const [agendamentos, setAgendamentos] = useLocalStorage('agendamentos', INITIAL_AGENDAMENTOS);

  const addAgendamento = (data) => {
    const newAg = {
      ...data,
      id: 'ag-' + generateId(),
      codigo: generateBookingCode(),
      status: 'pending',
      criadoEm: new Date().toISOString(),
    };
    setAgendamentos(prev => [...prev, newAg]);
    return newAg;
  };

  const updateAgendamento = (id, data) => {
    setAgendamentos(prev => prev.map(a => a.id === id ? { ...a, ...data } : a));
  };

  const deleteAgendamento = (id) => {
    setAgendamentos(prev => prev.filter(a => a.id !== id));
  };

  const cancelAgendamento = (id) => {
    updateAgendamento(id, { status: 'cancelled' });
  };

  const confirmAgendamento = (id) => {
    updateAgendamento(id, { status: 'confirmed' });
  };

  const getAgendamentoById = (id) => agendamentos.find(a => a.id === id);

  const getAgendamentosByEmail = (email) => {
    return agendamentos.filter(a => a.clienteEmail.toLowerCase() === email.toLowerCase());
  };

  const getAgendamentosByDate = (date) => {
    return agendamentos.filter(a => a.data === date);
  };

  const getAgendamentosByCliente = (clienteId) => {
    return agendamentos.filter(a => a.clienteId === clienteId);
  };

  const getTodayAgendamentos = () => {
    return agendamentos.filter(a => a.data === getTodayString());
  };

  const getHorariosOcupados = (date) => {
    return agendamentos
      .filter(a => a.data === date && a.status !== 'cancelled')
      .map(a => a.horario);
  };

  const isHorarioOcupado = (date, horario) => {
    return agendamentos.some(a => a.data === date && a.horario === horario && a.status !== 'cancelled');
  };

  const getStats = () => {
    const today = getTodayString();
    const total = agendamentos.length;
    const hoje = agendamentos.filter(a => a.data === today).length;
    const confirmados = agendamentos.filter(a => a.status === 'confirmed').length;
    const pendentes = agendamentos.filter(a => a.status === 'pending').length;
    const cancelados = agendamentos.filter(a => a.status === 'cancelled').length;
    const receita = agendamentos
      .filter(a => a.status !== 'cancelled')
      .reduce((sum, a) => sum + (a.valorTotal || 0), 0);
    return { total, hoje, confirmados, pendentes, cancelados, receita };
  };

  const searchAgendamentos = (query) => {
    if (!query) return agendamentos;
    const q = query.toLowerCase();
    return agendamentos.filter(a =>
      a.clienteNome?.toLowerCase().includes(q) ||
      a.clienteEmail?.toLowerCase().includes(q) ||
      a.codigo?.toLowerCase().includes(q) ||
      a.data?.includes(q)
    );
  };

  return (
    <AgendamentosContext.Provider value={{
      agendamentos,
      addAgendamento,
      updateAgendamento,
      deleteAgendamento,
      cancelAgendamento,
      confirmAgendamento,
      getAgendamentoById,
      getAgendamentosByEmail,
      getAgendamentosByDate,
      getAgendamentosByCliente,
      getTodayAgendamentos,
      getHorariosOcupados,
      isHorarioOcupado,
      getStats,
      searchAgendamentos,
    }}>
      {children}
    </AgendamentosContext.Provider>
  );
}

export function useAgendamentos() {
  const context = useContext(AgendamentosContext);
  if (!context) throw new Error('useAgendamentos must be used within AgendamentosProvider');
  return context;
}
