"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto = require("crypto");
const argon2 = require("argon2");

// Simplified for CJS compatibility
const algorithm = 'aes-256-gcm';
const ivLength = 12;
const tagLength = 16;

exports.encryptCpf = (cpf, key) => {
    const iv = crypto.randomBytes(ivLength);
    const cipher = crypto.createCipheriv(algorithm, Buffer.from(key, 'hex'), iv);
    let encrypted = cipher.update(cpf, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const tag = cipher.getAuthTag().toString('hex');
    return `${iv.toString('hex')}:${encrypted}:${tag}`;
};

exports.decryptCpf = (encryptedCpf, key) => {
    const [ivHex, encryptedHex, tagHex] = encryptedCpf.split(':');
    const decipher = crypto.createDecipheriv(algorithm, Buffer.from(key, 'hex'), Buffer.from(ivHex, 'hex'));
    decipher.setAuthTag(Buffer.from(tagHex, 'hex'));
    let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
};

exports.hashCpfForSearch = (cpf, key) => {
    return crypto.createHmac('sha256', key).update(cpf).digest('hex');
};

exports.hashPin = async (pin) => {
    return argon2.hash(pin);
};

exports.verifyPin = async (hash, pin) => {
    return argon2.verify(hash, pin);
};
