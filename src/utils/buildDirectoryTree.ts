import type { TreeNode } from "./type";

export const buildDirectoryTree = (
  markdownFiles: Record<string, string>,
): TreeNode[] => {
  const tree: TreeNode[] = [];

  // Use a Map to quickly group files by their folder name
  const folderMap = new Map<string, TreeNode>();

  Object.entries(markdownFiles).forEach(([filePath, fileContent]) => {
    // 1. Parse the path to get Folder and File names
    // Assuming filePath is like "../assets/notes/泰百OST/NantanFilm.md"
    const parts = filePath.split("/");
    const fileNameWithExt = parts.pop() || "";
    const folderName = parts.pop() || "Uncategorized";
    const fileName = fileNameWithExt.replace(".md", "");

    // 2. Ensure Folder (Level 1) exists in the tree
    if (!folderMap.has(folderName)) {
      const newFolder: TreeNode = {
        id: `folder-${folderName}`,
        name: folderName,
        children: [],
      };
      folderMap.set(folderName, newFolder);
      tree.push(newFolder);
    }
    const folderNode = folderMap.get(folderName)!;

    // 3. Create File/Singer/Book (Level 2)
    const fileNode: TreeNode = {
      id: filePath,
      name: fileName,
      path: filePath,
      children: [],
    };
    folderNode.children!.push(fileNode);

    // 4. Parse file content for ## Headings (Level 3) and isolate content
    const lines = fileContent.split("\n");
    let currentSectionNode: TreeNode | null = null;
    let currentSectionLines: string[] = [];

    lines.forEach((line) => {
      const trimmed = line.trim();

      if (trimmed.startsWith("## ")) {
        // Flush the accumulated lines into the PREVIOUS section's content
        if (currentSectionNode) {
          currentSectionNode.content = currentSectionLines.join("\n");
        }

        // Initialize a NEW section
        const sectionName = trimmed.replace("## ", "").trim();
        currentSectionNode = {
          id: `${filePath}#${sectionName}`,
          name: sectionName,
          path: filePath,
          content: "", // Will be filled when the section finishes
        };

        fileNode.children!.push(currentSectionNode);

        // Start accumulating lines for this new section (including the ## heading itself)
        currentSectionLines = [line];
      } else if (currentSectionNode) {
        // If we are currently inside a ## section, accumulate its lines
        currentSectionLines.push(line);
      }
    });

    // 5. Save the very last section in the file
    if (currentSectionNode) {
      (currentSectionNode as TreeNode).content = currentSectionLines.join("\n");
    }
  });
  return tree;
};
