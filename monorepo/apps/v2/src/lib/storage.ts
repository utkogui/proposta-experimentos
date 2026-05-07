import { promises as fs } from "node:fs";
import path from "node:path";
import Redis from "ioredis";
import { Proposta, PropostaSchema, PropostaSummary } from "./types";

/**
 * Camada de storage abstrata.
 *
 * - Em produção (Render), usa Redis via REDIS_URL
 * - Em dev, sem essas vars setadas, usa filesystem local em ./data/propostas/
 *
 * Chave KV: "proposta:<slug>" -> JSON serializado
 * Index:    "propostas:slugs" -> Set de slugs (para listar)
 */

const DATA_DIR = path.resolve(process.cwd(), "data", "propostas");

let redisClient: Redis | null = null;

function getRedis(): Redis | null {
  const url = process.env.REDIS_URL;
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

async function ensureDataDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

export async function listPropostas(): Promise<PropostaSummary[]> {
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
        return {
          slug: p.slug,
          clienteNome: p.cliente?.nome ?? "",
          projeto: p.proposta?.projeto ?? "",
          numero: p.proposta?.numero ?? "",
          atualizadoEm: p.metadata?.atualizadoEm ?? "",
        } satisfies PropostaSummary;
      })
      .filter((x): x is PropostaSummary => x !== null)
      .sort((a, b) => (b.atualizadoEm || "").localeCompare(a.atualizadoEm || ""));
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
      out.push({
        slug: p.slug,
        clienteNome: p.cliente?.nome ?? "",
        projeto: p.proposta?.projeto ?? "",
        numero: p.proposta?.numero ?? "",
        atualizadoEm: p.metadata?.atualizadoEm ?? "",
      });
    } catch {
      // arquivo corrompido — ignorar
    }
  }
  return out.sort((a, b) =>
    (b.atualizadoEm || "").localeCompare(a.atualizadoEm || "")
  );
}

export async function getProposta(slug: string): Promise<Proposta | null> {
  const redis = getRedis();
  if (redis) {
    const raw = (await redis.get(KEY(slug))) as Proposta | string | null;
    if (!raw) return null;
    const obj = typeof raw === "string" ? JSON.parse(raw) : raw;
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
  return (await getProposta(slug)) !== null;
}

/** Gera um slug único derivado de um título. */
export async function generateUniqueSlug(base: string): Promise<string> {
  const norm = base
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
