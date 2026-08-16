import { markdownFiles } from "./markdownFiles";

export interface NoteNode {
  name: string;
  path?: string; // 完整路径，仅叶子节点（文件）有
  content?: string;
  children?: Record<string, NoteNode>;
}

// 1. 构建目录树
export const buildDirectoryTree = () => {
  const root: Record<string, NoteNode> = {};

  for (const path in markdownFiles) {
    // 提取相对路径，例如 "初级泰语/第一课.md"
    const relativePath = path.replace("../assets/notes/", "");
    const parts = relativePath.split("/");
    let currentLevel = root;

    parts.forEach((part, index) => {
      const isFile = index === parts.length - 1;
      const nodeName = isFile ? part.replace(".md", "") : part;

      if (!currentLevel[nodeName]) {
        currentLevel[nodeName] = { name: nodeName };
        if (!isFile) {
          currentLevel[nodeName].children = {};
        }
      }

      if (isFile) {
        currentLevel[nodeName].path = path;
        currentLevel[nodeName].content = markdownFiles[path] as string;
      }

      if (!isFile) {
        currentLevel = currentLevel[nodeName].children!;
      }
    });
  }
  return root;
};
