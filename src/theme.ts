import { createTheme } from '@mui/material/styles';
const LIGHT_SAGE_GREEN = '#9CAF88'; // 浅鼠尾草绿
const PANDAN_LEAF_GREEN = '#7DA27E'; // 斑斓叶绿
const WOOD_GRAIN_BROWN = '#E8DCC4'; // 木纹棕
const LAVENDER='#E6E6FA'// 薰衣草紫
export const theme = createTheme({
  palette: {
    primary: {
      main: LIGHT_SAGE_GREEN,
      dark: PANDAN_LEAF_GREEN,
    },
    secondary: {
      main: LAVENDER,
    },
    background: {
      default: LIGHT_SAGE_GREEN,
      paper: WOOD_GRAIN_BROWN,
    },
    text: {
      primary: '#333333',
    },
  },
  typography: {
    fontFamily: '"Sarabun", "Roboto", "Helvetica", "Arial", sans-serif',
    body1: {
      fontSize: '1.15rem', // 泰语字体放大，至少 18px (约 1.125rem)
      lineHeight: 2.0,     // 加大行高，防止泰语音标重叠
      letterSpacing: '0.02em',
    },
    h1: { fontSize: '2rem', color: PANDAN_LEAF_GREEN, fontWeight: 600 },
    h2: { fontSize: '1.75rem', color: LIGHT_SAGE_GREEN, fontWeight: 600 },
  },
  components: {
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: WOOD_GRAIN_BROWN,
          borderRight: 'none',
        },
      },
    },
  },
});