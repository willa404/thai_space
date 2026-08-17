import React, { useState, useEffect, useMemo } from "react";
import type { NoteDocument } from "./utils/notesManager";
import {
  ThemeProvider,
  CssBaseline,
  Box,
  Drawer,
  IconButton,
  Typography,
  TextField,
  List,
  ListItem,
  ListItemText,
  Divider,
  InputAdornment,
  Toolbar,
  AppBar,
} from "@mui/material";
import {
  MenuOpen,
  Search as SearchIcon,
  Menu,
  KeyboardDoubleArrowRight,
} from "@mui/icons-material";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { theme } from "./theme";
import { initSearchEngine, searchNotes } from "./utils/notesManager";
import { buildDirectoryTree, type NoteNode } from "./utils/buildDirectoryTree";
import { SearchResults } from "./searchResults/SearchResults";
const LEFT_DRAWER_WIDTH = 280;
const RIGHT_DRAWER_WIDTH = 360;
export default function App() {
  const [leftOpen, setLeftOpen] = useState<boolean>(true);
  const [rightOpen, setRightOpen] = useState<boolean>(false);
  const [currentContent, setCurrentContent] = useState<string>(
    "# 欢迎来到泰语学习笔记\n请在左侧选择笔记。",
  );
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchResults, setSearchResults] = useState<NoteDocument[]>([]);
  const tree = useMemo(() => buildDirectoryTree(), []);
  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    if (term.length > 1) {
      const results = await searchNotes(term);
      console.log("handleSearch searchResults", results);

      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };
  const renderTree = (nodes: Record<string, NoteNode>) => (
    <List>
      {Object.values(nodes).map((node) => (
        <React.Fragment key={node.name}>
          <ListItem
            onClick={() =>
              node.path &&
              setCurrentContent(node.content || "") &&
              setLeftOpen(false)
            }
            sx={{
              pl: node.path ? 5 : 1,
              py: 0,
              cursor: node.path ? "pointer" : "default",
            }}
          >
            <ListItemText primary={node.name} />
          </ListItem>
          {node.children && renderTree(node.children)}
        </React.Fragment>
      ))}
    </List>
  );
  useEffect(() => {
    initSearchEngine();
  }, []);
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar elevation={0}>
        <Toolbar>
          {!leftOpen && (
            <IconButton onClick={() => setLeftOpen(true)}>
              <Menu />
            </IconButton>
          )}
          <Box sx={{ flexGrow: 1 }} />
          {!rightOpen && (
            <IconButton
              onClick={() => setRightOpen(!rightOpen)}
              color="success"
            >
              <SearchIcon />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>
      <Box
        sx={{
          display: "flex",
          height: "100vh",
          overflow: "hidden",
          border: "none",
        }}
      >
        {/* left drawer */}
        <Drawer
          variant="persistent"
          anchor="left"
          open={leftOpen}
          sx={{
            width: leftOpen ? LEFT_DRAWER_WIDTH : 0,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: LEFT_DRAWER_WIDTH,
              boxSizing: "border-box",
            },
          }}
        >
          <Box
            sx={{
              p: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography variant="h6" color="primary">
              目录
            </Typography>
            <IconButton onClick={() => setLeftOpen(false)}>
              <MenuOpen />
            </IconButton>
          </Box>
          <Divider />
          <Box sx={{ overflow: "auto" }}>{renderTree(tree)}</Box>
        </Drawer>
        {/* reading area */}
        <Box
          sx={{
            flexGrow: 1,
            p: 4,
            display: "flex",
            flexDirection: "column",
            overflow: "auto",
          }}
        >
          <Box
            className="markdown-body"
            sx={{
              maxWidth: "800px",
              margin: "0 auto",
              width: "100%",
              "& p": {
                whiteSpace: "pre-wrap",
                margin: "0 0 1em 0",
              },
            }}
          >
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {currentContent}
            </ReactMarkdown>
          </Box>
        </Box>
        {/* right drawer: global search bar */}
        <Drawer
          variant="persistent"
          anchor="right"
          open={rightOpen}
          sx={{
            width: rightOpen ? RIGHT_DRAWER_WIDTH : 0,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: RIGHT_DRAWER_WIDTH,
              boxSizing: "border-box",
              backgroundColor: theme.palette.background.paper,
            },
          }}
        >
          <Box
            sx={{
              p: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <IconButton sx={{ mr: 1 }} onClick={() => setRightOpen(!rightOpen)}>
              <KeyboardDoubleArrowRight />
            </IconButton>
            <TextField
              fullWidth
              size="small"
              placeholder="搜索泰语或中文"
              onChange={handleSearch}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: "action.active" }} />
                    </InputAdornment>
                  ),
                },
              }}
            />
          </Box>
          <Divider />
          <SearchResults
            searchResults={searchResults}
            searchTerm={searchTerm}
            onSelectNote={setCurrentContent}
          />
        </Drawer>
      </Box>
    </ThemeProvider>
  );
}
