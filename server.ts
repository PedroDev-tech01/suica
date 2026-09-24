import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para processar JSON com limite adequado para webhooks
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Inicialização segura do cliente Supabase Admin (usado exclusivamente no backend)
const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const hotmartHottokSecret = process.env.HOTMART_HOTTOK || process.env.HOTMART_WEBHOOK_SECRET || '';

const getSupabaseAdmin = () => {
  if (!supabaseUrl || !supabaseServiceKey) {
    return null;
  }
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
};

// ---------------------------------------------------------------------------
// 1. HEALTH CHECK & STATUS DA CONFIGURAÇÃO
// ---------------------------------------------------------------------------
app.get('/api/webhook-health', (req: Request, res: Response) => {
  const isSupabaseConfigured = Boolean(supabaseUrl && supabaseServiceKey);
  const isHottokConfigured = Boolean(hotmartHottokSecret);

  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    webhook_url: '/api/hotmart-webhook',
    isSupabaseConfigured,
    isHottokConfigured,
    info: 'Endpoint oficial para recebimento de webhooks da Hotmart',
  });
});

// ---------------------------------------------------------------------------
// 2. ENDPOINT DO WEBHOOK DA HOTMART
// ---------------------------------------------------------------------------
app.post('/api/hotmart-webhook', async (req: Request, res: Response): Promise<any> => {
  try {
    console.log('[Hotmart Webhook] Requisição recebida em /api/hotmart-webhook');

    // A. Validação de Segurança do Token X-HOTMART-HOTTOK
    const incomingHottokHeader = (req.headers['x-hotmart-hottok'] as string) || '';
    const incomingHottokBody = req.body?.hottok || req.query?.hottok || '';
    const providedHottok = incomingHottokHeader || incomingHottokBody;

    if (hotmartHottokSecret) {
      if (!providedHottok || providedHottok !== hotmartHottokSecret) {
        console.warn('[Hotmart Webhook] Rejeitado: X-HOTMART-HOTTOK inválido ou ausente.');
        return res.status(401).json({
          error: 'Unauthorized: Token de segurança da Hotmart (X-HOTMART-HOTTOK) inválido.',
        });
      }
      console.log('[Hotmart Webhook] Token de segurança validado com sucesso.');
    } else {
      console.warn(
        '[Hotmart Webhook] AVISO: HOTMART_HOTTOK não configurado em .env. Recomenda-se configurar para produção.'
      );
    }

    const payload = req.body || {};

    // B. Extração dos dados (compatível com Hotmart v1 e v2)
    const event = (payload.event || payload.status || 'PURCHASE_APPROVED').toUpperCase();

    // Extrai o e-mail do comprador
    const buyerEmail = (
      payload.data?.buyer?.email ||
      payload.buyer?.email ||
      payload.email ||
      payload.data?.buyerEmail ||
      ''
    )
      .toLowerCase()
      .trim();

    // Extrai o ID da transação
    const transactionId =
      payload.data?.purchase?.transaction ||
      payload.purchase?.transaction ||
      payload.transaction ||
      payload.data?.transaction ||
      `HP-${Date.now()}`;

    // Extrai o ID do produto
    const productId =
      payload.data?.product?.id?.toString() ||
      payload.product?.id?.toString() ||
      payload.product_id?.toString() ||
      'swiss-optimizer-2026';

    if (!buyerEmail) {
      console.error('[Hotmart Webhook] E-mail do comprador não encontrado no payload recebido:', payload);
      return res.status(400).json({ error: 'E-mail do comprador não fornecido.' });
    }

    console.log(`[Hotmart Webhook] Evento: ${event} | Comprador: ${buyerEmail} | Transação: ${transactionId}`);

    // C. Determina liberação ou revogação de acesso
    // Eventos de liberação: PURCHASE_APPROVED, APPROVED, COMPLETE
    // Eventos de revogação: PURCHASE_REFUNDED, PURCHASE_CHARGEBACK, PURCHASE_CANCELED
    const isApproval = ['PURCHASE_APPROVED', 'APPROVED', 'COMPLETE'].includes(event);
    const isRevocation = [
      'PURCHASE_REFUNDED',
      'REFUNDED',
      'PURCHASE_CHARGEBACK',
      'CHARGEBACK',
      'PURCHASE_CANCELED',
      'CANCELED',
    ].includes(event);

    let accessGranted = false;
    let purchaseStatus = event;

    if (isApproval) {
      accessGranted = true;
      purchaseStatus = 'APPROVED';
    } else if (isRevocation) {
      accessGranted = false;
      purchaseStatus = event.replace('PURCHASE_', '');
    } else {
      // Outros eventos (ex: PURCHASE_OUT_OF_SHOPPING_CART, etc.)
      console.log(`[Hotmart Webhook] Evento informativo ignorado para liberação: ${event}`);
      return res.status(200).json({ success: true, message: `Evento ${event} recebido sem alteração de acesso.` });
    }

    // D. Persistência no Supabase (se configurado)
    const supabaseAdmin = getSupabaseAdmin();
    if (supabaseAdmin) {
      const { data, error } = await supabaseAdmin
        .from('customers_access')
        .upsert(
          {
            email: buyerEmail,
            transaction_id: transactionId,
            product_id: productId,
            purchase_status: purchaseStatus,
            access_granted: accessGranted,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'transaction_id' }
        )
        .select();

      if (error) {
        console.error('[Hotmart Webhook] Erro ao gravar no Supabase:', error);
        return res.status(500).json({ error: error.message });
      }

      console.log(`[Hotmart Webhook] Gravado com sucesso no Supabase para ${buyerEmail}. Acesso: ${accessGranted}`);
    } else {
      console.warn(
        '[Hotmart Webhook] Supabase não configurado via variáveis de ambiente. Simulação de sucesso registrada em log.'
      );
    }

    return res.status(200).json({
      success: true,
      event,
      email: buyerEmail,
      transaction_id: transactionId,
      access_granted: accessGranted,
      purchase_status: purchaseStatus,
    });
  } catch (error: any) {
    console.error('[Hotmart Webhook] Erro inesperado:', error);
    return res.status(500).json({ error: error.message || 'Erro interno ao processar webhook.' });
  }
});

