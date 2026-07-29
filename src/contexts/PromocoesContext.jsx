import { createContext, useContext } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { INITIAL_PROMOCOES } from '../mocks/promocoes';
import { generateId } from '../utils/formatters';

const PromocoesContext = createContext(null);

export function PromocoesProvider({ children }) {
  const [promocoes, setPromocoes] = useLocalStorage('promocoes', INITIAL_PROMOCOES);

  const addPromocao = (data) => {
    const newPromo = { ...data, id: 'promo-' + generateId(), criadoEm: new Date().toISOString() };
    setPromocoes(prev => [...prev, newPromo]);
    return newPromo;
  };

  const updatePromocao = (id, data) => {
    setPromocoes(prev => prev.map(p => p.id === id ? { ...p, ...data } : p));
  };

  const deletePromocao = (id) => {
    setPromocoes(prev => prev.filter(p => p.id !== id));
  };

  const toggleAtivo = (id) => {
    setPromocoes(prev => prev.map(p => p.id === id ? { ...p, ativo: !p.ativo } : p));
  };

  const getPromocoesAtivas = () => {
    const today = new Date().toISOString().split('T')[0];
    return promocoes.filter(p => p.ativo && p.validoAte >= today);
  };

  const getPromocoesVigentes = () => {
    const today = new Date().toISOString().split('T')[0];
    return promocoes.filter(p =>
      p.ativo &&
      p.validoDe <= today &&
      p.validoAte >= today
    );
  };

  return (
    <PromocoesContext.Provider value={{
      promocoes,
      addPromocao,
      updatePromocao,
      deletePromocao,
      toggleAtivo,
      getPromocoesAtivas,
      getPromocoesVigentes,
    }}>
      {children}
    </PromocoesContext.Provider>
  );
}

export function usePromocoes() {
  const context = useContext(PromocoesContext);
  if (!context) throw new Error('usePromocoes must be used within PromocoesProvider');
  return context;
}
