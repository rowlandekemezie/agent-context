import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { listMarkdownFiles } from '../core/markdown-files.js';
import type { WorkspaceContext } from '../core/workspace.js';

export async function renderContext(ctx: WorkspaceContext): Promise<string> {
  const recentProgress = (await listMarkdownFiles(ctx.dirs.progress)).slice(0, 3);
  const sections: string[] = [];

  if (existsSync(ctx.currentFocusPath)) {
    sections.push(`# current-focus.md\n\n${await readFile(ctx.currentFocusPath, 'utf8')}`);
  }

  if (existsSync(ctx.quirksPath)) {
    sections.push(`# QUIRKS.md\n\n${await readFile(ctx.quirksPath, 'utf8')}`);
  }

  for (const file of recentProgress.reverse()) {
    const filePath = path.join(ctx.dirs.progress, file);
    sections.push(`# progress-updates/${file}\n\n${await readFile(filePath, 'utf8')}`);
  }

  return sections.join('\n\n---\n\n');
}
