import pool from '../config/database';

export interface SafeQueryResult<T = any> {
  rows: T[];
}

export async function executeQuery(sql: string, params: (string | number | null | boolean | undefined)[] = []): Promise<any[]> {
  // ✅ Convertir undefined → null
  const safeParams = params.map(param => param === undefined ? null : param);
  
  const [rows] = await pool.execute(sql, safeParams) as any;
  return Array.isArray(rows) ? rows : [];
}

export async function executeInsert(sql: string, params: (string | number | null | boolean | undefined)[]): Promise<number> {
  const safeParams = params.map(param => param === undefined ? null : param);
  const [result] = await pool.execute(sql, safeParams) as any;
  return result.insertId;
}

export async function executeUpdate(sql: string, params: (string | number | null | boolean | undefined)[]): Promise<number> {
  const safeParams = params.map(param => param === undefined ? null : param);
  const [result] = await pool.execute(sql, safeParams) as any;
  return result.affectedRows;
}

export async function generateId(): Promise<string> {
  return `tag_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}