-- CreateTable
CREATE TABLE "Admin" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL DEFAULT 'acebraz',
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Parceiro" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL DEFAULT 'acebraz',
    "cnpj" TEXT NOT NULL,
    "nomeFantasia" TEXT NOT NULL,
    "categoria" TEXT NOT NULL,
    "subcategoria" TEXT,
    "endereco" TEXT,
    "contato" TEXT,
    "logoUrl" TEXT,
    "regras" TEXT,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "tokenValidacao" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Parceiro_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Beneficiario" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL DEFAULT 'acebraz',
    "nome" TEXT NOT NULL,
    "cpfCrypt" TEXT NOT NULL,
    "cpfHmac" TEXT NOT NULL,
    "pinHash" TEXT NOT NULL,
    "tipoVinculo" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ATIVO',
    "validade" TIMESTAMP(3),
    "titularId" TEXT,
    "tentativasPin" INTEGER NOT NULL DEFAULT 0,
    "bloqueadoAte" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Beneficiario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Validacao" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL DEFAULT 'acebraz',
    "parceiroId" TEXT NOT NULL,
    "beneficiarioId" TEXT NOT NULL,
    "metodo" TEXT NOT NULL,
    "resultado" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Validacao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Nonce" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL DEFAULT 'acebraz',
    "nonce" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "used" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Nonce_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");

-- CreateIndex
CREATE INDEX "Admin_tenantId_idx" ON "Admin"("tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "Parceiro_cnpj_key" ON "Parceiro"("cnpj");

-- CreateIndex
CREATE UNIQUE INDEX "Parceiro_tokenValidacao_key" ON "Parceiro"("tokenValidacao");

-- CreateIndex
CREATE INDEX "Parceiro_tenantId_idx" ON "Parceiro"("tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "Beneficiario_cpfHmac_key" ON "Beneficiario"("cpfHmac");

-- CreateIndex
CREATE INDEX "Beneficiario_tenantId_cpfHmac_idx" ON "Beneficiario"("tenantId", "cpfHmac");

-- CreateIndex
CREATE INDEX "Validacao_tenantId_parceiroId_beneficiarioId_timestamp_idx" ON "Validacao"("tenantId", "parceiroId", "beneficiarioId", "timestamp");

-- CreateIndex
CREATE UNIQUE INDEX "Nonce_nonce_key" ON "Nonce"("nonce");

-- CreateIndex
CREATE INDEX "Nonce_tenantId_expiresAt_idx" ON "Nonce"("tenantId", "expiresAt");

-- AddForeignKey
ALTER TABLE "Beneficiario" ADD CONSTRAINT "Beneficiario_titularId_fkey" FOREIGN KEY ("titularId") REFERENCES "Beneficiario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Validacao" ADD CONSTRAINT "Validacao_parceiroId_fkey" FOREIGN KEY ("parceiroId") REFERENCES "Parceiro"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Validacao" ADD CONSTRAINT "Validacao_beneficiarioId_fkey" FOREIGN KEY ("beneficiarioId") REFERENCES "Beneficiario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
