"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.executeQuery = executeQuery;
exports.executeInsert = executeInsert;
exports.executeUpdate = executeUpdate;
exports.generateId = generateId;
const database_1 = __importDefault(require("../config/database"));
async function executeQuery(sql, params = []) {
    // ✅ Convertir undefined → null
    const safeParams = params.map(param => param === undefined ? null : param);
    const [rows] = await database_1.default.execute(sql, safeParams);
    return Array.isArray(rows) ? rows : [];
}
async function executeInsert(sql, params) {
    const safeParams = params.map(param => param === undefined ? null : param);
    const [result] = await database_1.default.execute(sql, safeParams);
    return result.insertId;
}
async function executeUpdate(sql, params) {
    const safeParams = params.map(param => param === undefined ? null : param);
    const [result] = await database_1.default.execute(sql, safeParams);
    return result.affectedRows;
}
async function generateId() {
    return `tag_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
