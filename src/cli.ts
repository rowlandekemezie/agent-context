#!/usr/bin/env node

import { createDoc, listDocs } from './commands/doc.js';
import { renderContext } from './commands/context.js';
import { appendProgress, ensureProgressFile, listProgress } from './commands/progress.js';
import { consumeHandoffs, createHandoff, listHandoffs } from './commands/handoff.js';
import { createWorkspaceContext, ensureBaseFiles } from './core/workspace.js';

export const packageVersion = '0.1.0';

export function usage(): string {
  return `ai-work ${packageVersion}\n\nLocal-first Markdown memory for AI-assisted software development.\n\nUsage:\n  ai-work <command> [args]\n\nCommands:\n  ai-work init\n  ai-work info\n  ai-work context\n  ai-work progress path\n  ai-work progress list [n]\n  ai-work progress append [file]\n  ai-work handoff create <slug>\n  ai-work handoff list\n  ai-work handoff consume\n  ai-work doc create <feature|architecture|research> <slug>\n  ai-work doc list <feature|architecture|research> [n]\n\nOptions:\n  -h, --help       Show this help message\n  -v, --version    Show the current version\n\nEnvironment:\n  AI_WORK_HOME     Base directory for generated work plans\n  AI_WORK_PROJECT  Project name used under AI_WORK_HOME`;
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
          aiWorkHome: ctx.aiWorkHome,
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
