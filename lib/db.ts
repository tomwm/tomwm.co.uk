import { neon } from '@neondatabase/serverless';

// Lazy client — only instantiated when a query is actually run (not at build time)
let _client: ReturnType<typeof neon> | null = null;
function getClient() {
  if (!_client) {
    const url = process.env.POSTGRES_URL ?? process.env.DATABASE_URL ?? '';
    _client = neon(url);
  }
  return _client;
}

// Typed tagged-template helper that always returns Record<string, unknown>[]
export async function sql(
  strings: TemplateStringsArray,
  ...values: unknown[]
): Promise<Record<string, unknown>[]> {
  const result = await getClient()(strings, ...values);
  // neon can return various shapes; normalise to a plain array
  if (Array.isArray(result)) {
    return result as Record<string, unknown>[];
  }
  // FullQueryResults shape
  const full = result as { rows: Record<string, unknown>[] };
  return full.rows ?? [];
}

export async function initDb() {
  await sql`
    CREATE TABLE IF NOT EXISTS posts (
      id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
      title TEXT NOT NULL,
      subtitle TEXT,
      slug TEXT UNIQUE NOT NULL,
      content TEXT,
      tags TEXT DEFAULT '',
      status TEXT DEFAULT 'draft',
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW(),
      published_at TIMESTAMPTZ
    )
  `;
}

export interface Post {
  id: string;
  title: string;
  subtitle: string | null;
  slug: string;
  content: string | null;
  tags: string;
  status: string;
  created_at: string;
  updated_at: string;
  published_at: string | null;
}
