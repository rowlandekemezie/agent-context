#!/usr/bin/env node

import { createDoc, listDocs } from './commands/doc.js';
import { renderContext } from './commands/context.js';
import { appendProgress, ensureProgressFile, listProgress } from './commands/progress.js';
import { consumeHandoffs, createHandoff, listHandoffs } from './commands/handoff.js';
import { createWorkspaceContext, ensureBaseFiles } from './core/workspace.js';

export const packageVersion = '0.1.0';

export function usage(): string {
  return `agent-context ${packageVersion}\n\nLocal-first Markdown memory for AI-assisted software development.\n\nUsage:\n  agent-context <command> [args]\n\nCommands:\n  agent-context init\n  agent-context info\n  agent-context context\n  agent-context progress path\n  agent-context progress list [n]\n  agent-context progress append [file]\n  agent-context handoff create <slug>\n  agent-context handoff list\n  agent-context handoff consume\n  agent-context doc create <feature|architecture|research> <slug>\n  agent-context doc list <feature|architecture|research> [n]\n\nOptions:\n  -h, --help       Show this help message\n  -v, --version    Show the current version\n\nEnvironment:\n  AGENT_CONTEXT_HOME     Base directory for generated work plans\n  AGENT_CONTEXT_PROJECT  Project name used under AGENT_CONTEXT_HOME`;
}

function unknownCommandMessage(command: string | undefined): string {
  if (!command) {
    return usage();
  }

  return `Unknown command: ${command}\n\n${usage()}`;
}

export async function run(argv = process.argv, env = process.env, cwd = process.cwd()): Promise<number> {
  const [, , command, subcommand, ...args] = argv;

  if (command === 'help' || command === '--help' || command === '-h') {
    console.log(usage());
    return 0;
  }

  if (command === '--version' || command === '-v') {
    console.log(packageVersion);
    return 0;
  }

  const ctx = createWorkspaceContext(env, cwd);
  await ensureBaseFiles(ctx);

  if (command === 'init') {
    console.log(ctx.projectDir);
    return 0;
  }

  if (command === 'info') {
    console.log(
      JSON.stringify(
        {
          root: ctx.root,
          agentContextHome: ctx.agentContextHome,
          projectName: ctx.projectName,
          projectDir: ctx.projectDir,
          currentFocusPath: ctx.currentFocusPath,
          quirksPath: ctx.quirksPath,
          dirs: ctx.dirs,
        },
        null,
        2,
      ),
    );
    return 0;
  }

  if (command === 'context') {
    console.log(await renderContext(ctx));
    return 0;
  }

  if (command === 'progress' && subcommand === 'path') {
    console.log(await ensureProgressFile(ctx));
    return 0;
  }

  if (command === 'progress' && subcommand === 'list') {
    console.log((await listProgress(ctx, args[0])).join('\n'));
    return 0;
  }

  if (command === 'progress' && subcommand === 'append') {
    console.log(await appendProgress(ctx, args[0]));
    return 0;
  }

  if (command === 'handoff' && subcommand === 'create') {
    console.log(await createHandoff(ctx, args.join(' ')));
    return 0;
  }

  if (command === 'handoff' && subcommand === 'list') {
    console.log((await listHandoffs(ctx)).join('\n'));
    return 0;
  }

  if (command === 'handoff' && subcommand === 'consume') {
    process.stdout.write(await consumeHandoffs(ctx));
    return 0;
  }

  if (command === 'doc' && subcommand === 'create') {
    console.log(await createDoc(ctx, args[0] ?? '', args.slice(1).join(' ')));
    return 0;
  }

  if (command === 'doc' && subcommand === 'list') {
    console.log((await listDocs(ctx, args[0] ?? '', args[1])).join('\n'));
    return 0;
  }

  console.error(unknownCommandMessage(command));
  return 1;
}

run().then((exitCode) => {
  process.exitCode = exitCode;
}).catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
