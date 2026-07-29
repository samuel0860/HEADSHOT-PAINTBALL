import { createContext, useContext } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { INITIAL_GALERIA, INITIAL_BANNERS } from '../mocks/galeria';
import { generateId } from '../utils/formatters';

const GaleriaContext = createContext(null);

export function GaleriaProvider({ children }) {
  const [galeria, setGaleria] = useLocalStorage('galeria', INITIAL_GALERIA);
  const [banners, setBanners] = useLocalStorage('banners', INITIAL_BANNERS);

  // GALERIA
  const addFoto = (data) => {
    const maxOrdem = galeria.length > 0 ? Math.max(...galeria.map(g => g.ordem)) : 0;
    const newFoto = { ...data, id: 'gal-' + generateId(), ordem: maxOrdem + 1, ativo: true };
    setGaleria(prev => [...prev, newFoto]);
    return newFoto;
  };

  const updateFoto = (id, data) => {
    setGaleria(prev => prev.map(f => f.id === id ? { ...f, ...data } : f));
  };

  const deleteFoto = (id) => {
    setGaleria(prev => prev.filter(f => f.id !== id));
  };

  const reorderFotos = (reorderedList) => {
    const updated = reorderedList.map((f, i) => ({ ...f, ordem: i + 1 }));
    setGaleria(updated);
  };

  const getFotosAtivas = () => galeria.filter(f => f.ativo).sort((a, b) => a.ordem - b.ordem);

  // BANNERS
  const addBanner = (data) => {
    const maxOrdem = banners.length > 0 ? Math.max(...banners.map(b => b.ordem)) : 0;
    const newBanner = { ...data, id: 'ban-' + generateId(), ordem: maxOrdem + 1, ativo: true };
    setBanners(prev => [...prev, newBanner]);
    return newBanner;
  };

  const updateBanner = (id, data) => {
    setBanners(prev => prev.map(b => b.id === id ? { ...b, ...data } : b));
  };

  const deleteBanner = (id) => {
    setBanners(prev => prev.filter(b => b.id !== id));
  };

  const setPrincipalBanner = (id) => {
    setBanners(prev => prev.map(b => ({ ...b, principal: b.id === id })));
  };

  const getBannersAtivos = () => banners.filter(b => b.ativo).sort((a, b) => a.ordem - b.ordem);

  return (
    <GaleriaContext.Provider value={{
      galeria,
      banners,
      addFoto,
      updateFoto,
      deleteFoto,
      reorderFotos,
      getFotosAtivas,
      addBanner,
      updateBanner,
      deleteBanner,
      setPrincipalBanner,
      getBannersAtivos,
    }}>
      {children}
    </GaleriaContext.Provider>
  );
}

export function useGaleria() {
  const context = useContext(GaleriaContext);
  if (!context) throw new Error('useGaleria must be used within GaleriaProvider');
  return context;
}
