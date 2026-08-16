import { markdownFiles } from "./markdownFiles";
export interface NoteDocument {
  id: string;
  title: string;
  path: string;
  content: string;
}

const notesList: NoteDocument[] = [];

export const initSearchEngine = async () => {
  notesList.length = 0; // 清空数组
  let idCounter = 0;

  for (const [path, content] of Object.entries(markdownFiles)) {
    const id = String(idCounter++);
    const title = path.split("/").pop()?.replace(".md", "") || "";

    notesList.push({
      id,
      title,
      path,
      content: content as string,
    });
  }
};

export const searchNotes = async (term: string): Promise<NoteDocument[]> => {
  const query = term.trim().toLowerCase();
  if (!query) return [];

  // 纯 JS 全文本无死角扫描，彻底解决中泰文漏搜问题
  return notesList.filter((note) => {
    const titleMatch = note.title.toLowerCase().includes(query);
    const contentMatch = note.content.toLowerCase().includes(query);
    return titleMatch || contentMatch;
  });
};
