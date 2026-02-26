# ACEBRAZ - Clube de Benefícios (MVP)

Sistema profissional de gestão e validação de benefícios para a Associação Comercial de Wenceslau Braz, focado em **associações comerciais** e **fortalecimento do comércio local**.

## ✨ Destaques do MVP

- **Identidade Visual Premium**: Interface moderna com cores da ACEBRAZ (`#1c8f48` e `#fbf32f`), glassmorphism e tipografia refinada.
- **Segurança Bancária**: Criptografia AES-256-GCM para CPFs e Argon2id para PINs.
- **Validação Anti-Fraude**: QR Codes dinâmicos com expiração de 2 minutos e proteção contra replay.
- **Conformidade LGPD**: Gestão de dados pessoais com anonimização automática em caso de exclusão.
- **Catalogação Inteligente**: Vitrine de parceiros com busca e visualização de regras de desconto.

## 🤝 Funil de Vendas e Onboarding (Workflow)

A ACEBRAZ desenhou um funil de adesão para garantir previsibilidade e gestão centralizada na aquisição de novos parceiros e beneficiários:

1. **Biblioteca de Pitch (`/admin/vendas`)**: Textos persuasivos e slides institucionais (Modo Fullscreen) prontos para os corretores/vendedores da Associação usarem com _Leads_.
2. **Workflow de Adesão (`/admin/workflow-associados`)**: Acompanhamento do pipeline desde "Lead", passando por "Negociação", até o repasse das regras de "Desconto para Associados, Funcionários e Dependentes".
3. **Cadastro em Lote (`/admin/formularios-cadastro`)**: Após o fechamento, a ACEBRAZ permite à empresa fornecer um CSV simples com seus funcionários/dependentes, cadastrando centenas de CPFs de uma vez, reduzindo o tempo de onboarding.
4. **Revalidações (`/admin/revalidacoes`)**: Dashboard que avisa a Associação quais beneficiários vencerão em 30 dias para realização de renovação ou inativação em lote.

## 🚀 Tecnologias

- **Frontend**: Next.js 14 (App Router, Tailwind CSS, Lucide Icons)
- **Backend**: NestJS (TypeScript, Swagger, BullMQ)
- **Database**: PostgreSQL + Prisma ORM
- **Segurança**: JWT, CryptoJS, Argon2id (Hashing de PIN)

## 📦 Estrutura do Monorepo

- `apps/api`: Servidor NestJS (Backend)
- `apps/web`: Aplicação Next.js (Frontend)
- `packages/db`: Camada de banco de dados (Prisma)
- `packages/common`: Utilitários de criptografia e segurança

## 🛠️ Instalação e Execução

### 1. Requisitos
- Node.js 18+
- PostgreSQL local ou remoto

### 2. Configuração Rápida
Na raiz do projeto:
```bash
npm install
npm run setup # Comando para rodar migrates e seeds (se configurado)
npm run dev
```

O backend rodará em `http://localhost:3001`
O frontend rodará em `http://localhost:3000`

## 📱 Acessos de Teste (MVP Seed)

- **Admin Web**: `admin@acebraz.com.br` / `adminpassword`
- **Área do Beneficiário**: CPF `111.222.333-44` / PIN `1234`
- **Link do Balcão (Parceiro)**: `/balcao?token=demo_token_partner`

---
Desenvolvido para fortalecer o assossiativismo e gerar valor real para Wenceslau Braz.
