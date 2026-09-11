// @vitest-environment node
import { describe, it, expect } from "vitest";
import { execFileSync, spawnSync } from "node:child_process";
import { mkdtempSync, copyFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

describe("Downloadable debugging example", () => {
  it("demonstrates the original failure and passes the same tests after the patch", () => {
    const dir = mkdtempSync(path.join(tmpdir(), "ai-blog-repro-"));
    const source = path.resolve("public/examples/ai-debugging");
    try {
      copyFileSync(path.join(source, "pagination.test.mjs"), path.join(dir, "pagination.test.mjs"));
      copyFileSync(path.join(source, "pagination.broken.mjs"), path.join(dir, "pagination.mjs"));
      const broken = spawnSync(process.execPath, ["--test", "pagination.test.mjs"], { cwd: dir, encoding: "utf8" });
      expect(broken.status).toBe(1);
      expect(broken.stdout).toContain("includes a partial final page");
      expect(broken.stdout).toContain("# fail 1");
      copyFileSync(path.join(source, "pagination.mjs"), path.join(dir, "pagination.mjs"));
      const fixed = execFileSync(process.execPath, ["--test", "pagination.test.mjs"], { cwd: dir, encoding: "utf8" });
      expect(fixed).toContain("# pass 4");
      expect(fixed).toContain("# fail 0");
    } finally { rmSync(dir, { recursive: true, force: true }); }
  });
});
