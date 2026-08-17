import { List, Box, Typography } from "@mui/material";
import { HighlightText } from "./HighlightText";
import type { NoteDocument } from "../utils/notesManager";
import { getSnippet } from "./getSnippet";
import { theme } from "../theme";
interface ISearchResultsProps {
  searchResults: NoteDocument[];
  searchTerm: string;
  onSelectNote: (content: string) => void;
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
          onClick={() => onSelectNote(item.content)}
        >
          <Typography variant="h6" component="div">
            <HighlightText text={item.title} highlight={searchTerm} />
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <HighlightText
              text={getSnippet(item.content, searchTerm)}
              highlight={searchTerm}
            />
          </Typography>
        </Box>
      ))}
    </List>
  );
};
