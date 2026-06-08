import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const cliPath = path.join(repoRoot, 'dist', 'cli.js');

type RunCliOptions = {
  cwd?: string;
  env?: NodeJS.ProcessEnv;
  input?: string;
};

type RunCliResult = {
  exitCode: number | null;
  stdout: string;
  stderr: string;
};

export function runCli(args: string[], options: RunCliOptions = {}): Promise<RunCliResult> {
  const {
    cwd = repoRoot,
    env = {},
    input,
  } = options;

  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [cliPath, ...args], {
      cwd,
      env: {
        ...process.env,
        TZ: 'UTC',
        ...env,
      },
      stdio: ['pipe', 'pipe', 'pipe'],
    });

    let stdout = '';
    let stderr = '';

    child.stdout.setEncoding('utf8');
    child.stderr.setEncoding('utf8');
    child.stdout.on('data', (chunk: string) => {
      stdout += chunk;
    });
    child.stderr.on('data', (chunk: string) => {
      stderr += chunk;
    });
    child.on('error', reject);
    child.on('close', (exitCode) => {
      resolve({ exitCode, stdout, stderr });
    });

    child.stdin.end(input);
  });
}
