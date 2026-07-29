import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Contexts
import { AuthProvider } from './contexts/AuthContext';
import { AgendamentosProvider } from './contexts/AgendamentosContext';
import { HorariosProvider } from './contexts/HorariosContext';
import { PacotesProvider } from './contexts/PacotesContext';
import { ClientesProvider } from './contexts/ClientesContext';
import { PromocoesProvider } from './contexts/PromocoesContext';
import { GaleriaProvider } from './contexts/GaleriaContext';

// Routes
import { ProtectedRoute } from './routes/ProtectedRoute';

// Admin Components
import { AdminLayout } from './components/admin/AdminLayout';

// Client Pages
import Home from './pages/Cliente/Home';
import Agendamento from './pages/Cliente/Agendamento';
import Confirmacao from './pages/Cliente/Confirmacao';
import MeusAgendamentos from './pages/Cliente/MeusAgendamentos';
import Pacotes from './pages/Cliente/Pacotes';
import Galeria from './pages/Cliente/Galeria';
import Promocoes from './pages/Cliente/Promocoes';

// Admin Pages
import Login from './pages/Admin/Login';
import Dashboard from './pages/Admin/Dashboard';
import AdminAgendamentos from './pages/Admin/Agendamentos';
import AdminHorarios from './pages/Admin/Horarios';
import AdminBanners from './pages/Admin/Banners';
import AdminGaleria from './pages/Admin/Galeria';
import AdminPromocoes from './pages/Admin/Promocoes';
import AdminPacotes from './pages/Admin/Pacotes';
import AdminClientes from './pages/Admin/Clientes';

export default function App() {
  return (
    <BrowserRouter basename="/HEADSHOT-PAINTBALL">
      <AuthProvider>
        <GaleriaProvider>
          <PacotesProvider>
            <HorariosProvider>
              <ClientesProvider>
                <AgendamentosProvider>
                  <PromocoesProvider>
                    <Toaster
                      position="top-right"
                      toastOptions={{
                        duration: 3500,
                        style: {
                          background: '#1a1a1a',
                          color: '#f1f5f9',
                          border: '1px solid #2a2a2a',
                          borderRadius: '12px',
                          fontSize: '14px',
                          fontFamily: 'Rajdhani, Inter, sans-serif',
                          fontWeight: '600',
                        },
                        success: {
                          iconTheme: { primary: '#22c55e', secondary: '#1a1a1a' },
                        },
                        error: {
                          iconTheme: { primary: '#dc2626', secondary: '#1a1a1a' },
                        },
                      }}
                    />
                    <Routes>
                      {/* ───── Client Routes ───── */}
                      <Route path="/" element={<Home />} />
                      <Route path="/agendamento" element={<Agendamento />} />
                      <Route path="/confirmacao" element={<Confirmacao />} />
                      <Route path="/meus-agendamentos" element={<MeusAgendamentos />} />
                      <Route path="/pacotes" element={<Pacotes />} />
                      <Route path="/galeria" element={<Galeria />} />
                      <Route path="/promocoes" element={<Promocoes />} />

                      {/* ───── Admin Routes ───── */}
                      <Route path="/admin/login" element={<Login />} />
                      <Route element={<ProtectedRoute />}>
                        <Route element={<AdminLayout />}>
                          <Route path="/admin" element={<Dashboard />} />
                          <Route path="/admin/agendamentos" element={<AdminAgendamentos />} />
                          <Route path="/admin/horarios" element={<AdminHorarios />} />
                          <Route path="/admin/banners" element={<AdminBanners />} />
                          <Route path="/admin/galeria" element={<AdminGaleria />} />
                          <Route path="/admin/promocoes" element={<AdminPromocoes />} />
                          <Route path="/admin/pacotes" element={<AdminPacotes />} />
                          <Route path="/admin/clientes" element={<AdminClientes />} />
                        </Route>
                      </Route>

                      {/* ───── Fallback ───── */}
                      <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                  </PromocoesProvider>
                </AgendamentosProvider>
              </ClientesProvider>
            </HorariosProvider>
          </PacotesProvider>
        </GaleriaProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
