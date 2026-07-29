import { createContext, useContext } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { INITIAL_HORARIOS } from '../mocks/horarios';
import { generateId } from '../utils/formatters';

const HorariosContext = createContext(null);

export function HorariosProvider({ children }) {
  const [horarios, setHorarios] = useLocalStorage('horarios', INITIAL_HORARIOS);
  const [horariosBlockados, setHorariosBlockados] = useLocalStorage('horarios_bloqueados', []);

  const addHorario = (data) => {
    const newHorario = { ...data, id: 'hor-' + generateId(), ativo: true };
    setHorarios(prev => [...prev, newHorario].sort((a, b) => a.hora.localeCompare(b.hora)));
    return newHorario;
  };

  const updateHorario = (id, data) => {
    setHorarios(prev => prev.map(h => h.id === id ? { ...h, ...data } : h));
  };

  const deleteHorario = (id) => {
    setHorarios(prev => prev.filter(h => h.id !== id));
  };

  const toggleAtivo = (id) => {
    setHorarios(prev => prev.map(h => h.id === id ? { ...h, ativo: !h.ativo } : h));
  };

  // Block a specific horário on a specific date
  const blockHorarioDate = (horario, data, motivo = '') => {
    const key = `${data}_${horario}`;
    if (!horariosBlockados.includes(key)) {
      setHorariosBlockados(prev => [...prev, { key, horario, data, motivo }]);
    }
  };

  const unblockHorarioDate = (horario, data) => {
    const key = `${data}_${horario}`;
    setHorariosBlockados(prev => prev.filter(h => h.key !== key));
  };

  const isBlocked = (horario, data) => {
    const key = `${data}_${horario}`;
    return horariosBlockados.some(h => h.key === key);
  };

  const getHorariosAtivos = () => horarios.filter(h => h.ativo);

  return (
    <HorariosContext.Provider value={{
      horarios,
      horariosBlockados,
      addHorario,
      updateHorario,
      deleteHorario,
      toggleAtivo,
      blockHorarioDate,
      unblockHorarioDate,
      isBlocked,
      getHorariosAtivos,
    }}>
      {children}
    </HorariosContext.Provider>
  );
}

export function useHorarios() {
  const context = useContext(HorariosContext);
  if (!context) throw new Error('useHorarios must be used within HorariosProvider');
  return context;
}
