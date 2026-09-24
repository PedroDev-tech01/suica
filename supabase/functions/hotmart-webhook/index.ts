// ==============================================================================
// SUPABASE EDGE FUNCTION: WEBHOOK HOTMART
// ==============================================================================
// Caso prefira rodar o webhook como Edge Function no Supabase em vez do Express,
// você pode implantar esta pasta com:
// supabase functions deploy hotmart-webhook --no-verify-jwt
//
// Variáveis de ambiente necessárias na Edge Function (definir em Supabase Dashboard -> Edge Functions -> Secrets):
// - HOTMART_HOTTOK (o token de segurança configurado no Webhook da Hotmart)
// - SUPABASE_SERVICE_ROLE_KEY (sua chave secreta do Supabase)
// - SUPABASE_URL (a URL do seu projeto Supabase)
// ==============================================================================

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-hotmart-hottok",
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const expectedHottok = Deno.env.get("HOTMART_HOTTOK") || Deno.env.get("HOTMART_WEBHOOK_SECRET");
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error("Erro: SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY não configuradas.");
      return new Response(
        JSON.stringify({ error: "Configuração do servidor incompleta." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 1. Validação do X-HOTMART-HOTTOK
    const incomingHottokHeader = req.headers.get("x-hotmart-hottok");
    const body = await req.json().catch(() => ({}));
    const incomingHottokBody = body.hottok;
    const providedToken = incomingHottokHeader || incomingHottokBody;

    if (expectedHottok && providedToken !== expectedHottok) {
      console.warn("Webhook rejeitado: X-HOTMART-HOTTOK inválido.");
      return new Response(
        JSON.stringify({ error: "Token de segurança da Hotmart inválido." }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 2. Extração dos dados do webhook (compatível com formato 1.0 e 2.0 da Hotmart)
    const event = body.event || body.status || "PURCHASE_APPROVED";
    const buyerEmail = (
      body.data?.buyer?.email ||
      body.buyer?.email ||
      body.email ||
      ""
    ).toLowerCase().trim();

    const transactionId =
      body.data?.purchase?.transaction ||
      body.purchase?.transaction ||
      body.transaction ||
      `TRANS-${Date.now()}`;

    const productId =
      body.data?.product?.id?.toString() ||
      body.product?.id?.toString() ||
      body.product_id?.toString() ||
      null;

    if (!buyerEmail) {
      return new Response(
        JSON.stringify({ error: "E-mail do comprador não encontrado no payload." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 3. Inicialização do Supabase com Service Role Key (acesso administrativo seguro)
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false },
    });

    // 4. Tratamento dos eventos
    // PURCHASE_APPROVED: libera acesso
    // PURCHASE_REFUNDED, PURCHASE_CHARGEBACK, PURCHASE_CANCELED: revoga acesso
    const isApproved = event === "PURCHASE_APPROVED";
    const isRevocation = [
      "PURCHASE_REFUNDED",
      "PURCHASE_CHARGEBACK",
      "PURCHASE_CANCELED",
      "REFUNDED",
      "CHARGEBACK",
    ].includes(event);

    let accessGranted = true;
    let statusText = "APPROVED";

    if (isRevocation) {
      accessGranted = false;
      statusText = event.replace("PURCHASE_", "");
    }

    // 5. Salva na tabela customers_access
    const { data, error } = await supabaseAdmin
      .from("customers_access")
      .upsert(
        {
          email: buyerEmail,
          transaction_id: transactionId,
          product_id: productId,
          purchase_status: statusText,
          access_granted: accessGranted,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "transaction_id" }
      )
      .select();

    if (error) {
      console.error("Erro ao salvar no Supabase:", error);
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Sucesso: Acesso atualizado para ${buyerEmail} (Status: ${statusText}, Acesso: ${accessGranted})`);

    return new Response(
      JSON.stringify({
        success: true,
        email: buyerEmail,
        status: statusText,
        access_granted: accessGranted,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    console.error("Erro interno no processamento do webhook:", err);
    return new Response(
      JSON.stringify({ error: err.message || "Erro interno do servidor." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
