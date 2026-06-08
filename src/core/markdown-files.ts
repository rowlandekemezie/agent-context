import { readdir } from 'node:fs/promises';

export async function listMarkdownFiles(dir: string): Promise<string[]> {
  const files = await readdir(dir, { withFileTypes: true });

  return files
    .filter((file) => file.isFile() && file.name.endsWith('.md'))
    .map((file) => file.name)
    .sort()
    .reverse();
}
