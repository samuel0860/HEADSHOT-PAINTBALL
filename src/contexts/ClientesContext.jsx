import { createContext, useContext } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { INITIAL_CLIENTES } from '../mocks/clientes';
import { generateId } from '../utils/formatters';

const ClientesContext = createContext(null);

export function ClientesProvider({ children }) {
  const [clientes, setClientes] = useLocalStorage('clientes', INITIAL_CLIENTES);

  const addCliente = (data) => {
    // Check if client already exists by email
    const existing = clientes.find(c => c.email.toLowerCase() === data.email.toLowerCase());
    if (existing) return existing;
    const newCliente = {
      ...data,
      id: 'cli-' + generateId(),
      dataCadastro: new Date().toISOString().split('T')[0],
    };
    setClientes(prev => [...prev, newCliente]);
    return newCliente;
  };

  const updateCliente = (id, data) => {
    setClientes(prev => prev.map(c => c.id === id ? { ...c, ...data } : c));
  };

  const deleteCliente = (id) => {
    setClientes(prev => prev.filter(c => c.id !== id));
  };

  const getClienteById = (id) => clientes.find(c => c.id === id);
  const getClienteByEmail = (email) => clientes.find(c => c.email.toLowerCase() === email.toLowerCase());

  const searchClientes = (query) => {
    if (!query) return clientes;
    const q = query.toLowerCase();
    return clientes.filter(c =>
      c.nome.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.telefone.includes(q)
    );
  };

  return (
    <ClientesContext.Provider value={{
      clientes,
      addCliente,
      updateCliente,
      deleteCliente,
      getClienteById,
      getClienteByEmail,
      searchClientes,
    }}>
      {children}
    </ClientesContext.Provider>
  );
}

export function useClientes() {
  const context = useContext(ClientesContext);
  if (!context) throw new Error('useClientes must be used within ClientesProvider');
  return context;
}
