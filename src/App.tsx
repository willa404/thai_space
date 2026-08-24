import React, { useState, useEffect, useMemo } from "react";
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
import { buildDirectoryTree } from "./utils/buildDirectoryTree";
import { SearchResults } from "./searchResults/SearchResults";
import type { TreeNode } from "./utils/type";

const LEFT_DRAWER_WIDTH = 280;
const RIGHT_DRAWER_WIDTH = 360;

// 1. Import raw markdown files using Vite's eager glob
const markdownFiles = import.meta.glob("./assets/notes/**/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

export default function App() {
  const [leftOpen, setLeftOpen] = useState<boolean>(true);
  const [rightOpen, setRightOpen] = useState<boolean>(false);
  const [currentContent, setCurrentContent] = useState<string>(
    "# 欢迎来到泰语学习笔记\n请在左侧选择笔记。",
  );
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchResults, setSearchResults] = useState<TreeNode[]>([]);

  // 2. Pass markdownFiles into buildDirectoryTree
  const tree = useMemo(() => buildDirectoryTree(markdownFiles), []);

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    if (term.length > 1) {
      const results = await searchNotes(term);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  // 3. Render Tree supporting Array nodes & Level-based padding
  const renderTree = (nodes: TreeNode[], level = 0) => (
    <List disablePadding>
      {nodes.map((node) => {
        const isSelectable = Boolean(node.content);

        return (
          <React.Fragment key={node.id}>
            <ListItem
              onClick={() => {
                if (isSelectable) {
                  setCurrentContent(node.content || "");
                  setLeftOpen(false); // Auto-close left drawer on selection
                }
              }}
              sx={{
                pl: level * 2 + 2, // Indent dynamically based on hierarchy depth (0, 2, 4...)
                py: 0.25,
                cursor: isSelectable ? "pointer" : "default",
                "&:hover": isSelectable
                  ? { backgroundColor: "action.hover" }
                  : undefined,
              }}
            >
              <ListItemText
                sx={{
                  "& .MuiListItemText-primary": {
                    fontSize: level === 0 ? "1.25rem" : "1rem",
                    fontWeight: level === 1 ? "normal" : "bold",
                  },
                }}
                primary={node.name}
                slotProps={{
                  primary: {
                    variant: level === 0 ? "subtitle2" : "body2",
                  },
                }}
              />
            </ListItem>

            {/* Recursively render child nodes if present */}
            {node.children &&
              node.children.length > 0 &&
              renderTree(node.children, level + 1)}
          </React.Fragment>
        );
      })}
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
        {/* Left Drawer */}
        <Drawer
          transitionDuration={{ enter: 300, exit: 800 }}
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
          <Box sx={{ overflow: "auto", flexGrow: 1, py: 1 }}>
            {renderTree(tree)}
          </Box>
        </Drawer>

        {/* Reading Area */}
        <Box
          sx={{
            flexGrow: 1,
            p: 4,
            pt: 10,
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

        {/* Right Drawer: Global Search Bar */}
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
            onSelectNote={(note) => {
              if (note.content) {
                setCurrentContent(note.content);
                setRightOpen(false);
              }
            }}
          />
        </Drawer>
      </Box>
    </ThemeProvider>
  );
}
