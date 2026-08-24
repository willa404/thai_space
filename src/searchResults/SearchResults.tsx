import { List, Box, Typography } from "@mui/material";
import { HighlightText } from "./HighlightText";
import { getSnippet } from "./getSnippet";
import { theme } from "../theme";
import type { TreeNode } from "../utils/type";
interface ISearchResultsProps {
  searchResults: TreeNode[];
  searchTerm: string;
  onSelectNote: (content: TreeNode) => void;
}
export const SearchResults: React.FC<ISearchResultsProps> = ({
  searchResults,
  searchTerm,
  onSelectNote,
}) => {
  return (
    <List sx={{ overflow: "auto", p: "16px" }}>
      {searchResults.map((item) => (
        <Box
          key={item.path}
          sx={{
            mb: 2,
            p: 1,
            cursor: "pointer",
            "&:hover": { backgroundColor: theme.palette.action.hover },
          }}
          onClick={() => onSelectNote(item)}
        >
          <Typography variant="h6" component="div">
            <HighlightText text={item.name} highlight={searchTerm} />
          </Typography>
          {item.content && (
            <Typography variant="body2" color="text.secondary">
              <HighlightText
                text={getSnippet(item.content, searchTerm)}
                highlight={searchTerm}
              />
            </Typography>
          )}
        </Box>
      ))}
    </List>
  );
};
