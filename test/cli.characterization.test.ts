import { describe, expect, it } from "vitest";
import { readFile, readdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { runCli } from "./helpers/run-cli.js";
import { withTempWorkspace } from "./helpers/temp-workspace.js";

async function exists(filePath: string): Promise<boolean> {
  try {
    await stat(filePath);
    return true;
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "ENOENT") {
      return false;
    }
    throw error;
  }
}

describe("agent-context CLI characterization", () => {
  it("Given a new project, when init runs, then it creates the base project memory layout", async () => {
    await withTempWorkspace(async ({ cwd, env, projectDir }) => {
      const result = await runCli(["init"], { cwd, env });

      expect(result.exitCode).toBe(0);
      expect(result.stderr).toBe("");
      expect(result.stdout.trim()).toBe(projectDir);

      await expect(
        stat(path.join(projectDir, "current-focus.md")),
      ).resolves.toBeTruthy();
      await expect(
        stat(path.join(projectDir, "QUIRKS.md")),
      ).resolves.toBeTruthy();

      for (const dir of [
        "architecture",
        "features",
        "progress-updates",
        "research",
        "subtask-handoffs",
        "subtask-handoffs/pending",
        "subtask-handoffs/completed",
      ]) {
        await expect(stat(path.join(projectDir, dir))).resolves.toBeTruthy();
      }
    });
  });

  it("Given initialized agent context storage, when info runs, then it prints valid JSON with configured paths", async () => {
    await withTempWorkspace(
      async ({ cwd, env, agentContextHome, projectDir, projectName }) => {
        const result = await runCli(["info"], { cwd, env });

        expect(result.exitCode).toBe(0);
        expect(result.stderr).toBe("");

        const info = JSON.parse(result.stdout);
        expect(info.root).toBe(cwd);
        expect(info.agentContextHome).toBe(agentContextHome);
        expect(info.projectName).toBe(projectName);
        expect(info.projectDir).toBe(projectDir);
        expect(info.currentFocusPath).toBe(
          path.join(projectDir, "current-focus.md"),
        );
        expect(info.quirksPath).toBe(path.join(projectDir, "QUIRKS.md"));
        expect(info.dirs.progress).toBe(
          path.join(projectDir, "progress-updates"),
        );
      },
    );
  });

  it("Given initialized storage, when context runs, then it prints focus and quirks content", async () => {
    await withTempWorkspace(async ({ cwd, env }) => {
      const result = await runCli(["context"], { cwd, env });

      expect(result.exitCode).toBe(0);
      expect(result.stderr).toBe("");
      expect(result.stdout).toContain("# current-focus.md");
      expect(result.stdout).toContain("# Current Focus");
      expect(result.stdout).toContain("# QUIRKS.md");
      expect(result.stdout).toContain(
        "Project-specific patterns, constraints, and reminders for test-project.",
      );
    });
  });

  it("Given no progress file, when progress path runs, then it creates and prints today’s progress file", async () => {
    await withTempWorkspace(async ({ cwd, env, projectDir }) => {
      const result = await runCli(["progress", "path"], { cwd, env });

      expect(result.exitCode).toBe(0);
      expect(result.stderr).toBe("");
      expect(result.stdout.trim()).toMatch(
        /progress-updates\/\d{4}-\d{2}-\d{2}-progress\.md$/,
      );
      expect(
        result.stdout
          .trim()
          .startsWith(path.join(projectDir, "progress-updates")),
      ).toBe(true);
      expect(await exists(result.stdout.trim())).toBe(true);
    });
  });

  it("Given progress content on stdin, when progress append runs, then it appends a timestamped entry", async () => {
    await withTempWorkspace(async ({ cwd, env }) => {
      const result = await runCli(["progress", "append"], {
        cwd,
        env,
        input: "Implemented the package scaffold.\n",
      });

      expect(result.exitCode).toBe(0);
      expect(result.stderr).toBe("");
      const progressPath = result.stdout.trim();
      const content = await readFile(progressPath, "utf8");
      expect(content).toContain("# Progress");
      expect(content).toContain("Implemented the package scaffold.");
      expect(content).toMatch(/## \d{4}-\d{2}-\d{2}T/);
    });
  });

  it("Given an existing progress file, when progress list runs, then it lists recent progress files newest first", async () => {
    await withTempWorkspace(async ({ cwd, env }) => {
      await runCli(["progress", "append"], { cwd, env, input: "First entry" });

      const result = await runCli(["progress", "list", "1"], { cwd, env });

      expect(result.exitCode).toBe(0);
      expect(result.stderr).toBe("");
      expect(result.stdout.trim()).toMatch(/^\d{4}-\d{2}-\d{2}-progress\.md$/);
    });
  });

  it("Given a progress source file, when progress append receives a file path, then it appends that file content", async () => {
    await withTempWorkspace(async ({ cwd, env }) => {
      await writeFile(
        path.join(cwd, "entry.md"),
        "Progress from a file.\n",
        "utf8",
      );

      const result = await runCli(["progress", "append", "entry.md"], {
        cwd,
        env,
      });

      expect(result.exitCode).toBe(0);
      const content = await readFile(result.stdout.trim(), "utf8");
      expect(content).toContain("Progress from a file.");
    });
  });

  it("Given no progress content, when progress append runs, then it fails with a helpful error", async () => {
    await withTempWorkspace(async ({ cwd, env }) => {
      const result = await runCli(["progress", "append"], {
        cwd,
        env,
        input: "",
      });

      expect(result.exitCode).toBe(1);
      expect(result.stdout).toBe("");
      expect(result.stderr).toContain("No progress content provided.");
    });
  });

  it("Given a handoff slug, when handoff create and list run, then a pending handoff template exists", async () => {
    await withTempWorkspace(async ({ cwd, env, projectDir }) => {
      const created = await runCli(["handoff", "create", "Next Agent"], {
        cwd,
        env,
      });

      expect(created.exitCode).toBe(0);
      expect(created.stderr).toBe("");
      expect(created.stdout.trim()).toMatch(
        /subtask-handoffs\/pending\/\d{4}-\d{2}-\d{2}-\d{2}-\d{2}-\d{2}-next-agent\.md$/,
      );
      expect(await exists(created.stdout.trim())).toBe(true);

      const content = await readFile(created.stdout.trim(), "utf8");
      expect(content).toContain("# next-agent");
      expect(content).toContain("## Goal");
      expect(content).toContain("## Next Step");

      const listed = await runCli(["handoff", "list"], { cwd, env });
      expect(listed.stdout.trim()).toBe(path.basename(created.stdout.trim()));
      expect(
        created.stdout
          .trim()
          .startsWith(path.join(projectDir, "subtask-handoffs", "pending")),
      ).toBe(true);
    });
  });

  it("Given a pending handoff, when handoff consume runs, then it prints and moves it to completed", async () => {
    await withTempWorkspace(async ({ cwd, env, projectDir }) => {
      const created = await runCli(["handoff", "create", "Follow Up"], {
        cwd,
        env,
      });
      const filename = path.basename(created.stdout.trim());

      const consumed = await runCli(["handoff", "consume"], { cwd, env });

      expect(consumed.exitCode).toBe(0);
      expect(consumed.stderr).toBe("");
      expect(consumed.stdout).toContain(`--- ${filename} ---`);
      expect(consumed.stdout).toContain("# follow-up");
      expect(
        await readdir(path.join(projectDir, "subtask-handoffs", "pending")),
      ).toEqual([]);

      const completedDays = await readdir(
        path.join(projectDir, "subtask-handoffs", "completed"),
      );
      expect(completedDays).toHaveLength(1);
      expect(
        await exists(
          path.join(
            projectDir,
            "subtask-handoffs",
            "completed",
            completedDays[0],
            filename,
          ),
        ),
      ).toBe(true);
    });
  });

  it("Given no pending handoffs, when handoff consume runs, then it reports no pending handoffs", async () => {
    await withTempWorkspace(async ({ cwd, env }) => {
      const result = await runCli(["handoff", "consume"], { cwd, env });

      expect(result.exitCode).toBe(0);
      expect(result.stdout.trim()).toBe("No pending handoffs.");
    });
  });

  it("Given a valid doc type and slug, when doc create and list run, then a dated planning doc exists", async () => {
    await withTempWorkspace(async ({ cwd, env, projectDir }) => {
      const created = await runCli(
        ["doc", "create", "feature", "Durable Context"],
        { cwd, env },
      );

      expect(created.exitCode).toBe(0);
      expect(created.stderr).toBe("");
      expect(created.stdout.trim()).toMatch(
        /features\/\d{4}-\d{2}-\d{2}-durable-context\.md$/,
      );
      expect(
        created.stdout.trim().startsWith(path.join(projectDir, "features")),
      ).toBe(true);

      const content = await readFile(created.stdout.trim(), "utf8");
      expect(content).toContain("# durable-context");
      expect(content).toContain("## Goal");
      expect(content).toContain("## Notes");
      expect(content).toContain("## Next Step");

      const listed = await runCli(["doc", "list", "feature", "1"], {
        cwd,
        env,
      });
      expect(listed.exitCode).toBe(0);
      expect(listed.stdout.trim()).toBe(path.basename(created.stdout.trim()));
    });
  });

  it("Given an invalid doc type, when doc create runs, then it fails without creating storage", async () => {
    await withTempWorkspace(async ({ cwd, env, projectDir }) => {
      const result = await runCli(["doc", "create", "unknown", "Bad Doc"], {
        cwd,
        env,
      });

      expect(result.exitCode).toBe(1);
      expect(result.stdout).toBe("");
      expect(result.stderr).toContain(
        'Doc type must be "feature", "architecture", or "research".',
      );
      expect(await exists(projectDir)).toBe(false);
    });
  });

  it("Given --help, when the CLI runs, then it prints command help without creating storage", async () => {
    await withTempWorkspace(async ({ cwd, env, projectDir }) => {
      const result = await runCli(["--help"], { cwd, env });

      expect(result.exitCode).toBe(0);
      expect(result.stderr).toBe("");
      expect(result.stdout).toContain("agent-context 0.1.0");
      expect(result.stdout).toContain("Usage:");
      expect(result.stdout).toContain("Commands:");
      expect(result.stdout).toContain("Options:");
      expect(result.stdout).toContain("AGENT_CONTEXT_HOME");
      expect(await exists(projectDir)).toBe(false);
    });
  });

  it("Given help, when the CLI runs, then it prints command help successfully", async () => {
    await withTempWorkspace(async ({ cwd, env }) => {
      const result = await runCli(["help"], { cwd, env });

      expect(result.exitCode).toBe(0);
      expect(result.stderr).toBe("");
      expect(result.stdout).toContain("agent-context <command> [args]");
      expect(result.stdout).toContain("agent-context progress append [file]");
    });
  });

  it("Given --version, when the CLI runs, then it prints the package version without creating storage", async () => {
    await withTempWorkspace(async ({ cwd, env, projectDir }) => {
      const result = await runCli(["--version"], { cwd, env });

      expect(result.exitCode).toBe(0);
      expect(result.stderr).toBe("");
      expect(result.stdout.trim()).toBe("0.1.0");
      expect(await exists(projectDir)).toBe(false);
    });
  });

  it("Given an unknown command, when the CLI runs, then it prints an actionable usage error without creating storage", async () => {
    await withTempWorkspace(async ({ cwd, env, projectDir }) => {
      const result = await runCli(["wat"], { cwd, env });

      expect(result.exitCode).toBe(1);
      expect(result.stdout).toBe("");
      expect(result.stderr).toContain("Unknown command: wat");
      expect(result.stderr).toContain("Usage:");
      expect(result.stderr).toContain("agent-context init");
      expect(await exists(projectDir)).toBe(false);
    });
  });

  it("Given an unknown subcommand, when the CLI runs, then it fails without creating storage", async () => {
    await withTempWorkspace(async ({ cwd, env, projectDir }) => {
      const result = await runCli(["progress", "wat"], { cwd, env });

      expect(result.exitCode).toBe(1);
      expect(result.stdout).toBe("");
      expect(result.stderr).toContain("Unknown command: progress wat");
      expect(await exists(projectDir)).toBe(false);
    });
  });

  it("Given AGENT_CONTEXT_PROJECT is unset, when init runs, then the project name defaults to the cwd basename", async () => {
    await withTempWorkspace(async ({ cwd, agentContextHome }) => {
      const result = await runCli(["init"], {
        cwd,
        env: {
          AGENT_CONTEXT_HOME: agentContextHome,
        },
      });

      expect(result.exitCode).toBe(0);
      expect(result.stdout.trim()).toBe(
        path.join(agentContextHome, path.basename(cwd)),
      );
    });
  });
});
