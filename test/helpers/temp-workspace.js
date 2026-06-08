import { mkdir, mkdtemp, realpath, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

export async function withTempWorkspace(callback) {
  const root = await realpath(
    await mkdtemp(path.join(os.tmpdir(), "ai-work-test-")),
  );
  const cwd = path.join(root, "workspace");
  const aiWorkHome = path.join(root, "ai-work-home");

  try {
    await mkdir(cwd, { recursive: true });

    return await callback({
      root,
      cwd,
      aiWorkHome,
      projectName: "test-project",
      env: {
        AI_WORK_HOME: aiWorkHome,
        AI_WORK_PROJECT: "test-project",
      },
      projectDir: path.join(aiWorkHome, "test-project"),
    });
  } finally {
    await rm(root, { recursive: true, force: true });
  }
}
