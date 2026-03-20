import { createTheme } from '@mui/material/styles';

// LEARNING NOTE: MUI 5 doesn't have built-in colorSchemes like MUI 6/7.
// Instead, you create separate themes (or one function that returns a theme
// based on mode) and swap them via ThemeProvider.

export function buildTheme(mode: 'light' | 'dark') {
  return createTheme({
    palette: {
      mode,
      primary: { main: mode === 'dark' ? '#90caf9' : '#1976d2' },
      secondary: { main: mode === 'dark' ? '#ce93d8' : '#9c27b0' },
      background:
        mode === 'dark'
          ? { default: '#121212', paper: '#1e1e1e' }
          : { default: '#f5f5f5', paper: '#ffffff' },
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h4: { fontWeight: 700 },
      h5: { fontWeight: 600 },
      h6: { fontWeight: 600 },
    },
    shape: { borderRadius: 12 },
    components: {
      MuiButton: {
        styleOverrides: {
          root: { textTransform: 'none', borderRadius: 8 },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: { borderRadius: 12 },
        },
      },
    },
  });
}
