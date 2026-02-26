"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto = require("crypto");
const bcrypt = require("bcrypt");

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
    return `${iv.toString('hex')}:${tag}:${encrypted}`;
};

exports.decryptCpf = (encryptedCpf, key) => {
    const [ivHex, tagHex, encryptedHex] = encryptedCpf.split(':');
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
    return bcrypt.hash(pin, 10);
};

exports.verifyPin = async (pin, hash) => {
    return bcrypt.compare(pin, hash);
};
