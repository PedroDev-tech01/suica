# Manual Passo a Passo: Integração Hotmart + Supabase + Webhook

Todo o código de backend, banco de dados, autenticação por **Magic Link** e proteção de rotas já foi **totalmente implementado e configurado no seu projeto**.

Abaixo estão exatamente os passos simples de configuração externa que você precisa realizar nos painéis do **Supabase** e da **Hotmart**.

---

## 1. Configuração no Supabase (Banco de Dados e Magic Link)

### Passo 1.1: Criar o Projeto e Rodar o SQL
1. Acesse [supabase.com](https://supabase.com) e entre na sua conta (ou crie uma gratuita).
2. Clique em **"New Project"**, dê um nome (ex: `Hotmart App`) e defina uma senha para o banco de dados.
3. No menu lateral esquerdo, clique no ícone **SQL Editor** (ícone de terminal `>_`).
4. Clique em **"New Query"**.
5. Abra o arquivo `supabase/schema.sql` deste projeto, copie todo o conteúdo e cole no SQL Editor do Supabase.
6. Clique no botão verde **"Run"** (no canto inferior direito do editor).
   * Isso criará a tabela `customers_access` com todas as proteções de segurança (Row Level Security - RLS) e índices otimizados.

### Passo 1.2: Copiar as Chaves de Conexão
1. No menu lateral do Supabase, clique na engrenagem **Project Settings** (no rodapé à esquerda).
2. Clique no menu **API**.
3. Copie os seguintes valores:
   * **Project URL**: Cole no `.env` em `VITE_SUPABASE_URL=...`
   * **anon / public key**: Cole no `.env` em `VITE_SUPABASE_ANON_KEY=...`
   * **service_role secret key**: (Clique em *Reveal* para mostrar): Cole no `.env` em `SUPABASE_SERVICE_ROLE_KEY=...` *(atenção: esta chave fica apenas no backend, nunca vai para o navegador do cliente)*.

### Passo 1.3: Configurar URL de Redirecionamento do Magic Link
1. No menu lateral do Supabase, clique em **Authentication** -> **URL Configuration**.
2. No campo **Site URL**, coloque a URL do seu site (ex: `https://seu-dominio.com` ou a URL do Cloud Run).
3. No campo **Redirect URLs**, clique em **"Add URL"** e adicione:
   * `https://seu-dominio.com/app`
   * `https://seu-dominio.com/login`
   *(se estiver testando localmente, adicione também `http://localhost:3000/app`)*
4. Clique em **Save**.

---

## 2. Configuração na Hotmart (Webhook)

### Passo 2.1: Cadastrar a URL do Webhook
1. Entre na sua conta da [Hotmart](https://app.hotmart.com).
2. No menu lateral esquerdo, clique em **Ferramentas** (ou Ferramentas de Produtor).
3. Procure por **Webhook (API e Notificações)** e clique nele.
4. Clique no botão **"Cadastrar Webhook"** ou **"Criar Configuração"**.
5. Preencha os campos:
   * **Nome da Configuração:** Ex: `Liberação de Acesso Automático`
   * **URL para envio:** `https://sua-url-do-app.com/api/hotmart-webhook`
   * **Versão:** Selecione a versão mais recente disponível (v2.0 ou 1.0, o código suporta ambas automaticamente).
6. Na aba de **Eventos**, selecione:
   *  **Compra Aprovada** (`PURCHASE_APPROVED`)
   *  **Compra Reembolsada** (`PURCHASE_REFUNDED`)
   *  **Chargeback** (`PURCHASE_CHARGEBACK`)
   *  **Compra Cancelada** (`PURCHASE_CANCELED`)
7. Clique em **Salvar**.

### Passo 2.2: Configurar o Token de Segurança (Hottok)
1. Na mesma tela de Webhook da Hotmart, clique na aba **"Configurações"** ou **"Autenticação"**.
2. Localize o seu código **Hottok** (Token de Verificação).
3. Copie esse código e adicione no arquivo `.env` do seu projeto:
   ```env
   HOTMART_HOTTOK="seu_codigo_hottok_aqui"
   ```
4. Nosso backend em `server.ts` valida automaticamente o cabeçalho `X-HOTMART-HOTTOK` enviado pela Hotmart em cada requisição. Se o token for diferente, a requisição é rejeitada com código 401 por segurança.

---

## 3. Como Funciona para o Seu Cliente

1. **Compra:** O cliente entra na sua landing page, clica no botão de compra e é direcionado para a Hotmart.
2. **Webhook em Milissegundos:** Assim que o pagamento é aprovado, a Hotmart dispara o webhook para `/api/hotmart-webhook`. O servidor valida a procedência e salva na tabela `customers_access`:
   * `email`: email do comprador
   * `purchase_status`: 'APPROVED'
   * `access_granted`: true
3. **Login Sem Senha (Magic Link):**
   * O cliente acessa `/login` (ou clica em "Área de Membros").
   * Informa o mesmo e-mail usado na compra.
   * O sistema consulta o banco de dados. Se confirmado, envia um link seguro para o e-mail dele.
   * Ao clicar no link, o cliente é autenticado e redirecionado para a página protegida do produto (`/app`), liberando 100% dos recursos!
4. **Tratamento de Reembolso / Chargeback:**
   * Se o cliente pedir reembolso ou chargeback, a Hotmart envia `PURCHASE_REFUNDED` ou `PURCHASE_CHARGEBACK`.
   * O backend atualiza imediatamente `access_granted = false` no banco de dados, revogando o acesso do usuário.
