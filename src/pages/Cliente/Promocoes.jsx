import { usePromocoes } from '../../contexts/PromocoesContext';
import { ClientNavbar } from '../../components/client/ClientNavbar';
import { ClientFooter } from '../../components/client/ClientFooter';
import { formatCurrency } from '../../utils/formatters';
import { Link } from 'react-router-dom';
import { FiTag, FiCalendar, FiCheck, FiClock } from 'react-icons/fi';

export default function Promocoes() {
  const { getPromocoesAtivas } = usePromocoes();
  const promocoes = getPromocoesAtivas();

  return (
    <div className="min-h-screen bg-[#080808]">
      <ClientNavbar />
      <div className="pt-24 pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#ec4899]/10 border border-[#ec4899]/30 rounded-full mb-4">
              <FiTag size={14} className="text-[#ec4899]" />
              <span className="text-sm text-[#ec4899] font-semibold tracking-wider">🔥 PROMOÇÕES</span>
            </div>
            <h1 className="font-display text-[clamp(2.5rem,8vw,4rem)] text-white tracking-wider mb-4 leading-none">
              OFERTAS <span className="text-gradient-pink">ESPECIAIS</span>
            </h1>
            <p className="text-[#94a3b8] max-w-xl mx-auto text-lg">Aproveite nossas promoções exclusivas por tempo limitado!</p>
          </div>

          {promocoes.length === 0 ? (
            <div className="text-center py-20 text-[#64748b]">
              <FiTag size={48} className="mx-auto mb-4 opacity-30" />
              <p className="text-xl font-semibold text-white mb-2">Sem promoções no momento</p>
              <p>Fique ligado, em breve novas ofertas!</p>
              <Link to="/pacotes" className="inline-block mt-6 px-6 py-3 bg-[#e85c0d] text-white font-bold rounded-xl hover:bg-[#c44d0b] transition-all">
                Ver Pacotes Regulares
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {promocoes.map((promo) => (
                <div
                  key={promo.id}
                  className="bg-[#111111] border rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.01] group"
                  style={{ borderColor: promo.cor ? promo.cor + '40' : '#1e1e1e' }}
                >
                  {/* Header */}
                  <div
                    className="p-8 relative overflow-hidden"
                    style={{ background: `linear-gradient(135deg, ${promo.cor || '#ec4899'}20, transparent)` }}
                  >
                    {promo.imagem && (
                      <img src={promo.imagem} alt={promo.titulo} className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:opacity-30 transition-opacity" />
                    )}
                    <div className="relative">
                      <h2 className="font-display text-3xl sm:text-4xl text-white tracking-wider mb-2">{promo.titulo}</h2>
                      <p className="font-bold text-lg" style={{ color: promo.cor || '#ec4899' }}>{promo.pacote}</p>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-5">
                      <div>
                        {promo.precoOriginal && (
                          <p className="text-[#64748b] line-through text-sm">{formatCurrency(promo.precoOriginal)}</p>
                        )}
                        <span className="font-display text-5xl" style={{ color: promo.cor || '#ec4899' }}>
                          {formatCurrency(promo.preco)}
                        </span>
                        <p className="text-xs text-[#64748b] mt-1">por pessoa</p>
                      </div>
                      <div className="flex items-center gap-2 px-3 py-2 bg-[#1a1a1a] rounded-xl border border-[#2a2a2a]">
                        <FiClock size={14} className="text-[#f59e0b]" />
                        <div>
                          <p className="text-[9px] text-[#64748b] uppercase tracking-wider">Válido até</p>
                          <p className="text-sm font-bold text-white">
                            {new Date(promo.validoAte + 'T12:00:00').toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                      </div>
                    </div>

                    <p className="text-[#94a3b8] mb-5">{promo.descricao}</p>

                    {promo.destaque?.length > 0 && (
                      <ul className="space-y-2 mb-6">
                        {promo.destaque.map((d, i) => (
                          <li key={i} className="flex items-center gap-3 text-sm text-[#94a3b8]">
                            <span className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: (promo.cor || '#ec4899') + '20', border: `1px solid ${promo.cor || '#ec4899'}40` }}>
                              <FiCheck size={11} style={{ color: promo.cor || '#ec4899' }} />
                            </span>
                            {d}
                          </li>
                        ))}
                      </ul>
                    )}

                    <Link
                      to="/agendamento"
                      className="flex items-center justify-center gap-2 w-full py-4 rounded-xl font-bold text-white text-lg transition-all duration-200 hover:opacity-90 hover:scale-[1.01]"
                      style={{ background: promo.cor || '#ec4899', boxShadow: `0 0 30px ${promo.cor || '#ec4899'}40` }}
                    >
                      <FiCalendar size={18} />
                      Aproveitar Esta Promoção
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <ClientFooter />
    </div>
  );
}
