import { mkdir, mkdtemp, realpath, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

export type TempWorkspace = {
  root: string;
  cwd: string;
  agentContextHome: string;
  projectName: string;
  env: NodeJS.ProcessEnv;
  projectDir: string;
};

export async function withTempWorkspace<T>(callback: (workspace: TempWorkspace) => Promise<T>): Promise<T> {
  const root = await realpath(
    await mkdtemp(path.join(os.tmpdir(), 'agent-context-test-')),
  );
  const cwd = path.join(root, 'workspace');
  const agentContextHome = path.join(root, 'agent-context-home');

  try {
    await mkdir(cwd, { recursive: true });

    return await callback({
      root,
      cwd,
      agentContextHome,
      projectName: 'test-project',
      env: {
        AGENT_CONTEXT_HOME: agentContextHome,
        AGENT_CONTEXT_PROJECT: 'test-project',
      },
      projectDir: path.join(agentContextHome, 'test-project'),
    });
  } finally {
    await rm(root, { recursive: true, force: true });
  }
}
