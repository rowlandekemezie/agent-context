#!/usr/bin/env node

import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const root = process.cwd();
const home = os.homedir();
const aiWorkHome =
  process.env.AI_WORK_HOME || path.join(home, '.config', 'ai-work', 'dev-plans');
const projectName = process.env.AI_WORK_PROJECT || path.basename(root);
const projectDir = path.join(aiWorkHome, projectName);
const dirs = {
  architecture: path.join(projectDir, 'architecture'),
  features: path.join(projectDir, 'features'),
  handoffs: path.join(projectDir, 'subtask-handoffs'),
  handoffPending: path.join(projectDir, 'subtask-handoffs', 'pending'),
  handoffCompleted: path.join(projectDir, 'subtask-handoffs', 'completed'),
  progress: path.join(projectDir, 'progress-updates'),
  research: path.join(projectDir, 'research'),
};

const currentFocusPath = path.join(projectDir, 'current-focus.md');
const quirksPath = path.join(projectDir, 'QUIRKS.md');
const [, , command, subcommand, ...args] = process.argv;
const packageVersion = '0.1.0';

function usage() {
  console.log(`ai-work ${packageVersion}

Local-first Markdown memory for AI-assisted software development.

Usage:
  ai-work <command> [args]

Commands:
  ai-work init
  ai-work info
  ai-work context
  ai-work progress path
  ai-work progress list [n]
  ai-work progress append [file]
  ai-work handoff create <slug>
  ai-work handoff list
  ai-work handoff consume
  ai-work doc create <feature|architecture|research> <slug>
  ai-work doc list <feature|architecture|research> [n]

Options:
  -h, --help       Show this help message
  -v, --version    Show the current version

Environment:
  AI_WORK_HOME     Base directory for generated work plans
  AI_WORK_PROJECT  Project name used under AI_WORK_HOME`);
}

function pad(value) {
  return String(value).padStart(2, '0');
}

function workDate(date = new Date()) {
  const adjusted = new Date(date);

  if (adjusted.getHours() < 6) {
    adjusted.setDate(adjusted.getDate() - 1);
  }

  return [
    adjusted.getFullYear(),
    pad(adjusted.getMonth() + 1),
    pad(adjusted.getDate()),
  ].join('-');
}

function timestamp(date = new Date()) {
  return [
    workDate(date),
    pad(date.getHours()),
    pad(date.getMinutes()),
    pad(date.getSeconds()),
  ].join('-');
}

