import { markdownFiles } from "./markdownFiles";
import type { TreeNode } from "./type";
const notesList: TreeNode[] = [];

export const initSearchEngine = async () => {
  notesList.length = 0; // 清空数组
  let idCounter = 0;
  for (const [path, content] of Object.entries(markdownFiles)) {
    const id = String(idCounter++);
    const name = path.split("/").pop()?.replace(".md", "") || "";
    notesList.push({
      id,
      name,
      path,
      content: content as string,
    });
  }
};

export const searchNotes = async (term: string): Promise<TreeNode[]> => {
  const query = term.trim().toLowerCase();
  if (!query) return [];

  // 纯 JS 全文本无死角扫描，彻底解决中泰文漏搜问题
  return notesList.filter((note) => {
    const nameMatch = note.name.toLowerCase().includes(query);
    const contentMatch = note.content?.toLowerCase().includes(query);
    return nameMatch || contentMatch;
  });
};
