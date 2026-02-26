"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var client_1 = require("@prisma/client");
var bcrypt = require("bcrypt");
var crypto = require("crypto");
var argon2 = require("argon2");
var prisma = new client_1.PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var tenantId, encryptionKey, hmacKey, encrypt, hashHmac, adminHash, p1, pin, pinFinal;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tenantId = 'acebraz';
                    encryptionKey = process.env.ENCRYPTION_KEY || '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';
                    hmacKey = process.env.HMAC_KEY || 'hmac_secret_key_random_acebraz_2026_braz';
                    encrypt = function (val) {
                        var iv = crypto.randomBytes(12);
                        var cipher = crypto.createCipheriv('aes-256-gcm', Buffer.from(encryptionKey, 'hex'), iv);
                        var enc = cipher.update(val, 'utf8', 'hex');
                        enc += cipher.final('hex');
                        var authTag = cipher.getAuthTag().toString('hex');
                        return "".concat(iv.toString('hex'), ":").concat(authTag, ":").concat(enc);
                    };
                    hashHmac = function (val) { return crypto.createHmac('sha256', hmacKey).update(val).digest('hex'); };
                    return [4 /*yield*/, bcrypt.hash('adminpassword', 10)];
                case 1:
                    adminHash = _a.sent();
                    return [4 /*yield*/, prisma.admin.upsert({
                            where: { email: 'admin@acebraz.com.br' },
                            update: { passwordHash: adminHash },
                            create: {
                                nome: 'Admin ACEBRAZ',
                                email: 'admin@acebraz.com.br',
                                passwordHash: adminHash,
                                tenantId: tenantId
                            }
                        })];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, prisma.parceiro.upsert({
                            where: { cnpj: '12345678000100' },
                            update: {},
                            create: {
                                cnpj: '12345678000100',
                                nomeFantasia: 'Restaurante Central',
                                categoria: 'Gastronomia',
                                regrasDesconto: '15% de desconto no almoço',
                                tenantId: tenantId
                            }
                        })];
                case 3:
                    p1 = _a.sent();
                    return [4 /*yield*/, argon2.hash('1234', { type: argon2.argon2id })];
                case 4:
                    pin = _a.sent();
                    // ASSOCIADO (Test User from README)
                    return [4 /*yield*/, prisma.beneficiario.upsert({
                            where: { cpfHmac: hashHmac('11122233344') },
                            update: { pinHash: pin, forcarTrocaPin: true },
                            create: {
                                nome: 'José Beneficiário',
                                cpfCrypt: encrypt('11122233344'),
                                cpfHmac: hashHmac('11122233344'),
                                pinHash: pin,
                                tipoVinculo: 'ASSOCIADO',
                                status: 'ATIVO',
                                associadoEmpresaId: p1.id,
                                forcarTrocaPin: true,
                                tenantId: tenantId
                            }
                        })];
                case 5:
                    // ASSOCIADO (Test User from README)
                    _a.sent();
                    return [4 /*yield*/, argon2.hash('4321', { type: argon2.argon2id })];
                case 6:
                    pinFinal = _a.sent();
                    return [4 /*yield*/, prisma.beneficiario.upsert({
                            where: { cpfHmac: hashHmac('55566677788') },
                            update: {},
                            create: {
                                nome: 'Maria Estável',
                                cpfCrypt: encrypt('55566677788'),
                                cpfHmac: hashHmac('55566677788'),
                                pinHash: pinFinal,
                                tipoVinculo: 'ASSOCIADO',
                                status: 'ATIVO',
                                associadoEmpresaId: p1.id,
                                forcarTrocaPin: false,
                                tenantId: tenantId
                            }
                        })];
                case 7:
                    _a.sent();
                    console.log('Seed completed successfully');
                    return [2 /*return*/];
            }
        });
    });
}
main().catch(function (e) {
    console.error(e);
    process.exit(1);
}).finally(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prisma.$disconnect()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
