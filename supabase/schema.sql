-- ==============================================================================
-- SCHEMA SUPABASE: CONTROLE DE ACESSO HOTMART (customers_access)
-- ==============================================================================
-- Execute este script no SQL Editor do painel do Supabase (https://app.supabase.com)
-- Projeto -> SQL Editor -> New Query -> Cole este script -> Run

-- 1. Cria a tabela customers_access
CREATE TABLE IF NOT EXISTS public.customers_access (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL,
    transaction_id TEXT UNIQUE,
    product_id TEXT,
    purchase_status TEXT NOT NULL DEFAULT 'APPROVED',
    access_granted BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Cria índices para busca ultra-rápida por e-mail e por ID da transação Hotmart
CREATE INDEX IF NOT EXISTS idx_customers_access_email ON public.customers_access(LOWER(email));
CREATE INDEX IF NOT EXISTS idx_customers_access_transaction ON public.customers_access(transaction_id);

-- 3. Função para atualizar automaticamente o campo updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_customers_access_updated_at ON public.customers_access;
CREATE TRIGGER trigger_customers_access_updated_at
BEFORE UPDATE ON public.customers_access
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- 4. Habilita Row Level Security (RLS) para proteger os dados contra acesso indevido
ALTER TABLE public.customers_access ENABLE ROW LEVEL SECURITY;

-- 5. POLÍTICA DE LEITURA (SELECT):
-- O usuário autenticado (via Magic Link do Supabase) só pode consultar o registro do PRÓPRIO e-mail dele.
DROP POLICY IF EXISTS "Users can view their own customer access" ON public.customers_access;
CREATE POLICY "Users can view their own customer access"
ON public.customers_access
FOR SELECT
TO authenticated
USING (LOWER(email) = LOWER(auth.jwt() ->> 'email'));

-- 6. POLÍTICA TOTAL PARA SERVICE_ROLE (Backend / Webhook):
-- Apenas o backend (que usa a chave secreta SUPABASE_SERVICE_ROLE_KEY) tem permissão de inserir,
-- atualizar e revogar acessos via Webhook da Hotmart. O navegador NÃO tem essa chave.
DROP POLICY IF EXISTS "Service role full access" ON public.customers_access;
CREATE POLICY "Service role full access"
ON public.customers_access
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- ==============================================================================
-- (OPCIONAL) Inserção de teste para você verificar seu próprio e-mail imediatamente:
-- Descomente a linha abaixo e troque pelo seu e-mail caso queira testar agora mesmo:
-- INSERT INTO public.customers_access (email, transaction_id, purchase_status, access_granted)
-- VALUES ('ph8170524@gmail.com', 'HP_MANUAL_TEST_001', 'APPROVED', true)
-- ON CONFLICT (transaction_id) DO UPDATE SET access_granted = true;
-- ==============================================================================
