// src/db/client.ts
import { Database } from "bun:sqlite";
import { CREATE_SCHEMA, type AuditLog } from "./schema";
import {join} from "node:path"
const DB_PATH = join(import.meta.dir, "../../ecommerce.db");
export const db = new Database(DB_PATH, { create: true, strict: true });

db.run(CREATE_SCHEMA);

type Bindable = string | number | boolean | null | bigint | Uint8Array;

export function dbAll<T = Record<string, unknown>>(
  sql: string,
  params: Bindable[] = [],
): T[] {
  return db.query<T, Bindable[]>(sql).all(...params);
}

export function dbGet<T = Record<string, unknown>>(
  sql: string,
  params: Bindable[] = [],
): T | undefined {
  return db.query<T, Bindable[]>(sql).get(...params) ?? undefined;
}

export function dbRun(
  sql: string,
  params: Bindable[] = [],
): { lastInsertRowid: number; changes: number } {
  return db.run(sql, params as never) as {
    lastInsertRowid: number;
    changes: number;
  };
}

export function writeAudit(entry: Omit<AuditLog, "id" | "created_at">): void {
  dbRun(
    `INSERT INTO audit_log (agent, action, entity, entity_id, note)
     VALUES (?1, ?2, ?3, ?4, ?5)`,
    [
      entry.agent,
      entry.action,
      entry.entity ?? null,
      entry.entity_id ?? null,
      entry.note ?? null,
    ],
  );
}

export function withTransaction(fn: () => void): void {
  db.transaction(fn)();
}