// ---------------------------------------------------------------------------
// 3. VERIFICAÇÃO DE ACESSO DO USUÁRIO
// ---------------------------------------------------------------------------
app.post('/api/check-access', async (req: Request, res: Response): Promise<any> => {
  try {
    const email = (req.body?.email || '').toLowerCase().trim();

    if (!email) {
      return res.status(400).json({ error: 'E-mail não fornecido.' });
    }

    const supabaseAdmin = getSupabaseAdmin();
    if (!supabaseAdmin) {
      // Se o Supabase ainda não estiver configurado pelo usuário, retorna status informativo
      return res.json({
        configured: false,
        access_granted: false,
        message: 'Supabase ainda não configurado no servidor.',
      });
    }

    const { data, error } = await supabaseAdmin
      .from('customers_access')
      .select('*')
      .eq('email', email)
      .eq('access_granted', true)
      .order('created_at', { ascending: false })
      .limit(1);

    if (error) {
      console.error('[Check Access] Erro na consulta do Supabase:', error);
      return res.status(500).json({ error: error.message });
    }

    const hasAccess = Boolean(data && data.length > 0);
    return res.json({
      configured: true,
      email,
      access_granted: hasAccess,
      record: hasAccess ? data[0] : null,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// ---------------------------------------------------------------------------
// 4. CONFIGURAÇÃO DO SERVIDOR VITE (DEV) OU ESTÁTICO (PROD)
// ---------------------------------------------------------------------------
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    // Modo Desenvolvimento: montagem dos middlewares do Vite
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Modo Produção: serve pasta dist
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`[Servidor Full-Stack] Rodando na porta ${PORT}`);
    console.log(`[Webhook Hotmart] Ativo em: http://localhost:${PORT}/api/hotmart-webhook`);
    console.log(`[Health Check] Ativo em: http://localhost:${PORT}/api/webhook-health`);
  });
}

startServer();
