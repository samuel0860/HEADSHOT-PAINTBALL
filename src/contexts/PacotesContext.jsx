import { createContext, useContext } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { INITIAL_PACOTES } from '../mocks/pacotes';
import { generateId } from '../utils/formatters';

const PacotesContext = createContext(null);

export function PacotesProvider({ children }) {
  const [pacotes, setPacotes] = useLocalStorage('pacotes', INITIAL_PACOTES);

  const addPacote = (data) => {
    const newPacote = { ...data, id: 'pac-' + generateId(), ativo: true };
    setPacotes(prev => [...prev, newPacote]);
    return newPacote;
  };

  const updatePacote = (id, data) => {
    setPacotes(prev => prev.map(p => p.id === id ? { ...p, ...data } : p));
  };

  const deletePacote = (id) => {
    setPacotes(prev => prev.filter(p => p.id !== id));
  };

  const toggleAtivo = (id) => {
    setPacotes(prev => prev.map(p => p.id === id ? { ...p, ativo: !p.ativo } : p));
  };

  const getPacoteById = (id) => pacotes.find(p => p.id === id);
  const getPacotesAtivos = () => pacotes.filter(p => p.ativo);

  return (
    <PacotesContext.Provider value={{
      pacotes,
      addPacote,
      updatePacote,
      deletePacote,
      toggleAtivo,
      getPacoteById,
      getPacotesAtivos,
    }}>
      {children}
    </PacotesContext.Provider>
  );
}

export function usePacotes() {
  const context = useContext(PacotesContext);
  if (!context) throw new Error('usePacotes must be used within PacotesProvider');
  return context;
}