function slugify(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function ensureDirs() {
  await Promise.all(Object.values(dirs).map((dir) => mkdir(dir, { recursive: true })));
}

async function ensureBaseFiles() {
  await ensureDirs();

  if (!existsSync(currentFocusPath)) {
    await writeFile(
      currentFocusPath,
      `# Current Focus

## Project

- Name: ${projectName}
- Repository: ${root}

## Goal

No active AI-assisted workstream is recorded yet.

## Open Questions

- None yet.

## Next Step

Set the active objective before starting a larger workstream.
`,
      'utf8',
    );
  }

  if (!existsSync(quirksPath)) {
    await writeFile(
      quirksPath,
      `# Quirks

Project-specific patterns, constraints, and reminders for ${projectName}.
`,
      'utf8',
    );
  }
}

async function listMarkdownFiles(dir) {
  const { readdir } = await import('node:fs/promises');
  const files = await readdir(dir, { withFileTypes: true });

  return files
    .filter((file) => file.isFile() && file.name.endsWith('.md'))
    .map((file) => file.name)
    .sort()
    .reverse();
}

function progressPath() {
  return path.join(dirs.progress, `${workDate()}-progress.md`);
}

async function ensureProgressFile(filePath = progressPath()) {
  if (!existsSync(filePath)) {
    await writeFile(filePath, `# Progress ${workDate()}\n\n`, 'utf8');
  }

  return filePath;
}

async function readStdin() {
  const chunks = [];

  for await (const chunk of process.stdin) {
    chunks.push(chunk);
  }

  return Buffer.concat(chunks).toString('utf8');
}

async function appendProgress(fileArg) {
  const target = await ensureProgressFile();
  const input = fileArg ? await readFile(path.resolve(root, fileArg), 'utf8') : await readStdin();
  const section = input.trim();

  if (!section) {
    throw new Error('No progress content provided.');
  }

  const entry = `## ${new Date().toISOString()}\n\n${section}\n\n`;
  const current = await readFile(target, 'utf8');
  await writeFile(target, `${current.trimEnd()}\n\n${entry}`, 'utf8');
  console.log(target);
}

async function createHandoff(slug) {
  const safeSlug = slugify(slug || 'handoff');
  const filePath = path.join(dirs.handoffPending, `${timestamp()}-${safeSlug}.md`);
  const template = `# ${safeSlug}

## Goal


## Current State


## Files Touched


## Commands Run


## Decisions


## Risks


## Next Step

`;

  await writeFile(filePath, template, 'utf8');
  console.log(filePath);
}

async function consumeHandoffs() {
  const files = await listMarkdownFiles(dirs.handoffPending);

  if (files.length === 0) {
    console.log('No pending handoffs.');
    return;
  }

  for (const file of files.reverse()) {
    const source = path.join(dirs.handoffPending, file);
    const content = await readFile(source, 'utf8');
    const completedDir = path.join(dirs.handoffCompleted, workDate());
    const destination = path.join(completedDir, file);

    console.log(`\n--- ${file} ---\n`);
    console.log(content.trimEnd());

    await mkdir(completedDir, { recursive: true });
    await rename(source, destination);
  }
}

function docDir(type) {
  if (type === 'feature') {
    return dirs.features;
  }

  if (type === 'architecture') {
    return dirs.architecture;
  }

  if (type === 'research') {
    return dirs.research;
  }

  throw new Error('Doc type must be "feature", "architecture", or "research".');
}

async function createDoc(type, slug) {
  const dir = docDir(type);
  const safeSlug = slugify(slug || type);
  const filePath = path.join(dir, `${workDate()}-${safeSlug}.md`);

  if (!existsSync(filePath)) {
    await writeFile(filePath, `# ${safeSlug}\n\n## Goal\n\n\n## Notes\n\n\n## Next Step\n\n`, 'utf8');
  }

  console.log(filePath);
}

async function context() {
  const recentProgress = (await listMarkdownFiles(dirs.progress)).slice(0, 3);
  const sections = [];

  if (existsSync(currentFocusPath)) {
    sections.push(`# current-focus.md\n\n${await readFile(currentFocusPath, 'utf8')}`);
  }

  if (existsSync(quirksPath)) {
    sections.push(`# QUIRKS.md\n\n${await readFile(quirksPath, 'utf8')}`);
  }

  for (const file of recentProgress.reverse()) {
    const filePath = path.join(dirs.progress, file);
    sections.push(`# progress-updates/${file}\n\n${await readFile(filePath, 'utf8')}`);
  }

  console.log(sections.join('\n\n---\n\n'));
}

async function main() {
  if (command === 'help' || command === '--help' || command === '-h') {
    usage();
    return;
  }

  if (command === '--version' || command === '-v') {
    console.log(packageVersion);
    return;
  }

  await ensureBaseFiles();

  if (command === 'init') {
    console.log(projectDir);
    return;
  }

  if (command === 'info') {
    console.log(
      JSON.stringify(
        { root, aiWorkHome, projectName, projectDir, currentFocusPath, quirksPath, dirs },
        null,
        2,
      ),
    );
    return;
  }

  if (command === 'context') {
    await context();
    return;
  }

  if (command === 'progress' && subcommand === 'path') {
    console.log(await ensureProgressFile());
    return;
  }

  if (command === 'progress' && subcommand === 'list') {
    const limit = Number(args[0] || 3);
    console.log((await listMarkdownFiles(dirs.progress)).slice(0, limit).join('\n'));
    return;
  }

  if (command === 'progress' && subcommand === 'append') {
    await appendProgress(args[0]);
    return;
  }

  if (command === 'handoff' && subcommand === 'create') {
    await createHandoff(args.join(' '));
    return;
  }

  if (command === 'handoff' && subcommand === 'list') {
    console.log((await listMarkdownFiles(dirs.handoffPending)).join('\n'));
    return;
  }

  if (command === 'handoff' && subcommand === 'consume') {
    await consumeHandoffs();
    return;
  }

  if (command === 'doc' && subcommand === 'create') {
    await createDoc(args[0], args.slice(1).join(' '));
    return;
  }

  if (command === 'doc' && subcommand === 'list') {
    const limit = Number(args[1] || 10);
    console.log((await listMarkdownFiles(docDir(args[0]))).slice(0, limit).join('\n'));
    return;
  }

  usage();
  process.exitCode = 1;
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
