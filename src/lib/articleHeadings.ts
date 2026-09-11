export interface ArticleHeading {
  id: string;
  text: string;
  level: number;
}
interface HeadingNode {
  type: string;
  tagName?: string;
  value?: string;
  properties?: Record<string, unknown>;
  children?: HeadingNode[];
}

/** Collect from the actual rendered Markdown tree so code fences and inline markup are handled correctly. */
export function createHeadingPlugin(headings: ArticleHeading[]) {
  return function headingPlugin() {
    return function transform(tree: HeadingNode) {
      const used = new Set<string>();
      const walk = (node: HeadingNode, visit: (node: HeadingNode) => void) => {
        visit(node);
        node.children?.forEach((child) => walk(child, visit));
      };
      walk(tree, (node) => {
        if (typeof node.properties?.id === "string")
          used.add(node.properties.id);
      });
      const textOf = (node: HeadingNode): string =>
        node.type === "text"
          ? (node.value ?? "")
          : (node.children?.map(textOf).join("") ?? "");
      walk(tree, (node) => {
        if (
          node.type !== "element" ||
          !["h2", "h3"].includes(node.tagName ?? "")
        )
          return;
        const text = textOf(node).trim();
        if (!text) return;
        let id =
          typeof node.properties?.id === "string" ? node.properties.id : "";
        if (!id) {
          const base =
            text
              .toLowerCase()
              .normalize("NFKD")
              .replace(/[\u0300-\u036f]/g, "")
              .replace(/[^\p{L}\p{N}\s-]/gu, "")
              .trim()
              .replace(/\s+/g, "-") || "section";
          id = base;
          let suffix = 2;
          while (used.has(id)) id = `${base}-${suffix++}`;
          used.add(id);
        }
        node.properties = { ...node.properties, id };
        headings.push({ id, text, level: Number(node.tagName!.slice(1)) });
      });
    };
  };
}
