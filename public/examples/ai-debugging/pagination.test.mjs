import test from "node:test";
import assert from "node:assert/strict";
import { pageCount } from "./pagination.mjs";

test("includes a partial final page", () => {
  assert.equal(pageCount(21, 10), 3);
});
test("does not add a page to an exact multiple", () => {
  assert.equal(pageCount(20, 10), 2);
});
test("an empty list has no pages", () => {
  assert.equal(pageCount(0, 10), 0);
});
test("rejects invalid pagination inputs", () => {
  assert.throws(() => pageCount(-1, 10), RangeError);
  assert.throws(() => pageCount(20, 0), RangeError);
  assert.throws(() => pageCount(2.5, 10), RangeError);
});
