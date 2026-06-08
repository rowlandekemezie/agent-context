import { existsSync } from 'node:fs';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { workDate } from '../core/dates.js';
import { listMarkdownFiles } from '../core/markdown-files.js';
import { readStdin } from '../core/stdin.js';
import type { WorkspaceContext } from '../core/workspace.js';

export function progressPath(ctx: WorkspaceContext): string {
  return path.join(ctx.dirs.progress, `${workDate()}-progress.md`);
}

export async function ensureProgressFile(ctx: WorkspaceContext, filePath = progressPath(ctx)): Promise<string> {

  if (!existsSync(filePath)) {
    await writeFile(filePath, `# Progress ${workDate()}\n\n`, 'utf8');
  }

  return filePath;
}

export async function appendProgress(ctx: WorkspaceContext, fileArg?: string): Promise<string> {
  const target = await ensureProgressFile(ctx);
  const input = fileArg ? await readFile(path.resolve(ctx.root, fileArg), 'utf8') : await readStdin();
  const section = input.trim();

  if (!section) {
    throw new Error('No progress content provided.');
  }

  const entry = `## ${new Date().toISOString()}\n\n${section}\n\n`;
  const current = await readFile(target, 'utf8');
  await writeFile(target, `${current.trimEnd()}\n\n${entry}`, 'utf8');

  return target;
}

export async function listProgress(ctx: WorkspaceContext, limitArg?: string): Promise<string[]> {
  const limit = Number(limitArg || 3);
  return (await listMarkdownFiles(ctx.dirs.progress)).slice(0, limit);
}
