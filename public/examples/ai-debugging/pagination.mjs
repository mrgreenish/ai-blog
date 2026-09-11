export function pageCount(total, pageSize) {
  if (!Number.isInteger(total) || total < 0) throw new RangeError("Invalid total");
  if (!Number.isInteger(pageSize) || pageSize <= 0) throw new RangeError("Invalid page size");
  return Math.ceil(total / pageSize);
}
