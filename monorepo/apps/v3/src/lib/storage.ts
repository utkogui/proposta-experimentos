import { promises as fs } from "node:fs";
import path from "node:path";
import Redis from "ioredis";
import { Pool } from "pg";
import { Proposta, PropostaSchema, PropostaSummary } from "./types";

/**
 * Persistência de propostas (JSON completo por slug).
 *
 * Prioridade:
 * 1. PostgreSQL (`DATABASE_URL`) — recomendado na Railway com plugin Postgres
 * 2. Redis (`REDIS_URL`)
 * 3. Ficheiros em ./data/propostas/
 */

const DATA_DIR = path.resolve(process.cwd(), "data", "propostas");

let redisClient: Redis | null = null;
let pgPool: Pool | null = null;

function databaseUrl(): string | null {
  const u = process.env.DATABASE_URL?.trim();
  return u || null;
}

function pgSslOption():
  | undefined
  | false
  | { rejectUnauthorized: boolean } {
  if (process.env.DATABASE_SSL === "false") return undefined;
  const url = databaseUrl();
  if (!url) return undefined;
  try {
    const hostname = new URL(url).hostname;
    if (hostname === "localhost" || hostname === "127.0.0.1") {
      return undefined;
    }
  } catch {
    return { rejectUnauthorized: false };
  }
  return { rejectUnauthorized: false };
}

function getPgPool(): Pool | null {
  const url = databaseUrl();
  if (!url) return null;
  if (!pgPool) {
    pgPool = new Pool({
      connectionString: url,
      max: 10,
      ssl: pgSslOption(),
    });
  }
  return pgPool;
}

function getRedis(): Redis | null {
  if (databaseUrl()) return null;
  const url = process.env.REDIS_URL?.trim();
  if (!url) return null;
  if (!redisClient) {
    redisClient = new Redis(url, {
      maxRetriesPerRequest: 3,
      lazyConnect: true,
    });
  }
  return redisClient;
}

const KEY = (slug: string) => `proposta:${slug}`;
const INDEX = "propostas:slugs";

function summaryFromProposta(p: Proposta): PropostaSummary {
  return {
    slug: p.slug,
    clienteNome: p.cliente?.nome ?? "",
    projeto: p.proposta?.projeto ?? "",
    numero: p.proposta?.numero ?? "",
    atualizadoEm: p.metadata?.atualizadoEm ?? "",
  };
}

async function ensureDataDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

export async function listPropostas(): Promise<PropostaSummary[]> {
  const pg = getPgPool();
  if (pg) {
    const r = await pg.query<{ slug: string; body: unknown }>(
      `SELECT slug, body FROM propostas ORDER BY updated_at DESC`
    );
    const out: PropostaSummary[] = [];
    for (const row of r.rows) {
      const parsed = PropostaSchema.safeParse(row.body);
      if (parsed.success) out.push(summaryFromProposta(parsed.data));
    }
    return out;
  }

  const redis = getRedis();
  if (redis) {
    const slugs = (await redis.smembers(INDEX)) as string[];
    if (!slugs.length) return [];
    const pipeline = redis.pipeline();
    slugs.forEach((s) => pipeline.get(KEY(s)));
    const results = await pipeline.exec();
    return (results ?? [])
      .map((result) => {
        const [err, raw] = result;
        if (err || !raw) return null;
        const p = JSON.parse(String(raw)) as Proposta;
        return summaryFromProposta(p);
      })
      .filter((x): x is PropostaSummary => x !== null)
      .sort((a, b) =>
        (b.atualizadoEm || "").localeCompare(a.atualizadoEm || "")
      );
  }

  await ensureDataDir();
  const files = await fs.readdir(DATA_DIR).catch(() => [] as string[]);
  const out: PropostaSummary[] = [];
  for (const f of files) {
    if (!f.endsWith(".json")) continue;
    if (f.startsWith("_")) continue;
    try {
      const raw = await fs.readFile(path.join(DATA_DIR, f), "utf8");
      const p = JSON.parse(raw) as Proposta;
      out.push(summaryFromProposta(p));
    } catch {
      // arquivo corrompido — ignorar
    }
  }
  return out.sort((a, b) =>
    (b.atualizadoEm || "").localeCompare(a.atualizadoEm || "")
  );
}

export async function getProposta(slug: string): Promise<Proposta | null> {
  const pg = getPgPool();
  if (pg) {
    const r = await pg.query<{ body: unknown }>(
      `SELECT body FROM propostas WHERE slug = $1`,
      [slug]
    );
    if (!r.rowCount) return null;
    const parsed = PropostaSchema.safeParse(r.rows[0].body);
    return parsed.success ? parsed.data : null;
  }

  const redis = getRedis();
  if (redis) {
    const raw = (await redis.get(KEY(slug))) as string | null;
    if (!raw) return null;
    const obj = JSON.parse(raw);
    const parsed = PropostaSchema.safeParse(obj);
    return parsed.success ? parsed.data : null;
  }

  await ensureDataDir();
  const file = path.join(DATA_DIR, `${slug}.json`);
  try {
    const raw = await fs.readFile(file, "utf8");
    const obj = JSON.parse(raw);
    const parsed = PropostaSchema.safeParse(obj);
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}

export async function saveProposta(p: Proposta): Promise<Proposta> {
  const now = new Date().toISOString();
  const toSave: Proposta = {
    ...p,
    metadata: {
      criadoEm: p.metadata?.criadoEm ?? now,
      atualizadoEm: now,
    },
  };

  const pg = getPgPool();
  if (pg) {
    await pg.query(
      `INSERT INTO propostas (slug, body, updated_at)
       VALUES ($1, $2::jsonb, NOW())
       ON CONFLICT (slug) DO UPDATE SET
         body = EXCLUDED.body,
         updated_at = NOW()`,
      [toSave.slug, JSON.stringify(toSave)]
    );
    return toSave;
  }

  const redis = getRedis();
  if (redis) {
    await redis.set(KEY(toSave.slug), JSON.stringify(toSave));
    await redis.sadd(INDEX, toSave.slug);
    return toSave;
  }

  await ensureDataDir();
  const file = path.join(DATA_DIR, `${toSave.slug}.json`);
  await fs.writeFile(file, JSON.stringify(toSave, null, 2), "utf8");
  return toSave;
}

export async function deleteProposta(slug: string): Promise<boolean> {
  const pg = getPgPool();
  if (pg) {
    const r = await pg.query(`DELETE FROM propostas WHERE slug = $1`, [slug]);
    return (r.rowCount ?? 0) > 0;
  }

  const redis = getRedis();
  if (redis) {
    await redis.del(KEY(slug));
    await redis.srem(INDEX, slug);
    return true;
  }

  await ensureDataDir();
  const file = path.join(DATA_DIR, `${slug}.json`);
  try {
    await fs.unlink(file);
    return true;
  } catch {
    return false;
  }
}

export async function slugExists(slug: string): Promise<boolean> {
  const pg = getPgPool();
  if (pg) {
    const r = await pg.query(`SELECT 1 FROM propostas WHERE slug = $1`, [
      slug,
    ]);
    return (r.rowCount ?? 0) > 0;
  }
  return (await getProposta(slug)) !== null;
}

/** Gera um slug único derivado de um título. */
export async function generateUniqueSlug(base: string): Promise<string> {
  const norm =
    base
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 50) || "proposta";
  let candidate = norm;
  let i = 2;
  while (await slugExists(candidate)) {
    candidate = `${norm}-${i++}`;
  }
  return candidate;
}
