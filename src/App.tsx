import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { RouterProvider } from 'react-router';
import { theme } from './theme/theme';
import { router } from './app/router';
import DisclaimerDialog from './components/DisclaimerDialog';

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline enableColorScheme />
      <DisclaimerDialog>
        <RouterProvider router={router} />
      </DisclaimerDialog>
    </ThemeProvider>
  );
}
