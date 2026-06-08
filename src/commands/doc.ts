import { existsSync } from 'node:fs';
import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import { workDate } from '../core/dates.js';
import { listMarkdownFiles } from '../core/markdown-files.js';
import { slugify } from '../core/slugify.js';
import type { WorkspaceContext } from '../core/workspace.js';

export type DocType = 'feature' | 'architecture' | 'research';

export function docDir(ctx: WorkspaceContext, type: string): string {
  if (type === 'feature') {
    return ctx.dirs.features;
  }

  if (type === 'architecture') {
    return ctx.dirs.architecture;
  }

  if (type === 'research') {
    return ctx.dirs.research;
  }

  throw new Error('Doc type must be "feature", "architecture", or "research".');
}

export async function createDoc(ctx: WorkspaceContext, type: string, slug: string): Promise<string> {
  const dir = docDir(ctx, type);
  const safeSlug = slugify(slug || type);
  const filePath = path.join(dir, `${workDate()}-${safeSlug}.md`);

  if (!existsSync(filePath)) {
    await writeFile(filePath, `# ${safeSlug}\n\n## Goal\n\n\n## Notes\n\n\n## Next Step\n\n`, 'utf8');
  }

  return filePath;
}

export async function listDocs(ctx: WorkspaceContext, type: string, limitArg?: string): Promise<string[]> {
  const limit = Number(limitArg || 10);
  return (await listMarkdownFiles(docDir(ctx, type))).slice(0, limit);
}
