import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("build creates a static IQC Knowledge Center entry page", async () => {
  const html = await readFile(new URL("../dist/index.html", import.meta.url), "utf8");
  assert.match(html, /<title>IQC Knowledge Center<\/title>/);
  assert.match(html, /<div id="root"><\/div>/);
});
