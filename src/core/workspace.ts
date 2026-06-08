import { existsSync } from 'node:fs';
import { mkdir, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

export type AiWorkDirs = {
  architecture: string;
  features: string;
  handoffs: string;
  handoffPending: string;
  handoffCompleted: string;
  progress: string;
  research: string;
};

export type WorkspaceContext = {
  root: string;
  home: string;
  aiWorkHome: string;
  projectName: string;
  projectDir: string;
  dirs: AiWorkDirs;
  currentFocusPath: string;
  quirksPath: string;
};

export function createWorkspaceContext(env: NodeJS.ProcessEnv = process.env, cwd = process.cwd()): WorkspaceContext {
  const root = cwd;
  const home = os.homedir();
  const aiWorkHome = env.AI_WORK_HOME || path.join(home, '.config', 'ai-work', 'dev-plans');
  const projectName = env.AI_WORK_PROJECT || path.basename(root);
  const projectDir = path.join(aiWorkHome, projectName);
  const dirs: AiWorkDirs = {
    architecture: path.join(projectDir, 'architecture'),
    features: path.join(projectDir, 'features'),
    handoffs: path.join(projectDir, 'subtask-handoffs'),
    handoffPending: path.join(projectDir, 'subtask-handoffs', 'pending'),
    handoffCompleted: path.join(projectDir, 'subtask-handoffs', 'completed'),
    progress: path.join(projectDir, 'progress-updates'),
    research: path.join(projectDir, 'research'),
  };

  return {
    root,
    home,
    aiWorkHome,
    projectName,
    projectDir,
    dirs,
    currentFocusPath: path.join(projectDir, 'current-focus.md'),
    quirksPath: path.join(projectDir, 'QUIRKS.md'),
  };
}

export async function ensureDirs(ctx: WorkspaceContext): Promise<void> {
  await Promise.all(Object.values(ctx.dirs).map((dir) => mkdir(dir, { recursive: true })));
}

export async function ensureBaseFiles(ctx: WorkspaceContext): Promise<void> {
  await ensureDirs(ctx);

  if (!existsSync(ctx.currentFocusPath)) {
    await writeFile(
      ctx.currentFocusPath,
      `# Current Focus\n\n## Project\n\n- Name: ${ctx.projectName}\n- Repository: ${ctx.root}\n\n## Goal\n\nNo active AI-assisted workstream is recorded yet.\n\n## Open Questions\n\n- None yet.\n\n## Next Step\n\nSet the active objective before starting a larger workstream.\n`,
      'utf8',
    );
  }

  if (!existsSync(ctx.quirksPath)) {
    await writeFile(
      ctx.quirksPath,
      `# Quirks\n\nProject-specific patterns, constraints, and reminders for ${ctx.projectName}.\n`,
      'utf8',
    );
  }
}
