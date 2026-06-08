import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { timestamp, workDate } from '../core/dates.js';
import { listMarkdownFiles } from '../core/markdown-files.js';
import { slugify } from '../core/slugify.js';
import type { WorkspaceContext } from '../core/workspace.js';

export async function createHandoff(ctx: WorkspaceContext, slug: string): Promise<string> {
  const safeSlug = slugify(slug || 'handoff');
  const filePath = path.join(ctx.dirs.handoffPending, `${timestamp()}-${safeSlug}.md`);
  const template = `# ${safeSlug}\n\n## Goal\n\n\n## Current State\n\n\n## Files Touched\n\n\n## Commands Run\n\n\n## Decisions\n\n\n## Risks\n\n\n## Next Step\n\n`;

  await writeFile(filePath, template, 'utf8');
  return filePath;
}

export async function listHandoffs(ctx: WorkspaceContext): Promise<string[]> {
  return listMarkdownFiles(ctx.dirs.handoffPending);
}

export async function consumeHandoffs(ctx: WorkspaceContext): Promise<string> {
  const files = await listMarkdownFiles(ctx.dirs.handoffPending);

  if (files.length === 0) {
    return 'No pending handoffs.\n';
  }

  const sections: string[] = [];

  for (const file of files.reverse()) {
    const source = path.join(ctx.dirs.handoffPending, file);
    const content = await readFile(source, 'utf8');
    const completedDir = path.join(ctx.dirs.handoffCompleted, workDate());
    const destination = path.join(completedDir, file);

    sections.push(`\n--- ${file} ---\n\n${content.trimEnd()}\n`);

    await mkdir(completedDir, { recursive: true });
    await rename(source, destination);
  }

  return sections.join('\n');
}
