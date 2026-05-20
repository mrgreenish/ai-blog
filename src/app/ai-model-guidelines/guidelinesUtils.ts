import type { AtAGlanceCellValue, AtAGlanceModelCell } from "./guidelinesContent";
import { formatModelNames } from "./guidelinesModels";

export function isModelCell(
  cell: AtAGlanceCellValue
): cell is AtAGlanceModelCell {
  return typeof cell === "object" && cell !== null && "modelIds" in cell;
}

export function resolveAtAGlanceCell(cell: AtAGlanceCellValue): string {
  if (isModelCell(cell)) {
    return formatModelNames(cell.modelIds);
  }
  return cell;
}
