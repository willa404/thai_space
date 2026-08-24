export interface TreeNode {
  id: string;
  name: string;
  path?: string;
  content?: string;
  children?: TreeNode[];
}
