import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { dbService } from './database';

export interface CustomerAccessRecord {
  id: string;
  email: string;
  transaction_id: string;
  product_id?: string;
  purchase_status: string;
  access_granted: boolean;
  created_at: string;
  updated_at: string;
}

export interface AccessCheckResult {
  hasAccess: boolean;
  email: string;
  record?: CustomerAccessRecord | null;
  message?: string;
}

class AuthService {
  /**
   * Envia um Magic Link do Supabase para o e-mail informado
   */
  async sendMagicLink(email: string): Promise<{ success: boolean; error?: string }> {
    const cleanEmail = email.toLowerCase().trim();

    if (!isSupabaseConfigured || !supabase) {
      return {
        success: false,
        error:
          'Supabase não configurado no ambiente. Configure VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no arquivo .env.',
      };
    }

    try {
      const redirectUrl = `${window.location.origin}/app`;
      const { error } = await supabase.auth.signInWithOtp({
        email: cleanEmail,
        options: {
          emailRedirectTo: redirectUrl,
        },
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Falha ao enviar Magic Link.' };
    }
  }

  /**
   * Verifica se o e-mail possui compra aprovada com access_granted = true
   * Realiza consulta direta no Supabase (RLS) e conta com fallback via backend (/api/check-access)
   */
  async checkCustomerAccess(email: string): Promise<AccessCheckResult> {
    const cleanEmail = email.toLowerCase().trim();

    if (!cleanEmail) {
      return { hasAccess: false, email: '', message: 'E-mail não informado.' };
    }

    // 1. Tenta verificar através do backend seguro (/api/check-access)
    try {
      const response = await fetch('/api/check-access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.configured) {
          if (data.access_granted) {
            dbService.setFullAccessGranted(true);
            return {
              hasAccess: true,
              email: cleanEmail,
              record: data.record,
              message: 'Compra aprovada confirmada pelo banco de dados.',
            };
          } else {
            return {
              hasAccess: false,
              email: cleanEmail,
              message: `Nenhuma compra aprovada encontrada para o e-mail "${cleanEmail}".`,
            };
          }
        }
      }
    } catch (e) {
      console.warn('[AuthService] Verificação via backend falhou, tentando cliente Supabase direto:', e);
    }

    // 2. Tenta verificar diretamente no Supabase se o cliente estiver autenticado
    if (supabase && isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('customers_access')
          .select('*')
          .eq('email', cleanEmail)
          .eq('access_granted', true)
          .order('created_at', { ascending: false })
          .limit(1);

        if (!error && data && data.length > 0) {
          dbService.setFullAccessGranted(true);
          return {
            hasAccess: true,
            email: cleanEmail,
            record: data[0] as CustomerAccessRecord,
            message: 'Acesso confirmado via Supabase.',
          };
        }
      } catch (err) {
        console.error('[AuthService] Erro ao consultar Supabase diretamente:', err);
      }
    }

    return {
      hasAccess: false,
      email: cleanEmail,
      message: `Nenhuma compra aprovada encontrada para o e-mail "${cleanEmail}". Verifique se este foi o mesmo e-mail usado no checkout da Hotmart.`,
    };
  }

  /**
   * Obtém a sessão atual do Supabase
   */
  async getCurrentSession() {
    if (!supabase || !isSupabaseConfigured) return null;
    try {
      const { data } = await supabase.auth.getSession();
      return data.session;
    } catch {
      return null;
    }
  }

  /**
   * Obtém o e-mail do usuário atualmente autenticado
   */
  async getCurrentUserEmail(): Promise<string | null> {
    if (!supabase || !isSupabaseConfigured) return null;
    try {
      const { data } = await supabase.auth.getUser();
      return data.user?.email?.toLowerCase().trim() || null;
    } catch {
      return null;
    }
  }

  /**
   * Encerra a sessão do usuário (Logout)
   */
  async signOut(): Promise<void> {
    if (supabase && isSupabaseConfigured) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.error('[AuthService] Erro no logout:', err);
      }
    }
    dbService.setFullAccessGranted(false);
  }

  /**
   * Escuta alterações de estado de autenticação (ex: Magic Link clicado)
   */
  onAuthStateChange(callback: (event: string, session: any) => void) {
    if (!supabase || !isSupabaseConfigured) {
      return { unsubscribe: () => {} };
    }
    const { data: subscription } = supabase.auth.onAuthStateChange(callback);
    return subscription.subscription;
  }
}

export const authService = new AuthService();
