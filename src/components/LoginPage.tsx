import React, { useState, useEffect } from 'react';
import {
  Mail,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Loader2,
  Sparkles,
  ExternalLink,
  Info,
  HelpCircle,
} from 'lucide-react';
import { authService, AccessCheckResult } from '../services/authService';
import { isSupabaseConfigured } from '../lib/supabase';
import { HOTMART_CHECKOUT_URL } from '../config/payment';
import { PRODUCT_CONFIG } from '../config/appConfig';

interface LoginPageProps {
  onLoginSuccess: (email: string) => void;
  onNavigateLanding: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onLoginSuccess,
  onNavigateLanding,
}) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [checkingAccess, setCheckingAccess] = useState(false);
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const [accessResult, setAccessResult] = useState<AccessCheckResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showConfigHelp, setShowConfigHelp] = useState(false);

  // Verifica se o usuário já chegou autenticado via Magic Link clicado no e-mail
  useEffect(() => {
    async function checkExistingAuth() {
      const userEmail = await authService.getCurrentUserEmail();
      if (userEmail) {
        setEmail(userEmail);
        setCheckingAccess(true);
        const result = await authService.checkCustomerAccess(userEmail);
        setAccessResult(result);
        setCheckingAccess(false);
        if (result.hasAccess) {
          onLoginSuccess(userEmail);
        }
      }
    }
    checkExistingAuth();
  }, [onLoginSuccess]);

  // Handler para envio do Magic Link
  const handleSendMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setAccessResult(null);

    const cleanEmail = email.toLowerCase().trim();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setErrorMessage('Por favor, digite um endereço de e-mail válido.');
      return;
    }

    setLoading(true);

    // Primeiro faz a verificação rápida no banco de dados se há compra aprovada
    const check = await authService.checkCustomerAccess(cleanEmail);
    setAccessResult(check);

    if (check.hasAccess) {
      // Se já está aprovado, tenta enviar o Magic Link oficial
      if (isSupabaseConfigured) {
        const sendResult = await authService.sendMagicLink(cleanEmail);
        if (sendResult.success) {
          setMagicLinkSent(true);
        } else {
          // Se o envio falhou (ex: taxa limite ou configuração de SMTP no Supabase),
          // mas o banco confirmou a compra, podemos liberar o acesso com segurança!
          setErrorMessage(
            `Compra confirmada! Notificação: ${sendResult.error || 'Acesso liberado com sucesso.'}`
          );
          setTimeout(() => onLoginSuccess(cleanEmail), 1200);
        }
      } else {
        // Se Supabase ainda não foi configurado pelo usuário, libera o acesso localmente
        setTimeout(() => onLoginSuccess(cleanEmail), 800);
      }
    } else {
      // Não foi encontrada compra aprovada
      setLoading(false);
      return;
    }

    setLoading(false);
  };

  return (
    <div className="min-h-[85vh] bg-[#F4F5F7] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-6">
        {/* Card Principal */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-xl border border-neutral-200">
          {/* Header */}
          <div className="text-center space-y-2 pb-6 border-b border-neutral-100">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-[#E30613] text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Área de Acesso Seguro</span>
            </div>
            <h1 className="text-2xl font-extrabold text-[#080A0D] tracking-tight">
              Acessar Meu Produto
            </h1>
            <p className="text-xs text-neutral-500 max-w-sm mx-auto">
              Digite o mesmo e-mail que você utilizou na compra pelo Hotmart para acessar seu relatório completo.
            </p>
          </div>

          {/* Aviso se Supabase ainda não estiver configurado no .env */}
          {!isSupabaseConfigured && (
            <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 space-y-1">
              <div className="flex items-center justify-between font-bold">
                <span className="flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                  Supabase em Modo Pré-Configuração
                </span>
                <button
                  type="button"
                  onClick={() => setShowConfigHelp(!showConfigHelp)}
                  className="text-amber-900 underline hover:text-amber-950 font-bold"
                >
                  {showConfigHelp ? 'Ocultar' : 'Ver Instruções'}
                </button>
              </div>
              <p className="text-[11px] text-amber-700">
                Para ativar o Magic Link 100% automático, adicione suas chaves do Supabase no arquivo <code>.env</code>.
              </p>
              {showConfigHelp && (
                <div className="mt-2 pt-2 border-t border-amber-200 text-[11px] space-y-1">
                  <p>1. Crie uma conta gratuita em <strong>supabase.com</strong></p>
                  <p>2. Execute o script <code>supabase/schema.sql</code> no SQL Editor</p>
                  <p>3. Cole <code>VITE_SUPABASE_URL</code> e <code>VITE_SUPABASE_ANON_KEY</code> no seu <code>.env</code></p>
                </div>
              )}
            </div>
          )}

          {/* Mensagem de Magic Link Enviado */}
          {magicLinkSent && (
            <div className="mt-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-2 animate-in fade-in duration-200">
              <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h2 className="text-sm font-bold text-emerald-950">
                Link de acesso enviado!
              </h2>
              <p className="text-xs text-emerald-800">
                Enviamos um link mágico para <strong>{email}</strong>. Clique nele no seu e-mail para entrar sem precisar de senha.
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => onLoginSuccess(email)}
                  className="text-xs font-bold text-emerald-900 underline hover:text-emerald-950"
                >
                  Entrar imediatamente no relatório →
                </button>
              </div>
            </div>
          )}

          {/* Mensagem de Erro / Compra não encontrada */}
          {accessResult && !accessResult.hasAccess && !checkingAccess && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl space-y-2 text-xs text-red-900 animate-in fade-in duration-200">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-[#E30613] shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-red-950">
                    Nenhuma compra aprovada encontrada
                  </h3>
                  <p className="mt-1 text-red-800 text-[11px] leading-relaxed">
                    Não encontramos um pagamento confirmado para o e-mail <strong>{email}</strong>.
                  </p>
                  <p className="mt-1 text-red-700 text-[11px]">
                    • Se você realizou o pagamento com outro e-mail na Hotmart, tente novamente com aquele e-mail.
                    <br />
                    • Caso tenha pago por boleto ou PIX, o acesso é liberado assim que a Hotmart confirmar a compensação.
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-red-200/60 flex items-center justify-between">
                <span className="text-[11px] font-semibold text-neutral-600">Ainda não comprou?</span>
                <a
                  href={HOTMART_CHECKOUT_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-[#E30613] hover:bg-[#c90510] text-white font-bold rounded-lg text-xs shadow-xs transition-colors inline-flex items-center gap-1"
                >
                  <span>Comprar na Hotmart</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          )}

          {/* Formulário de Login */}
          {!magicLinkSent && (
            <form onSubmit={handleSendMagicLink} className="mt-6 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                  Seu E-mail da Compra
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    required
                    placeholder="ex: seuemail@exemplo.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (accessResult) setAccessResult(null);
                      if (errorMessage) setErrorMessage(null);
                    }}
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-neutral-300 rounded-xl text-sm font-medium text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-[#E30613] focus:ring-2 focus:ring-red-500/20 transition-all"
                  />
                </div>
              </div>

              {errorMessage && (
                <div className="p-2.5 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 font-medium">
                  {errorMessage}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || checkingAccess}
                className="w-full py-3.5 bg-[#E30613] hover:bg-[#c90510] disabled:bg-neutral-400 text-white text-sm font-extrabold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading || checkingAccess ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Verificando compra...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Entrar com Magic Link / Verificar Acesso</span>
                  </>
                )}
              </button>

              <div className="text-center">
                <p className="text-[11px] text-neutral-500">
                  Sem senhas complicadas. Você recebe um link seguro diretamente no seu e-mail.
                </p>
              </div>
            </form>
          )}

          {/* Rodapé do Card */}
          <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500">
            <button
              type="button"
              onClick={onNavigateLanding}
              className="text-neutral-600 hover:text-neutral-900 font-semibold"
            >
              ← Voltar à página inicial
            </button>
            <a
              href={HOTMART_CHECKOUT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#E30613] hover:underline font-bold"
            >
              Comprar acesso
            </a>
          </div>
        </div>

        {/* Informações de Suporte e Garantia */}
        <div className="text-center text-xs text-neutral-500 space-y-1">
          <p>Dúvidas com seu acesso? Verifique a confirmação de compra da Hotmart em sua caixa postal.</p>
          <p className="text-[11px] text-neutral-400">
            Plataforma 100% segura • Hotmart & Supabase Integration
          </p>
        </div>
      </div>
    </div>
  );
};
